const API_URL = 'https://web-production-b8b2d.up.railway.app/convert';

const TONES = ['professional', 'friendly', 'casual', 'polite', 'aggressive', 'motivational', 'formal', 'humorous'];

let triggerBtn = null;
let popup = null;
let selectedText = '';
let selectionRange = null;

// ── Create the small trigger button that appears on text selection ──
function createTriggerBtn() {
    const btn = document.createElement('div');
    btn.id = 'toneai-trigger';
    btn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
    tone.ai
  `;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPopup();
    });
    document.body.appendChild(btn);
    return btn;
}

// ── Create the main popup card ──
function createPopup() {
    const el = document.createElement('div');
    el.id = 'toneai-popup';
    el.innerHTML = `
    <div class="tai-header">
      <span class="tai-brand">tone<span class="tai-dot">.</span>ai</span>
      <button class="tai-close" id="toneai-close">✕</button>
    </div>
    <div class="tai-original">
      <div class="tai-label">ORIGINAL</div>
      <div class="tai-original-text" id="toneai-original-text"></div>
    </div>
    <div class="tai-tones" id="toneai-tones">
      ${TONES.map(t => `<button class="tai-tone-btn" data-tone="${t}">${t}</button>`).join('')}
    </div>
    <div class="tai-output" id="toneai-output" style="display:none;">
      <div class="tai-label">
        <span>REWRITTEN</span>
        <span class="tai-tone-tag" id="toneai-tone-tag"></span>
      </div>
      <div class="tai-result-text" id="toneai-result-text"></div>
      <div class="tai-actions">
        <button class="tai-btn-copy" id="toneai-copy">Copy</button>
        <button class="tai-btn-replace" id="toneai-replace">Replace selection</button>
      </div>
    </div>
    <div class="tai-loading" id="toneai-loading" style="display:none;">
      <div class="tai-spinner"></div>
      <span>Rewriting...</span>
    </div>
    <div class="tai-error" id="toneai-error" style="display:none;"></div>
  `;
    document.body.appendChild(el);

    // Close button
    el.querySelector('#toneai-close').addEventListener('click', closeAll);

    // Tone buttons
    el.querySelectorAll('.tai-tone-btn').forEach(btn => {
        btn.addEventListener('click', () => convertTone(btn.dataset.tone));
    });

    // Copy button
    el.querySelector('#toneai-copy').addEventListener('click', () => {
        const text = el.querySelector('#toneai-result-text').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = el.querySelector('#toneai-copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 2000);
        });
    });

    // Replace button
    el.querySelector('#toneai-replace').addEventListener('click', () => {
        const text = el.querySelector('#toneai-result-text').textContent;
        if (selectionRange) {
            selectionRange.deleteContents();
            selectionRange.insertNode(document.createTextNode(text));
        }
        closeAll();
    });

    return el;
}

// ── Position element near the selection ──
function positionNear(el, rect, offset = 8) {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    let top = rect.bottom + scrollY + offset;
    let left = rect.left + scrollX;

    // Keep within viewport horizontally
    const elWidth = el.offsetWidth || 280;
    if (left + elWidth > window.innerWidth + scrollX - 16) {
        left = window.innerWidth + scrollX - elWidth - 16;
    }
    if (left < scrollX + 8) left = scrollX + 8;

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
}

// ── Show the small trigger button ──
function showTriggerBtn(rect) {
    if (!triggerBtn) triggerBtn = createTriggerBtn();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    triggerBtn.style.top = `${rect.bottom + scrollY + 6}px`;
    triggerBtn.style.left = `${rect.left + scrollX}px`;
    triggerBtn.style.display = 'flex';
}

// ── Show the full popup ──
function showPopup() {
    if (!popup) popup = createPopup();

    // Reset state
    popup.querySelector('#toneai-output').style.display = 'none';
    popup.querySelector('#toneai-loading').style.display = 'none';
    popup.querySelector('#toneai-error').style.display = 'none';
    popup.querySelectorAll('.tai-tone-btn').forEach(b => b.classList.remove('active'));

    popup.querySelector('#toneai-original-text').textContent =
        selectedText.length > 120 ? selectedText.slice(0, 120) + '…' : selectedText;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0).cloneRange();
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        popup.style.display = 'block';
        positionNear(popup, rect, 12);
    }

    if (triggerBtn) triggerBtn.style.display = 'none';
}

// ── Call the API ──
async function convertTone(tone) {
    const loading = popup.querySelector('#toneai-loading');
    const output = popup.querySelector('#toneai-output');
    const error = popup.querySelector('#toneai-error');
    const tones = popup.querySelector('#toneai-tones');

    error.style.display = 'none';
    output.style.display = 'none';
    loading.style.display = 'flex';
    tones.querySelectorAll('.tai-tone-btn').forEach(b => b.classList.remove('active'));
    tones.querySelector(`[data-tone="${tone}"]`).classList.add('active');

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText, tone })
        });
        const data = await res.json();

        if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong');

        popup.querySelector('#toneai-result-text').textContent = data.converted;
        popup.querySelector('#toneai-tone-tag').textContent = tone;
        popup.querySelector('#toneai-copy').textContent = 'Copy';
        loading.style.display = 'none';
        output.style.display = 'block';

    } catch (err) {
        loading.style.display = 'none';
        error.textContent = err.message || 'Failed to connect to tone.ai';
        error.style.display = 'block';
    }
}

// ── Close everything ──
function closeAll() {
    if (triggerBtn) triggerBtn.style.display = 'none';
    if (popup) popup.style.display = 'none';
    selectedText = '';
    selectionRange = null;
}

// ── Listen for text selection ──
document.addEventListener('mouseup', (e) => {
    // Don't trigger inside our own popup
    if (e.target.closest('#toneai-popup') || e.target.closest('#toneai-trigger')) return;

    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection ? selection.toString().trim() : '';

        if (text.length > 10) {
            selectedText = text;
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            showTriggerBtn(rect);
        } else {
            closeAll();
        }
    }, 10);
});

// ── Close when clicking outside ──
document.addEventListener('mousedown', (e) => {
    if (
        popup && popup.style.display === 'block' &&
        !e.target.closest('#toneai-popup') &&
        !e.target.closest('#toneai-trigger')
    ) {
        closeAll();
    }
});