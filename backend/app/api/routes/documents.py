# app/api/routes/documents.py
from datetime import datetime
from typing import Dict
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from app.services.document_processor import extract_text_from_document
from app.services.occupation_suggestion_llm_service import analyze_cv_with_llm
from app.services.occupation_matcher import match_occupations
from app.models.response import CVAnalysisResponse
from app.services.auth_service import get_current_user
from app.db.supabase_client import get_supabase_client
from app.services.applicant_data_service import extract_and_save_applicant_data

router = APIRouter(prefix="/documents", tags=["documents"])
@router.post("/upload-cv", response_model=CVAnalysisResponse)
async def upload_cv(
    file: UploadFile = File(),
    current_user: dict = Depends(get_current_user),
    client_id: str = Form(None)
):
    """Uploads and processes a CV file, extracting text and analyzing with LLM."""
    
    # Validate file type
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File must be PDF or DOCX")
    
    # Read file content
    file_content = await file.read()

    # Extract text from document
    try:
        extracted_text = await extract_text_from_document(file_content, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

    # Process with LLM
    try:
        analysis_result = await analyze_cv_with_llm(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing with LLM: {str(e)}")

    # Match with occupations
    try:
        occupation_matches = await match_occupations(analysis_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching occupations: {str(e)}")

    # Store document in database
    document_id = str(uuid.uuid4())
    document_data = {
        "id": document_id,
        "user_id": current_user["id"],
        "client_id": client_id,  # Link to client if provided
        "filename": file.filename,
        "file_type": file.content_type,
        "file_size": len(file_content),
        "extracted_text": extracted_text,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    # Save document to database
    supabase_client = get_supabase_client()
    supabase_client.table("documents").insert(document_data).execute()

    # Store occupation matches in a separate table
    for match in occupation_matches:
        match_data = {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "anzsco_code": match.get("anzsco_code"),
            "occupation_name": match.get("occupation_name"),
            "confidence_score": match.get("confidence_score"),
            "created_at": datetime.now().isoformat(),
        }
        supabase_client.table("document_occupations").insert(match_data).execute()

    # Return the results along with the document ID for reference
    return {
        "document_id": document_id,
        "extracted_info": analysis_result,
        "occupation_matches": occupation_matches,
    }
    
    
@router.get("/client/{client_id}/latest")
async def get_latest_document(
    client_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get the latest document for a client"""
    supabase_client = get_supabase_client()
    
    # Check if client belongs to current user
    client_result = supabase_client.table("clients").select("*").eq("id", client_id).eq("user_id", current_user["id"]).execute()
    
    if not client_result.data or len(client_result.data) == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Get latest document for this client
    document_result = supabase_client.table("documents").select("*").eq("client_id", client_id).order("created_at", desc=True).limit(1).execute()
    
    if not document_result.data or len(document_result.data) == 0:
        return {"message": "No documents found for this client"}
    
    document = document_result.data[0]
    
    # Get occupation matches for this document
    occupation_result = supabase_client.table("document_occupations").select("*").eq("document_id", document["id"]).execute()
    occupation_matches = occupation_result.data if occupation_result.data else []
    
    return {
        "document": document,
        "occupation_matches": occupation_matches
    }


@router.post("/{document_id}/extract-applicant-data")
async def extract_applicant_data(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Extract applicant data from a document and save to the client record."""
    
    # Check if document exists and belongs to current user
    supabase_client = get_supabase_client()
    document_result = supabase_client.table("documents").select("*").eq("id", document_id).eq("user_id", current_user["id"]).execute()
    
    if not document_result.data or len(document_result.data) == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document = document_result.data[0]
    
    # Check if document is linked to a client
    if not document.get("client_id"):
        raise HTTPException(status_code=400, detail="Document is not linked to a client")
    
    # Extract applicant data from the document text
    try:
        client_id = document["client_id"]
        extracted_text = document["extracted_text"]
        
        # Extract and save applicant data
        result = await extract_and_save_applicant_data(extracted_text, client_id)
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to extract applicant data")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting applicant data: {str(e)}")