import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

const LEVELS = {
    easy: ['cat', 'dog', 'sun', 'box', 'hat', 'run', 'pen', 'cup'],
    medium: ['apple', 'happy', 'green', 'tiger', 'sunny', 'pizza', 'robot', 'cloud'],
    hard: ['elephant', 'butterfly', 'dinosaur', 'rainbow', 'adventure', 'chocolate', 'computer']
};

function SpellingGame({ onBack }) {
    const [difficulty, setDifficulty] = useState('easy');
    const [currentWord, setCurrentWord] = useState('');
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
    const [score, setScore] = useState(0);

    useEffect(() => {
        newWord();
    }, [difficulty]);

    const newWord = () => {
        const words = LEVELS[difficulty];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(randomWord);
        setUserInput('');
        setFeedback(null);
        setTimeout(() => speakWord(randomWord), 500);
    };

    const speakWord = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8; // Slightly slower for kids
        utterance.pitch = 1.2; // Slightly higher pitch
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userInput.toLowerCase().trim() === currentWord.toLowerCase()) {
            playSound('correct');
            setFeedback('correct');
            setScore(s => s + 10);
            speakWord("Correct! " + currentWord);
        } else {
            playSound('wrong');
            setFeedback('incorrect');
            speakWord("Try again");
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
        if (feedback) setFeedback(null);
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%)'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
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
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#F39C12' }}>
                    ⭐ {score}
                </div>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '30px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'center',
                    border: '4px solid #F1C40F'
                }}
            >
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', marginBottom: '30px' }}>
                    🐝 Spelling Bee
                </h2>

                {/* Controls */}
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {Object.keys(LEVELS).map(level => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '20px',
                                border: 'none',
                                background: difficulty === level ? '#E67E22' : '#ecf0f1',
                                color: difficulty === level ? 'white' : '#7f8c8d',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                capitalize: 'true'
                            }}
                        >
                            {level.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Speaker Icon */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => speakWord(currentWord)}
                    style={{
                        background: '#3498DB',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: 'none',
                        boxShadow: '0 8px 0 #2980B9',
                        cursor: 'pointer',
                        marginBottom: '40px',
                        fontSize: '4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    🔊
                </motion.button>

                {/* Input Area */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type the word..."
                        autoFocus
                        style={{
                            padding: '20px',
                            fontSize: '2rem',
                            borderRadius: '20px',
                            border: '3px solid #ddd',
                            width: '100%',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            outline: 'none',
                            color: '#2C3E50'
                        }}
                    />

                    {feedback === 'correct' ? (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="button"
                            onClick={newWord}
                            style={{
                                padding: '20px 50px',
                                fontSize: '1.5rem',
                                background: '#27AE60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: '900',
                                boxShadow: '0 6px 0 #219150',
                                cursor: 'pointer'
                            }}
                        >
                            NEXT WORD ➡️
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            style={{
                                padding: '20px 50px',
                                fontSize: '1.5rem',
                                background: '#F1C40F',
                                color: '#2C3E50',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: '900',
                                boxShadow: '0 6px 0 #D4AC0D',
                                cursor: 'pointer'
                            }}
                        >
                            CHECK
                        </motion.button>
                    )}
                </form>

                {/* Feedback Message */}
                <div style={{ height: '40px', marginTop: '20px' }}>
                    {feedback === 'correct' && (
                        <span style={{ color: '#27AE60', fontSize: '1.5rem', fontWeight: 'bold' }}>Correct! The word is {currentWord}</span>
                    )}
                    {feedback === 'incorrect' && (
                        <span style={{ color: '#E74C3C', fontSize: '1.5rem', fontWeight: 'bold' }}>Try again! Listen closely 👂</span>
                    )}
                </div>

            </motion.div>
        </div>
    );
}

export default SpellingGame;
