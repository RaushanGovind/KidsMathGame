import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function TwoLetterWordsGame({ onBack }) {
    const [gameData, setGameData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
    const [currentIndex, setCurrentIndex] = useState(0);

    // Quiz state
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || \'http://localhost:8000\';
        fetch(`${API_URL}/api/content/two_letter_words`)
            .then(res => res.json())
            .then(data => {
                setGameData(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load two letter words", err);
                setLoading(false);
            });
    }, []);

    const currentWord = gameData[currentIndex];

    useEffect(() => {
        if (mode === 'learn' && gameData.length > 0) {
            // Auto-speak when word changes
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode, gameData]);

    const playLearnSequence = () => {
        if (!currentWord) return;
        // "A... T... AT!"
        speak(`${currentWord.p1}...... ${currentWord.p2}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < gameData.length - 1) {
            setCurrentIndex(c => c + 1);
        }
    };

    const prevWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(c => c - 1);
        }
    };

    // --- Quiz Logic ---
    const startQuizRound = () => {
        if (gameData.length === 0) return;
        const targetIndex = Math.floor(Math.random() * gameData.length);
        const target = gameData[targetIndex];
        setQuizTarget(target);
        setFeedback(null);

        // Generate options
        const options = [target];
        while (options.length < 3) {
            const random = gameData[Math.floor(Math.random() * gameData.length)];
            if (!options.some(o => o.word === random.word)) options.push(random);
        }
        // Shuffle
        setQuizOptions(options.sort(() => Math.random() - 0.5));

        setTimeout(() => speak(`Find the word... ${target.word}`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz' && gameData.length > 0) {
            startQuizRound();
        }
    }, [mode, gameData]);

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

    if (gameData.length === 0) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data.</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
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

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#009688' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E91E63' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>

                    {/* Prev Button */}
                    <button
                        onClick={prevWord}
                        disabled={currentIndex === 0}
                        style={{
                            background: currentIndex === 0 ? '#ccc' : 'white',
                            border: 'none', borderRadius: '50%', width: '60px', height: '60px',
                            fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                        }}
                    >
                        ⬅
                    </button>

                    {/* Main Focus Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentWord.word}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            onClick={playLearnSequence}
                            style={{
                                background: 'white',
                                padding: '40px',
                                borderRadius: '40px',
                                boxShadow: '0 20px 0 rgba(0,0,0,0.1)',
                                width: '100%',
                                maxWidth: '500px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: '6px solid #009688',
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>
                                {currentIndex + 1} / {gameData.length}
                            </div>

                            {/* Phonics Breakdown */}
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 20px', borderRadius: '15px' }}>
                                    {currentWord.p1}
                                </div>
                                <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 20px', borderRadius: '15px' }}>
                                    {currentWord.p2}
                                </div>
                            </div>

                            {/* Arrow Down */}
                            <div style={{ fontSize: '3rem', color: '#009688', marginBottom: '10px' }}>⬇️</div>

                            {/* Full Word */}
                            <div style={{ fontSize: '6rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>
                                {currentWord.word}
                            </div>

                            {/* Icon/Diagram */}
                            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
                                {currentWord.icon}
                            </div>

                            {/* Sentence */}
                            <div style={{
                                fontSize: '1.5rem', fontWeight: '700', color: '#16A085',
                                background: '#E0F2F1', padding: '15px 30px', borderRadius: '20px',
                                textAlign: 'center'
                            }}>
                                "{currentWord.sentence}"
                            </div>

                            <div style={{ marginTop: '20px', fontSize: '1rem', color: '#95A5A6' }}>(Click card to hear again 🔊)</div>

                        </motion.div>
                    </AnimatePresence>

                    {/* Next Button */}
                    <button
                        onClick={nextWord}
                        disabled={currentIndex === gameData.length - 1}
                        style={{
                            background: currentIndex === gameData.length - 1 ? '#ccc' : 'white',
                            border: 'none', borderRadius: '50%', width: '60px', height: '60px',
                            fontSize: '2rem', cursor: currentIndex === gameData.length - 1 ? 'default' : 'pointer',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                        }}
                    >
                        ➡
                    </button>
                </div>
            ) : (
                // Quiz Mode
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {quizTarget && (
                        <>
                            <button onClick={() => speak(quizTarget.word)} style={{
                                background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px',
                                fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px'
                            }}>🔊</button>

                            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#00796B' }}>
                                Which one is "{quizTarget.word}"?
                            </h2>

                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {quizOptions.map((item, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleQuizOptionClick(item)}
                                        style={{
                                            background: 'white',
                                            border: '4px solid #E91E63',
                                            borderRadius: '20px',
                                            padding: '30px 50px',
                                            fontSize: '3rem',
                                            fontWeight: '900',
                                            color: '#2C3E50',
                                            boxShadow: '0 8px 0 #C2185B',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {item.word}
                                    </motion.button>
                                ))}
                            </div>

                            {feedback === 'correct' && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginTop: '30px', fontSize: '2rem', color: '#27AE60', fontWeight: 'bold' }}>
                                    ✅ Awesome!
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default TwoLetterWordsGame;
