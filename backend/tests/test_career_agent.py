import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

MOCK_SUCCESS_PAYLOAD = {
    "user_profile": {
        "name": "Jules",
        "current_role": "Junior Backend Engineer",
        "target_role": "Senior Cloud Engineer",
        "years_experience": 1,
        "skills": ["Python"]
    },
    "years": 1
}

MOCK_LLM_RESPONSE = """
{
    "plan": [
        {
            "year": 1,
            "title": "Cloud Fundamentals",
            "goals": ["Learn AWS"],
            "actions": ["Take AWS CCP"],
            "skills_to_learn": ["AWS", "Terraform"],
            "milestone": "Pass AWS CCP"
        }
    ]
}
"""

class MockResponse:
    def __init__(self, text):
        self.text = text

@pytest.fixture
def mock_genai():
    with patch("app.agent.career_agent.client.aio.models.generate_content", new_callable=AsyncMock) as mock:
        yield mock


def test_generate_career_success(mock_genai):
    mock_genai.return_value = MockResponse(MOCK_LLM_RESPONSE)

    response = client.post("/api/career/generate", json=MOCK_SUCCESS_PAYLOAD)

    assert response.status_code == 200
    data = response.json()
    assert "plan" in data
    assert "metadata" in data
    assert len(data["plan"]) == 1
    assert data["plan"][0]["year"] == 1
    assert data["plan"][0]["title"] == "Cloud Fundamentals"
    assert data["metadata"]["model"] == "gemini-2.0-flash"


def test_generate_career_missing_fields():
    # Missing 'current_role' and 'skills' which are required by the schema
    bad_payload = {
        "user_profile": {
            "name": "Jules",
            "target_role": "Senior Cloud Engineer",
            "years_experience": 1
        },
        "years": 1
    }
    response = client.post("/api/career/generate", json=bad_payload)
    assert response.status_code == 422


def test_generate_career_llm_failure(mock_genai):
    mock_genai.side_effect = Exception("Google API Error")

    response = client.post("/api/career/generate", json=MOCK_SUCCESS_PAYLOAD)

    # The application gracefully wraps internal failures in a 500
    assert response.status_code == 500
    assert "Internal server error" in response.json()["detail"]
