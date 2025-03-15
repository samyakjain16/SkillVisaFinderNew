# app/services/occupation_matcher.py
import openai
import numpy as np
from typing import List, Dict, Any
from app.db.supabase_client import get_supabase_client
from app.core.config import settings
import json
from dotenv import load_dotenv  
from openai import OpenAI

openai.api_key = settings.OPENAI_API_KEY
client = OpenAI()
# Configure OpenAI
#openai.api_key = settings.OPENAI_API_KEY

async def match_occupations(suggested_occupations: list) -> List[Dict[Any, Any]]:
    """
    Match LLM-suggested occupations to actual ANZSCO occupations using embeddings.
    """
    if not suggested_occupations:
        return []

    # Generate embeddings for suggested occupations
    suggested_embeddings = await generate_embeddings(suggested_occupations)
    
    #print("Embeddings generated")
    #print("Embeddings length",len(suggested_embeddings[0]))
    if suggested_embeddings is None:
        return []

    # Get Supabase client
    supabase = get_supabase_client()

    # Fetch all occupations with embeddings from Supabase
    response = supabase.table("occupations").select("*").execute()

    if not response.data:
        print("No occupations found in the database")
        return

    #print(f"Retrieved {len(response.data)} occupations from database")
    #print(f"Sample occupation: {response.data[0]['occupation_name']}")

    # Process all occupations
    all_occupations = response.data

    # Ensure embeddings exist for comparison
    all_occupations = [occ for occ in all_occupations if occ.get('occupation_embedding')]

    if not all_occupations:
        print("No occupations with embeddings found")
        return

    # Convert stored embeddings (handle string case)
    for occ in all_occupations:
        if isinstance(occ["occupation_embedding"], str):  # If stored as a string, convert
            try:
                occ["occupation_embedding"] = json.loads(occ["occupation_embedding"])
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON for occupation: {occ['occupation_name']}, Error: {e}")
                continue  # Skip invalid entries

    # Convert embeddings to NumPy array
    occupation_embeddings = np.array(
        [occ["occupation_embedding"] for occ in all_occupations], dtype=np.float32
    )
    #print(f"Occupation embeddings shape: {occupation_embeddings.shape}")  # Should be (510, 1536)

    # Process each suggested occupation
    final_matches = []
    for i, (occupation, embedding) in enumerate(zip(suggested_occupations, suggested_embeddings)):
        # Convert to numpy array with correct shape
        embedding_np = np.array(embedding, dtype=np.float32).reshape(1, -1)  # Shape: (1, 1536)

        # Compute cosine similarity correctly
        similarities = np.dot(occupation_embeddings, embedding_np.T).flatten() / (
            np.linalg.norm(occupation_embeddings, axis=1) * np.linalg.norm(embedding_np)
        )

        #print(f"Cosine similarity computed for {occupation}")

        # Attach similarity scores to occupations
        occupation_with_scores = []
        for occ, similarity in zip(all_occupations, similarities):
            occ_copy = occ.copy()  # Create a copy to avoid modifying the original
            occ_copy["similarity"] = float(similarity)
            occupation_with_scores.append(occ_copy)

        # Sort matches by similarity (descending) and get the best match
        top_match = sorted(occupation_with_scores, key=lambda x: x["similarity"], reverse=True)[0]
        #print(f"Best match found for {occupation}: {top_match['occupation_name']} (Score: {top_match['similarity']*100:.1f}%)")

        # Add the best match to the final list
        final_matches.append({
            "anzsco_code": top_match["anzsco_code"],
            "occupation_name": top_match["occupation_name"],
            "list": top_match.get("list", ""),
            "visa_subclasses": top_match.get("visa_subclasses", ""),
            "assessing_authority": top_match.get("assessing_authority", ""),
            "confidence_score": round(top_match["similarity"] * 100, 1),
            "suggested_occupation": occupation
        })

    # Remove duplicates based on occupation name, keeping the one with the highest confidence score
    unique_matches = {}
    for match in final_matches:
        if match["occupation_name"] not in unique_matches:
            unique_matches[match["occupation_name"]] = match
        else:
            # Keep the one with the higher confidence score
            if match["confidence_score"] > unique_matches[match["occupation_name"]]["confidence_score"]:
                unique_matches[match["occupation_name"]] = match

    # Sort the final unique matches by confidence score
    unique_matches = list(unique_matches.values())
    unique_matches.sort(key=lambda x: x["confidence_score"], reverse=True)

    return unique_matches[:5]



async def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of texts using OpenAI's embedding model."""
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=texts
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None

