# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Visa Assessment System"
    API_V1_STR: str = "/api/v1"
    
    # Supabase settings (automatically loaded from environment variables)
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # OpenAI API settings
    OPENAI_API_KEY: str
    
    # New authentication settings
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str

    class Config:
        case_sensitive = True
        env_file = ".env"  # Optional: to specify a custom environment file

settings = Settings()
