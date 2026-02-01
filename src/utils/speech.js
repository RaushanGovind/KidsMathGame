
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

export const speak = (text, lang = 'en-US', rate = 0.8) => {
    // Get voice gender from local storage/settings
    let voiceGender = 'female';
    try {
        const saved = localStorage.getItem('fastMathFunData');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.settings?.voiceGender) {
                voiceGender = parsed.settings.voiceGender;
            }
        }
    } catch (e) { }

    if (!synthesis) {
        console.warn("Speech synthesis not supported");
        return;
    }

    // Clean up text for better pronunciation
    let cleanedText = text
        .replace(/\.\.\./g, '. ')
        .replace(/([,!?])(?=[^\s])/g, '$1 ') // Ensure space after punctuation
        .replace(/\s+/g, ' ')
        .trim();

    // Add period if no ending punctuation
    if (cleanedText && !/[.!?]$/.test(cleanedText)) {
        cleanedText += '.';
    }

    console.log(`Speaking: "${cleanedText}" [${lang}] (Rate: ${rate})`);

    // cancel previous
    synthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    activeUtterance = utterance; // Prevent GC

    // Select Voice
    if (voices.length === 0) loadVoices();

    const isEnglish = lang.toLowerCase().startsWith('en');
    const isHindi = lang.toLowerCase().startsWith('hi');

    let selectedVoice = null;

    if (isEnglish) {
        // For Indian kids, always prefer en-IN (Indian English) voices first
        const enInVoices = voices.filter(v => v.lang.includes('IN') && (v.lang.toLowerCase().includes('en') || v.name.toLowerCase().includes('india')));

        if (voiceGender === 'male') {
            selectedVoice = enInVoices.find(v => v.name.includes('Ravi')) ||
                enInVoices.find(v => v.name.includes('Male')) ||
                enInVoices[0];
        } else {
            selectedVoice = enInVoices.find(v => v.name.includes('Heera')) ||
                enInVoices.find(v => v.name.includes('Google')) ||
                enInVoices.find(v => v.name.includes('Female')) ||
                enInVoices[0];
        }

        // Fallback to general English if no Indian English
        if (!selectedVoice) {
            const generalEnVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
            if (voiceGender === 'male') {
                selectedVoice = generalEnVoices.find(v => v.name.includes('David')) ||
                    generalEnVoices.find(v => v.name.includes('Male')) ||
                    generalEnVoices[0];
            } else {
                selectedVoice = generalEnVoices.find(v => v.name.includes('Google')) ||
                    generalEnVoices.find(v => v.name.includes('Samantha')) ||
                    generalEnVoices[0];
            }
        }
    } else if (isHindi) {
        const hiVoices = voices.filter(v => v.lang.toLowerCase().includes('hi'));
        if (voiceGender === 'male') {
            selectedVoice = hiVoices.find(v => v.name.includes('Hemant')) || hiVoices[0];
        } else {
            selectedVoice = hiVoices.find(v => v.name.includes('Google')) ||
                hiVoices.find(v => v.name.includes('Kalpana')) ||
                hiVoices[0];
        }
    }

    // Final fallback
    if (!selectedVoice) selectedVoice = voices.find(v => v.default) || voices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log("Selected voice:", selectedVoice.name, selectedVoice.lang);
    }

    // Adjust rate for extreme clarity
    // Normal is 1.0, kids like 0.75 - 0.85
    utterance.rate = rate; // Caller can override, but default is 0.8
    utterance.pitch = 1.05; // Slightly higher pitch often sounds clearer for kids
    utterance.volume = 1.0;

    return new Promise((resolve) => {
        utterance.onend = () => {
            activeUtterance = null;
            setTimeout(resolve, 100); // Tiny pause after speaking
        };

        utterance.onerror = (e) => {
            console.error("Speech error:", e);
            activeUtterance = null;
            resolve();
        };

        synthesis.speak(utterance);
    });
};
