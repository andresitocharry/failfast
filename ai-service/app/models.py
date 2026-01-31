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
    parties: List[str]
    phases: List[Phase]
    current_phase: Literal["INITIATION", "EXECUTION", "CLOSURE"] = "INITIATION"
