let synth = window.speechSynthesis;
let isTTSEnabled = false; // Changed to false by default

export function toggleTTS() {
    isTTSEnabled = !isTTSEnabled;
    return isTTSEnabled;
}

export function speak(text) {
    if (!isTTSEnabled || !text || !synth) return;
    
    if (synth.speaking) {
        synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    synth.speak(utterance);
}

