from pydantic import BaseModel, Field
from typing import List, Optional

class UserProfile(BaseModel):
    name: Optional[str] = None
    current_role: str
    target_role: str
    years_experience: int
    skills: List[str]
    education: Optional[str] = None

class GenerateCareerRequest(BaseModel):
    user_profile: UserProfile
    years: int = Field(default=5, ge=1, le=10)

class YearlyPlan(BaseModel):
    year: int
    title: str
    goals: List[str]
    actions: List[str]
    skills_to_learn: List[str]
    milestone: str

class PlanMetadata(BaseModel):
    generated_at: str
    model: str

class GenerateCareerResponse(BaseModel):
    plan: List[YearlyPlan]
    metadata: PlanMetadata
