from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.auth_service import get_current_user
from app.services.visa_assessment_service import (
    create_visa_assessment, 
    get_visa_assessment,
    get_user_visa_assessments,
    update_visa_assessment,
    extract_applicant_data_from_cv
)
from app.db.supabase_client import get_supabase_client
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class ClientCreate(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    passport_number: Optional[str] = None
    nationality: Optional[str] = None

class ClientUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    passport_number: Optional[str] = None
    nationality: Optional[str] = None

class AssessmentUpdate(BaseModel):
    occupation_code: Optional[str] = None
    occupation_name: Optional[str] = None
    status: Optional[str] = None
    age_value: Optional[int] = None
    english_level: Optional[str] = None
    english_test: Optional[str] = None
    education_level: Optional[str] = None
    education_field: Optional[str] = None
    experience_overseas_years: Optional[float] = None
    experience_australia_years: Optional[float] = None
    australian_study: Optional[bool] = None
    specialist_education: Optional[bool] = None
    partner_skills_points: Optional[int] = None
    community_language_points: Optional[int] = None
    regional_study_points: Optional[int] = None
    professional_year_points: Optional[int] = None
    points_notes: Optional[str] = None
    eligibility_notes: Optional[str] = None



class VisaAssessmentRequest(BaseModel):
    client_id: str
    visa_subclass: str
    document_id: Optional[str] = None
    occupation_code: Optional[str] = None
    
    
router = APIRouter(prefix="/visa-assessment", tags=["visa-assessment"])
@router.post("/clients", response_model=Dict[str, Any])
async def create_client(
    client_data: ClientCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a new client for the current user"""
    data = {**client_data.dict(), "user_id": current_user["id"]}
    result = get_supabase_client().table("clients").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create client")
    
    return result.data[0]

@router.get("/clients", response_model=List[Dict[str, Any]])
async def get_clients(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Get all clients for the current user"""
    result = get_supabase_client().table("clients").select("*").eq("user_id", current_user["id"]).execute()
    return result.data if result.data else []

@router.get("/clients/{client_id}", response_model=Dict[str, Any])
async def get_client(
    client_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get a specific client by ID"""
    result = get_supabase_client().table("clients").select("*").eq("id", client_id).eq("user_id", current_user["id"]).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return result.data[0]

@router.put("/clients/{client_id}", response_model=Dict[str, Any])
async def update_client(
    client_id: str,
    client_data: ClientUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Update a client's information"""
    # Check if client exists and belongs to current user
    result = get_supabase_client().table("clients").select("*").eq("id", client_id).eq("user_id", current_user["id"]).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Update client
    update_data = {k: v for k, v in client_data.dict().items() if v is not None}
    update_result = get_supabase_client().table("clients").update(update_data).eq("id", client_id).execute()
    
    if not update_result.data:
        raise HTTPException(status_code=400, detail="Failed to update client")
    
    return update_result.data[0]



@router.get("/list", response_model=List[Dict[str, Any]])
async def list_assessments(
    client_id: Optional[str] = None,
    visa_subclass: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """List visa assessments with optional filters"""
    query = get_supabase_client().table("visa_assessments").select("*").eq("user_id", current_user["id"])
    
    if client_id:
        query = query.eq("client_id", client_id)
    
    if visa_subclass:
        query = query.eq("visa_subclass", visa_subclass)
    
    result = query.order("created_at", desc=True).execute()
    
    return result.data if result.data else []

@router.get("/{assessment_id}", response_model=Dict[str, Any])
async def get_assessment_by_id(
    assessment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get a specific visa assessment by ID"""
    result = get_supabase_client().table("visa_assessments").select("*").eq("id", assessment_id).eq("user_id", current_user["id"]).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    return result.data[0]

@router.put("/{assessment_id}", response_model=Dict[str, Any])
async def update_assessment_by_id(
    assessment_id: str,
    assessment_data: AssessmentUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Update a visa assessment"""
    # Check if assessment exists and belongs to current user
    result = get_supabase_client().table("visa_assessments").select("*").eq("id", assessment_id).eq("user_id", current_user["id"]).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Update assessment
    update_data = {k: v for k, v in assessment_data.dict().items() if v is not None}
    updated_assessment = await update_visa_assessment(assessment_id, update_data)
    
    if not updated_assessment:
        raise HTTPException(status_code=400, detail="Failed to update assessment")
    
    return updated_assessment

@router.get("/client/{client_id}/summary", response_model=Dict[str, Any])
async def get_client_assessment_summary(
    client_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get a summary of all visa assessments for a client"""
    # Check if client exists and belongs to current user
    client_result = get_supabase_client().table("clients").select("*").eq("id", client_id).eq("user_id", current_user["id"]).execute()
    
    if not client_result.data or len(client_result.data) == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Get all assessments for this client
    assessments_result = get_supabase_client().table("visa_assessments").select("*").eq("client_id", client_id).execute()
    assessments = assessments_result.data if assessments_result.data else []
    
    # Group assessments by visa subclass
    visa_pathways = {}
    for assessment in assessments:
        subclass = assessment["visa_subclass"]
        if subclass not in visa_pathways:
            visa_pathways[subclass] = {
                "visa_subclass": subclass,
                "visa_name": assessment["visa_name"],
                "eligibility_status": assessment["eligibility_status"],
                "points": assessment.get("total_points", 0) if "total_points" in assessment else None,
                "assessment_id": assessment["id"]
            }
    
    return {
        "client": client_result.data[0],
        "visa_pathways": list(visa_pathways.values())
    }
    
def get_latest_document(client_id: str, current_user: dict) -> Dict[str, Any]:
    """Get the latest document with all its data for a client"""
    result = get_supabase_client().table("documents").select("*").eq("client_id", client_id).eq("user_id", current_user["id"]).order('created_at', desc=True).limit(1).execute()
    print("GET LATEST DOCU", result)
    if len(result.data) ==0:
        print("NO CV FOUND")
        raise HTTPException(
            status_code=400,
            detail={
                "code": "NO_CV_FOUND",
                "message": "No CV found for this client",
                "action": "Please upload a CV before starting the assessment"
            }
        )
        

    return result.data[0]

@router.post("/create", response_model=Dict[str, Any])
async def create_assessment(
    request: VisaAssessmentRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a new visa assessment for a client"""
    print("--Create assessment endpoint called with:", request.dict())

    client_id = request.client_id
    visa_subclass = request.visa_subclass
    occupation_code = request.occupation_code

    # Check if client exists and belongs to current user
    client_result = get_supabase_client().table("clients").select("*").eq("id", client_id).eq("user_id", current_user["id"]).execute()
    if not client_result.data:
        raise HTTPException(status_code=404, detail="Client not found")

    try:
        # Get the latest document with all its data
        document = get_latest_document(client_id, current_user)  # This will raise NO_CV_FOUND if no document exists
        document_id = document['id']
        
        # Extract applicant data if document has extracted text
        applicant_data = None
        if document.get("extracted_text"):
            applicant_data = await extract_applicant_data_from_cv(document["extracted_text"])

        # Get occupation details if not provided in the request (but it's not mandatory)
        occupation_name = None
        if not occupation_code:
            # Fetch occupation code from document_occupations if not provided in the request
            occ_result = get_supabase_client().table("document_occupations").select("*").eq("document_id", document_id).execute()
            if occ_result.data:
                occupation_code = occ_result.data[0]["anzsco_code"]
                occupation_name = occ_result.data[0]["occupation_name"]
            else:
                # If no occupation code is found, we just leave it as None (it's allowed to be missing)
                occupation_code = None
                occupation_name = None

        # Create assessment with all gathered data (even if occupation_code is None)
        assessment = await create_visa_assessment(
            user_id=current_user["id"],
            document_id=document_id,
            visa_subclass=visa_subclass,
            occupation_code=occupation_code,  # Can be None or empty
            occupation_name=occupation_name,  # Can be None if occupation_code is missing
            client_id=client_id,
            applicant_data=applicant_data
        )
        
        return assessment

    except HTTPException as e:
        raise e  # Propagate NO_CV_FOUND or other HTTPExceptions directly
    except Exception as e:
        print(f"Error creating assessment: {str(e)}")  # Log unexpected errors
        raise HTTPException(status_code=500, detail=str(e))