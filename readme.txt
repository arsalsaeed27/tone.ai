# tone.ai - AI Tone Converter

An AI-powered text tone conversion web app built with Python, Flask, and a dual-provider AI backend (Groq + Ollama fallback)

Paste any text, pick a tone, and get it rewritten instantly. Professionally, casually, aggressively, or however you need it.

---

## Demo
> Enter text → Select tone → Click Convert (or Ctrl + Enter) → Copy result

---

## Tech Stack
- Python + Flask — backend and REST API
- Groq API — primary AI provider (LLaMA 3.1)
- Ollama — local LLM fallback
- HTML / CSS / Vanilla JS — frontend, no frameworks
- Railway — deployment

---

## Features

- Paste any text and convert it to a chosen tone instantly
- 8 tone options: Professional, Friendly, Polite, Aggressive, Motivational, Casual, Formal, Humorous
- Dual AI backend; Groq first for speed, falls back to local Ollama automatically if Groq fails
- Ctrl + Enter keyboard shortcut to convert
- Copy to clipboard on the converted output
- Character counter with 1000 character limit
- Input validation. Empty text and oversized input are caught before hitting the API
- Inline error messages
- Loading state on the convert button

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/arsalsaeed27/AI-Tone-Converter
cd tone-ai
```

### 2. Create a virtual environment and install dependencies

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

### 3. Get a free Groq API key

Go to [console.groq.com](https://console.groq.com), sign up, and generate an API key.

### 4. Create a `.env` file in the project root

```
GROQ_API_KEY=your_key_here
```

### 5. (Optional) Set up Ollama as a fallback

Install [Ollama](https://ollama.com) and pull a model:

```bash
ollama pull phi3:mini
```

The app will use Ollama automatically if Groq is unavailable.

### 6. Run the app

```bash
python app.py
```

Open your browser at localhost

---

## Deploying to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project from your GitHub repo
3. Add your environment variable: `GROQ_API_KEY=your_key_here` under **Variables**
4. Add a `Procfile` in the project root:
   ```
   web: gunicorn app:app
   ```
5. Add `gunicorn` to your `requirements.txt`
6. Railway will build and deploy automatically — your live URL appears in the dashboard

---

## Browser Extension

A Chrome extension is in development that lets you select text on any webpage, pick a tone, and rewrite it inline without leaving the page.

Planned flow: Highlight text → tone.ai button appears → pick tone → rewritten text replaces selection

> Extension files will live in the `/extension` folder once released.

---

## Project Structure

```
tone-ai/
├── app.py              # Flask app, routes, input validation
├── ai_handler.py       # Groq + Ollama AI logic
├── requirements.txt    # Python dependencies
├── Procfile            # Railway deployment config
├── .env                # API key (not committed)
├── .gitignore
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── extension/          # Chrome extension (coming soon)
```

---

## How It Works

1. User submits text and a tone via the frontend
2. Flask validates the input and calls `convert_tone()`
3. `ai_handler.py` sends the request to Groq using `llama-3.1-8b-instant`
4. If Groq fails, it automatically retries with local Ollama
5. The cleaned response is returned as JSON and displayed in the UI

---

## Why Groq?

Groq runs on custom LPU (Language Processing Unit) hardware built specifically for LLM inference. The free tier gives 14,400 requests/day with no credit card required, and responses come back in under a second, making the app feel instant compared to running a local model on CPU.