

import google.generativeai as genai

# 🔑 Hardcoded API key (for testing purposes only)
API_KEY = "AIzaSyBTPv0pVN-h4Zp8dnzhWQFWnmO-f1xw43g"  # Replace with your actual key

# Configure the library to use the API key
genai.configure(api_key=API_KEY)

# Load the Gemini model (free tier / fast)
MODEL_NAME = "gemini-1.5-flash"
model = genai.GenerativeModel(MODEL_NAME)

def query_llm(prompt: str) -> str:
    """
    Send a prompt to Gemini and return the response text.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error querying Gemini: {e}"


