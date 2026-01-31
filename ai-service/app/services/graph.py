from typing import TypedDict, List, Annotated, Optional
from langgraph.graph import StateGraph, END
from app.models import ContractSchema, ActionItem, Phase

# Define the State for the Graph
class AgentState(TypedDict):
    contract: ContractSchema
    current_action: Optional[ActionItem]
    latest_evidence: Optional[str]
    agent_response: Optional[str]

def evaluate_evidence_node(state: AgentState):
    """
    Agent analyzes evidence against the criteria of the current action.
    """
    # Mocking LLM logic for deciding if evidence is sufficient
    action = state.get("current_action")
    evidence = state.get("latest_evidence")
    
    if not action or not evidence:
        return {"agent_response": "No action or evidence provided."}

    # In a real impl, we'd use LLM here:
    # prompt = f"Criteria: {action.criteria}. Evidence: {evidence}. Is it met?"
    
    # Simple keyword mock for MVP
    is_met = "done" in evidence.lower() or "completo" in evidence.lower() or "https://" in evidence
    
    if is_met:
        action.status = "COMPLETED"
        return {"agent_response": "Milestone COMPLETED based on evidence.", "contract": state["contract"]}
    else:
        return {"agent_response": "Evidence insufficient. Please provide more details."}

def check_phase_transition(state: AgentState):
    """
    Checks if all actions in the current phase are complete.
    If so, moves to the next phase.
    """
    contract = state["contract"]
    current_phase_name = contract.current_phase
    
    # Find current phase object
    phase_idx = next((i for i, p in enumerate(contract.phases) if p.name == current_phase_name), -1)
    if phase_idx == -1:
        return state

    current_phase = contract.phases[phase_idx]
    
    # Check if all actions are COMPLETED
    all_done = all(a.status == "COMPLETED" for a in current_phase.actions)
    
    if all_done:
        current_phase.status = "COMPLETED"
        # Move to next phase
        if current_phase_name == "INITIATION":
            contract.current_phase = "EXECUTION"
            contract.phases[phase_idx + 1].status = "ACTIVE"
        elif current_phase_name == "EXECUTION":
            contract.current_phase = "CLOSURE"
            contract.phases[phase_idx + 1].status = "ACTIVE"
        elif current_phase_name == "CLOSURE":
            # Contract Done
            pass
            
    return {"contract": contract}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("evaluator", evaluate_evidence_node)
workflow.add_node("manager", check_phase_transition)

# Edges
workflow.set_entry_point("evaluator")
workflow.add_edge("evaluator", "manager")
workflow.add_edge("manager", END)

app_graph = workflow.compile()
