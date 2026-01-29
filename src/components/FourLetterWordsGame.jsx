import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const FOUR_LETTER_WORDS = [
    { word: 'BALL', p1: 'B', p2: 'A', p3: 'L', p4: 'L', icon: '⚽', sentence: 'Kick the ball.' },
    { word: 'BEAR', p1: 'B', p2: 'E', p3: 'A', p4: 'R', icon: '🐻', sentence: 'Big brown bear.' },
    { word: 'BIRD', p1: 'B', p2: 'I', p3: 'R', p4: 'D', icon: '🐦', sentence: 'The bird sings.' },
    { word: 'BOAT', p1: 'B', p2: 'O', p3: 'A', p4: 'T', icon: '⛵', sentence: 'Sail the boat.' },
    { word: 'BOOK', p1: 'B', p2: 'O', p3: 'O', p4: 'K', icon: '📖', sentence: 'Read a book.' },
    { word: 'CAKE', p1: 'C', p2: 'A', p3: 'K', p4: 'E', icon: '🎂', sentence: 'Yummy cake.' },
    { word: 'CORN', p1: 'C', p2: 'O', p3: 'R', p4: 'N', icon: '🌽', sentence: 'Sweet yellow corn.' },
    { word: 'CRAB', p1: 'C', p2: 'R', p3: 'A', p4: 'B', icon: '🦀', sentence: 'Crab on the beach.' },
    { word: 'DOLL', p1: 'D', p2: 'O', p3: 'L', p4: 'L', icon: '🎎', sentence: 'Play with a doll.' },
    { word: 'DOOR', p1: 'D', p2: 'O', p3: 'O', p4: 'R', icon: '🚪', sentence: 'Open the door.' },
    { word: 'DRUM', p1: 'D', p2: 'R', p3: 'U', p4: 'M', icon: '🥁', sentence: 'Bang the drum.' },
    { word: 'DUCK', p1: 'D', p2: 'U', p3: 'C', p4: 'K', icon: '🦆', sentence: 'Quack quack duck.' },
    { word: 'FISH', p1: 'F', p2: 'I', p3: 'S', p4: 'H', icon: '🐠', sentence: 'Swim like a fish.' },
    { word: 'FROG', p1: 'F', p2: 'R', p3: 'O', p4: 'G', icon: '🐸', sentence: 'Hop like a frog.' },
    { word: 'GIFT', p1: 'G', p2: 'I', p3: 'F', p4: 'T', icon: '🎁', sentence: 'A surprise gift.' },
    { word: 'GOAT', p1: 'G', p2: 'O', p3: 'A', p4: 'T', icon: '🐐', sentence: 'The goat eats grass.' },
    { word: 'HAND', p1: 'H', p2: 'A', p3: 'N', p4: 'D', icon: '✋', sentence: 'Wave your hand.' },
    { word: 'KITE', p1: 'K', p2: 'I', p3: 'T', p4: 'E', icon: '🪁', sentence: 'Fly a kite.' },
    { word: 'LAMB', p1: 'L', p2: 'A', p3: 'M', p4: 'B', icon: '🐑', sentence: 'Little white lamb.' },
    { word: 'LEAF', p1: 'L', p2: 'E', p3: 'A', p4: 'F', icon: '🍃', sentence: 'Green leaf falls.' },
    { word: 'LION', p1: 'L', p2: 'I', p3: 'O', p4: 'N', icon: '🦁', sentence: 'The lion roars.' },
    { word: 'LOVE', p1: 'L', p2: 'O', p3: 'V', p4: 'E', icon: '❤️', sentence: 'I love you.' },
    { word: 'MILK', p1: 'M', p2: 'I', p3: 'L', p4: 'K', icon: '🥛', sentence: 'Drink your milk.' },
    { word: 'MOON', p1: 'M', p2: 'O', p3: 'O', p4: 'N', icon: '🌙', sentence: 'Goodnight moon.' },
    { word: 'NOSE', p1: 'N', p2: 'O', p3: 'S', p4: 'E', icon: '👃', sentence: 'Touch your nose.' },
    { word: 'PARK', p1: 'P', p2: 'A', p3: 'R', p4: 'K', icon: '⛲', sentence: 'Play in the park.' },
    { word: 'RAIN', p1: 'R', p2: 'A', p3: 'I', p4: 'N', icon: '🌧️', sentence: 'Rain goes away.' },
    { word: 'RING', p1: 'R', p2: 'I', p3: 'N', p4: 'G', icon: '💍', sentence: 'Shiny gold ring.' },
    { word: 'ROSE', p1: 'R', p2: 'O', p3: 'S', p4: 'E', icon: '🌹', sentence: 'Smell the rose.' },
    { word: 'SHIP', p1: 'S', p2: 'H', p3: 'I', p4: 'P', icon: '🚢', sentence: 'Big ship sails.' },
    { word: 'SHOE', p1: 'S', p2: 'H', p3: 'O', p4: 'E', icon: '👟', sentence: 'Tie your shoe.' },
    { word: 'SNOW', p1: 'S', p2: 'N', p3: 'O', p4: 'W', icon: '❄️', sentence: 'Cold white snow.' },
    { word: 'SOCK', p1: 'S', p2: 'O', p3: 'C', p4: 'K', icon: '🧦', sentence: 'Put on a sock.' },
    { word: 'STAR', p1: 'S', p2: 'T', p3: 'A', p4: 'R', icon: '⭐', sentence: 'Twinkle twinkle star.' },
    { word: 'TREE', p1: 'T', p2: 'R', p3: 'E', p4: 'E', icon: '🌳', sentence: 'Climb the tree.' },
    { word: 'WOLF', p1: 'W', p2: 'O', p3: 'L', p4: 'F', icon: '🐺', sentence: 'The wolf howls.' }
];

function FourLetterWordsGame({ onBack }) {
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
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

    const currentWord = FOUR_LETTER_WORDS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentWord.p1}... ${currentWord.p2}... ${currentWord.p3}... ${currentWord.p4}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < FOUR_LETTER_WORDS.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevWord = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = FOUR_LETTER_WORDS[Math.floor(Math.random() * FOUR_LETTER_WORDS.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = FOUR_LETTER_WORDS[Math.floor(Math.random() * FOUR_LETTER_WORDS.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Find the word... ${target.word}`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz') startQuizRound();
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
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#3498DB' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
                    <button onClick={prevWord} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentWord.word}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #3498DB', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {FOUR_LETTER_WORDS.length}</div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
                            {[currentWord.p1, currentWord.p2, currentWord.p3, currentWord.p4].map((char, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '15px' }}>{char}</div>
                                    {i < 3 && <div style={{ fontSize: '1.5rem', color: '#95A5A6', marginLeft: '8px' }}>+</div>}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: '3rem', color: '#3498DB', marginBottom: '10px' }}>⬇️</div>
                        <div style={{ fontSize: '5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>{currentWord.word}</div>
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>{currentWord.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2980B9', background: '#E3F2FD', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>"{currentWord.sentence}"</div>
                    </motion.div>

                    <button onClick={nextWord} disabled={currentIndex === FOUR_LETTER_WORDS.length - 1} style={{ background: currentIndex === FOUR_LETTER_WORDS.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === FOUR_LETTER_WORDS.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#2980B9' }}>Which one is "{quizTarget?.word}"?</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #F39C12', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer' }}>
                                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50' }}>{item.word}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FourLetterWordsGame;
