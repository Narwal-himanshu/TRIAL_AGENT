from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Student, CareerPath

router = APIRouter(prefix="/api/student", tags=["student"])


class StudentInput(BaseModel):
    firebase_uid: str
    name: str
    current_year: str
    branch: str
    skills: list[str]
    programming_languages: list[str]
    interests: str
    career_goals: str
    dsa_problems_solved: int


@router.post("/profile")
def save_profile(data: StudentInput, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.firebase_uid == data.firebase_uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.name = data.name
    student.current_year = data.current_year
    student.branch = data.branch
    student.skills = data.skills
    student.programming_languages = data.programming_languages
    student.interests = data.interests
    student.career_goals = data.career_goals
    student.dsa_problems_solved = data.dsa_problems_solved
    db.commit()
    db.refresh(student)
    return {"message": "Profile saved", "student_id": student.id}


@router.get("/profile/{firebase_uid}")
def get_profile(firebase_uid: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.firebase_uid == firebase_uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "id": student.id,
        "firebase_uid": student.firebase_uid,
        "name": student.name,
        "current_year": student.current_year,
        "branch": student.branch,
        "skills": student.skills,
        "programming_languages": student.programming_languages,
        "interests": student.interests,
        "career_goals": student.career_goals,
        "dsa_problems_solved": student.dsa_problems_solved,
        "level": student.level.value if student.level else None,
    }
