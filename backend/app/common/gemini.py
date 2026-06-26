import os
import time
import random
from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

_PRIMARY_MODEL = "gemini-2.5-flash-lite"
_FALLBACK_MODEL = "gemini-2.5-flash"

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate(prompt: str, max_retries: int = 5) -> str:
    last_error = None
    models = [_PRIMARY_MODEL]
    if _FALLBACK_MODEL != _PRIMARY_MODEL:
        models.append(_FALLBACK_MODEL)

    for model in models:
        for attempt in range(max_retries):
            try:
                response = _client.models.generate_content(model=model, contents=prompt)
                return response.text.strip()
            except errors.ServerError as e:
                last_error = e
                code = getattr(e, "code", 0) or getattr(e, "status_code", 0)
                if code in (429, 503):
                    delay = (2 ** attempt) + random.uniform(0, 1)
                    time.sleep(delay)
                    continue
                break
            except Exception as e:
                last_error = e
                break
        if not last_error:
            break

    raise last_error or Exception("Gemini API call failed after all retries")
