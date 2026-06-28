from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.schemas import GenerateCareerRequest, GenerateCareerResponse
from app.agent.career_agent import generate_career_plan

router = APIRouter(prefix="/api/career", tags=["career"])

@router.post("/generate", response_model=GenerateCareerResponse)
async def generate_career(request: GenerateCareerRequest):
    """
    Endpoint to generate a personalized career roadmap for a user.
    Uses an AI agent to build a year-by-year plan.
    """
    try:
        response = await generate_career_plan(request.user_profile, request.years)
        return response
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        if "429" in str(e):
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
        raise HTTPException(status_code=500, detail="Internal server error while generating career plan.")
