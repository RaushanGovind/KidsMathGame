
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

    // Sort logic to prefer native/good voices
    const availableVoices = voices.filter(v => v.lang.includes(lang.split('-')[0]));

    let selectedVoice = null;
    if (lang.includes('en')) {
        // Prefer Google US, then Microsoft Zira/David, then generic English
        selectedVoice = availableVoices.find(v => v.name.includes('Google US English')) ||
            availableVoices.find(v => v.name.includes('Zira')) ||
            availableVoices.find(v => v.name.includes('Samantha')) ||
            availableVoices[0];
    } else if (lang.includes('hi')) {
        // Prefer Hindi Google, then Generic
        selectedVoice = availableVoices.find(v => v.name.includes('Google') && v.name.includes('Hindi')) ||
            availableVoices[0];
    } else {
        selectedVoice = availableVoices[0];
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang; // Ensure lang matches voice
        console.log("Selected voice:", selectedVoice.name);
    } else {
        console.log("No specific voice found, using default.");
    }

    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
        activeUtterance = null; // Release
    };

    utterance.onerror = (e) => {
        console.error("Speech error:", e);
        activeUtterance = null;
    };

    synthesis.speak(utterance);
};
