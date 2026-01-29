import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function GlobalChallenge({ onBack }) {
    const [problems, setProblems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('loading'); // loading, playing, finished
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        setGameState('loading');
        try {
            const response = await fetch('/api/problems/addition?count=5&difficulty=2');
            const data = await response.json();
            setProblems(data);
            setGameState('playing');
        } catch (error) {
            console.error('Failed to fetch problems:', error);
            setGameState('error');
        }
    };

    const handleAnswer = async (selectedAnswer) => {
        const currentProblem = problems[currentIndex];
        if (selectedAnswer === currentProblem.answer) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        setTimeout(async () => {
            setFeedback(null);
            if (currentIndex + 1 < problems.length) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameState('finished');
                await submitScore();
            }
        }, 1000);
    };

    const submitScore = async () => {
        try {
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'Player1', // Could be dynamic
                    score: score + (feedback === 'correct' ? 10 : 0),
                    game_type: 'global_addition'
                })
            });
        } catch (error) {
            console.error('Failed to submit score:', error);
        }
    };

    if (gameState === 'loading') return <div className="glass-panel">Loading Challenge...</div>;
    if (gameState === 'error') return <div className="glass-panel">Error connecting to backend!</div>;

    if (gameState === 'finished') {
        return (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem' }}>Challenge Complete!</h2>
                <p style={{ fontSize: '2rem' }}>Your Score: {score}</p>
                <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 30px' }}>Back to Menu</button>
            </div>
        );
    }

    const currentProblem = problems[currentIndex];

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px' }}>

            {/* Header */}
            <div className="glass-panel" style={{
                width: '100%',
                padding: '15px 25px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px'
            }}>
                <button onClick={onBack} style={{
                    padding: '10px 20px',
                    background: '#fff',
                    color: '#2C3E50',
                    fontWeight: '900',
                    border: '2px solid #eee',
                    borderRadius: '12px'
                }}>⬅ MENU</button>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2C3E50' }}>
                    SCORE: <span style={{ color: '#27AE60' }}>{score}</span>
                </div>
                <div style={{ fontWeight: 'bold', color: '#7F8C8D' }}>
                    {currentIndex + 1} / {problems.length}
                </div>
            </div>

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-panel"
                style={{
                    padding: '50px',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '40px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
            >
                <h1 style={{ fontSize: '7rem', marginBottom: '50px', fontWeight: '900', color: '#2C3E50' }}>
                    {currentProblem.question}
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                    {currentProblem.options.map((opt, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(opt)}
                            style={{
                                padding: '30px',
                                fontSize: '3rem',
                                background: '#fff',
                                color: '#2C3E50',
                                fontWeight: '900',
                                borderRadius: '25px',
                                border: '3px solid #eee',
                                boxShadow: '0 8px 0 #ddd, 0 10px 20px rgba(0,0,0,0.05)',
                                cursor: 'pointer'
                            }}
                        >
                            {opt}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {feedback && (
                        <motion.div
                            key={feedback}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                marginTop: '40px',
                                fontSize: '3rem',
                                fontWeight: '900',
                                color: feedback === 'correct' ? '#27AE60' : '#E74C3C'
                            }}
                        >
                            {feedback === 'correct' ? '🌟 AWESOME!' : '❌ OOPS!'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default GlobalChallenge;
