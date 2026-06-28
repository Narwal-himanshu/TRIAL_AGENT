# AI Career Agent

An AI-powered backend that generates highly specific, year-by-year career roadmaps using Google's Gemini 2.0 Flash.

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and set your `GEMINI_API_KEY`.

## Running the Application

To start the server, run:
```bash
uvicorn app.main:app --reload
```
The server will start on `http://127.0.0.1:8000`.

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
