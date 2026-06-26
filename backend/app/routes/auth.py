from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Student
from app.auth.firebase import verify_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    id_token: str


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        decoded = verify_token(data.id_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

    uid = decoded.get("uid", "")
    email = decoded.get("email", "")

    student = db.query(Student).filter(Student.firebase_uid == uid).first()
    if not student:
        student = Student(firebase_uid=uid, email=email)
        db.add(student)
        db.commit()
        db.refresh(student)
        return {"student_id": student.id, "profile_complete": False}

    profile_complete = bool(student.name and student.branch)
    return {"student_id": student.id, "profile_complete": profile_complete}
