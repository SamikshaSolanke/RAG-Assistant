

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

def build_faiss_index(chunks: list):
    """Build FAISS index from text chunks and return index + id->chunk map."""
    if not chunks:
        raise ValueError("No chunks provided to build FAISS index")
    
    embeddings = model.encode(chunks)
    embeddings = np.array(embeddings).astype("float32")

    # Handle case where embeddings might be 1D (single chunk)
    if embeddings.ndim == 1:
        embeddings = embeddings.reshape(1, -1)
    
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    chunk_map = {i: chunk for i, chunk in enumerate(chunks)}
    return index, chunk_map

def search(query: str, index, chunk_map: dict, top_k: int = 3):
    """Search top_k relevant chunks for a query."""
    query_vec = model.encode([query])
    query_vec = np.array(query_vec).astype("float32")

    distances, indices = index.search(query_vec, top_k)
    results = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx != -1:
            results.append((chunk_map[idx], float(dist)))
    return results
