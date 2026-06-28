import asyncio
from app.models.schemas import UserProfile
from app.agent.career_agent import generate_career_plan
import os
import json

async def main():
    if not os.getenv("GEMINI_API_KEY"):
        print("Set GEMINI_API_KEY to run test.")
        return

    profile = UserProfile(
        name="Alice",
        current_role="Junior Frontend Engineer",
        target_role="Senior Full-Stack Engineer",
        years_experience=1,
        skills=["React", "JavaScript", "HTML/CSS"],
        education="B.S. Computer Science"
    )

    try:
        response = await generate_career_plan(profile, 3)
        print(response.model_dump_json(indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
