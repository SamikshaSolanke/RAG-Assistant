

from embedding_store import search
from llm_interface import query_llm

def rag_query(user_query: str, index, chunk_map, top_k: int = 3) -> str:
    """
    Retrieve top_k chunks from FAISS and generate a LLM answer.
    """
    results = search(user_query, index, chunk_map, top_k=top_k)
    retrieved_text = "\n\n".join([chunk for chunk, _ in results])

    prompt = f"""
You are a legal assistant AI.
Use the following extracted contract clauses to answer the user's question.

Contract excerpts:
{retrieved_text}

Question:
{user_query}

Answer concisely based only on the above excerpts.
"""
    answer = query_llm(prompt)
    return answer
