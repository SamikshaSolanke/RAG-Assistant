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

# RAG Contract — Local Runbook

This repository contains two main parts:

- Backend RAG API (FastAPI + Python) — located at the repo root under `src/`
- Frontend UI (Vite + React + TypeScript) — located in `clear-clause-ai-main/clear-clause-ai-main`
- Small News proxy service (Flask) used by the frontend — located at `clear-clause-ai-main/clear-clause-ai-main/src/components/news`

This README explains how to run the full stack locally using three terminals (backend, news proxy, frontend) concurrently.

Prerequisites
-------------

- Python 3.10+ (ensure `python3` is available)
- Node.js 18+ and npm
- Optional: `virtualenv` (we use `python3 -m venv` below)

Ports used
----------

- Backend FastAPI: `http://localhost:8000`
- News Flask proxy: `http://localhost:3000`
- Frontend Vite dev server: typically `http://localhost:5173` or `http://localhost:8080`

Quick start (three terminals)
-----------------------------

Terminal 1 — Backend (Python / FastAPI)

```zsh
cd /Users/tanishkasingh/Desktop/projects/contract/rag-contract

# Create virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
# Make sure you're in the venv (again, if needed)
source .venv/bin/activate

# Set the API key (replace with your Gemini API key)
export GEMINI_API_KEY="api key"

# Start the backend
python3 src/main.py
```

Terminal 2 — News proxy (Flask)

```zsh
cd /Users/tanishkasingh/Desktop/projects/contract/rag-contract/clear-clause-ai-main/clear-clause-ai-main/src/components/news

# Install dependencies if needed (use the same Python venv or system Python)
pip install flask flask-cors requests feedparser

# Start the news server
python3 app.py
```

Terminal 3 — Frontend (Vite + React)

```zsh
cd /Users/tanishkasingh/Desktop/projects/contract/rag-contract/clear-clause-ai-main/clear-clause-ai-main

# Install node dependencies (only required once or when package.json changes)
npm install

# Start the dev server (run concurrently with the backend)
npm run dev
```

Notes & tips
------------

- Environment variables: Frontend (Vite) environment variables must start with `VITE_` to be embedded at build time. For backend secrets like `GEMINI_API_KEY` keep them in shell env or a `.env` file read by the backend (`python-dotenv` is used).
- Add your `.env` or `.env.local` to `.gitignore` to avoid committing secrets.
- If you prefer a single terminal, consider using a process manager (tmux, GNU parallel, or a simple shell script) but running in separate terminals makes logs easier to inspect.
- If the frontend cannot reach `http://localhost:3000` due to mixed content (HTTPS) or CORS, run both frontend and news proxy over HTTP for local development.
- If any Python packages fail to install (native wheels like `faiss-cpu`, `opencv-python`), follow pip error guidance — on macOS Homebrew may be required for system libraries.

Troubleshooting
---------------

- `ModuleNotFoundError: No module named 'pydantic_settings'` — ensure you installed `requirements.txt` inside the activated virtualenv. If missing, run `pip install pydantic-settings`.
- News not appearing in UI — make sure the news Flask server is running on `http://localhost:3000/news/<topic>` and check the browser DevTools Network tab. The frontend will try the backend proxy first, then fall back to a public CORS proxy if the backend is unavailable.
- If you see CORS errors, confirm `flask_cors` is installed and the Flask app shows CORS enabled (it is enabled in `app.py`).




