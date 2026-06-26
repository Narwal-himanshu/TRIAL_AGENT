from app.common.gemini import generate


def classify_student_level(student_data: dict) -> str:
    dsa = student_data.get("dsa_problems_solved", 0)
    skills = student_data.get("skills", [])
    languages = student_data.get("programming_languages", [])
    year = student_data.get("current_year", "")

    rule_level = _rule_based_classifier(dsa, skills, languages, year)
    gemini_level = _gemini_classifier(student_data)

    levels = ["beginner", "intermediate", "advanced"]
    rule_idx = levels.index(rule_level)
    gemini_idx = levels.index(gemini_level)

    if abs(rule_idx - gemini_idx) <= 1:
        return levels[max(rule_idx, gemini_idx)]

    return rule_level


def _rule_based_classifier(dsa: int, skills: list, languages: list, year: str) -> str:
    year_num = 0
    for y in ["1st", "2nd", "3rd", "4th"]:
        if y in year:
            year_num = int(y[0])
            break

    score = 0
    if dsa >= 200:
        score += 3
    elif dsa >= 100:
        score += 2
    elif dsa >= 30:
        score += 1

    if len(skills) >= 5:
        score += 2
    elif len(skills) >= 3:
        score += 1

    if len(languages) >= 3:
        score += 2
    elif len(languages) >= 2:
        score += 1

    if year_num >= 3:
        score += 2
    elif year_num >= 2:
        score += 1

    if score >= 6:
        return "advanced"
    elif score >= 3:
        return "intermediate"
    return "beginner"


def _gemini_classifier(student_data: dict) -> str:
    prompt = f"""
You are a career guidance AI. Classify this student's skill level as 'beginner', 'intermediate', or 'advanced'.

Student info:
- Current year: {student_data.get("current_year", "N/A")}
- Skills: {", ".join(student_data.get("skills", []))}
- Programming languages: {", ".join(student_data.get("programming_languages", []))}
- DSA problems solved: {student_data.get("dsa_problems_solved", 0)}
- Interests: {student_data.get("interests", "N/A")}
- Career goals: {student_data.get("career_goals", "N/A")}

Respond with ONLY one word: beginner, intermediate, or advanced.
"""
    return generate(prompt)
