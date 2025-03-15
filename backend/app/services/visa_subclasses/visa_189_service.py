# app/services/visa_subclasses/visa_189_service.py
from datetime import datetime
import json
from typing import Dict, Any, Optional

from app.services.points_calculator import VisaPointsCalculator, education_level_rank

class Visa189Calculator(VisaPointsCalculator):
    """Specific calculator for Subclass 189 visa"""
    
    @staticmethod
    def calculate_australian_study_points(completed: bool) -> int:
        """Calculate points for Australian study requirement"""
        return 5 if completed else 0
    
    @staticmethod
    def calculate_specialist_education_points(completed: bool) -> int:
        """Calculate points for specialist education qualification"""
        return 10 if completed else 0
    
    @staticmethod
    def calculate_community_language_points(accredited: bool) -> int:
        """Calculate points for community language"""
        return 5 if accredited else 0
    
    @staticmethod
    def calculate_regional_study_points(completed: bool) -> int:
        """Calculate points for study in regional Australia"""
        return 5 if completed else 0
    
    @staticmethod
    def calculate_professional_year_points(completed: bool) -> int:
        """Calculate points for professional year in Australia"""
        return 5 if completed else 0
    
    @staticmethod
    def calculate_partner_skills_points(skilled_partner: bool, competent_english: bool) -> int:
        """Calculate points for partner skills"""
        if skilled_partner:
            return 10
        elif competent_english:
            return 5
        else:
            return 0
    @staticmethod
    def calculate_english_points(english_level: str) -> int:
        """Calculate points for English language proficiency"""
        if english_level == "Superior":
            return 20
        elif english_level == "Proficient":
            return 10
        else:
            return 0
    
    @staticmethod
    def calculate_total_points(assessment_data: Dict[str, Any]) -> int:
        """Calculate total points for Subclass 189 visa"""
        total = 0
        
            # Add all point categories
        total += assessment_data.get("age_points", 0)
        total += assessment_data.get("english_points", 0)
        total += assessment_data.get("education_points", 0)
        total += assessment_data.get("experience_points", 0)
        total += assessment_data.get("australian_study_points", 0)
        total += assessment_data.get("specialist_education_points", 0)
        total += assessment_data.get("partner_skills_points", 0)
        total += assessment_data.get("community_language_points", 0)
        total += assessment_data.get("regional_study_points", 0)
        total += assessment_data.get("professional_year_points", 0)

        
        return total
    
    @staticmethod
    def determine_eligibility(points: int) -> tuple:
        """Determine eligibility for Subclass 189 visa based on points"""
        if points >= 65:
            return "potentially_eligible", "Points requirement met. Further verification needed."
        else:
            return "not_eligible", f"Minimum 65 points required. Current points: {points}"

async def process_189_assessment(assessment_data: Dict[str, Any], applicant_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    print("STARTED 189 VISA ASSESSMENT")
    """Process a Subclass 189 visa assessment"""
    
    # If we have applicant data, fill in the details
    print("APPLICANT DATA FROM 189 VISA ASSESSMENT SERVICE:",applicant_data)
    if applicant_data:
        applicant_data = json.loads(applicant_data)

        # Basic details
        #assessment_data["applicant_name"] = applicant_data["full_name"]
        #assessment_data["applicant_email"] = applicant_data["email"]
        
        # Handle date of birth
        dob_str = applicant_data["date_of_birth"]
        if dob_str:
            try:
                dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
                #assessment_data["applicant_dob"] = dob.isoformat()
                age = None
            except:
                dob = None
                age = applicant_data["age"]
        else:
            dob = None
            age = applicant_data["age"]
        
        # Calculate age points
        age_points = Visa189Calculator.calculate_age_points(dob, age)
        assessment_data["age_value"] = age
        assessment_data["age_points"] = age_points
        
        # Education
        if applicant_data["education"] and len(applicant_data["education"]) > 0:
            # Use the highest qualification
            education = sorted(
                applicant_data["education"], 
                key=lambda x: education_level_rank(x.get("level", "")), 
                reverse=True
            )[0]
            
            assessment_data["education_level"] = education["level"]
            assessment_data["education_field"] = education["field"]
            education_points = Visa189Calculator.calculate_education_points(education["level"])
            assessment_data["education_points"] = education_points
        
        # English proficiency
        english = applicant_data.get("english", {})
        if english:
            assessment_data["english_level"] = english["level"]
            assessment_data["english_test"] = english["test"]
            english_points = Visa189Calculator.calculate_english_points(english["level"])
            assessment_data["english_points"] = english_points
        
        # Work experience
        if applicant_data["experience"] and len(applicant_data["experience"]) > 0:
            # Calculate years of experience overseas and in Australia
            australia_years = 0
            overseas_years = 0
            
            for exp in applicant_data["experience"]:
                country = exp.get("country", "").lower()
                years = exp["duration_years"]
                
                if years is None:
                    # Try to calculate from dates
                    start_date = exp["start_date"]
                    end_date = exp["end_date"]
                    
                    if start_date and end_date and end_date != "present":
                        try:
                            start = datetime.strptime(start_date, "%Y-%m")
                            end = datetime.strptime(end_date, "%Y-%m")
                            years = (end.year - start.year) + (end.month - start.month) / 12
                        except:
                            years = 0
                    elif start_date and end_date == "present":
                        try:
                            start = datetime.strptime(start_date, "%Y-%m")
                            now = datetime.now()
                            years = (now.year - start.year) + (now.month - start.month) / 12
                        except:
                            years = 0
                
                if years:
                    if country == "australia":
                        australia_years += years
                    else:
                        overseas_years += years
            
            assessment_data["experience_australia_years"] = round(australia_years, 2)
            assessment_data["experience_overseas_years"] = round(overseas_years, 2)
            experience_points = Visa189Calculator.calculate_experience_points(overseas_years, australia_years)
            assessment_data["experience_points"] = experience_points
    
    # Initialize other point categories with default values
    assessment_data.setdefault("australian_study", False)
    assessment_data.setdefault("australian_study_points", 0)
    assessment_data.setdefault("specialist_education", False)
    assessment_data.setdefault("specialist_education_points", 0)
    assessment_data.setdefault("partner_skills_points", 0)
    assessment_data.setdefault("community_language_points", 0)
    assessment_data.setdefault("regional_study_points", 0)
    assessment_data.setdefault("professional_year_points", 0)
    
    # Calculate total points
    total_points = Visa189Calculator.calculate_total_points(assessment_data)
    assessment_data["total_points"] = total_points
    
    # Determine eligibility status
    eligibility_status, eligibility_notes = Visa189Calculator.determine_eligibility(total_points)
    assessment_data["eligibility_status"] = eligibility_status
    assessment_data["eligibility_notes"] = eligibility_notes
    
    return assessment_data

async def update_189_assessment(current_assessment: Dict[str, Any], update_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update a Subclass 189 visa assessment"""
    
    # Recalculate points if relevant fields are updated
    points_fields = ["age_value", "english_level", "education_level", 
                    "experience_australia_years", "experience_overseas_years",
                    "australian_study", "specialist_education"]
    
    needs_recalculation = any(field in update_data for field in points_fields)
    
    if needs_recalculation:
        # Merge the updates with current data
        assessment_data = {**current_assessment, **update_data}
        
        # Recalculate individual point categories
        if "age_value" in update_data:
            assessment_data["age_points"] = Visa189Calculator.calculate_age_points(age=assessment_data["age_value"])
            
        if "english_level" in update_data:
            assessment_data["english_points"] = Visa189Calculator.calculate_english_points(assessment_data["english_level"])
            
        if "education_level" in update_data:
            assessment_data["education_points"] = Visa189Calculator.calculate_education_points(assessment_data["education_level"])
            
        if "experience_australia_years" in update_data or "experience_overseas_years" in update_data:
            assessment_data["experience_points"] = Visa189Calculator.calculate_experience_points(
                assessment_data["experience_overseas_years"],
                assessment_data["experience_australia_years"]
            )
            
        if "australian_study" in update_data:
            assessment_data["australian_study_points"] = Visa189Calculator.calculate_australian_study_points(
                assessment_data["australian_study"])
                
        if "specialist_education" in update_data:
            assessment_data["specialist_education_points"] = Visa189Calculator.calculate_specialist_education_points(
                assessment_data["specialist_education"])
        
        # Recalculate total points
        total_points = Visa189Calculator.calculate_total_points(assessment_data)
        update_data["total_points"] = total_points
        
        # Update eligibility status
        eligibility_status, eligibility_notes = Visa189Calculator.determine_eligibility(total_points)
        update_data["eligibility_status"] = eligibility_status
        update_data["eligibility_notes"] = eligibility_notes
    
    return update_data