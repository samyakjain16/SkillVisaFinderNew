# scripts/import_occupations.py
import pandas as pd
import os
import sys
import logging
import json
import time

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.supabase_client import get_supabase_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def import_occupations(csv_path: str) -> None:
    """
    Import occupations from a CSV file into Supabase.
    """
    # Get Supabase client
    supabase = get_supabase_client()
    
    try:
        # Read CSV file
        logger.info(f"Reading occupation data from {csv_path}")
        df = pd.read_csv(csv_path)
        
        # Process each row and prepare for import
        logger.info(f"Processing {len(df)} occupations")
        
        # Convert embeddings from string to array format if needed
        def process_embedding(embedding):
            if isinstance(embedding, str):
                if embedding.startswith('[') and embedding.endswith(']'):
                    return [float(x.strip()) for x in embedding.strip('[]').split(',')]
                else:
                    return [float(x) for x in embedding.split()]
            return embedding
        
        # Apply the conversion
        if 'occupation_embedding' in df.columns:
            df['occupation_embedding'] = df['occupation_embedding'].apply(process_embedding)
        
        # Insert data in batches to avoid timeouts
        batch_size = 50
        total_rows = len(df)
        
        for i in range(0, total_rows, batch_size):
            batch_df = df.iloc[i:min(i+batch_size, total_rows)]
            
            # Convert DataFrame to list of dictionaries
            records = batch_df.to_dict('records')
            
            # Insert records using Supabase
            for record in records:
                # Check if record already exists
                response = supabase.table('occupations').select('anzsco_code').eq('anzsco_code', record['anzsco_code']).execute()
                
                if len(response.data) > 0:
                    # Update existing record
                    supabase.table('occupations').update(record).eq('anzsco_code', record['anzsco_code']).execute()
                else:
                    # Insert new record
                    supabase.table('occupations').insert(record).execute()
            
            logger.info(f"Imported {min(i+batch_size, total_rows)} of {total_rows} occupations")
            
            # Add a small delay to avoid rate limits
            time.sleep(1)
        
        logger.info(f"Successfully imported {total_rows} occupations")
        
    except Exception as e:
        logger.error(f"Error importing occupations: {e}")
        raise

if __name__ == "__main__":
    if len(sys.argv) != 2:
        logger.error("Usage: python import_occupations.py <path_to_csv>")
        sys.exit(1)
        
    csv_path = sys.argv[1]
    if not os.path.exists(csv_path):
        logger.error(f"CSV file not found: {csv_path}")
        sys.exit(1)
        
    import_occupations(csv_path)