import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function MentalMathGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [level, setLevel] = useState(1);
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [category, setCategory] = useState(null); // will set after fetch

    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/mental_math')
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setCategory(Object.keys(data['level_1'])[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load content", err);
                setLoading(false);
            });
    }, []);


    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        if (gameData) {
            const levelKey = `level_${newLevel}`;
            setCategory(Object.keys(gameData[levelKey])[0]);
        }
        setMode('learn');
        resetQuiz();
    };

    const handleQuizAnswer = (option) => {
        const quizzes = gameData.quizzes;
        const currentQuizData = quizzes[String(level)];
        const correct = currentQuizData[quizIndex].answer;
        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak("Correct!");
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak("Try again.");
        }

        setTimeout(() => {
            if (quizIndex < currentQuizData.length - 1) {
                setQuizIndex(c => c + 1);
                setFeedback(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setQuizIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
        setMode('learn');
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading...</div>;
    if (!gameData) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Error Loading Data</h2>
            <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 20px' }}>Go Back</button>
        </div>
    );

    const currentDataVals = gameData[`level_${level}`];
    // Safety check if category is not in current level
    const activeCategory = (currentDataVals && currentDataVals[category]) ? category : (currentDataVals ? Object.keys(currentDataVals)[0] : null);

    if (!activeCategory) return null;

    const currentData = currentDataVals[activeCategory];
    const currentQuizData = gameData.quizzes[String(level)];

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#F4F6F7',
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>⚡</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3].map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => handleLevelChange(lvl)}
                                style={{
                                    padding: '8px 16px', borderRadius: '15px', border: 'none',
                                    background: level === lvl ? (lvl === 1 ? '#F1C40F' : lvl === 2 ? '#E67E22' : '#9B59B6') : '#BDC3C7',
                                    color: 'white', fontWeight: 'bold', cursor: 'pointer'
                                }}>
                                Lvl {lvl}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#3498DB' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 🧠</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#2ECC71' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                        {Object.keys(currentDataVals).map(key => (
                            <button
                                key={key}
                                onClick={() => setCategory(key)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === key ? currentDataVals[key].color : 'white',
                                    color: activeCategory === key ? 'white' : currentDataVals[key].color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {currentDataVals[key].title}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        <h2 style={{ textAlign: 'center', color: currentData.color, fontSize: '2rem', margin: 0 }}>{currentData.title}</h2>
                        {currentData.description && <p style={{ textAlign: 'center', color: '#7F8C8D', fontSize: '1.2rem' }}>{currentData.description}</p>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {currentData.type === 'html' ? (
                                currentData.content.map((item, idx) => (
                                    <div key={idx} style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                        <h3 style={{ color: currentData.color, marginTop: 0 }}>{item.title}</h3>
                                        <p style={{ fontSize: '1.2rem', color: '#2C3E50', whiteSpace: 'pre-line' }}>{item.text}</p>
                                    </div>
                                ))
                            ) : (
                                currentData.items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => speak(`${item.q.replace('×', 'times').replace('÷', 'divided by')} equals ${item.a}`)}
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            background: 'white', padding: '20px 40px', borderRadius: '20px',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'pointer',
                                            borderLeft: `10px solid ${currentData.color}`
                                        }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50' }}>{item.q}</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: currentData.color }}>{item.a}</div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#E74C3C', marginBottom: '10px' }}>Question {quizIndex + 1} / {currentQuizData.length}</h2>

                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#2C3E50', marginBottom: '40px' }}>
                            {currentQuizData[quizIndex].question}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            {currentQuizData[quizIndex].options.map((option, idx) => (
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
                                        borderRadius: '15px',
                                        border: 'none',
                                        background: feedback && option === currentQuizData[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== currentQuizData[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#FDF2E9',
                                        color: feedback ? 'white' : '#2C3E50',
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
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🏆</div>
                    <h2 style={{ fontSize: '3rem', color: '#F1C40F', marginBottom: '20px' }}>Math Wizard!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {currentQuizData.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#3498DB', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #2980B9' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default MentalMathGame;
