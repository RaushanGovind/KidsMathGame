import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const THREE_LETTER_WORDS = [
    { word: 'ANT', p1: 'A', p2: 'N', p3: 'T', icon: '🐜', sentence: 'The ant is tiny.' },
    { word: 'BAT', p1: 'B', p2: 'A', p3: 'T', icon: '🦇', sentence: 'The bat can fly.' },
    { word: 'BED', p1: 'B', p2: 'E', p3: 'D', icon: '🛏️', sentence: 'Sleep in the bed.' },
    { word: 'BOX', p1: 'B', p2: 'O', p3: 'X', icon: '📦', sentence: 'Open the box.' },
    { word: 'BOY', p1: 'B', p2: 'O', p3: 'Y', icon: '👦', sentence: 'He is a boy.' },
    { word: 'BUS', p1: 'B', p2: 'U', p3: 'S', icon: '🚌', sentence: 'Ride the bus.' },
    { word: 'CAT', p1: 'C', p2: 'A', p3: 'T', icon: '🐱', sentence: 'Cute little cat.' },
    { word: 'COW', p1: 'C', p2: 'O', p3: 'W', icon: '🐮', sentence: 'The cow says moo.' },
    { word: 'CUP', p1: 'C', p2: 'U', p3: 'P', icon: '☕', sentence: 'Hot tea in a cup.' },
    { word: 'DOG', p1: 'D', p2: 'O', p3: 'G', icon: '🐶', sentence: 'My pet dog.' },
    { word: 'EGG', p1: 'E', p2: 'G', p3: 'G', icon: '🥚', sentence: 'Eat an egg.' },
    { word: 'EYE', p1: 'E', p2: 'Y', p3: 'E', icon: '👁️', sentence: 'Blink your eye.' },
    { word: 'FAN', p1: 'F', p2: 'A', p3: 'N', icon: '🌀', sentence: 'Turn on the fan.' },
    { word: 'FOX', p1: 'F', p2: 'O', p3: 'X', icon: '🦊', sentence: 'Sly red fox.' },
    { word: 'HAT', p1: 'H', p2: 'A', p3: 'T', icon: '🎩', sentence: 'Wear a hat.' },
    { word: 'HEN', p1: 'H', p2: 'E', p3: 'N', icon: '🐔', sentence: 'The hen lays eggs.' },
    { word: 'ICE', p1: 'I', p2: 'C', p3: 'E', icon: '🧊', sentence: 'Cold ice cubes.' },
    { word: 'JAM', p1: 'J', p2: 'A', p3: 'M', icon: '🍓', sentence: 'Sweet strawberry jam.' },
    { word: 'KEY', p1: 'K', p2: 'E', p3: 'Y', icon: '🔑', sentence: 'Lost my key.' },
    { word: 'MAP', p1: 'M', p2: 'A', p3: 'P', icon: '🗺️', sentence: 'Look at the map.' },
    { word: 'MUG', p1: 'M', p2: 'U', p3: 'G', icon: '🍺', sentence: 'A root beer mug.' },
    { word: 'OWL', p1: 'O', p2: 'W', p3: 'L', icon: '🦉', sentence: 'Night owl.' },
    { word: 'PEN', p1: 'P', p2: 'E', p3: 'N', icon: '🖊️', sentence: 'Blue ink pen.' },
    { word: 'PIG', p1: 'P', p2: 'I', p3: 'G', icon: '🐷', sentence: 'Pink little pig.' },
    { word: 'RAT', p1: 'R', p2: 'A', p3: 'T', icon: '🐀', sentence: 'A squeaky rat.' },
    { word: 'RED', p1: 'R', p2: 'E', p3: 'D', icon: '🔴', sentence: 'The color red.' },
    { word: 'RUN', p1: 'R', p2: 'U', p3: 'N', icon: '🏃', sentence: 'Run very fast.' },
    { word: 'SUN', p1: 'S', p2: 'U', p3: 'N', icon: '☀️', sentence: 'Bright yellow sun.' },
    { word: 'TOP', p1: 'T', p2: 'O', p3: 'P', icon: '🔝', sentence: 'Climb to the top.' },
    { word: 'VAN', p1: 'V', p2: 'A', p3: 'N', icon: '🚐', sentence: 'Big white van.' }
];

function ThreeLetterWordsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
    const [currentIndex, setCurrentIndex] = useState(0);

    // Quiz state
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const speak = (text, rate = 0.8) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const currentWord = THREE_LETTER_WORDS[currentIndex];

    // Trigger TTS when card changes in Learn mode
    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        // "C... A... T... CAT!"
        speak(`${currentWord.p1}...... ${currentWord.p2}...... ${currentWord.p3}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < THREE_LETTER_WORDS.length - 1) {
            setCurrentIndex(c => c + 1);
        }
    };

    const prevWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(c => c - 1);
        }
    };

    // --- Quiz Logic ---
    const startQuizRound = () => {
        const targetIndex = Math.floor(Math.random() * THREE_LETTER_WORDS.length);
        const target = THREE_LETTER_WORDS[targetIndex];
        setQuizTarget(target);
        setFeedback(null);

        // Generate options
        const options = [target];
        while (options.length < 3) {
            const random = THREE_LETTER_WORDS[Math.floor(Math.random() * THREE_LETTER_WORDS.length)];
            if (!options.includes(random)) options.push(random);
        }
        // Shuffle
        setQuizOptions(options.sort(() => Math.random() - 0.5));

        setTimeout(() => speak(`Find the word... ${target.word}`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz') {
            startQuizRound();
        }
    }, [mode]);

    const handleQuizOptionClick = (item) => {
        if (item.word === quizTarget.word) {
            playAppSound('correct');
            setFeedback('correct');
            setScore(s => s + 1);
            speak(`Correct! ${item.word}`);
            setTimeout(startQuizRound, 2000);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak("Try again!");
        }
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 0 #BDC3C7',
                    border: '2px solid #ECF0F1',
                    cursor: 'pointer'
                }}>
                    ⬅ MENU
                </button>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#9B59B6' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E91E63' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>

                    {/* Prev Button */}
                    <button
                        onClick={prevWord}
                        disabled={currentIndex === 0}
                        style={{
                            background: currentIndex === 0 ? '#ccc' : 'white',
                            border: 'none', borderRadius: '50%', width: '60px', height: '60px',
                            fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                        }}
                    >
                        ⬅
                    </button>

                    {/* Main Focus Card */}
                    <motion.div
                        key={currentWord.word}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white',
                            padding: '40px',
                            borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)',
                            width: '100%',
                            maxWidth: '550px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '6px solid #9B59B6',
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>
                            {currentIndex + 1} / {THREE_LETTER_WORDS.length}
                        </div>

                        {/* Phonics Breakdown */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '15px' }}>
                                {currentWord.p1}
                            </div>
                            <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '15px' }}>
                                {currentWord.p2}
                            </div>
                            <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '15px' }}>
                                {currentWord.p3}
                            </div>
                        </div>

                        {/* Arrow Down */}
                        <div style={{ fontSize: '3rem', color: '#9B59B6', marginBottom: '10px' }}>⬇️</div>

                        {/* Full Word */}
                        <div style={{ fontSize: '6rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>
                            {currentWord.word}
                        </div>

                        {/* Icon */}
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>
                            {currentWord.icon}
                        </div>

                        {/* Sentence */}
                        <div style={{
                            fontSize: '1.5rem', fontWeight: '700', color: '#8E44AD',
                            background: '#F3E5F5', padding: '15px 30px', borderRadius: '20px',
                            textAlign: 'center'
                        }}>
                            "{currentWord.sentence}"
                        </div>

                        <div style={{ marginTop: '20px', fontSize: '1rem', color: '#95A5A6' }}>(Click card to hear again 🔊)</div>

                    </motion.div>

                    {/* Next Button */}
                    <button
                        onClick={nextWord}
                        disabled={currentIndex === THREE_LETTER_WORDS.length - 1}
                        style={{
                            background: currentIndex === THREE_LETTER_WORDS.length - 1 ? '#ccc' : 'white',
                            border: 'none', borderRadius: '50%', width: '60px', height: '60px',
                            fontSize: '2rem', cursor: currentIndex === THREE_LETTER_WORDS.length - 1 ? 'default' : 'pointer',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                        }}
                    >
                        ➡
                    </button>
                </div>
            ) : (
                // Quiz Mode
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{
                        background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px',
                        fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px'
                    }}>🔊</button>

                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#8E44AD' }}>
                        Which one is "{quizTarget?.word}"?
                    </h2>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuizOptionClick(item)}
                                style={{
                                    background: 'white',
                                    border: '4px solid #E91E63',
                                    borderRadius: '20px',
                                    padding: '30px 40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: '0 8px 0 #C2185B',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50' }}>{item.word}</span>
                            </motion.button>
                        ))}
                    </div>

                    {feedback === 'correct' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginTop: '30px', fontSize: '2rem', color: '#27AE60', fontWeight: 'bold' }}>
                            ✅ Great Job!
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ThreeLetterWordsGame;
