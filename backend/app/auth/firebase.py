import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

_firebase_app = None


def initialize_firebase():
    global _firebase_app
    if _firebase_app:
        return _firebase_app

    cred_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    if cred_json:
        cred = credentials.Certificate(json.loads(cred_json))
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app

    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app

    _firebase_app = None
    return _firebase_app


def verify_token(id_token: str) -> dict:
    app = initialize_firebase()
    if not app:
        raise ValueError("Firebase not initialized")
    decoded = auth.verify_id_token(id_token)
    return decoded
