
from document_loader import load_document
from chunking import chunk_text
from embedding_store import build_faiss_index
from rag_pipeline import rag_query

def main():
    file_path = "../data/uploads/COE-Sample.pdf"  # Change if needed
    text = load_document(file_path)

    # Chunk & embed
    chunks = chunk_text(text, max_length=500, overlap=50)
    index, chunk_map = build_faiss_index(chunks)

    # Example query
    query = "What is the termination clause?"
    answer = rag_query(query, index, chunk_map, top_k=3)

    print("\n=== RAG Answer ===\n")
    print(answer)

if __name__ == "__main__":
    main()
