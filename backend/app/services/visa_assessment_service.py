from app.db.supabase_client import get_supabase_client
from app.services.occupation_suggestion_llm_service import analyze_cv_with_llm
from app.services.visa_subclasses.visa_189_service import process_189_assessment

# app/services/visa_assessment_service.py
import json
from uuid import uuid4
from datetime import datetime
from typing import Dict, Any, Optional, List
import openai
from openai import OpenAI
from dotenv import load_dotenv  
import os

load_dotenv()


# Get OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#  Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)


# In /services/visa_assessment_service.py
async def create_visa_assessment(
    user_id: str, 
    client_id: str,
    visa_subclass: str,
    document_id: Optional[str] = None,  # Add document_id as parameter
    occupation_code: Optional[str] = None,
    occupation_name: Optional[str] = None,
    applicant_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Create a new visa assessment"""
    
    # Generate a new ID for the assessment
    assessment_id = str(uuid4())
    
    # Initialize with default values
    assessment_data = {
        "id": assessment_id,
        "user_id": user_id,
        "client_id": client_id,
        "document_id": document_id,
        "visa_subclass": visa_subclass,
        "visa_name": get_visa_name(visa_subclass),
        "occupation_code": occupation_code,
        "occupation_name": occupation_name,
        "status": "draft",
        "eligibility_status": "undetermined",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    # Process assessment based on visa subclass
    if visa_subclass == "189":
        assessment_data = await process_189_assessment(assessment_data, applicant_data)
    elif visa_subclass == "190":
        # TODO: Implement 190 assessment
        pass
    # Add more visa subclasses as needed
    
    # Save to database
    get_supabase_client().table("visa_assessments").insert(assessment_data).execute()
    print(assessment_data)
    return assessment_data

def get_visa_name(visa_subclass: str) -> str:
    """Return the full name of a visa subclass"""
    visa_names = {
        "189": "Skilled Independent Visa",
        "190": "Skilled Nominated Visa",
        "491": "Skilled Work Regional (Provisional) Visa",
        "186": "Employer Nomination Scheme",
        "482": "Temporary Skill Shortage Visa",
        "500": "Student Visa"
    }
    
    return visa_names.get(visa_subclass, f"Visa Subclass {visa_subclass}")

async def get_visa_assessment(assessment_id: str) -> Dict[str, Any]:
    """Get a visa assessment by ID"""
    result = get_supabase_client().table("visa_assessments").select("*").eq("id", assessment_id).execute()
    
    if not result.data or len(result.data) == 0:
        return None
    
    return result.data[0]

async def get_user_visa_assessments(user_id: str) -> List[Dict[str, Any]]:
    """Get all visa assessments for a user"""
    result = get_supabase_client().table("visa_assessments").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    
    return result.data if result.data else []

async def update_visa_assessment(assessment_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update a visa assessment"""
    # Don't allow updating certain fields
    protected_fields = ["id", "user_id", "created_at"]
    for field in protected_fields:
        if field in update_data:
            del update_data[field]
    
    # Add updated timestamp
    update_data["updated_at"] = datetime.now().isoformat()
    
    # Get current assessment
    current = await get_visa_assessment(assessment_id)
    if not current:
        return None
    
    # Route to appropriate visa subclass handler for updates
    visa_subclass = current.get("visa_subclass")
    
    if visa_subclass == "189":
        from app.services.visa_subclasses.visa_189_service import update_189_assessment
        update_data = await update_189_assessment(current, update_data)
    elif visa_subclass == "190":
        # TODO: Implement 190 assessment update
        pass
    # Add more visa subclasses as needed
    
    # Update in database
    result = get_supabase_client().table("visa_assessments").update(update_data).eq("id", assessment_id).execute()
    
    if not result.data or len(result.data) == 0:
        return None
        
    return result.data[0]



async def extract_applicant_data_from_cv(cv_text: str) -> Dict[str,Any]:
    """Extract applicant data from CV using OpenAI API and return JSON response."""
    
    # Updated prompt with clear instructions for JSON output
    prompt = f"""
    Based on the following CV, extract information relevant for an Australian skilled visa application.
    Extract the following details if available:
    
    1. Full name
    2. Email address
    3. Date of birth or age
    4. Education qualifications (level, institution, field, country, dates)
    5. Work experience (job titles, companies, dates, locations)
    6. English language proficiency level and test scores if mentioned
    
    Format your response as structured JSON with these fields (leave empty if not found):
    {{
      "full_name": "",
      "email": "",
      "date_of_birth": "YYYY-MM-DD", // or null
      "age": null, // numeric age if date not available
      "education": [
        {{
          "level": "", // phd, masters, bachelors, diploma, etc.
          "field": "",
          "institution": "",
          "country": "",
          "start_date": "YYYY-MM", // or null
          "end_date": "YYYY-MM" // or null
        }}
      ],
      "experience": [
        {{
          "title": "",
          "company": "",
          "country": "",
          "start_date": "YYYY-MM", // or null
          "end_date": "YYYY-MM", // or "present" if current
          "duration_years": null // numeric duration if dates not clear
        }}
      ],
      "english": {{
        "level": "", // superior, proficient, competent, or null
        "test": "", // IELTS, PTE, etc.
        "scores": {{
          "overall": null,
          "reading": null,
          "writing": null,
          "speaking": null,
          "listening": null
        }}
      }}
    }}

    CV Content:
    {cv_text}
    """

    try:
        # Updated OpenAI API call using the client
        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that extracts structured data from text and returns it as JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.0,  # Low temperature for more deterministic output
            response_format={"type": "json_object"}  # Ensures JSON output (available in newer API versions)
        )

        # OpenAI already returns a dictionary
        applicant_data = response.choices[0].message.content
        #print(applicant_data)
        return applicant_data  # Returning as Dict[str, Any]

    except openai.APIError as e:
        return {"error": f"OpenAI API error: {str(e)}"}

    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}