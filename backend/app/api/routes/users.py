from fastapi import APIRouter, Depends, HTTPException
from typing import Any

from app.services.auth_service import get_current_user
from app.models.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)) -> Any:
    """
    Get current user profile.
    """
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "is_active": current_user["is_active"],
        "is_verified": current_user["is_verified"],
        "created_at": current_user["created_at"]
    }