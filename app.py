from flask import Flask, render_template, request, jsonify
from ai_handler import convert_tone
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/convert",methods=["POST"])
def convert():
    data= request.json

    text =(data.get("text") or "").strip()
    tone= (data.get("tone") or"").strip()



    if not text:
        return jsonify({"error":"Please enter some text."}),400
    if not tone:
        return jsonify({"error":"Please select a tone."}),400
    if len(text) >1000:
        return jsonify({"error":"Text is too long.Max 1000 characters."}),400

    try:
        result= convert_tone(text,tone)
        return jsonify({"converted":result})
    except Exception as e:
        return jsonify({"error":f"Conversion failed: {str(e)}"}), 500

if __name__ =="__main__":
    app.run(debug=True)