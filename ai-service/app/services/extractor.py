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

# Load Master Data (Mock RAG)
def load_master_data():
    try:
        path = "app/data/bari_master_data.json"
        import json
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load master data: {e}")
        return {}

master_data = load_master_data()

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
    model="gemini-pro-latest",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0
)

from app.services.chroma_service import query_kb, initialize_knowledge_base

# Initialize Knowledge Base once at startup
try:
    initialize_knowledge_base()
except Exception as e:
    logger.error(f"Failed to init ChromaDB: {e}")

# Define the Professional Prompt
def get_prompt(context_data: str):
    system_instructions = f"""
You are a Lead AI Architect specializing in SAP/ERP integration for BARI Infraestructuras. 
Your analysis must be methodical and transparent.

REFERENCE KNOWLEDGE (From BARI ChromaDB):
{context_data}

REQUIRED ANALYSIS STEPS (Chain of Thought):
1. **Analyze Parties**: Match names in the text with the 'vendors' retrieved. Select the most precise Vendor ID.
2. **Contextual Classification**: Determine if the contract is Maintenance, New Project, or Supply. Match with the relevant Cost Center Area.
3. **Phase Structuring**: Break down the milestones. For Construction/Waterproofing, look for 'Pruebas de Inundación' or 'Garantías de Estanqueidad' for Closure.
4. **Draft Reasoning**: In 'thought_process', explain *why* you chose these ERP mappings based on the retrieved policies.

INSTRUCTIONS:
- IDENTIFY Vendor ID from master data.
- ASSIGN Cost Center based on organizational area.
- CLASSIFY Material Group.
- DEFINE EXACTLY 3 Phases (INITIATION, EXECUTION, CLOSURE).
- **CRITICAL**: For each identified Action Item, provide:
    * `insight`: A super-brief professional consideration or risk (e.g., 'Exigir prueba de inundación').
    * `citation`: The exact text snippet from the contract.

Output MUST be a perfectly structured JSON.
"""
    return ChatPromptTemplate.from_messages([
        ("system", system_instructions),
        ("human", "{text}")
    ])

# Create the structured output chain
structured_llm = llm.with_structured_output(ContractSchema)

def extract_contract_data(param: str) -> ContractSchema:
    """
    Extracts data using REAL RAG (ChromaDB) and Gemini.
    """
    try:
        if not settings.GOOGLE_API_KEY:
            raise ValueError("Google API Key missing")
            
        # 🟢 STEP 1: SEMANTIC SEARCH (RAG)
        logger.info("   --> Searching ChromaDB for relevant BARI context...")
        relevant_context = query_kb(param, n_results=5)
        context_str = "\n".join(relevant_context)
        
        # 🔵 STEP 2: DYNAMIC PROMPT
        current_prompt = get_prompt(context_str)
        extraction_chain = current_prompt | structured_llm

        logger.info("   --> Invoking Gemini Chain (Enterprise RAG Mode)...")
        start_time = time.time()
        result = extraction_chain.invoke({"text": param})
        logger.info(f"   --> Gemini Response received in {time.time() - start_time:.2f}s")
        
        if result is None:
            raise ValueError("Gemini returned None (Failed to generate structured output)")
        
        with open("debug_gemini_response.txt", "w", encoding="utf-8") as f:
            f.write(f"SUCCESS:\n{result}")
            
        return result
    except Exception as e:
        # ... existing fallback code ...
        # Fallback for demo if API fails or Key missing
        logger.error(f"Extraction failed: {e}")
        import traceback
        traceback.print_exc()
        
        with open("debug_gemini_response.txt", "w", encoding="utf-8") as f:
            f.write(f"EXCEPTION:\n{str(e)}\n\nTRACEBACK:\n{traceback.format_exc()}")
            
        logger.info("Returning mock data due to error.")
        return ContractSchema(
            contract_id="MOCK-SAP-001",
            title="Contrato de Suministro Estándar (Fallback)",
            summary="Análisis de contingencia por error de conexión con Gemini.",
            thought_process="Protocolo de respaldo activado.",
            erp_vendor_id="100045",
            erp_cost_center="CC-OPS-100",
            erp_material_group="SERV-002",
            erp_purchasing_org="1000",
            parties=["BARI S.A.S.", "ENTIDAD EXTERNA"],
            phases=[
                Phase(name="INITIATION", description="Preparación Legal", actions=[
                    ActionItem(
                        id="ACT-01", 
                        description="Validación de Pólizas", 
                        criteria="Póliza aprobada en sistema",
                        insight="Fundamental para mitigar riesgos de ejecución inicial.",
                        citation="Cláusula Quinta: Garantías y Pólizas."
                    )
                ], status="PENDING"),
                Phase(name="EXECUTION", description="Prestación del Servicio", actions=[
                    ActionItem(
                        id="ACT-02", 
                        description="Reporte Mensual de Avance", 
                        criteria="Documento PDF cargado",
                        insight="Control de KPIs críticos para desembolsos.",
                        citation="Cláusula Novena: Obligaciones del Contratista."
                    )
                ], status="PENDING"),
                Phase(name="CLOSURE", description="Liquidación", actions=[
                    ActionItem(
                        id="ACT-03", 
                        description="Firma de Acta de Liquidación", 
                        criteria="Acta firmada digitalmente",
                        insight="Cierra formalmente las obligaciones legales y contables.",
                        citation="Cláusula Décimo Segunda: Liquidación."
                    )
                ], status="PENDING")
            ],
            current_phase="INITIATION"
        )
