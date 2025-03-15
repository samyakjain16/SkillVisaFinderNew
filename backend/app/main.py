# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import documents, auth, users, visa_assessment  # Import the new auth router
from app.core.config import settings

app = FastAPI(title="Visa Assessment API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix=f"{settings.API_V1_STR}", tags=["documents"])
#app.include_router(auth.router, prefix=settings.API_V1_STR)  # Add the auth router
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}", tags=["auth"])

app.include_router(users.router, prefix=settings.API_V1_STR)  # Make sure this is added


#-----------
app.include_router(visa_assessment.router, prefix=settings.API_V1_STR, tags=["visa-assessment"])  # Add this line


@app.get("/")
async def root():
    return {"message": "Welcome to the Visa Assessment API"}