import io
from docx import Document
from pypdf import PdfReader
import pdfplumber

async def extract_text_from_document(file_content: bytes, content_type: str) -> str:
    """Extract text from PDF or DOCX files."""
    if "pdf" in content_type:
        return extract_text_from_pdf(file_content)
    elif "docx" in content_type:
        return extract_text_from_docx(file_content)
    else:
        raise ValueError(f"Unsupported content type: {content_type}")

import io
from pypdf import PdfReader
import pdfplumber

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from a PDF file using pypdf with pdfplumber as a fallback."""
    try:
        # Primary extraction using pypdf
        pdf = PdfReader(io.BytesIO(file_content))
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        
        if text.strip():  # Ensure extracted text is not empty
            return text
        else:
            raise ValueError("pypdf extraction returned empty text.")
    
    except Exception as e:
        print(f"Error extracting PDF text with pypdf: {str(e)}")
    
    # Fallback extraction using pdfplumber
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            return text if text.strip() else "Error extracting text from PDF. Please try another file."
    
    except Exception as e2:
        print(f"Fallback PDF extraction also failed: {str(e2)}")
        return "Error extracting text from PDF. Please try another file."


def extract_text_from_docx(file_content: bytes) -> str:
    print
    """Extract text from DOCX file."""
    doc = Document(io.BytesIO(file_content))
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])
