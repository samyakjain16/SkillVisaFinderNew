# test_supabase_connection.py
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.supabase_client import get_supabase_client

def test_connection():
    supabase = get_supabase_client()
    
    # Test connection by querying a table
    response = supabase.table('occupations').select('count', count='exact').execute()
    
    count = response.count
    print(f"Connected successfully to Supabase! Found {count} occupations.")

if __name__ == "__main__":
    test_connection()