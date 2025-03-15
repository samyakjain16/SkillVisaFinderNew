from datetime import datetime, timedelta
from typing import Optional
import uuid
from fastapi import Depends, HTTPException, requests, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.db.supabase_client import get_supabase_client
from app.db.models.user import UserTable
from app.core.config import settings
from passlib.context import CryptContext # type: ignore
from google.oauth2 import id_token

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2PasswordBearer is used to extract the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a password hash."""
    return pwd_context.hash(password)

def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"sub": user_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def authenticate_user(email: str, password: str):
    """Authenticate a user by email and password."""
    result = get_supabase_client().table("users").select("*").eq(UserTable.email, email).execute()
    
    if not result.data or len(result.data) == 0:
        return None
    
    user = result.data[0]
    
    if not verify_password(password, user[UserTable.hashed_password]):
        return None
    
    # Update last login
    get_supabase_client().table("users").update({
        UserTable.last_login: datetime.utcnow().isoformat()
    }).eq(UserTable.id, user[UserTable.id]).execute()
    
    return user

async def authenticate_google(token: str):
    """Authenticate a user with a Google token."""
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        
        # Check if the token is valid
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return None
        
        # Get the user's Google ID and email
        google_id = idinfo['sub']
        email = idinfo['email']
        
        # Check if the user exists in our database
        result = get_supabase_client().table("users").select("*").eq(UserTable.google_id, google_id).execute()
        
        if result.data and len(result.data) > 0:
            # User exists, update last login
            user = result.data[0]
            get_supabase_client().table("users").update({
                UserTable.last_login: datetime.utcnow().isoformat()
            }).eq(UserTable.id, user[UserTable.id]).execute()
            return user
        
        # Check if the email exists without Google ID
        result = get_supabase_client().table("users").select("*").eq(UserTable.email, email).execute()
        
        if result.data and len(result.data) > 0:
            # Email exists, link the Google ID
            user = result.data[0]
            get_supabase_client().table("users").update({
                UserTable.google_id: google_id,
                UserTable.last_login: datetime.utcnow().isoformat()
            }).eq(UserTable.id, user[UserTable.id]).execute()
            return user
        
        # Create a new user
        user_id = str(uuid.uuid4())
        user_data = {
            UserTable.id: user_id,
            UserTable.email: email,
            UserTable.full_name: idinfo.get('name', ''),
            UserTable.is_active: True,
            UserTable.is_verified: True,  # Google already verified the email
            UserTable.google_id: google_id,
            UserTable.created_at: datetime.utcnow().isoformat(),
            UserTable.last_login: datetime.utcnow().isoformat()
        }
        
        get_supabase_client().table("users").insert(user_data).execute()
        
        # Get the newly created user
        result = get_supabase_client().table("users").select("*").eq(UserTable.id, user_id).execute()
        
        if result.data and len(result.data) > 0:
            return result.data[0]
        
        return None
    
    except Exception as e:
        print(f"Google authentication error: {e}")
        return None

async def create_user(email: str, password: str, full_name: Optional[str] = None):
    """Create a new user."""
    # Check if email already exists
    result = get_supabase_client().table("users").select("*").eq(UserTable.email, email).execute()
    
    if result.data and len(result.data) > 0:
        return None  # Email already exists
    
    user_id = str(uuid.uuid4())
    user_data = {
        UserTable.id: user_id,
        UserTable.email: email,
        UserTable.hashed_password: get_password_hash(password),
        UserTable.full_name: full_name or "",
        UserTable.is_active: True,
        UserTable.is_verified: False,  # Requires email verification
        UserTable.created_at: datetime.utcnow().isoformat(),
    }
    
    get_supabase_client().table("users").insert(user_data).execute()
    
    # Get the newly created user
    result = get_supabase_client().table("users").select("*").eq(UserTable.id, user_id).execute()
    
    if result.data and len(result.data) > 0:
        return result.data[0]
    
    return None


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    result = get_supabase_client().table("users").select("*").eq(UserTable.id, user_id).execute()
    
    if not result.data or len(result.data) == 0:
        raise credentials_exception
    
    user = result.data[0]
    
    if not user[UserTable.is_active]:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user