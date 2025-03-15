# app/services/points_calculator.py
from datetime import datetime, date
from typing import Dict, Any, Optional

class VisaPointsCalculator:
    """Base calculator for visa points assessment"""
    
    @staticmethod
    def calculate_age_points(dob: Optional[date] = None, age: Optional[int] = None) -> int:
        """Calculate points for age"""
        if age is None and dob is not None:
            # Calculate age from date of birth
            today = datetime.now().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        
        if age is None:
            return 0
            
        if 18 <= age <= 24:
            return 25
        elif 25 <= age <= 32:
            return 30
        elif 33 <= age <= 39:
            return 25
        elif 40 <= age <= 44:
            return 15
        else:
            return 0
    
    @staticmethod
    def calculate_english_points(level: Optional[str] = None) -> int:
        """Calculate points for English language proficiency"""
        if level is None:
            return 0
            
        level = level.lower()
        if level == "superior":
            return 20
        elif level == "proficient":
            return 10
        elif level == "competent":
            return 0
        else:
            return 0
    
    @staticmethod
    def calculate_education_points(level: Optional[str] = None) -> int:
        """Calculate points for educational qualifications"""
        if level is None:
            return 0
            
        level = level.lower()
        if level == "phd":
            return 20
        elif level in ["masters", "bachelors"]:
            return 15
        elif level in ["diploma", "trade"]:
            return 10
        else:
            return 0
    
    @staticmethod
    def calculate_experience_points(overseas_years: Optional[float] = None, australia_years: Optional[float] = None) -> int:
        """Calculate points for skilled employment experience"""
        overseas_points = 0
        australia_points = 0
        
        # Overseas employment points
        if overseas_years is not None:
            if 3 <= overseas_years < 5:
                overseas_points = 5
            elif 5 <= overseas_years < 8:
                overseas_points = 10
            elif overseas_years >= 8:
                overseas_points = 15
        
        # Australian employment points
        if australia_years is not None:
            if 1 <= australia_years < 3:
                australia_points = 5
            elif 3 <= australia_years < 5:
                australia_points = 10
            elif 5 <= australia_years < 8:
                australia_points = 15
            elif australia_years >= 8:
                australia_points = 20
        
        # Return the higher of the two
        return max(overseas_points, australia_points)

# Utility functions for education ranking
def education_level_rank(level: str) -> int:
    """Helper function to rank education levels"""
    level = level.lower()
    ranks = {
        "phd": 5,
        "doctorate": 5,
        "masters": 4,
        "master": 4,
        "bachelors": 3,
        "bachelor": 3,
        "diploma": 2,
        "advanced diploma": 2,
        "certificate": 1,
        "trade": 1
    }
    
    return ranks.get(level, 0)