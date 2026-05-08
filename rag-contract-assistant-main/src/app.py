import streamlit as st
from document_loader import load_document
from chunking import chunk_text
from embedding_store import build_faiss_index
from rag_pipeline import rag_query
from llm_interface import query_llm

st.set_page_config(page_title="AI Contract Assistant", layout="wide")
st.title("📄 AI Contract & Policy Assistant")

# Session state to keep index and chunks for multiple queries
if "index" not in st.session_state:
    st.session_state.index = None
if "chunk_map" not in st.session_state:
    st.session_state.chunk_map = None
if "file_text" not in st.session_state:
    st.session_state.file_text = None

# 1️⃣ Upload document
uploaded_file = st.file_uploader("Upload a contract (PDF/DOCX/TXT)", type=["pdf", "docx", "txt"])

if uploaded_file:
    with st.spinner("Processing document..."):
        # Save temporarily
        file_path = f"temp_{uploaded_file.name}"
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())

        # Load text
        st.session_state.file_text = load_document(file_path)

        # Chunk & build FAISS index
        chunks = chunk_text(st.session_state.file_text, max_length=500)
        index, chunk_map = build_faiss_index(chunks)
        st.session_state.index = index
        st.session_state.chunk_map = chunk_map

    st.success("Document loaded and indexed successfully!")

    # 2️⃣ Show document preview
    with st.expander("📄 Show Document Preview"):
        st.text(st.session_state.file_text[:2000] + ("..." if len(st.session_state.file_text) > 2000 else ""))

    # 3️⃣ Query RAG
    query = st.text_input("Ask a question about the document:")
    if query:
        with st.spinner("Generating answer..."):
            answer = rag_query(query, st.session_state.index, st.session_state.chunk_map, top_k=3)
        st.subheader("Answer:")
        st.write(answer)

        # 4️⃣ Show retrieved chunks
        if st.checkbox("Show Retrieved Chunks"):
            from embedding_store import search
            results = search(query, st.session_state.index, st.session_state.chunk_map, top_k=3)
            for i, (chunk, dist) in enumerate(results, 1):
                st.markdown(f"**Chunk {i} (distance={dist:.4f}):**")
                st.text(chunk)

    # 5️⃣ Optional: Summarize document
    if st.button("Summarize Document"):
        with st.spinner("Generating summary..."):
            summary_prompt = f"Summarize the following contract concisely:\n\n{st.session_state.file_text}"
            summary = query_llm(summary_prompt)
        st.subheader("Document Summary:")
        st.write(summary)

    # 6️⃣ Optional: Compare clause to template
    if st.button("Compare Clause to Standard Template"):
        clause = st.text_area("Enter the clause to compare:")
        if clause:
            with st.spinner("Comparing clause..."):
                comparison_prompt = f"""
Compare the following contract clause to a standard employment clause template and highlight any differences or missing points:

Clause:
{clause}
"""
                comparison = query_llm(comparison_prompt)
            st.subheader("Comparison Result:")
            st.write(comparison)
