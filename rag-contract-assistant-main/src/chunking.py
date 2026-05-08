import re

def clean_text(text: str) -> str:
    """Remove extra spaces/newlines."""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text: str, max_length: int = 500, overlap: int = 50) -> list:
    """
    Split text into chunks of ~max_length characters with optional overlap.
    """
    text = clean_text(text)
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + max_length, text_len)
        chunks.append(text[start:end])
        start += max_length - overlap

    return chunks
