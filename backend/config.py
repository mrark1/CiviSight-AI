import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
UPLOAD_DIR = PROJECT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{BASE_DIR / 'civisight.db'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    UPLOAD_DIR = str(UPLOAD_DIR)
    SECRET_KEY = os.getenv("SECRET_KEY", "civisight-development-secret")
