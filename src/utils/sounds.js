// Sound effects and music manager

const sounds = {
    click: '/sounds/click.mp3',
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/wrong.mp3',
    star: '/sounds/star.mp3',
    levelUp: '/sounds/levelup.mp3',
    badge: '/sounds/badge.mp3'
};

const music = {
    background: '/sounds/background.mp3'
};

let audioContext;
let musicAudio;
let soundEnabled = true;
let musicEnabled = true;

export function initAudio() {
    if (typeof window === 'undefined') return;

    // AudioContext for better control
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
}

export function setSoundEnabled(enabled) {
    soundEnabled = enabled;
}

export function setMusicEnabled(enabled) {
    musicEnabled = enabled;
    if (musicAudio) {
        if (enabled) {
            musicAudio.play().catch(e => console.warn('Music play failed', e));
        } else {
            musicAudio.pause();
        }
    }
}

export function playSound(soundName) {
    if (!soundEnabled) return;

    // For now, use simple beep tones since we don't have actual audio files
    // In production, replace with actual sound file loading

    if (audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different tones for different sounds
        const frequencies = {
            click: 300,
            correct: 600,
            wrong: 200,
            star: 800,
            levelUp: 1000,
            badge: 1200
        };

        oscillator.frequency.value = frequencies[soundName] || 400;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

export function playBackgroundMusic() {
    if (!musicEnabled) return;

    // In production, load and play background music file
    // For now, skip to avoid console errors
    console.log('Background music would play here');
}

export function stopBackgroundMusic() {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio.currentTime = 0;
    }
}
