let selectedTone = 'professional';

document.addEventListener('DOMContentLoaded', () => {

    // ── Tone selection ──
    const toneItems = document.querySelectorAll('.tone-item');

    toneItems.forEach(item => {
        item.addEventListener('click', () => {
            toneItems.forEach(t => t.classList.remove('sel'));
            item.classList.add('sel');
            selectedTone = item.dataset.tone;
            document.getElementById('toneBadge').textContent = selectedTone;
        });
    });

    // ── Character counter ──
    const textarea = document.getElementById('inputText');
    const counter = document.getElementById('charCount');

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / 1000`;
        counter.classList.toggle('warn', len > 900);
    });

    // ── Keyboard shortcut ──
    textarea.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') convertTone();
    });
});

async function convertTone() {
    const text = document.getElementById('inputText').value.trim();
    const outputEl = document.getElementById('outputText');
    const errorBox = document.getElementById('errorBox');
    const goBtn = document.getElementById('goBtn');
    const viaLabel = document.getElementById('viaLabel');
    const viaDot = document.getElementById('viaDot');
    const copyInline = document.getElementById('copyInline');

    // reset
    errorBox.style.display = 'none';
    copyInline.style.display = 'none';

    if (!text) { showError('Please enter some text before converting.'); return; }

    // loading state
    goBtn.disabled = true;
    goBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Converting...`;
    outputEl.className = 'output-text is-placeholder';
    outputEl.textContent = 'Rewriting...';
    viaLabel.textContent = 'thinking...';
    viaDot.className = 'via-dot';

    const t0 = Date.now();

    try {
        const res = await fetch('/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, tone: selectedTone })
        });
        const data = await res.json();

        if (!res.ok || data.error) {
            showError(data.error || 'Something went wrong. Please try again.');
            resetOutput();
            return;
        }

        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        outputEl.textContent = data.converted;
        outputEl.className = 'output-text';
        viaLabel.textContent = `via Groq · ${elapsed}s`;
        viaDot.className = 'via-dot live';
        copyInline.style.display = 'inline';

    } catch (err) {
        showError('Network error. Make sure the server is running.');
        resetOutput();
    } finally {
        goBtn.disabled = false;
        goBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Convert tone`;
    }
}

function resetOutput() {
    const outputEl = document.getElementById('outputText');
    outputEl.textContent = 'Your rewritten text will appear here...';
    outputEl.className = 'output-text is-placeholder';
    document.getElementById('viaLabel').textContent = 'waiting';
    document.getElementById('viaDot').className = 'via-dot';
}

function showError(msg) {
    const box = document.getElementById('errorBox');
    box.textContent = msg;
    box.style.display = 'block';
}

function copyOutput() {
    const outputEl = document.getElementById('outputText');
    if (outputEl.classList.contains('is-placeholder')) return;

    navigator.clipboard.writeText(outputEl.textContent).then(() => {
        const btnSec = document.querySelector('.btn-sec');
        const copyInline = document.getElementById('copyInline');
        const origSec = btnSec.innerHTML;

        btnSec.textContent = 'Copied!';
        copyInline.textContent = 'copied!';

        setTimeout(() => {
            btnSec.innerHTML = origSec;
            copyInline.textContent = 'copy';
        }, 2000);
    });
}