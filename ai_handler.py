import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def convert_tone(text,tone):
    prompt = f"""
    Rewrite the following text in a {tone} tone.
    Text: 
    {text}
    Only return the rewritten text without any additional explanation.
    """
    
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "phi3",
            "prompt": prompt,
            "stream": False
        }
    )
    
    data = response.json()
    return data["response"]