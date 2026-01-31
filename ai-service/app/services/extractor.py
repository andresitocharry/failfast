import logging
import io
import time
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from app.models import ContractSchema, Phase, ActionItem
from app.core.config import settings
from pydantic import ValidationError
from pypdf import PdfReader

# Setup Logger
logger = logging.getLogger("uvicorn.error")

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    """
    try:
        logger.info(f"   --> Starting PDF Extraction. Bytes: {len(pdf_bytes)}")
        reader = PdfReader(io.BytesIO(pdf_bytes))
        logger.info(f"   --> PDF Loaded. Pages: {len(reader.pages)}")
        text = ""
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            logger.info(f"   --> Page {i+1} extracted: {len(page_text)} chars")
            text += page_text + "\n"
        
        logger.info(f"   --> Total Text: {len(text)} chars")
        
        if len(text.strip()) < 50:
            logger.warning("   ⚠️ PDF text is very short or empty. Is it a scanned image?")
            # We can raise a warning or just let it pass, but logging is key.
            
        return text
    except Exception as e:
        logger.error(f"❌ Error reading PDF: {e}")
        import traceback
        traceback.print_exc()
        return ""


# Initialize LLM (Gemini)
if not settings.GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in settings.")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0
)

# Define the Prompt
extraction_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert legal AI. Extract the contract structure, parties, and actionable items into the specified JSON format. "
               "Divide the contract strictly into 3 phases: INITIATION, EXECUTION, CLOSURE. "
               "For each phase, list specific Action Items with clear success criteria. "
               "Also provide a concise summary of what the contract is about."),
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
            
        logger.info("   --> Invoking Gemini Chain...")
        start_time = time.time()
        result = extraction_chain.invoke({"text": param})
        logger.info(f"   --> Gemini Response received in {time.time() - start_time:.2f}s")
        logger.info(f"   --> Gemini Raw Output: {result}")
        
        if result is None:
            with open("debug_gemini_response.txt", "w", encoding="utf-8") as f:
                f.write("ERROR: Gemini returned None\n")
            raise ValueError("Gemini returned None (Failed to generate structured output)")
        
        with open("debug_gemini_response.txt", "w", encoding="utf-8") as f:
            f.write(f"SUCCESS:\n{result}")
            
        return result
    except Exception as e:
        # Fallback for demo if API fails or Key missing
        logger.error(f"Extraction failed: {e}")
        import traceback
        traceback.print_exc()
        
        with open("debug_gemini_response.txt", "w", encoding="utf-8") as f:
            f.write(f"EXCEPTION:\n{str(e)}\n\nTRACEBACK:\n{traceback.format_exc()}")
            
        logger.info("Returning mock data due to error.")
        return ContractSchema(
            contract_id="MOCK-001",
            title="Contrato de Servicio - Fallback Mock (Gemini Error)",
            summary="Este es un resumen simulado porque ocurrió un error al conectar con Gemini. El contrato trata sobre servicios de consultoría.",
            parties=["Empresa A", "Proveedor B"],
            phases=[
                Phase(name="INITIATION", description="Preparación", actions=[
                    ActionItem(id="ACT-01", description="Firmar acta de inicio", criteria="Documento firmado por ambas partes")
                ]),
                Phase(name="EXECUTION", description="Desarrollo", actions=[]),
                Phase(name="CLOSURE", description="Finalización", actions=[])
            ]
        )
