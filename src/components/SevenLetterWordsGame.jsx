import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function SevenLetterWordsGame({ onBack }) {
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const [gameData, setGameData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        fetch(`${API_URL}/api/content/seven_letter_words`)
            .then(res => res.json())
            .then(data => {
                setGameData(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load words", err);
                setLoading(false);
            });
    }, []);

    const currentWord = gameData[currentIndex];

    useEffect(() => {
        if (mode === 'learn' && currentWord) {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode, gameData]);

    const playLearnSequence = () => {
        if (currentWord) {
            speak(`${currentWord.p1}... ${currentWord.p2}... ${currentWord.p3}... ${currentWord.p4}... ${currentWord.p5}... ${currentWord.p6}... ${currentWord.p7}...... ${currentWord.word}. ${currentWord.sentence}`);
        }
    };

    const nextWord = () => {
        if (currentIndex < gameData.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevWord = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        if (!gameData || gameData.length === 0) return;
        const target = gameData[Math.floor(Math.random() * gameData.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = gameData[Math.floor(Math.random() * gameData.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Find the word... ${target.word}`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz' && !loading) startQuizRound();
    }, [mode, loading]);

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

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Words...</div>;

    if (!gameData || gameData.length === 0) return <div>No data found</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#8E44AD' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E91E63' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1200px', justifyContent: 'center' }}>
                    <button onClick={prevWord} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentWord.word}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '1000px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #8E44AD', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {gameData.length}</div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[currentWord.p1, currentWord.p2, currentWord.p3, currentWord.p4, currentWord.p5, currentWord.p6, currentWord.p7].map((char, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#8E44AD', border: '3px dashed #8E44AD', padding: '10px 12px', borderRadius: '15px' }}>{char}</div>
                                    {i < 6 && <div style={{ fontSize: '1.5rem', color: '#95A5A6', marginLeft: '3px' }}>+</div>}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: '3rem', color: '#8E44AD', marginBottom: '10px' }}>⬇️</div>
                        <div style={{ fontSize: '4.5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>{currentWord.word}</div>
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>{currentWord.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6C3483', background: '#F3E5F5', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>"{currentWord.sentence}"</div>
                    </motion.div>

                    <button onClick={nextWord} disabled={currentIndex === gameData.length - 1} style={{ background: currentIndex === gameData.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === gameData.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(currentWord?.word || quizTarget?.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#8E44AD' }}>Which one is "{quizTarget?.word}"?</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #E91E63', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #C2185B', cursor: 'pointer' }}>
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

export default SevenLetterWordsGame;
