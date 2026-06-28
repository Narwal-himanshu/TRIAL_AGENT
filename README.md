# AI Career Agent

An AI-powered backend that generates highly specific, year-by-year career roadmaps using Google's Gemini 2.0 Flash.

## Quick start (Docker)
```bash
cp backend/.env.example backend/.env   # fill in your API key
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Quick start (local dev)

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in your API key
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

FastAPI provides automatic interactive API documentation:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Core Endpoints

### Generate Career Plan

**POST** `/api/career/generate`

**Request Body**
```json
{
  "user_profile": {
    "name": "Jane Doe",
    "current_role": "Junior Frontend Engineer",
    "target_role": "Senior Full-Stack Engineer",
    "years_experience": 1,
    "skills": ["React", "JavaScript", "HTML", "CSS"],
    "education": "B.S. Computer Science"
  },
  "years": 3
}
```

**Response**
```json
{
  "plan": [
    {
      "year": 1,
      "title": "Foundation & Backend Basics",
      "goals": [
        "Master backend fundamentals with Node.js or Python",
        "Understand database design and SQL"
      ],
      "actions": [
        "Build 3 full-stack projects",
        "Take an advanced system design course"
      ],
      "skills_to_learn": [
        "Node.js",
        "PostgreSQL",
        "REST APIs"
      ],
      "milestone": "Deploy a complete full-stack application with a real database."
    }
  ],
  "metadata": {
    "generated_at": "2023-10-25T12:00:00Z",
    "model": "gemini-2.0-flash"
  }
}
```

### Health Check

**GET** `/api/health`

**Response**
```json
{
  "status": "ok"
}
```
