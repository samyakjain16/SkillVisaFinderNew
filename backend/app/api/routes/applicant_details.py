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