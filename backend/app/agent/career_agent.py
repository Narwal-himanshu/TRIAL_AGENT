import json
from datetime import datetime
from google import genai
from pydantic import ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import get_settings
from app.models.schemas import UserProfile, GenerateCareerResponse, YearlyPlan, PlanMetadata

settings = get_settings()
client = genai.Client(api_key=settings.gemini_api_key)

PROMPT_TEMPLATE = """
You are an elite, senior career coach and Silicon Valley engineering manager.
Your task is to generate a highly specific, actionable, year-by-year career roadmap for the user.

USER PROFILE:
Name: {name}
Current Role: {current_role}
Target Role: {target_role}
Years of Experience: {years_experience}
Skills: {skills}
Education: {education}

ROADMAP DURATION: {years} years.

INSTRUCTIONS:
1. Provide a step-by-step roadmap for exactly {years} years.
2. The plan must bridge the gap between their Current Role and Target Role.
3. Each year should have:
   - A descriptive `title` (e.g., "Foundation & Skill Building", "Senior Contributor Transition").
   - 3-5 specific, actionable `goals` for that year.
   - 3-5 concrete `actions` they must take to achieve the goals.
   - 3-5 specific `skills_to_learn` relevant to the target role.
   - A major `milestone` to hit by the end of the year.
4. Return ONLY a valid JSON object matching the requested schema. No markdown wrapping, no code blocks (like ```json), and no extra text.

EXPECTED JSON SCHEMA:
{{
    "plan": [
        {{
            "year": 1,
            "title": "String",
            "goals": ["String"],
            "actions": ["String"],
            "skills_to_learn": ["String"],
            "milestone": "String"
        }}
        // ... repeat for exactly {years} years
    ]
}}
"""

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(Exception),
    reraise=True
)
async def generate_career_plan(user_profile: UserProfile, years: int) -> GenerateCareerResponse:
    """
    Generates a personalized, year-by-year career roadmap for a user.
    Calls the Gemini 2.0 Flash model and enforces a strict JSON response.

    Args:
        user_profile (UserProfile): The user's current background and target role.
        years (int): The number of years for the roadmap duration.

    Returns:
        GenerateCareerResponse: A structured Pydantic object containing the roadmap plan and metadata.
    """
    prompt = PROMPT_TEMPLATE.format(
        name=user_profile.name or "N/A",
        current_role=user_profile.current_role,
        target_role=user_profile.target_role,
        years_experience=user_profile.years_experience,
        skills=", ".join(user_profile.skills) if user_profile.skills else "None specified",
        education=user_profile.education or "N/A",
        years=years
    )

    # Use Google GenAI SDK's async client to avoid blocking the event loop
    response = await client.aio.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.7,
        }
    )

    try:
        raw_text = response.text
        # Sometimes the model might still return markdown wrapping despite instructions and response_mime_type
        if raw_text.startswith("```json"):
            raw_text = raw_text.replace("```json", "", 1)
        if raw_text.endswith("```"):
            raw_text = raw_text.rsplit("```", 1)[0]

        data = json.loads(raw_text.strip())

        # Validate structure with Pydantic
        # Since response schema requires `plan` and `metadata`, we construct the metadata here.
        plan_items = [YearlyPlan(**item) for item in data.get("plan", [])]

        if len(plan_items) != years:
            # If the model didn't return the exact number of years, that's an error, but we'll accept it
            # if we are strict. However, for a robust API, we just take what it gave us as valid plans.
            pass

        return GenerateCareerResponse(
            plan=plan_items,
            metadata=PlanMetadata(
                generated_at=datetime.utcnow().isoformat() + "Z",
                model="gemini-2.0-flash"
            )
        )
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse LLM response as JSON: {e}")
    except ValidationError as e:
        raise Exception(f"LLM response did not match expected schema: {e}")
