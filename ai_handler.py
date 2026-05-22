import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL= "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL ="llama-3.1-8b-instant"

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "phi3:mini"


def build_prompt(text, tone):
    return f"""Rewrite the following text in a {tone} tone.

IMPORTANT RULES:
- Only return the rewritten text
- Do NOT explain anything
- Do NOT add introductions or commentary
- Do NOT describe what you did
- Keep it concise, do not add unnecessary wording
- Output ONLY the final rewritten sentence

TEXT:
{text}"""


def convert_tone(text, tone):
    text = text.strip()
    tone = tone.strip()

    if not text or not tone:
        raise ValueError("Text and tone must not be empty.")

    # trying Groq first
    if GROQ_API_KEY:
        try:
            response =requests.post(
                GROQ_URL,
                headers={
                    "Authorization":f"Bearer {GROQ_API_KEY}",
                    "Content-Type":"application/json"
                },
                json={
                    "model":GROQ_MODEL,
                    "messages":[
                        {"role": "user", "content": build_prompt(text, tone)}
                    ],
                    "max_tokens":300,
                    "temperature": 0.7
                },
                timeout=10
            )
            response.raise_for_status()
            result= response.json()
            return result["choices"][0]["message"]["content"].strip()

        except Exception as e:
            print(f"[Groq failed] {e} —falling back to Ollama")

    # Ollama fallback 
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model":OLLAMA_MODEL,
                "prompt": build_prompt(text, tone),
                "stream":False
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()["response"].strip()

    except Exception as e:
        raise RuntimeError(f"Both Groq and Ollama failed: {e}")