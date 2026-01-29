import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const TWO_LETTER_WORDS = [
    { word: 'AM', p1: 'A', p2: 'M', icon: '🙋‍♂️', sentence: 'I am happy.' },
    { word: 'AN', p1: 'A', p2: 'N', icon: '🍎', sentence: 'I saw an apple.' },
    { word: 'AS', p1: 'A', p2: 'S', icon: '⚡', sentence: 'As fast as I can.' },
    { word: 'AT', p1: 'A', p2: 'T', icon: '📍', sentence: 'Look at the cat.' },
    { word: 'BE', p1: 'B', p2: 'E', icon: '🐝', sentence: 'Be kind.' }, // pun intended
    { word: 'BY', p1: 'B', p2: 'Y', icon: '🌊', sentence: 'By the sea.' },
    { word: 'DO', p1: 'D', p2: 'O', icon: '✅', sentence: 'Do your best.' },
    { word: 'GO', p1: 'G', p2: 'O', icon: '🚦', sentence: 'Ready, set, go!' },
    { word: 'HE', p1: 'H', p2: 'E', icon: '👦', sentence: 'He is my friend.' },
    { word: 'HI', p1: 'H', p2: 'I', icon: '👋', sentence: 'Hi there!' },
    { word: 'IF', p1: 'I', p2: 'F', icon: '☔', sentence: 'If it rains.' },
    { word: 'IN', p1: 'I', p2: 'N', icon: '📦', sentence: 'It is in the box.' },
    { word: 'IS', p1: 'I', p2: 'S', icon: '🌞', sentence: 'It is sunny.' },
    { word: 'IT', p1: 'I', p2: 'T', icon: '🎈', sentence: 'It is fun.' },
    { word: 'ME', p1: 'M', p2: 'E', icon: '🧒', sentence: 'Play with me.' },
    { word: 'MY', p1: 'M', p2: 'Y', icon: '🧸', sentence: 'This is my toy.' },
    { word: 'NO', p1: 'N', p2: 'O', icon: '🚫', sentence: 'Say no.' },
    { word: 'OF', p1: 'O', p2: 'F', icon: '☕', sentence: 'Cup of tea.' },
    { word: 'ON', p1: 'O', p2: 'N', icon: '🔛', sentence: 'On the table.' },
    { word: 'OR', p1: 'O', p2: 'R', icon: '🤷', sentence: 'This or that?' },
    { word: 'SO', p1: 'S', p2: 'O', icon: '😊', sentence: 'I am so happy.' },
    { word: 'TO', p1: 'T', p2: 'O', icon: '👉', sentence: 'Go to sleep.' },
    { word: 'UP', p1: 'U', p2: 'P', icon: '⬆️', sentence: 'Look up!' },
    { word: 'US', p1: 'U', p2: 'S', icon: '👥', sentence: 'Play with us.' },
    { word: 'WE', p1: 'W', p2: 'E', icon: '👨‍👩‍👧‍👦', sentence: 'We are family.' }
];

function TwoLetterWordsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

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

    const currentWord = TWO_LETTER_WORDS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            // Auto-speak when word changes
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        // "A... T... AT!"
        speak(`${currentWord.p1}...... ${currentWord.p2}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < TWO_LETTER_WORDS.length - 1) {
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
        const targetIndex = Math.floor(Math.random() * TWO_LETTER_WORDS.length);
        const target = TWO_LETTER_WORDS[targetIndex];
        setQuizTarget(target);
        setFeedback(null);

        // Generate options
        const options = [target];
        while (options.length < 3) {
            const random = TWO_LETTER_WORDS[Math.floor(Math.random() * TWO_LETTER_WORDS.length)];
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
            background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)'
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
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#009688' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
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
                            maxWidth: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '6px solid #009688',
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>
                            {currentIndex + 1} / {TWO_LETTER_WORDS.length}
                        </div>

                        {/* Phonics Breakdown */}
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 20px', borderRadius: '15px' }}>
                                {currentWord.p1}
                            </div>
                            <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 20px', borderRadius: '15px' }}>
                                {currentWord.p2}
                            </div>
                        </div>

                        {/* Arrow Down */}
                        <div style={{ fontSize: '3rem', color: '#009688', marginBottom: '10px' }}>⬇️</div>

                        {/* Full Word */}
                        <div style={{ fontSize: '6rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>
                            {currentWord.word}
                        </div>

                        {/* Icon/Diagram */}
                        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
                            {currentWord.icon}
                        </div>

                        {/* Sentence */}
                        <div style={{
                            fontSize: '1.5rem', fontWeight: '700', color: '#16A085',
                            background: '#E0F2F1', padding: '15px 30px', borderRadius: '20px',
                            textAlign: 'center'
                        }}>
                            "{currentWord.sentence}"
                        </div>

                        <div style={{ marginTop: '20px', fontSize: '1rem', color: '#95A5A6' }}>(Click card to hear again 🔊)</div>

                    </motion.div>

                    {/* Next Button */}
                    <button
                        onClick={nextWord}
                        disabled={currentIndex === TWO_LETTER_WORDS.length - 1}
                        style={{
                            background: currentIndex === TWO_LETTER_WORDS.length - 1 ? '#ccc' : 'white',
                            border: 'none', borderRadius: '50%', width: '60px', height: '60px',
                            fontSize: '2rem', cursor: currentIndex === TWO_LETTER_WORDS.length - 1 ? 'default' : 'pointer',
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

                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#00796B' }}>
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
                                    padding: '30px 50px',
                                    fontSize: '3rem',
                                    fontWeight: '900',
                                    color: '#2C3E50',
                                    boxShadow: '0 8px 0 #C2185B',
                                    cursor: 'pointer'
                                }}
                            >
                                {item.word}
                            </motion.button>
                        ))}
                    </div>

                    {feedback === 'correct' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginTop: '30px', fontSize: '2rem', color: '#27AE60', fontWeight: 'bold' }}>
                            ✅ Awesome!
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TwoLetterWordsGame;
