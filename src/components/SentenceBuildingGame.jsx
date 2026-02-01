import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function SentenceBuildingGame({ onBack }) {
    const [sentenceData, setSentenceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState(0);
    const [currentWords, setCurrentWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || \'http://localhost:8000\';
        fetch(`${API_URL}/api/content/sentence_builder`)
            .then(res => res.json())
            .then(data => {
                setSentenceData(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load sentence builder content", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (sentenceData.length > 0) {
            resetLevel();
        }
    }, [level, sentenceData]);

    const resetLevel = () => {
        if (sentenceData.length === 0) return;
        // Shuffle words
        const shuffled = [...sentenceData[level].words].sort(() => Math.random() - 0.5);
        setCurrentWords(shuffled);
        setSelectedWords([]);
        setIsCorrect(false);
        setShowSuccess(false);
    };

    const handleWordClick = (word, index) => {
        playAppSound('pop');
        const newSelected = [...selectedWords, word];
        setSelectedWords(newSelected);

        // Remove from current pool
        const newCurrent = [...currentWords];
        newCurrent.splice(index, 1);
        setCurrentWords(newCurrent);

        // Check if sentence is complete
        if (newCurrent.length === 0) {
            checkSentence(newSelected);
        }
    };

    const handleUndo = () => {
        if (selectedWords.length === 0) return;
        const lastWord = selectedWords[selectedWords.length - 1];
        setSelectedWords(selectedWords.slice(0, -1));
        setCurrentWords([...currentWords, lastWord]);
    };

    const checkSentence = (words) => {
        const formedSentence = words.join(" ");
        const targetSentence = sentenceData[level].correct;

        if (formedSentence === targetSentence) {
            playAppSound('correct');
            setIsCorrect(true);
            setShowSuccess(true);
            speak(formedSentence);
        } else {
            playAppSound('wrong');
            speak("Try again");
        }
    };

    const nextLevel = () => {
        if (level < sentenceData.length - 1) {
            setLevel(l => l + 1);
        } else {
            // Game Over / Restart
            setLevel(0);
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Game...</div>;

    if (!sentenceData || sentenceData.length === 0) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading data.</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FEF9E7', // Light Yellow
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#F39C12', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏗️</span> SENTENCE BUILDER
                </div>
            </div>

            {/* Progress */}
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7F8C8D', marginBottom: '20px' }}>
                Sentence {level + 1} of {sentenceData.length}
            </div>

            {/* Target Image/Icon */}
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
                {sentenceData[level].icon}
            </div>

            {/* Sentence Display Area */}
            <div style={{
                minHeight: '80px', width: '100%', maxWidth: '800px',
                background: 'white', borderRadius: '20px',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '20px', marginBottom: '30px',
                border: '2px dashed #BDC3C7',
                boxShadow: isCorrect ? '0 0 20px #2ECC71' : 'none',
                transition: 'all 0.3s ease'
            }}>
                {selectedWords.map((word, idx) => (
                    <motion.div
                        key={`${word}-${idx}`}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{
                            padding: '10px 20px', background: '#3498DB', color: 'white',
                            borderRadius: '15px', fontSize: '1.5rem', fontWeight: 'bold'
                        }}
                    >
                        {word}
                    </motion.div>
                ))}
                {selectedWords.length === 0 && <span style={{ color: '#BDC3C7', fontSize: '1.2rem' }}>Click words to build the sentence...</span>}
            </div>

            {/* Controls */}
            {selectedWords.length > 0 && !isCorrect && (
                <button onClick={handleUndo} style={{ marginBottom: '30px', padding: '10px 20px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ↩ Undo
                </button>
            )}

            {/* Word Pool */}
            {!isCorrect && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', maxWidth: '800px' }}>
                    {currentWords.map((word, idx) => (
                        <motion.button
                            key={`${word}-${idx}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleWordClick(word, idx)}
                            style={{
                                padding: '15px 30px',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                color: '#2C3E50',
                                background: 'white',
                                border: '2px solid #3498DB',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {word}
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Success Overlay / Next Button */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', marginTop: '30px' }}
                    >
                        <h2 style={{ color: '#2ECC71', fontSize: '2.5rem', marginBottom: '20px' }}>Great Job! 🎉</h2>
                        <button
                            onClick={nextLevel}
                            style={{
                                padding: '15px 40px',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                background: '#F39C12',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 5px 0 #D35400'
                            }}
                        >
                            Next Sentence ➡️
                        </button>
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={resetLevel} style={{ background: 'none', border: 'none', color: '#7F8C8D', cursor: 'pointer', textDecoration: 'underline' }}>Replay</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default SentenceBuildingGame;
