import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function SingularPluralGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/singular_plural')
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load singular plural content", err);
                setLoading(false);
            });
    }, []);

    const handleQuizAnswer = (option) => {
        const correct = gameData.quiz[quizIndex].answer;
        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak('Correct!');
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak(`Oops, the plural of ${gameData.quiz[quizIndex].question} is ${correct}`);
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

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Singular & Plural...</div>;

    if (!gameData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data.</div>;

    const currentRule = gameData.rules[currentRuleIndex];

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FDF2E9', // Soft background
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🐈🐈‍⬛</span> SINGULAR & PLURAL
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#3498DB' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Unknown Rules 📜</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice Quiz 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Rules Tabs */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '15px', marginBottom: '10px' }}>
                        {gameData.rules.map((rule, idx) => (
                            <button
                                key={rule.id}
                                onClick={() => setCurrentRuleIndex(idx)}
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    border: 'none',
                                    background: currentRuleIndex === idx ? rule.color : 'white',
                                    color: currentRuleIndex === idx ? 'white' : '#7F8C8D',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {rule.title}
                            </button>
                        ))}
                    </div>

                    {/* Rule Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentRule.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                background: 'white',
                                borderRadius: '30px',
                                padding: '40px',
                                width: '100%',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <h2 style={{ color: currentRule.color, fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>{currentRule.title}</h2>
                            <p style={{ fontSize: '1.5rem', color: '#7F8C8D', marginBottom: '30px', textAlign: 'center' }}>{currentRule.description}</p>

                            {/* Examples Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', marginBottom: '30px' }}>
                                {currentRule.examples.map((item, idx) => (
                                    <div key={idx}
                                        onClick={() => speak(`One ${item.singular}, many ${item.plural}`)}
                                        style={{
                                            background: '#F8F9F9',
                                            borderRadius: '20px',
                                            padding: '20px',
                                            textAlign: 'center',
                                            border: `2px solid ${currentRule.color}`,
                                            cursor: 'pointer'
                                        }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.icon}</div>
                                        <div style={{ fontSize: '1.2rem', color: '#7F8C8D' }}>One <strong>{item.singular}</strong></div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50' }}>Many <span style={{ color: currentRule.color }}>{item.plural}</span></div>
                                    </div>
                                ))}
                            </div>

                            {currentRule.sentence && (
                                <div style={{ background: '#FDEDEC', padding: '20px', borderRadius: '15px', color: '#C0392B', fontStyle: 'italic', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🗣️</span> "{currentRule.sentence}"
                                    <button onClick={() => speak(currentRule.sentence)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>🔊</button>
                                </div>
                            )}

                            {currentRule.note && (
                                <div style={{ marginTop: '20px', fontSize: '1rem', color: '#7F8C8D' }}>NOTE: {currentRule.note}</div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#3498DB', marginBottom: '10px' }}>Question {quizIndex + 1} / {gameData.quiz.length}</h2>
                        <h3 style={{ fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '40px' }}>What is the plural of "{gameData.quiz[quizIndex].question}"?</h3>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            {gameData.quiz[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '20px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        borderRadius: '20px',
                                        border: 'none',
                                        background: feedback && option === gameData.quiz[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== gameData.quiz[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#D6EAF8',
                                        color: feedback ? 'white' : '#2980B9',
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
                    <h2 style={{ fontSize: '3rem', color: '#3498DB', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {gameData.quiz.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default SingularPluralGame;
