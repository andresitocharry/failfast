import os
import chromadb
from chromadb.utils import embedding_functions
from app.core.config import settings
import json

# Setup Client
# Persist data in a local folder
CHROMA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "chroma_db")

def get_chroma_client():
    return chromadb.PersistentClient(path=CHROMA_PATH)

def get_embedding_fn():
    # Using Google Gemini Embeddings
    # Note: Requires google-generativeai installed
    return embedding_functions.GoogleGenerativeAiEmbeddingFunction(
        api_key=settings.GOOGLE_API_KEY,
        task_type="RETRIEVAL_DOCUMENT",
        model_name="models/text-embedding-004"
    )

def initialize_knowledge_base():
    """
    Ingests Master Data and Policies into ChromaDB.
    """
    client = get_chroma_client()
    embedding_fn = get_embedding_fn()
    
    # Create or Get Collection
    collection = client.get_or_create_collection(
        name="bari_knowledge_base",
        embedding_function=embedding_fn
    )
    
    # Check if we already have data
    if collection.count() > 0:
        print("Knowledge base already initialized.")
        return

    print("🚀 Initializing BARI Knowledge Base in ChromaDB...")
    
    # 1. Ingest Master Data (from JSON)
    master_data_path = os.path.join(os.path.dirname(__file__), "..", "data", "bari_master_data.json")
    with open(master_data_path, "r", encoding="utf-8") as f:
        master_data = json.load(f)
    
    # Ingest Vendors as separate documents
    for vendor in master_data["vendors"]:
        text = f"Vendor: {vendor['name']} (ID: {vendor['id']}). Category: {vendor['category']}. specialty: {vendor.get('specialty', 'N/A')}. Rating: {vendor.get('rating', 'N/A')}"
        collection.add(
            ids=[f"vendor_{vendor['id']}"],
            documents=[text],
            metadatas=[{"type": "vendor", "id": vendor['id'], "name": vendor['name']}]
        )
    
    # Ingest Cost Centers
    for cc in master_data["cost_centers"]:
        text = f"Cost Center: {cc['description']} (ID: {cc['id']}). Area: {cc['area']}"
        collection.add(
            ids=[f"cc_{cc['id']}"],
            documents=[text],
            metadatas=[{"type": "cost_center", "id": cc['id'], "desc": cc['description']}]
        )

    # 2. Ingest Policies (from TXT)
    policies_path = os.path.join(os.path.dirname(__file__), "..", "data", "bari_policies.txt")
    with open(policies_path, "r", encoding="utf-8") as f:
        policies_text = f.read()
    
    # Simple split by sections (Double Newlines)
    sections = policies_text.split("\n\n")
    for i, section in enumerate(sections):
        if section.strip():
            collection.add(
                ids=[f"policy_{i}"],
                documents=[section.strip()],
                metadatas=[{"type": "policy", "source": "bari_policies.txt"}]
            )
            
    print(f"✅ Knowledge Base ready with {collection.count()} entries.")

def query_kb(query_text: str, n_results=3):
    """
    Searches the knowledge base for relevant context.
    """
    client = get_chroma_client()
    embedding_fn = get_embedding_fn()
    collection = client.get_collection(name="bari_knowledge_base", embedding_function=embedding_fn)
    
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    return results["documents"][0]
