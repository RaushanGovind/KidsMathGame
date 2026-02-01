import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function ActionSentencesGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [quizIndex, setQuizIndex] = useState(0);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || \'http://localhost:8000\';
        fetch(`${API_URL}/api/content/action_sentences`)
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load action sentences", err);
                setLoading(false);
            });
    }, []);

    const currentSentence = gameData?.content[currentIndex];

    useEffect(() => {
        if (mode === 'learn' && gameData) {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode, gameData]);

    const playLearnSequence = () => {
        if (!currentSentence) return;
        speak(currentSentence.sentence);
    };

    const nextSentence = () => {
        if (currentIndex < gameData.content.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        if (gameData.quiz && gameData.quiz[quizIndex]) {
            setQuizTarget(gameData.quiz[quizIndex]);
            setFeedback(null);
            setTimeout(() => speak(gameData.quiz[quizIndex].question.replace('___', 'blank')), 500);
        }
    };

    useEffect(() => {
        if (mode === 'quiz' && gameData) startQuizRound();
    }, [mode, gameData, quizIndex]);

    const handleQuizOptionClick = (option) => {
        if (option === quizTarget.answer) {
            playAppSound('correct');
            setFeedback('correct');
            setScore(s => s + 1);
            speak(`Correct! ${quizTarget.question.replace('___', option)}`);
            setTimeout(() => {
                if (quizIndex < gameData.quiz.length - 1) {
                    setQuizIndex(q => q + 1);
                } else {
                    setMode('learn'); // Or show results
                }
            }, 2000);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak("Try again!");
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Action Sentences...</div>;

    if (!gameData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data.</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#E74C3C' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#8E44AD' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
                    <button onClick={prevSentence} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSentence.sentence}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={playLearnSequence}
                            style={{
                                background: 'white', padding: '40px', borderRadius: '40px',
                                boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                border: '6px solid #E74C3C', position: 'relative', cursor: 'pointer'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {gameData.content.length}</div>

                            <div style={{ fontSize: '3rem', color: '#E74C3C', marginBottom: '10px', fontWeight: 'bold' }}>ACTION TIME! ⚡</div>

                            <div style={{ fontSize: '4rem', fontWeight: '1000', color: '#2C3E50', textAlign: 'center', marginBottom: '20px' }}>
                                {currentSentence.sentence}
                            </div>

                            <div style={{ fontSize: '10rem', marginBottom: '10px' }}>{currentSentence.icon}</div>

                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#C0392B', background: '#FFEBEE', padding: '15px 40px', borderRadius: '30px', textAlign: 'center' }}>
                                {currentSentence.action}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button onClick={nextSentence} disabled={currentIndex === gameData.content.length - 1} style={{ background: currentIndex === gameData.content.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === gameData.content.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {quizTarget && (
                        <>
                            <button onClick={() => speak(quizTarget.question.replace('___', 'blank'))} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E74C3C' }}>{quizTarget.question}</h2>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {quizTarget.options.map((option, idx) => (
                                    <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(option)} style={{ background: 'white', border: '4px solid #F1C40F', borderRadius: '20px', padding: '20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #F39C12', cursor: 'pointer', minWidth: '200px' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50' }}>{option}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ActionSentencesGame;
