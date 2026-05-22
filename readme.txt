# AI Tone Converter

An AI-powered text tone conversion web app built with Python, Flask, and a dual-provider AI backend (Groq + Ollama fallback)

Paste any text, pick a tone, and get it rewritten instantly. Professionally, casually, aggressively, or however you need it

---

## Demo

> Enter text → Select tone → Click Convert → Copy result

---

## Tech Stack

- **Python** + **Flask** — backend and REST API
- **Groq API** — primary AI provider (free, no credit card, extremely fast LPU inference)
- **Ollama** — local LLM fallback (runs offline if Groq is unavailable)
- **HTML / CSS / Vanilla JS** — frontend, no frameworks

---

## Features

- Paste any text and convert it to a chosen tone instantly
- 8 tone options: Professional, Friendly, Polite, Aggressive, Motivational, Casual, Formal, Humorous
- Dual AI backend. Groq is used first for speedand falls back to local Ollama automatically if Groq fails
- Copy to clipboard button on the converted output
- Character counter with 1000 character limit
- Input validation, empty text and oversized input are caught before hitting the API
- Error messages shown inline in the UI
- Loading state on the convert button so you know it's working

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-tone-converter.git
cd ai-tone-converter
```

### 2. Create a virtual environment and install dependencies

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

### 3. Get a free Groq API key

Go to [console.groq.com](https://console.groq.com), sign up with your email , and generate an API key.

### 4. Create a `.env` file in the project root

```
GROQ_API_KEY=your_key_here
```

### 5. (Optional) Set up Ollama as a fallback

If you want offline support, install [Ollama](https://ollama.com) and pull a model:

```bash
ollama pull phi3:mini
```

The app will use Ollama automatically if Groq is unavailable.

### 6. Run the app

```bash
python app.py
```

Open your browser at `http://localhost:5000`

---

## Project Structure

```
ai-tone-converter/
├── app.py              # Flask app, routes, input validation
├── ai_handler.py       # Groq + Ollama AI logic
├── requirements.txt    # Python dependencies
├── .env                # API key (not committed)
├── .gitignore
└── templates/
    └── index.html
└── static/
    ├── style.css
    └── script.js
```

---

## How It Works

1. User submits text and a tone via the frontend
2. Flask validates the input and calls `convert_tone()`
3. `ai_handler.py` sends the request to Groq first using `llama-3.1-8b-instant`
4. If Groq fails for any reason, it automatically retries with local Ollama
5. The cleaned response is returned as JSON and displayed in the UI

---

## Why Groq?
Groq runs on custom Language Processing Unit hardware designed specifically for LLM inference. On the free tier we can get 14,400 requests/day with no credit card required, and responses come back in under a second, which makes the app feel snappy compared to running a local model on CPU
---
