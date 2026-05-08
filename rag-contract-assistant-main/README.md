# AI-Powered Contract & Policy Assistant

## 📄 Project Overview

The AI Contract & Policy Assistant is a **Retrieval-Augmented Generation (RAG) system** that allows users to upload contracts or policy documents and interact with them intelligently.  
It can **extract, classify, and explain contract clauses, summarize documents, answer user queries, and compare clauses to standard templates** using a large language model (Gemini LLM).  

This project is designed for legal professionals, HR teams, or anyone needing fast insights from contracts without reading the full document manually.  

---

## 🚀 Features

- Upload and parse **PDF, DOCX, or TXT** contracts.  
- Automatic **text chunking** and **FAISS-based retrieval** for efficient search.  
- Ask **natural language questions** about any contract clause.  
- **View retrieved chunks** for transparency.  
- Generate a **concise summary** of the document.  
- **Compare specific clauses** against a standard template and highlight differences.  
- **Interactive Streamlit UI** for ease of use.  
- Support for **multiple queries** on the same document without re-uploading.  

---

## 🛠️ Tech Stack

- **Python 3.10+**  
- **Streamlit** – Web UI  
- **FAISS** – Vector search for document chunks  
- **Sentence-Transformers** – Embedding model (`all-MiniLM-L6-v2`)  
- **Gemini LLM** – Free-tier large language model for natural language understanding  
- **PDFPlumber, python-docx** – Document parsing  
- **NumPy** – Numerical computations  

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/rag-contract-assistant.git
cd rag-contract-assistant

# 2. Create Virtual Env

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# 3.Install requirements
pip install -r requirements.txt

# Windows
set GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Mac/Linux
export GEMINI_API_KEY="YOUR_API_KEY_HERE"
