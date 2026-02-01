import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function EncouragementGame({ onBack }) {
    const [gameData, setGameData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || \'http://localhost:8000\';
        fetch(`${API_URL}/api/content/encouragement`)
            .then(res => res.json())
            .then(data => {
                setGameData(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load encouragement content", err);
                setLoading(false);
            });
    }, []);

    const currentItem = gameData[currentIndex];

    useEffect(() => {
        if (mode === 'learn' && currentItem) {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode, gameData]);

    const playLearnSequence = () => {
        if (currentItem) {
            speak(`${currentItem.word}. ${currentItem.context}`);
        }
    };

    const nextItem = () => {
        if (currentIndex < gameData.length - 1) setCurrentIndex(c => c + 1);
        playAppSound('click');
    };

    const prevItem = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
        playAppSound('click');
    };

    const startQuizRound = () => {
        if (!gameData || gameData.length === 0) return;
        const target = gameData[Math.floor(Math.random() * gameData.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = gameData[Math.floor(Math.random() * gameData.length)];
            if (!options.map(o => o.word).includes(random.word)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`When do we say... ${target.word}?`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz' && !loading) startQuizRound();
    }, [mode, loading]);

    const handleQuizOptionClick = (item) => {
        if (item.word === quizTarget.word) {
            playAppSound('correct');
            setFeedback('correct');
            speak(`Yes! ${item.word}`);
            setTimeout(startQuizRound, 2000);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak("Try again!");
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: '4rem' }}>🌟</motion.div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#64748B', marginTop: '20px' }}>Loading Phrases...</div>
        </div>
    );

    if (!gameData || gameData.length === 0) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#64748B' }}>No content found.</div>
            <button onClick={onBack} style={{ marginTop: '20px', padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900' }}>GO BACK</button>
        </div>
    );

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '10px', minHeight: '100vh',
            background: '#F8FAFC'
        }}>
            {/* Premium Header */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '25px',
                marginTop: '15px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={onBack} style={{ padding: '10px 22px', background: 'white', color: '#2C3E50', fontWeight: '1000', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #bdc3c7', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ MENU</button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => { setMode('learn'); playAppSound('click'); }}
                            style={{
                                padding: '10px 22px',
                                background: mode === 'learn' ? '#F59E0B' : 'white',
                                color: mode === 'learn' ? 'white' : '#2C3E50',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === 'learn' ? '0 4px 0 #D97706' : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', fontSize: '1.1rem'
                            }}
                        >LEARN</button>
                        <button
                            onClick={() => { setMode('quiz'); playAppSound('click'); }}
                            style={{
                                padding: '10px 22px',
                                background: mode === 'quiz' ? '#10B981' : 'white',
                                color: mode === 'quiz' ? 'white' : '#2C3E50',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === 'quiz' ? '0 4px 0 #059669' : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', fontSize: '1.1rem'
                            }}
                        >QUIZ</button>
                    </div>
                </div>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '30px 20px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '40px',
                    width: '100%',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(25px)',
                    position: 'relative'
                }}
            >
                {mode === 'learn' ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: '25px', right: '30px', fontSize: '1.2rem', color: '#94A3B8', fontWeight: '1000' }}>
                            {currentIndex + 1} / {gameData.length}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.word}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                            >
                                <div
                                    onClick={playLearnSequence}
                                    style={{
                                        fontSize: '8rem',
                                        marginBottom: '20px',
                                        cursor: 'pointer',
                                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                                    }}
                                >
                                    {currentItem.icon}
                                </div>

                                <motion.div
                                    onClick={playLearnSequence}
                                    style={{
                                        fontSize: '4.5rem',
                                        fontWeight: '1000',
                                        color: '#3B82F6',
                                        marginBottom: '20px',
                                        textAlign: 'center',
                                        lineHeight: 1.1,
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {currentItem.word}
                                </motion.div>

                                <div style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '800',
                                    color: '#64748B',
                                    background: '#F1F5F9',
                                    padding: '20px 35px',
                                    borderRadius: '25px',
                                    textAlign: 'center',
                                    border: '2px dashed #CBD5E1',
                                    lineHeight: 1.4
                                }}>
                                    "{currentItem.context}"
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '40px', width: '100%', justifyContent: 'center' }}>
                            <button
                                onClick={prevItem}
                                disabled={currentIndex === 0}
                                style={{
                                    background: currentIndex === 0 ? '#E2E8F0' : 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    width: '80px', height: '65px',
                                    fontSize: '1.5rem',
                                    cursor: currentIndex === 0 ? 'default' : 'pointer',
                                    boxShadow: currentIndex === 0 ? 'none' : '0 5px 0 #CBD5E1',
                                    transition: 'all 0.2s'
                                }}
                            >⬅</button>
                            <button
                                onClick={nextItem}
                                disabled={currentIndex === gameData.length - 1}
                                style={{
                                    background: currentIndex === gameData.length - 1 ? '#E2E8F0' : '#3B82F6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    width: '80px', height: '65px',
                                    fontSize: '1.5rem',
                                    cursor: currentIndex === gameData.length - 1 ? 'default' : 'pointer',
                                    boxShadow: currentIndex === gameData.length - 1 ? 'none' : '0 5px 0 #1D4ED8',
                                    transition: 'all 0.2s'
                                }}
                            >➡</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => speak(quizTarget?.word)}
                            style={{
                                background: '#3B82F6',
                                border: 'none',
                                borderRadius: '50%',
                                width: '100px', height: '100px',
                                fontSize: '3.5rem',
                                cursor: 'pointer',
                                boxShadow: '0 8px 0 #1D4ED8',
                                marginBottom: '40px',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >🔊</motion.button>

                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '1.4rem', color: '#64748B', fontWeight: '800', margin: 0 }}>FIND THE ICON FOR:</h2>
                            <div style={{ fontSize: '3rem', fontWeight: '1000', color: '#1E293B', textTransform: 'uppercase', marginTop: '5px' }}>
                                "{quizTarget?.word}"
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', width: '100%' }}>
                            {quizOptions.map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuizOptionClick(item)}
                                    style={{
                                        background: 'white',
                                        border: '3px solid #E2E8F0',
                                        borderRadius: '30px',
                                        padding: '25px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        boxShadow: '0 8px 15px rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                        borderBottom: feedback === 'correct' && item.word === quizTarget.word ? '8px solid #10B981' :
                                            feedback === 'incorrect' && item.word !== quizTarget.word ? '8px solid #EF4444' : '8px solid #E2E8F0',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.icon}</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{item.word}</span>
                                </motion.button>
                            ))}
                        </div>

                        <div style={{ height: '60px', marginTop: '30px', display: 'flex', alignItems: 'center' }}>
                            <AnimatePresence mode="wait">
                                {feedback && (
                                    <motion.div
                                        key={feedback}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        style={{
                                            fontSize: '2rem',
                                            fontWeight: '1000',
                                            color: feedback === 'correct' ? '#10B981' : '#EF4444'
                                        }}
                                    >
                                        {feedback === 'correct' ? '🌟 AWESOME!' : '❌ TRY AGAIN!'}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default EncouragementGame;
