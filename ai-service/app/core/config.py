import os
from pydantic import BaseModel

class Settings(BaseModel):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    PROJECT_NAME: str = "Agentic Contract ERP AI"
    VERSION: str = "0.1.0"

settings = Settings()
