# app/db/models/occupation.py
from sqlalchemy import Column, String, Text, ARRAY, Float
from app.db.base_class import Base

class Occupation(Base):
    __tablename__ = "occupations"

    anzsco_code = Column(String, primary_key=True, index=True)
    occupation_name = Column(String, nullable=False, index=True)
    list = Column(String, nullable=True)  # Assuming this is the occupation list type
    visa_subclasses = Column(String, nullable=True)  # Consider using ARRAY(String) if it's a list
    assessing_authority = Column(String, nullable=True)
    occupation_embedding = Column(ARRAY(Float), nullable=True)