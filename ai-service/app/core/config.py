import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    PROJECT_NAME: str = "Agentic Contract ERP AI"
    VERSION: str = "0.1.0"

settings = Settings()
