from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class Evidence(BaseModel):
    description: str
    url: Optional[str] = None
    timestamp: str

class ActionItem(BaseModel):
    id: str = Field(..., description="Unique identifier for the action (ej: M1-C1)")
    description: str
    criteria: str = Field(..., description="Success criteria to verify this action")
    insight: Optional[str] = Field(None, description="A very brief expert insight or consideration for this task.")
    citation: Optional[str] = Field(None, description="Exact quote from the contract that justifies this task.")
    status: Literal["pending", "in-progress", "completed", "delayed"] = "pending"
    due_date: str = Field(..., description="Fecha límite estimada para esta tarea (DD Mes YYYY).")
    milestone_value: str = Field(..., description="Peso porcentual de esta tarea (ej: 10%).")
    deliverables: List[str] = Field(default_factory=list, description="Lista de entregables técnicos para esta tarea.")
    evidence: Optional[List[Evidence]] = []

class Phase(BaseModel):
    name: Literal["INICIO", "EJECUCION", "CIERRE"]
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
    current_phase: Literal["INICIO", "EJECUCION", "CIERRE"] = "INICIO"
    
    # Audit Layer Fields
    audit_summary: str = Field(..., description="Resumen del Agente Auditor sobre el cumplimiento de reglas de negocio.")
    audit_insights: List[str] = Field(..., description="Lista de hallazgos específicos, riesgos de pago o falta de proveedores.")

    # Neon Database Fields (Sync Layer)
    client: str = Field(..., description="Nombre del cliente o entidad contratante.")
    type: str = Field(..., description="Categoría del contrato (ej: construcción, mantenimiento, refinería).")
    status: str = Field("active", description="Estado inicial del contrato.")
    progress: int = Field(0, description="Progreso actual (por defecto 0 para nuevos).")
    value: str = Field(..., description="Valor total del contrato formateado (ej: $1.2M).")
    start_date: str = Field(..., description="Fecha de inicio (DD Mes YYYY).")
    end_date: str = Field(..., description="Fecha de finalización (DD Mes YYYY).")
    location: str = Field(..., description="Ubicación geográfica del proyecto.")
    health: int = Field(100, description="Puntaje de salud del contrato (0-100).")
    risk_level: Literal["bajo", "medio", "alto"] = Field(..., description="Nivel de riesgo determinado por la auditoría.")
    project_manager_id: str = Field("1", description="ID del Project Manager asignado.")
    pdf_url: Optional[str] = Field(None, description="URL del archivo en Cloudinary.")
