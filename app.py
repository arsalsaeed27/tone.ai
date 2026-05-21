from flask import Flask, request, jsonify
from ai_handler import convert_tone

app = Flask(__name__)
@app.route("/")
def home():
    return "AI Tone Converter Running..."

@app.route("/convert", methods=["POST"])
def convert():
    data = request.json
    text = data.get("text")
    tone = data.get("tone")
    
    result = convert_tone(text, tone)
    return jsonify({
        "original": text,
        "tone": tone,
        "converted": result
    })
    
if __name__ == "__main__":
    app.run(debug=True)