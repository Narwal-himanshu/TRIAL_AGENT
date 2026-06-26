import enum
from sqlalchemy import Column, Integer, String, Text, JSON, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base


class StudentLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    firebase_uid = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    current_year = Column(String(50))
    branch = Column(String(255))
    skills = Column(JSON)
    programming_languages = Column(JSON)
    interests = Column(Text)
    career_goals = Column(Text)
    dsa_problems_solved = Column(Integer, default=0)
    level = Column(Enum(StudentLevel), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    level = Column(Enum(StudentLevel), nullable=False)
    title = Column(String(255))
    description = Column(Text)
    milestones = Column(JSON)
    skills_to_learn = Column(JSON)
    recommended_roles = Column(JSON)
    timeline_months = Column(Integer)
    raw_recommendation = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class CareerTemplate(Base):
    __tablename__ = "career_templates"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    level = Column(Enum(StudentLevel), nullable=False)
    milestones = Column(JSON)
    skills_to_learn = Column(JSON)
    recommended_roles = Column(JSON)
    timeline_months = Column(Integer)
    required_skills = Column(JSON)
