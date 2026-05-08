# Create a test script to check the settings

import sys
import os
sys.path.insert(0, 'src')

# Set environment variable
os.environ["GEMINI_API_KEY"] = "AIzaSyBTPv0pVN-h4Zp8dnzhWQFWnmO-f1xw43g"

try:
    from config import settings
    print("✅ Config loaded successfully!")
    print(f"LLM_MODEL: {settings.LLM_MODEL}")
    print(f"GEMINI_API_KEY present: {'Yes' if settings.GEMINI_API_KEY else 'No'}")
    print(f"MAX_FILE_SIZE_MB: {settings.MAX_FILE_SIZE_MB}")
    print(f"ALLOWED_FILE_TYPES: {settings.ALLOWED_FILE_TYPES}")
except Exception as e:
    print(f"❌ Error loading config: {e}")
    import traceback
    traceback.print_exc()
