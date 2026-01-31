from fastapi.testclient import TestClient
from app.main import app
import os

client = TestClient(app)

# Mock contract text content
fake_contract_content = """
CONTRATO DE SERVICIOS
FASES:
FASE 1: INICIO - Acta de inicio.
FASE 2: EJECUCIÓN - Desarrollo de software.
FASE 3: CIERRE - Liquidación.
"""

def test_upload_text_file():
    print("Testing upload of text file...")
    response = client.post(
        "/analyze-contract",
        files={"file": ("contract.txt", fake_contract_content, "text/plain")}
    )
    
    if response.status_code == 200:
        print("✅ Text Upload Success!")
        data = response.json()
        print(f"Contract ID: {data.get('contract_id')}")
        print(f"Phases: {len(data.get('phases'))}")
    else:
        print(f"❌ Upload Failed: {response.text}")

if __name__ == "__main__":
    test_upload_text_file()
