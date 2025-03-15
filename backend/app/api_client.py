# app/api_client.py
import requests
import os
from typing import Dict, Any

class VisaAssessmentAPI:
    """Client for Visa Assessment API."""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv("API_BASE_URL", "http://localhost:8000")
        self.session = requests.Session()
    
    def upload_cv(self, file_path: str) -> Dict[str, Any]:
        """
        Upload a CV file for analysis.
        
        Args:
            file_path: Path to the CV file
            
        Returns:
            Dict containing analysis results
        """
        url = f"{self.base_url}/documents/upload-cv"
        
        with open(file_path, "rb") as file:
            files = {"file": file}
            response = self.session.post(url, files=files)
        
        if response.status_code != 200:
            raise Exception(f"Error uploading CV: {response.text}")
        
        return response.json()
    
    def get_occupation_details(self, anzsco_code: str) -> Dict[str, Any]:
        """
        Get details for a specific occupation.
        
        Args:
            anzsco_code: ANZSCO code for the occupation
            
        Returns:
            Dict containing occupation details
        """
        url = f"{self.base_url}/occupations/{anzsco_code}"
        response = self.session.get(url)
        
        if response.status_code != 200:
            raise Exception(f"Error getting occupation details: {response.text}")
        
        return response.json()