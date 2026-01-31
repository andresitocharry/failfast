from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class Evidence(BaseModel):
    description: str
    url: Optional[str] = None
    timestamp: str

class ActionItem(BaseModel):
    id: str = Field(..., description="Unique identifier for the action")
    description: str
    criteria: str = Field(..., description="Success criteria to verify this action")
    insight: Optional[str] = Field(None, description="A very brief expert insight or consideration for this task.")
    citation: Optional[str] = Field(None, description="Exact quote from the contract that justifies this task.")
    status: Literal["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"] = "PENDING"
    evidence: Optional[List[Evidence]] = []

class Phase(BaseModel):
    name: Literal["INITIATION", "EXECUTION", "CLOSURE"]
    description: str
    actions: List[ActionItem]
    status: Literal["PENDING", "ACTIVE", "COMPLETED"] = "PENDING"

class ContractSchema(BaseModel):
    contract_id: str
    title: str
    summary: str = Field(..., description="A brief summary of the contract content and purpose.")
    thought_process: str = Field(..., description="Internal reasoning: Why were these ERP mappings and phases selected? Explain the logic.")
    
    # ERP / SAP Integration Fields (RAG Inferred)
    erp_vendor_id: Optional[str] = Field(None, description="SAP Vendor ID matched from Master Data")
    erp_cost_center: Optional[str] = Field(None, description="Cost Center ID inferred from context")
    erp_material_group: Optional[str] = Field(None, description="Service/Material Group code")
    erp_purchasing_org: Optional[str] = Field(None, description="Purchasing Organization")
    
    parties: List[str]
    phases: List[Phase]
    current_phase: Literal["INITIATION", "EXECUTION", "CLOSURE"] = "INITIATION"
