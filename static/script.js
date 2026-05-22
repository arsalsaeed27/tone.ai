async function convertTone() {
    const text = document.getElementById("inputText").value.trim();
    const tone = document.getElementById("tone").value;
    const outputText = document.getElementById("outputText");
    const errorBox = document.getElementById("errorBox");
    const btn = document.getElementById("convertBtn");
    const copyBtn = document.getElementById("copyBtn");

    errorBox.style.display = "none";
    errorBox.textContent = "";
    outputText.textContent = "";
    copyBtn.style.display = "none";

    if (!text) {
        showError("Please enter some text before converting.");
        return;
    }

    // shows a loading state while waiting for the response
    btn.disabled = true;
    btn.textContent = "Converting...";

    try {
        const response = await fetch("/convert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, tone })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            showError(data.error || "Something went wrong. Please try again.");
            return;
        }
        outputText.textContent = data.converted;
        copyBtn.style.display = "inline-block";

    } catch (err) {
        showError("Network error. Is the server running?");
    } finally {
        btn.disabled = false;
        btn.textContent = "Convert Tone";
    }
}

function showError(msg) {
    const errorBox = document.getElementById("errorBox");
    errorBox.textContent = msg;
    errorBox.style.display = "block";
}

function copyOutput() {
    const text = document.getElementById("outputText").textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("copyBtn");
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy", 2000);
    });
}

// will show a character count and turn red when approaching the 1000 character limit
document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("inputText");
    const counter = document.getElementById("charCount");

    textarea.addEventListener("input", () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / 1000`;
        counter.style.color = len > 900 ? "#f87171" : "#94a3b8";
    });
});