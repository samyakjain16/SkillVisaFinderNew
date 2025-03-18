from typing import Dict, Any, Optional
from app.db.supabase_client import get_supabase_client
from openai import AsyncOpenAI
import os
import json
from dotenv import load_dotenv
from datetime import datetime
from dateutil import parser

# Load environment variables
load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def format_date(date_str: str) -> Optional[str]:
    """Format date string to YYYY-MM-DD."""
    try:
        return parser.parse(date_str).strftime("%Y-%m-%d")
    except:
        return None

async def extract_and_save_applicant_data(extracted_text: str, client_id: str) -> Optional[Dict[str, Any]]:
    """
    Extract applicant data from CV text and save to database.
    Stores education and experience as JSONB in the clients table.
    """
    try:
        # Define extraction schema matching current database structure
        extraction_schema = {
            "personal": {
                "full_name": "",
                "email": "",
                "phone": "",
                "date_of_birth": "",
                "nationality": ""
            },
            "education": [{
                "level": "",
                "field": "",
                "institution": "",
                "country": "",
                "start_date": "",
                "end_date": ""
            }],
            "experience": [{
                "title": "",
                "company": "",
                "country": "",
                "start_date": "",
                "end_date": ""
            }]
        }

        # Create system message for GPT
        system_message = """Extract personal information, education, and work experience from the CV text.
Rules:
- Extract only explicitly stated information
- Format dates as YYYY-MM-DD where possible
- Leave fields empty if information is not found
- For education and experience, list in reverse chronological order (most recent first)
- Use "present" for current positions/education"""

        # Get OpenAI response
        response = await client.chat.completions.create(
            model="gpt-4-1106-preview",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Extract the following information from this CV into a JSON object:\n\n{json.dumps(extraction_schema, indent=2)}\n\nCV TEXT:\n{extracted_text}\n\nReturn only a valid JSON object matching the schema exactly."}
            ],
            response_format={"type": "json_object"}
        )

        # Parse the response
        extracted_data = json.loads(response.choices[0].message.content)

        # Process dates in education
        if "education" in extracted_data:
            for edu in extracted_data["education"]:
                if edu.get("start_date"):
                    edu["start_date"] = format_date(edu["start_date"])
                if edu.get("end_date") and edu["end_date"].lower() != "present":
                    edu["end_date"] = format_date(edu["end_date"])

        # Process dates in experience
        if "experience" in extracted_data:
            for exp in extracted_data["experience"]:
                if exp.get("start_date"):
                    exp["start_date"] = format_date(exp["start_date"])
                if exp.get("end_date") and exp["end_date"].lower() != "present":
                    exp["end_date"] = format_date(exp["end_date"])

        # Prepare update data
        update_data = {}
        
        # Add personal information
        if extracted_data.get("personal"):
            personal = extracted_data["personal"]
            for key, value in personal.items():
                if value:  # Only include non-empty values
                    update_data[key] = value

        # Add education and experience as JSONB
        if extracted_data.get("education"):
            valid_education = [
                edu for edu in extracted_data["education"] 
                if any(value for value in edu.values())
            ]
            if valid_education:
                update_data["education"] = valid_education

        if extracted_data.get("experience"):
            valid_experience = [
                exp for exp in extracted_data["experience"] 
                if any(value for value in exp.values())
            ]
            if valid_experience:
                update_data["experience"] = valid_experience

        # Update client record
        if update_data:
            result = get_supabase_client().table("clients").update(update_data).eq("id", client_id).execute()
            
            if not result.data:
                print(f"Failed to update client record: {client_id}")
                return None

            return result.data[0]

        return None

    except Exception as e:
        print(f"Error in extract_and_save_applicant_data: {str(e)}")
        return None