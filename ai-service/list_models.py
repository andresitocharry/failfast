import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found in environment.")
    exit(1)

genai.configure(api_key=api_key)


print("Listing available models...")
try:
    with open("models.txt", "w", encoding="utf-8") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                line = f"- {m.name}"
                print(line)
                f.write(line + "\n")
except Exception as e:
    print(f"Error listing models: {str(e)}")
