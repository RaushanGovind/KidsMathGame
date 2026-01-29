import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function PronounsGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz' | 'dialogue'
    const [category, setCategory] = useState('personal');
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [selectedDialogueId, setSelectedDialogueId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/pronouns')
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load pronouns content", err);
                setLoading(false);
            });
    }, []);

    const handleQuizAnswer = (option) => {
        const correct = gameData.quiz[quizIndex].answer;
        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak(`Correct! ${gameData.quiz[quizIndex].question.replace('___', option)}`);
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak(`Try again.`);
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

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Pronouns...</div>;

    if (!gameData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data.</div>;

    const currentData = gameData[category];

    // Helper to render bold text
    const renderStyledText = (text) => {
        if (!text) return "";
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={index} style={{ color: '#8E44AD', fontWeight: '900', background: '#F4ECF7', padding: '0 4px', borderRadius: '4px' }}>{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    const categories = ['personal', 'object', 'possessive', 'demonstrative'];

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#F4ECF7', // Light Purple bg
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#8E44AD', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>👉</span> PRONOUNS
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#8E44AD' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('dialogue')} style={{ padding: '12px 25px', background: mode === 'dialogue' ? '#3498DB' : 'white', color: mode === 'dialogue' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Dialogues 🗣️</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                        {categories.map(key => (
                            <button
                                key={key}
                                onClick={() => setCategory(key)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: category === key ? gameData[key].color : 'white',
                                    color: category === key ? 'white' : gameData[key].color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {gameData[key].title}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}
                    >
                        {/* Description Header */}
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: currentData.color, fontSize: '2rem', margin: 0 }}>{currentData.title}</h2>
                            <p style={{ color: '#7F8C8D', fontSize: '1.2rem' }}>{currentData.description}</p>
                        </div>

                        {/* Table / Grid Content */}
                        {(category === 'personal' || category === 'object') && currentData.content ? (
                            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#ECF0F1', border: '2px solid #ECF0F1', borderRadius: '15px', overflow: 'hidden' }}>
                                    <div style={{ padding: '15px', background: '#F4F6F7', fontWeight: 'bold', textAlign: 'center', color: '#7F8C8D' }}>
                                        {category === 'personal' ? 'Singular (One)' : 'Subject'}
                                    </div>
                                    <div style={{ padding: '15px', background: '#F4F6F7', fontWeight: 'bold', textAlign: 'center', color: '#7F8C8D' }}>
                                        {category === 'personal' ? 'Plural (Many)' : 'Object'}
                                    </div>

                                    {currentData.content.map((row, idx) => (
                                        <div key={idx} style={{ display: 'contents' }}>
                                            <div style={{ padding: '15px', background: 'white', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                {row.left}
                                            </div>
                                            <div style={{ padding: '15px', background: 'white', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: currentData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                <span>{row.right}</span> <span style={{ fontSize: '1.5rem' }}>{row.icon}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                {currentData.items && currentData.items.map((item, idx) => (
                                    <div key={idx}
                                        onClick={() => speak(item.sentence)}
                                        style={{
                                            background: 'white', padding: '20px', borderRadius: '20px',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                            textAlign: 'center', cursor: 'pointer',
                                            borderBottom: `5px solid ${currentData.color}`
                                        }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.icon}</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: currentData.color, marginBottom: '5px' }}>{item.word}</div>
                                        <div style={{ fontSize: '1.1rem', color: '#34495E' }}>{renderStyledText(item.sentence)}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Examples Section */}
                        {currentData.examples && (
                            <div style={{ background: '#FEF9E7', padding: '30px', borderRadius: '20px', border: '2px solid #F1C40F' }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#F39C12', fontSize: '1.5rem' }}>🌟 Examples</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {currentData.examples.map((ex, idx) => (
                                        <div key={idx} onClick={() => speak(ex)} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.3rem', color: '#2C3E50', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '1.5rem' }}>👉</span>
                                            <span>{renderStyledText(ex)}</span>
                                            <span style={{ fontSize: '1rem', opacity: 0.5 }}>🔊</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {mode === 'dialogue' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!selectedDialogueId ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
                            {gameData.dialogues.map(d => (
                                <motion.button
                                    key={d.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDialogueId(d.id)}
                                    style={{
                                        background: 'white', border: 'none', padding: '30px', borderRadius: '20px',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left',
                                        display: 'flex', alignItems: 'center', gap: '20px'
                                    }}
                                >
                                    <span style={{ fontSize: '3rem' }}>{d.icon}</span>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#2C3E50' }}>{d.title}</h3>
                                        <span style={{ color: '#3498DB', fontWeight: 'bold' }}>Read & Listen ➜</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div style={{ width: '100%', maxWidth: '800px' }}>
                            <button onClick={() => setSelectedDialogueId(null)} style={{ marginBottom: '20px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'white', color: '#3498DB', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>⬅ Back to Dialogues</button>

                            {(() => {
                                const activeDialogue = gameData.dialogues.find(d => d.id === selectedDialogueId);
                                return (
                                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                                        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                            <span style={{ fontSize: '2.5rem' }}>{activeDialogue.icon}</span>
                                            {activeDialogue.title}
                                        </h2>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                            {activeDialogue.lines.map((line, idx) => (
                                                <div key={idx} onClick={() => speak(line.text)} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: 'pointer' }}>
                                                    <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold', color: '#7F8C8D', paddingTop: '10px' }}>{line.speaker}:</div>
                                                    <div style={{
                                                        background: idx % 2 === 0 ? '#EBF5FB' : '#FEF9E7',
                                                        padding: '15px 25px', borderRadius: '20px',
                                                        borderBottomLeftRadius: idx % 2 === 0 ? '0' : '20px',
                                                        borderBottomRightRadius: idx % 2 !== 0 ? '0' : '20px',
                                                        flex: 1, position: 'relative'
                                                    }}>
                                                        <div style={{ fontSize: '1.2rem', color: '#2C3E50', lineHeight: '1.6' }}>{renderStyledText(line.text)}</div>
                                                        <div style={{ position: 'absolute', right: '15px', bottom: '10px', opacity: 0.3 }}>🔊</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#8E44AD', marginBottom: '10px' }}>Question {quizIndex + 1} / {gameData.quiz.length}</h2>

                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '40px', lineHeight: '1.4' }}>
                            {gameData.quiz[quizIndex].question}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            {gameData.quiz[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '15px',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        borderRadius: '15px',
                                        border: 'none',
                                        background: feedback && option === gameData.quiz[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== gameData.quiz[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#F4ECF7',
                                        color: feedback ? 'white' : '#8E44AD',
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
                    <h2 style={{ fontSize: '3rem', color: '#8E44AD', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {gameData.quiz.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default PronounsGame;
