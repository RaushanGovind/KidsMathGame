import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function VerbsGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [category, setCategory] = useState('movement');
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        fetch(`${API_URL}/api/content/verbs`)
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load verbs content", err);
                setLoading(false);
            });
    }, []);

    const handleQuizAnswer = (option) => {
        const correct = gameData.quiz[quizIndex].answer;
        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak(`Correct! ${gameData.quiz[quizIndex].text.replace('___', option)}`);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak(`Try again. The answer is ${correct}.`);
        }

        setTimeout(() => {
            if (quizIndex < gameData.quiz.length - 1) {
                setQuizIndex(c => c + 1);
                setFeedback(null);
            } else {
                setShowResult(true);
            }
        }, 2000);
    };

    const resetQuiz = () => {
        setQuizIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
        setMode('learn');
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Verbs...</div>;

    if (!gameData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data.</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FDEDEC',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E74C3C', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏃‍♂️</span> ACTION WORDS (VERBS)
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => { setMode('learn'); setCategory('movement'); }} style={{ padding: '12px 25px', background: mode === 'learn' ? '#E74C3C' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#F39C12' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { id: 'movement', label: 'Movement 🏃', color: '#E74C3C' },
                            { id: 'hands', label: 'Hands ✋', color: '#F39C12' },
                            { id: 'home', label: 'Home 🧹', color: '#16A085' },
                            { id: 'learning', label: 'Learning 🧠', color: '#8E44AD' },
                            { id: 'feelings', label: 'Feelings 😀', color: '#E91E63' },
                            { id: 'communication', label: 'Speaking 🗣️', color: '#3498DB' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCategory(tab.id)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: category === tab.id ? tab.color : 'white',
                                    color: category === tab.id ? 'white' : tab.color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%' }}>
                        {gameData.content[category].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => speak(`${item.word}. ${item.sentence}`)}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    border: '2px solid transparent'
                                }}
                            >
                                <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>{item.icon}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2C3E50', marginBottom: '5px' }}>{item.word}</div>
                                <div style={{ fontSize: '1rem', color: '#7F8C8D', fontStyle: 'italic' }}>"{item.sentence}"</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#E74C3C', marginBottom: '10px' }}>Question {quizIndex + 1} / {gameData.quiz.length}</h2>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '40px', lineHeight: '1.4' }}>
                            {gameData.quiz[quizIndex].text.replace('___', '______')}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {gameData.quiz[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '20px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        borderRadius: '20px',
                                        border: 'none',
                                        background: feedback && option === gameData.quiz[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== gameData.quiz[quizIndex].answer && feedback === 'incorrect' ? '#E74C3C' : '#FADBD8',
                                        color: feedback ? 'white' : '#C0392B',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showResult && (
                <div style={{ width: '100%', maxWidth: '600px', background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ fontSize: '3rem', color: '#E74C3C', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {gameData.quiz.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}
        </div>
    );
}

export default VerbsGame;
