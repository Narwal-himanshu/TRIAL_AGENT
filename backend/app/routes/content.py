from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Student, CareerPath
from app.agents.content_agent import get_content_feed

router = APIRouter(prefix="/api/content", tags=["content"])


class FeedRequest(BaseModel):
    firebase_uid: str


@router.post("/feed")
def content_feed(data: FeedRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.firebase_uid == data.firebase_uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    career_path = (
        db.query(CareerPath)
        .filter(CareerPath.student_id == student.id)
        .order_by(CareerPath.id.desc())
        .first()
    )
    career_title = career_path.title if career_path else "general"

    student_data = {
        "skills": student.skills or [],
        "interests": student.interests or "",
        "career_goals": student.career_goals or "",
    }

    feed = get_content_feed(student_data, career_title)
    return feed
