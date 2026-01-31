import os
import sys

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from app.services.extractor import extract_contract_data
from app.models import ContractSchema

# Mock Contract Text
mock_contract_text = """
CONTRATO DE PRESTACIÓN DE SERVICIOS

ENTRE:
1. TechSolutions S.A.S (el "Cliente")
2. DevExperts Ltda (el "Proveedor")

OBJETO:
El Proveedor se compromete a desarrollar el módulo de IA para el ERP.

FASES Y ENTREGABLES:

FASE 1: INICIO
- Firma del acta de constitución.
- Entrega del plan de trabajo detallado.

FASE 2: EJECUCIÓN
- Desarrollo del microservicio en FastAPI.
- Integración con Google Gemini.
- Despliegue en ambiente de pruebas.

FASE 3: CIERRE
- Capacitación a usuarios finales.
- Firma del acta de liquidación.
"""

print("--- Iniciando Prueba de Extracción con Gemini ---")
try:
    print("Enviando texto a Gemini...")
    result = extract_contract_data(mock_contract_text)
    
    print("\n✅ Extracción Exitosa!")
    print(f"ID del Contrato: {result.contract_id}")
    print(f"Título: {result.title}")
    print(f"Partes: {result.parties}")
    print(f"Fases detectadas: {len(result.phases)}")
    
    for phase in result.phases:
        print(f"\n🔹 FASE: {phase.name} ({phase.status})")
        for action in phase.actions:
            print(f"   - [ ] {action.description} (Criteria: {action.criteria})")
            
except Exception as e:
    print(f"\n❌ Error durante la prueba: {e}")
