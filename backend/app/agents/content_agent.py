import os
import json
from serpapi import GoogleSearch
from app.common.gemini import generate

SERPAPI_KEY = os.getenv("SERPAPI_API_KEY")
YOUTUBE_KEY = os.getenv("YOUTUBE_API_KEY")


def get_content_feed(student_data: dict, career_title: str) -> dict:
    skills = student_data.get("skills", [])
    interests = student_data.get("interests", "")
    goals = student_data.get("career_goals", "")

    internships = _search_internships(career_title, skills)
    hackathons = _search_hackathons()
    ctfs = _search_ctfs()
    courses = _recommend_courses(career_title, interests, goals)

    return {
        "internships": internships,
        "hackathons": hackathons,
        "ctfs": ctfs,
        "courses": courses,
    }


def _search_internships(career: str, skills: list) -> list:
    if not SERPAPI_KEY:
        return _gemini_fallback("internships", career, skills)
    try:
        params = {
            "q": f"{career} internship 2026 {' '.join(skills[:3])}",
            "tbm": "nws",
            "num": 5,
            "api_key": SERPAPI_KEY,
        }
        results = GoogleSearch(params).get_dict()
        news = results.get("news_results", [])
        return [
            {"title": n.get("title"), "link": n.get("link"), "source": n.get("source")}
            for n in news[:5]
        ]
    except Exception:
        return _gemini_fallback("internships", career, skills)


def _search_hackathons() -> list:
    if not SERPAPI_KEY:
        return _gemini_fallback("hackathons", "", [])
    try:
        params = {
            "q": "upcoming hackathons 2026 for college students",
            "num": 5,
            "api_key": SERPAPI_KEY,
        }
        results = GoogleSearch(params).get_dict()
        organic = results.get("organic_results", [])
        return [
            {"title": r.get("title"), "link": r.get("link"), "snippet": r.get("snippet")}
            for r in organic[:5]
        ]
    except Exception:
        return _gemini_fallback("hackathons", "", [])


def _search_ctfs() -> list:
    if not SERPAPI_KEY:
        return _gemini_fallback("CTFs", "", [])
    try:
        params = {
            "q": "upcoming CTF competitions 2026 cybersecurity",
            "num": 5,
            "api_key": SERPAPI_KEY,
        }
        results = GoogleSearch(params).get_dict()
        organic = results.get("organic_results", [])
        return [
            {"title": r.get("title"), "link": r.get("link"), "snippet": r.get("snippet")}
            for r in organic[:5]
        ]
    except Exception:
        return _gemini_fallback("CTFs", "", [])


def _recommend_courses(career: str, interests: str, goals: str) -> list:
    prompt = f"""
Recommend 5 online courses for someone pursuing {career}.
Interests: {interests}
Goals: {goals}

Respond in JSON array format (no markdown):
[{{"title": "Course name", "platform": "Coursera/Udemy/etc", "reason": "why this helps"}}]
"""
    try:
        raw = generate(prompt)
        return json.loads(raw)
    except Exception:
        return []


def _gemini_fallback(field: str, career: str, skills: list) -> list:
    prompt = f"""
Suggest 5 {field} opportunities for a student interested in {career}.
Skills: {', '.join(skills) if skills else 'various'}

Respond in JSON array format (no markdown):
[{{"title": "Opportunity name", "description": "brief description"}}]
"""
    try:
        raw = generate(prompt)
        return json.loads(raw)
    except Exception:
        return []
