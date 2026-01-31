from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from app.models import ContractSchema, Phase, ActionItem
from app.core.config import settings
import json

# Initialize LLM
llm = ChatOpenAI(model="gpt-4-turbo", api_key=settings.OPENAI_API_KEY, temperature=0)

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
        # For MVP, if we don't have a valid key, we can return a mock if needed, 
        # but the goal is to use the LLM. 
        # If the user hasn't set the key, this will fail.
        # We can fallback or just let it error for now as we are building the "Real" thing.
        
        return extraction_chain.invoke({"text": param})
    except Exception as e:
        # Fallback for demo if API fails or Key missing
        print(f"Extraction failed: {e}. Returning mock data.")
        return ContractSchema(
            contract_id="MOCK-001",
            title="Contrato de Servicio - Fallback Mock",
            parties=["Empresa A", "Proveedor B"],
            phases=[
                Phase(name="INITIATION", description="Preparación", actions=[
                    ActionItem(id="ACT-01", description="Firmar acta de inicio", criteria="Documento firmado por ambas partes")
                ]),
                Phase(name="EXECUTION", description="Desarrollo", actions=[]),
                Phase(name="CLOSURE", description="Finalización", actions=[])
            ]
        )
