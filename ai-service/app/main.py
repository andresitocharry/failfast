from fastapi import FastAPI, UploadFile, File, HTTPException
from app.models import ContractSchema, ActionItem, Phase
from app.services.extractor import extract_contract_data
from app.services.graph import app_graph
from pydantic import BaseModel
import shutil

app = FastAPI(title="Agentic Contract ERP AI", version="0.1.0")

class MilestoneCheckRequest(BaseModel):
    contract: ContractSchema
    action_id: str
    evidence_text: str

@app.get("/")
def read_root():
    return {"status": "AI Microservice Online", "service": "Agentic ERP"}

@app.post("/analyze-contract", response_model=ContractSchema)
async def analyze_contract(file: UploadFile = File(...)):
    """
    Ingests a PDF contract, extracts structure using LLM, and returns JSON.
    """
    try:
        # Save temp file or read content
        # For MVP, we pass text directly to extractor. 
        # Ideally use OCR/PyPDF2 here.
        # content = await file.read()
        # text = content.decode("utf-8") # Assuming text file for MVP 
        
        # Simulating text extraction for now to keep dependencies simple
        simulated_text = f"Simulated content of {file.filename}"
        
        contract_data = extract_contract_data(simulated_text)
        return contract_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/check-milestone")
async def check_milestone(request: MilestoneCheckRequest):
    """
    Agentic node: Checks if a milestone is met based on evidence.
    Returns updated Contract status and Agent response.
    """
    try:
        # Find the action in the contract
        # (In real app, we might fetch from DB, here we expect full state passed in or just ID)
        # We assume the 'contract' passed in the body is the current state.
        
        current_action = None
        for phase in request.contract.phases:
            for action in phase.actions:
                if action.id == request.action_id:
                    current_action = action
                    break
        
        if not current_action:
            raise HTTPException(status_code=404, detail="Action ID not found in contract")

        # Invoke LangGraph
        initial_state = {
            "contract": request.contract,
            "current_action": current_action,
            "latest_evidence": request.evidence_text,
            "agent_response": None
        }
        
        result = app_graph.invoke(initial_state)
        
        return {
            "status": "success", 
            "agent_response": result["agent_response"],
            "updated_contract": result["contract"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent-status")
async def agent_status():
    return {"state": "Idle", "agents_active": 0}
