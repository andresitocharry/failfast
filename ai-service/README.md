# AI Microservice - Agentic ERP

Este microservicio es el "cerebro" del ERP. Se encarga de analizar contratos PDF y monitorear el cumplimiento de hitos usando agentes inteligentes.

## 🛠️ Stack Tecnológico
- **Python 3.10+**
- **FastAPI**: API REST de alto rendimiento.
- **LangGraph**: Orquestación de estados (Inicio -> Ejecución -> Cierre).
- **LangChain + OpenAI**: Extracción de datos y razonamiento.

## 🚀 Cómo Iniciar

1.  **Crear entorno virtual:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    # source venv/bin/activate # Mac/Linux
    ```

2.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configurar Variables:**
    - Copia `.env.example` a `.env`
    - Agrega tu `OPENAI_API_KEY`

4.  **Correr el Servidor:**
    ```bash
    uvicorn app.main:app --reload
    ```
    El servidor correrá en `http://localhost:8000`

## 📡 Endpoints Principales

### `POST /analyze-contract`
**Input:** Archivo (PDF/Texto)
**Output:** JSON con la estructura del contrato (Fases y Acciones).
Uso: Llamado por el Core (Nest.js) cuando se sube un nuevo contrato.

### `POST /check-milestone`
**Input:**
```json
{
  "contract": { ... toda la data del contrato ... },
  "action_id": "ACT-001",
  "evidence_text": "URL del documento firmado"
}
```
**Output:** Estado actualizado del contrato y respuesta del agente.
Uso: Llamado cuando un usuario sube una evidencia.

## 🧠 Lógica de Agentes
- **Extractor:** Convierte texto no estructurado en el esquema JSON definido en `app/models.py`.
- **LangGraph (`app/services/graph.py`):** Evalúa si la evidencia cumple los criterios. Si todas las acciones de una fase están completas, avanza automáticamente a la siguiente fase (Inicio -> Ejecución -> Cierre).
