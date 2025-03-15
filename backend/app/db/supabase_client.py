# app/db/supabase_client.py
from supabase import create_client
from app.core.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_client():
    return supabase