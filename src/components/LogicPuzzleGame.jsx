import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function LogicPuzzleGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/logic_puzzles')
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                // Set first category as active by default
                if (data.categories && Object.keys(data.categories).length > 0) {
                    setActiveCategory(Object.keys(data.categories)[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load logic puzzles", err);
                setLoading(false);
            });
    }, []);

    const handleAnswer = (option) => {
        const currentQuestions = gameData.categories[activeCategory].questions;
        const correct = currentQuestions[quizIndex].a;

        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak("That is logical!");
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak("Think again.");
        }

        setTimeout(() => {
            if (quizIndex < currentQuestions.length - 1) {
                setQuizIndex(c => c + 1);
                setFeedback(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const changeCategory = (catKey) => {
        setActiveCategory(catKey);
        setQuizIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
    };

    const resetGame = () => {
        setQuizIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Puzzles...</div>;
    if (!gameData) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Error Loading Data</h2>
            <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 20px' }}>Go Back</button>
        </div>
    );

    const currentCategoryData = gameData.categories[activeCategory];
    const currentQuestions = currentCategoryData.questions;
    const currentQ = currentQuestions[quizIndex];

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#F0F3F4',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🧩</span> LOGIC PUZZLES
                </div>
            </div>

            {/* Category selection */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                {Object.keys(gameData.categories).map(catKey => {
                    const cat = gameData.categories[catKey];
                    const isActive = activeCategory === catKey;
                    return (
                        <button
                            key={catKey}
                            onClick={() => changeCategory(catKey)}
                            style={{
                                padding: '12px 25px',
                                background: isActive ? cat.color : 'white',
                                color: isActive ? 'white' : cat.color,
                                border: 'none',
                                borderRadius: '25px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            <span>{cat.icon}</span> {cat.title}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.div
                        key={quizIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <div style={{
                            background: 'white', padding: '40px', borderRadius: '30px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center',
                            borderTop: `10px solid ${currentCategoryData.color}`
                        }}>
                            <h3 style={{ color: '#BDC3C7', margin: '0 0 20px 0' }}>Puzzle {quizIndex + 1} of {currentQuestions.length}</h3>

                            <div style={{
                                fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '40px',
                                minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {currentQ.q}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                                {currentQ.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAnswer(option)}
                                        disabled={feedback !== null}
                                        style={{
                                            padding: '20px',
                                            fontSize: '1.8rem',
                                            fontWeight: 'bold',
                                            borderRadius: '20px',
                                            border: '3px solid #ECF0F1',
                                            background: feedback && option === currentQ.a ? '#2ECC71' :
                                                feedback && option !== currentQ.a && feedback === 'wrong' ? '#E74C3C' : 'white',
                                            color: feedback && (option === currentQ.a || (option !== currentQ.a && feedback === 'wrong')) ? 'white' : '#2C3E50',
                                            cursor: 'pointer',
                                            boxShadow: '0 5px 0 #BDC3C7'
                                        }}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            background: 'white', padding: '50px', borderRadius: '40px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)', textAlign: 'center', maxWidth: '600px'
                        }}
                    >
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>🧠</div>
                        <h2 style={{ fontSize: '3rem', color: currentCategoryData.color, marginBottom: '20px' }}>Logic Master!</h2>
                        <p style={{ fontSize: '2rem', color: '#34495E', marginBottom: '40px' }}>
                            You solved {score} out of {currentQuestions.length} puzzles!
                        </p>
                        <button
                            onClick={resetGame}
                            style={{
                                padding: '15px 40px',
                                background: currentCategoryData.color,
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            Play Again 🔄
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default LogicPuzzleGame;
