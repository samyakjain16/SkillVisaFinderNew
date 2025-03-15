# In your response.py models file
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class OccupationMatch(BaseModel):
    anzsco_code: str
    occupation_name: str
    list: Optional[str] = None
    visa_subclasses: Optional[str] = None
    assessing_authority: Optional[str] = None
    confidence_score: float
    suggested_occupation: str

class CVAnalysisResponse(BaseModel):
    extracted_info: List[str]  # Changed from extracted_text to match your response
    occupation_matches: List[OccupationMatch]