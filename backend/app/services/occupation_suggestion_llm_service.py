
import os
import json
import re
from fastapi import HTTPException
from openai import AsyncOpenAI, OpenAIError
from dotenv import load_dotenv  

# ✅ Load .env variables
load_dotenv()

# ✅ Get OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("Missing OpenAI API Key! Set OPENAI_API_KEY in your .env file or environment.")

# ✅ Initialize OpenAI client
client = AsyncOpenAI(api_key=OPENAI_API_KEY)

async def analyze_cv_with_llm(cv_text: str) -> list:
    """
    Analyze CV text using LLM to suggest suitable occupations for Australian visa.
    """
    print("Analyzing CV with LLM...")

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": 
                    "You are an expert Australian migration agent who specializes in analyzing CVs and identifying appropriate ANZSCO occupations for migration visas."},
                {"role": "user", "content": 
                    f"""Analyze the following CV and suggest 3-5 most suitable ANZSCO occupations for Australian skilled migration:

                    {cv_text}

                    For each occupation, provide only the occupation name. Do not include ANZSCO codes or additional information.
                    Format your response as a JSON array of occupation names only.
                    """}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}  # Updated to correct format
        )

        # ✅ Extract and parse JSON response correctly
        content = response.choices[0].message.content
        print("Content",content)

        try:
            occupations = json.loads(content)

            # Ensure response is a list
            if not isinstance(occupations, list):
                if isinstance(occupations, dict) and "occupations" in occupations:
                    occupations = occupations["occupations"]
                else:
                    raise ValueError("Response is not a list or doesn't contain an occupations list")

            return occupations
        except json.JSONDecodeError:
            # ✅ Fallback parsing if JSON fails
            lines = content.split("\n")
            occupations = []
            for line in lines:
                cleaned = line.strip()
                if cleaned and not cleaned.startswith(("```", "{", "}")):
                    cleaned = re.sub(r'^[\d\.\*\-\"\'\s]+', '', cleaned)
                    cleaned = re.sub(r'[\"\'\s]+$', '', cleaned)
                    if cleaned:
                        occupations.append(cleaned)

            return occupations[:5]  # ✅ Limit to 5 occupations

    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

