import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

// Word Data with icons
const WORDS = [
    { word: 'CAT', icon: '🐱', hint: 'Meows and likes milk' },
    { word: 'DOG', icon: '🐶', hint: 'Barks and guards home' },
    { word: 'SUN', icon: '☀️', hint: 'Shines in the sky' },
    { word: 'BALL', icon: '⚽', hint: 'You kick this' },
    { word: 'BOOK', icon: '📖', hint: 'You read this' },
    { word: 'FISH', icon: '🐠', hint: 'Swims in water' },
    { word: 'TREE', icon: '🌳', hint: 'Has leaves and gives shade' },
    { word: 'BIRD', icon: '🐦', hint: 'Flies in the sky' },
    { word: 'CAKE', icon: '🎂', hint: 'Yummy birthday treat' },
    { word: 'MILK', icon: '🥛', hint: 'White and healthy drink' },
    { word: 'STAR', icon: '⭐', hint: 'Twinkles at night' },
    { word: 'MOON', icon: '🌙', hint: 'Shines at night' },
    { word: 'APPLE', icon: '🍎', hint: 'Red healthy fruit' },
    { word: 'HOUSE', icon: '🏠', hint: 'Where you live' },
    { word: 'CHAIR', icon: '🪑', hint: 'You sit on this' },
    { word: 'TABLE', icon: '🧱', hint: 'Put things on this' },
    { word: 'SPOON', icon: '🥄', hint: 'Use this to eat soup' },
    { word: 'HAPPY', icon: '😊', hint: 'Smile!' },
    { word: 'WATER', icon: '💧', hint: 'Drink this when thirsty' },
    { word: 'TIGER', icon: '🐅', hint: 'Big wild cat' }
];

function WordScrambleGame({ onBack }) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [scrambledLetters, setScrambledLetters] = useState([]);
    const [userGuess, setUserGuess] = useState([]);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
    const [availableLetters, setAvailableLetters] = useState([]); // Array of {id, letter}

    // Initialize or loading new word
    useEffect(() => {
        loadWord(currentWordIndex);
    }, [currentWordIndex]);

    const loadWord = (index) => {
        const target = WORDS[index].word;
        const letters = target.split('').map((l, i) => ({ id: i, letter: l }));
        // Shuffle
        const shuffled = [...letters].sort(() => Math.random() - 0.5);
        setScrambledLetters(shuffled);
        setAvailableLetters(shuffled);
        setUserGuess([]);
        setFeedback(null);
    };

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const handleLetterSelect = (letterObj) => {
        if (feedback) return; // Block input during feedback

        playAppSound('click');
        // Add to guess
        setUserGuess(prev => [...prev, letterObj]);
        // Remove from available
        setAvailableLetters(prev => prev.filter(l => l.id !== letterObj.id));
    };

    const handleUndo = (letterObj) => {
        if (feedback) return;

        playAppSound('click');
        // Remove from guess
        setUserGuess(prev => prev.filter(l => l.id !== letterObj.id));
        // Add back to available
        setAvailableLetters(prev => [...prev, letterObj]);
    };

    const checkAnswer = () => {
        const target = WORDS[currentWordIndex].word;
        const guessString = userGuess.map(l => l.letter).join('');

        if (guessString === target) {
            playAppSound('correct');
            setFeedback('correct');
            speak(`Correct! It is ${target}.`);
            setScore(s => s + 10);

            setTimeout(() => {
                if (currentWordIndex < WORDS.length - 1) {
                    setCurrentWordIndex(prev => prev + 1);
                } else {
                    setShowResult(true);
                }
            }, 2000);
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak('Try again!');
            setTimeout(() => {
                setFeedback(null);
                // Reset guess for user retry or keep it? 
                // Let's return all letters to pool to restart trying this word
                setUserGuess([]);
                setAvailableLetters(scrambledLetters); // Reset to initial shuffled state? OR just move all back.
                // Actually let's just reverse the actions.
                // Simply reloading the word state is easiest reset.
                // But better UX: Shake the letters and let user undo themselves? 
                // Or just clear automatically? clearing automatically is easier for kids.
            }, 1000);
        }
    };

    useEffect(() => {
        // Auto-check when all letters are used
        if (userGuess.length === WORDS[currentWordIndex].word.length && userGuess.length > 0 && !feedback) {
            checkAnswer();
        }
    }, [userGuess]);

    const resetGame = () => {
        setScore(0);
        setCurrentWordIndex(0);
        setShowResult(false);
        setFeedback(null);
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🔠</span> WORD SCRAMBLE
                </div>
                <div style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', color: '#D35400', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    Score: {score}
                </div>
            </div>

            {!showResult ? (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Clue Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={currentWordIndex}
                        style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '40px', width: '100%' }}
                    >
                        <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{WORDS[currentWordIndex].icon}</div>
                        <div style={{ fontSize: '1.5rem', color: '#7F8C8D', fontStyle: 'italic' }}>"{WORDS[currentWordIndex].hint}"</div>
                    </motion.div>

                    {/* Answer Slots */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', minHeight: '80px' }}>
                        {Array(WORDS[currentWordIndex].word.length).fill(null).map((_, idx) => {
                            const letterObj = userGuess[idx];
                            return (
                                <motion.button
                                    key={`slot-${idx}`}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: letterObj ? 1 : 1, backgroundColor: feedback === 'correct' ? '#2ECC71' : feedback === 'wrong' ? '#E74C3C' : '#FFF' }}
                                    onClick={() => letterObj && handleUndo(letterObj)}
                                    style={{
                                        width: '60px', height: '70px',
                                        borderRadius: '15px',
                                        border: '3px dashed #BDC3C7',
                                        background: 'white',
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                        color: feedback === 'correct' || feedback === 'wrong' ? 'white' : '#2C3E50',
                                        cursor: letterObj ? 'pointer' : 'default',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: letterObj ? '0 5px 0 #BDC3C7' : 'none',
                                        borderStyle: letterObj ? 'solid' : 'dashed'
                                    }}
                                >
                                    {letterObj ? letterObj.letter : ''}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Available Letters */}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <AnimatePresence>
                            {availableLetters.map((item) => (
                                <motion.button
                                    key={item.id}
                                    layoutId={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLetterSelect(item)}
                                    style={{
                                        width: '60px', height: '70px',
                                        borderRadius: '15px',
                                        border: 'none',
                                        background: '#F39C12',
                                        color: 'white',
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 5px 0 #D35400',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {item.letter}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            ) : (
                <div style={{ width: '100%', maxWidth: '600px', background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ fontSize: '3rem', color: '#E67E22', marginBottom: '20px' }}>Excellent!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} points!</p>
                    <button onClick={resetGame} style={{ padding: '15px 40px', borderRadius: '50px', background: '#27AE60', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #1E8449' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default WordScrambleGame;
