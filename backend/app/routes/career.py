from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Student
from app.agents.level_classifier import classify_student_level
from app.agents.career_agent import get_career_recommendation, save_career_path

router = APIRouter(prefix="/api/career", tags=["career"])


class ClassifyRequest(BaseModel):
    firebase_uid: str


@router.post("/classify")
def classify_student(data: ClassifyRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.firebase_uid == data.firebase_uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student_data = {
        "dsa_problems_solved": student.dsa_problems_solved or 0,
        "skills": student.skills or [],
        "programming_languages": student.programming_languages or [],
        "current_year": student.current_year or "",
        "interests": student.interests or "",
        "career_goals": student.career_goals or "",
    }

    level = classify_student_level(student_data)

    from app.db.models import StudentLevel
    student.level = StudentLevel(level)
    db.commit()

    return {"level": level, "student_id": student.id}


class RecommendRequest(BaseModel):
    firebase_uid: str


@router.post("/recommend")
def recommend_career(data: RecommendRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.firebase_uid == data.firebase_uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not student.level:
        raise HTTPException(status_code=400, detail="Student not classified yet")

    student_data = {
        "dsa_problems_solved": student.dsa_problems_solved or 0,
        "skills": student.skills or [],
        "programming_languages": student.programming_languages or [],
        "current_year": student.current_year or "",
        "interests": student.interests or "",
        "career_goals": student.career_goals or "",
    }

    recommendation = get_career_recommendation(student_data, student.level.value)
    career_path = save_career_path(student.id, student.level.value, recommendation)

    return {
        "id": career_path.id,
        "level": career_path.level.value,
        "title": career_path.title,
        "description": career_path.description,
        "milestones": career_path.milestones,
        "skills_to_learn": career_path.skills_to_learn,
        "recommended_roles": career_path.recommended_roles,
        "timeline_months": career_path.timeline_months,
    }
