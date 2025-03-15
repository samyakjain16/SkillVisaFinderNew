from uuid import uuid4
from datetime import datetime

# These are the fields we'll store in Supabase
class UserTable:
    id = "id"  # UUID primary key
    email = "email"  # Unique email
    hashed_password = "hashed_password"  # Stored hashed, not plaintext
    full_name = "full_name"  # User's full name
    is_active = "is_active"  # Account status
    is_verified = "is_verified"  # Email verification status
    created_at = "created_at"  # Timestamp
    google_id = "google_id"  # For Google OAuth (nullable)
    last_login = "last_login"  # Track login activity