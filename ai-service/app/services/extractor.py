from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from app.models import ContractSchema, Phase, ActionItem
from app.core.config import settings
import json
import io
from pydantic import ValidationError
from pypdf import PdfReader

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    """
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""


# Initialize LLM (Gemini)
if not settings.GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in settings.")

llm = ChatGoogleGenerativeAI(
    model="gemini-3-pro-preview",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0
)

# Define the Prompt
extraction_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert legal AI. Extract the contract structure, parties, and actionable items into the specified JSON format. "
               "Divide the contract strictly into 3 phases: INITIATION, EXECUTION, CLOSURE. "
               "For each phase, list specific Action Items with clear success criteria."),
    ("human", "{text}")
])

# Create the structured output chain
structured_llm = llm.with_structured_output(ContractSchema)
extraction_chain = extraction_prompt | structured_llm

def extract_contract_data(param: str) -> ContractSchema:
    """
    Simulates extracting data from a PDF text.
    In a real scenario, 'param' would be the full text of the PDF.
    """
    try:
        if not settings.GOOGLE_API_KEY:
            raise ValueError("Google API Key missing")
            
        return extraction_chain.invoke({"text": param})
    except Exception as e:
        # Fallback for demo if API fails or Key missing
        print(f"Extraction failed: {e}. Returning mock data.")
        return ContractSchema(
            contract_id="MOCK-001",
            title="Contrato de Servicio - Fallback Mock (Gemini Error)",
            parties=["Empresa A", "Proveedor B"],
            phases=[
                Phase(name="INITIATION", description="Preparación", actions=[
                    ActionItem(id="ACT-01", description="Firmar acta de inicio", criteria="Documento firmado por ambas partes")
                ]),
                Phase(name="EXECUTION", description="Desarrollo", actions=[]),
                Phase(name="CLOSURE", description="Finalización", actions=[])
            ]
        )
