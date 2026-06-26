from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.routes import auth, student, career, content
from app.auth.firebase import initialize_firebase
from app.agents.career_agent import initialize_vector_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database init skipped: {e}")
    try:
        initialize_firebase()
    except Exception as e:
        print(f"Firebase init skipped: {e}")
    try:
        initialize_vector_db()
    except Exception as e:
        print(f"Vector DB init skipped: {e}")
    yield

app = FastAPI(title="AI Career Agent API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(student.router)
app.include_router(career.router)
app.include_router(content.router)


@app.get("/")
async def root():
    return {
        "message": "AI Career Agent API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "student": "/api/student",
            "career": "/api/career",
            "content": "/api/content",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
