
// Utility for robust Text-to-Speech

let voices = [];
let synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

// Handling the garbage collection bug: keep reference to active utterance
let activeUtterance = null;

const loadVoices = () => {
    if (!synthesis) return;
    voices = synthesis.getVoices();
    console.log("Voices loaded:", voices.length);
};

if (synthesis) {
    loadVoices();
    if (synthesis.onvoiceschanged !== undefined) {
        synthesis.onvoiceschanged = loadVoices;
    }
}

export const speak = (text, lang = 'en-US', rate = 1.0) => {
    if (!synthesis) {
        console.warn("Speech synthesis not supported");
        return;
    }

    console.log(`Speaking: "${text}" [${lang}]`);

    // cancel previous
    synthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance; // Prevent GC

    // Select Voice
    if (voices.length === 0) loadVoices();

    // Prefer specific languages
    const availableVoices = voices.filter(v => v.lang.toLowerCase().includes(lang.toLowerCase().split('-')[0]));

    let selectedVoice = null;

    if (lang.toLowerCase().includes('en-in')) {
        // Target Indian English specifically
        selectedVoice = availableVoices.find(v => v.lang.includes('IN') && (v.name.includes('Google') || v.name.includes('India'))) ||
            availableVoices.find(v => v.name.includes('Heera')) ||
            availableVoices.find(v => v.name.includes('Ravi')) ||
            availableVoices.find(v => v.lang.includes('IN'));
    }

    if (!selectedVoice && lang.includes('en')) {
        selectedVoice = selectedVoice ||
            availableVoices.find(v => v.name.includes('Google US English')) ||
            availableVoices.find(v => v.name.includes('Zira')) ||
            availableVoices.find(v => v.name.includes('Samantha'));
    } else if (lang.includes('hi')) {
        // Prefer Hindi Google, then Microsoft Kalpana/Hemant, then Generic
        selectedVoice = availableVoices.find(v => v.name.includes('Google') && v.name.includes('Hindi')) ||
            availableVoices.find(v => v.name.includes('Kalpana')) ||
            availableVoices.find(v => v.name.includes('Hemant')) ||
            availableVoices.find(v => v.lang.includes('IN'));
    }

    // Final fallback
    if (!selectedVoice) selectedVoice = availableVoices[0] || voices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log("Selected voice:", selectedVoice.name, selectedVoice.lang);
    }

    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    return new Promise((resolve) => {
        utterance.onend = () => {
            activeUtterance = null;
            resolve();
        };

        utterance.onerror = (e) => {
            console.error("Speech error:", e);
            activeUtterance = null;
            resolve(); // Still resolve to not hang
        };

        synthesis.speak(utterance);
    });
};
