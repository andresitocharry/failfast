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
    model="gemini-2.0-flash",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0
)

from app.services.chroma_service import query_kb, initialize_knowledge_base

# Initialize Knowledge Base once at startup
try:
    initialize_knowledge_base()
except Exception as e:
    logger.error(f"Failed to init ChromaDB: {e}")

# Definir el Prompt del Agente Auditor BARI
def get_prompt(context_data: str):
    system_instructions = f"""
Eres el Arquitecto Legal y Auditor Senior de BARI Infraestructuras. Tu objetivo es realizar un análisis EXHAUSTIVO, TÉCNICO y OPERATIVO del contrato.

CONTEXTO DE BARI (Políticas Internas y Datos Maestros SAP):
{context_data}

FLUJO DE ANÁLISIS REQUERIDO:
1. **Extracción Exhaustiva**: Primero, identifica TODAS las obligaciones, hitos, pólizas, actas y pruebas técnicas. No resumas. Si el contrato dice "Acta de inicio" y "Póliza de cumplimiento", son CIEN por ciento tareas distintas.
2. **Auditoría de Cumplimiento**: Basado en lo extraído y en el contexto de BARI, evalúa riesgos financieros y operativos.

REGLAS ESTRÍCTAS:
- **Idioma**: Español técnico colombiano.
- **Fases (Phases)**: Divide en INITIATION, EXECUTION, CLOSURE. 
  - Mínimo 4 tareas por fase (si el texto lo permite). Sé extremadamente detallista.
  - Cada tarea debe incluir un `insight` experto y una `citation` EXACTA del texto.
- **Resumen Auditor (audit_summary)**: Informe ejecutivo sobre la viabilidad del contrato. Debe validar si la clasificación de fases y actividades realizada por el extractor es lógica y coherente con los estándares de BARI. Identifica inconsistencias entre las obligaciones legales y el plan de ejecución propuesto.
- **Hallazgos (audit_insights)**: Lista de observaciones críticas con tono Corporativo y Analítico. Ejemplo: "No se identificaron proveedores homologados para la categoría de impermeabilización en SAP; se requiere iniciar proceso de registro", "La estructura de pagos presenta una desviación del 15% respecto a la política interna", "Se recomienda validar la coherencia entre el acta de entrega y la fase de liquidación".
- **Thought Process**: Justificación técnica de la selección de Centros de Costo y Proveedores.
- **Campos para Sincronización DB (Neon)**:
  - `client`: Identifica el cliente o contratante.
  - `type`: Clasifica el proyecto (construccion, mantenimiento, perforacion, refineria).
  - `value`: Extrae el monto total y formatéalo (ej: $5.0M).
  - `start_date` / `end_date`: Busca las fechas de vigencia (DD Mes YYYY).
  - `location`: Ciudad o región del proyecto.
  - `risk_level`: Determina si es "bajo", "medio" o "alto" basado en tu auditoría.

TONE: Legal Architect, Senior Corporate Auditor, Rigorous & Professional.
SALIDA: JSON válido siguiendo el esquema ContractSchema.
"""
    return ChatPromptTemplate.from_messages([
        ("system", system_instructions),
        ("human", "Analiza el siguiente texto legal y genera el informe de auditoría detallado en JSON:\n\n{text}")
    ])

# Create the structured output chain
structured_llm = llm.with_structured_output(ContractSchema)

def extract_contract_data(param: str) -> ContractSchema:
    """
    Extracts data using RAG (ChromaDB) and Gemini (Stable Version).
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

        logger.info("   --> Invoking Gemini Chain (Stable Mode)...")
        start_time = time.time()
        result = extraction_chain.invoke({"text": param})
        logger.info(f"   --> Gemini Response received in {time.time() - start_time:.2f}s")
        
        if result is None:
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
            current_phase="INITIATION",
            audit_summary="REVISIÓN DE RESPALDO: Se ha detectado un contrato de suministro estándar.",
            audit_insights=["Validación de pólizas pendiente."],
            client="BARI Fallback Client",
            type="mantenimiento",
            value="$0.0M",
            start_date="01 Ene 2026",
            end_date="31 Dic 2026",
            location="Colombia",
            health=100,
            risk_level="bajo"
        )
