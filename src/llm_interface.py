import logging
import google.generativeai as genai
from config import settings

"""LLM interface wrapper.

Uses configuration from `config.settings` and exposes `query_llm`.
"""

# Configure client using the value from settings (validated at startup)
genai.configure(api_key=settings.GEMINI_API_KEY)

# Model selection: use configured value from `settings.LLM_MODEL`
MODEL_NAME = settings.LLM_MODEL  # CHANGED: Removed fallback default

# Create a model instance. If the configured model is invalid the
# actual call will raise; we handle that in `query_llm`.
model = genai.GenerativeModel(MODEL_NAME)

logger = logging.getLogger(__name__)

def query_llm(prompt: str) -> str:
    """Send a prompt to Gemini and return the response text.

    Raises RuntimeError on failure so callers can convert to HTTP errors.
    """
    try:
        response = model.generate_content(prompt)
        # Depending on the client library the attribute name may differ
        text = getattr(response, "text", None) or getattr(response, "content", None)
        if text is None:
            # Fallback: stringify the response
            text = str(response)
        return text
    except Exception as e:
        # Provide a clearer error message for missing/unsupported models
        logger.exception("LLM query failed")
        msg = str(e)
        if "not found" in msg.lower() or "not supported" in msg.lower():
            hint = (
                f"Model '{MODEL_NAME}' not available for this API client or version. "
                "Please set the `LLM_MODEL` environment variable or `settings.LLM_MODEL` to a supported model. "
                "Run ListModels with your API client to see available models for your account/region."
            )
            raise RuntimeError(f"Error querying Gemini: {e}. {hint}") from e
        raise RuntimeError(f"Error querying Gemini: {e}") from e

def get_model_info() -> dict:
    """Return basic model info used by this service."""
    return {"model": MODEL_NAME}