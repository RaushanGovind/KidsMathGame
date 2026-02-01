import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

function HindiGame({ gameType, onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // gameType can be: 'varnamala', 'hindi-2-letter', 'hindi-3-letter'

    useEffect(() => {
        const endpoint = gameType === 'varnamala' ? 'varnamala' :
            gameType === 'hindi-2-letter' ? 'two_letter' : 'three_letter';

        fetch(`http://localhost:8000/api/content/hindi_${endpoint}`)
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
                setCurrentIndex(0);
            })
            .catch(err => {
                console.error("Failed to load Hindi content", err);
                setLoading(false);
            });
    }, [gameType]);

    // Flatten content into a single array for sequential navigation
    const items = useMemo(() => {
        if (!gameData || !gameData.content) return [];
        const content = gameData.content;
        if (Array.isArray(content)) return content;
        return [...(content.swar || []), ...(content.vyanjan || [])];
    }, [gameData]);

    const currentItem = items[currentIndex];

    const handleSpeak = async (item) => {
        // Clear any lingering speech
        window.speechSynthesis?.cancel();

        // 1. Speak Hindi (Natural pause at end)
        const hindiText = item.text || item.letter;
        if (hindiText) {
            await speak(`${hindiText}.`, 'hi-IN', 0.65);
        }

        // Major pause between Hindi and English
        await new Promise(r => setTimeout(r, 800));

        // 2. Speak English (Indian Accent)
        if (item.word) {
            const cleanWord = item.word.replace(/[()]/g, '');
            await speak(`${cleanWord}.`, 'en-IN', 0.65);
        }
    };

    const nextItem = () => {
        if (currentIndex < items.length - 1) {
            window.speechSynthesis?.cancel(); // Stop talking immediately on click
            setCurrentIndex(prev => prev + 1);
            playSound('click');
        }
    };

    const prevItem = () => {
        if (currentIndex > 0) {
            window.speechSynthesis?.cancel(); // Stop talking immediately on click
            setCurrentIndex(prev => prev - 1);
            playSound('click');
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: '4rem' }}>🕉️</motion.div>
            <div className="hindi-text" style={{ fontSize: '1.8rem', fontWeight: '900', color: '#D35400', marginTop: '20px' }}>नमस्ते... Loading Content...</div>
        </div>
    );

    if (!gameData || items.length === 0) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#64748B' }}>Error Loading Data</h2>
            <button onClick={onBack} style={{ marginTop: '20px', padding: '12px 24px', background: '#D35400', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900' }}>GO BACK</button>
        </div>
    );

    const isVarnamala = gameType === 'varnamala';

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FDFCFB',
            padding: '20px',
            overflowX: 'hidden'
        }}>

            {/* Premium Header */}
            <div style={{
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '40px',
                alignItems: 'center'
            }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '1000', borderRadius: '15px', border: '2px solid #F1F5F9', boxShadow: '0 4px 0 #CBD5E1', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ BACK</button>

                <h1 className="hindi-text" style={{
                    fontSize: '2rem',
                    fontWeight: '1000',
                    color: '#D35400',
                    margin: 0,
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
                    {gameData.title}
                </h1>

                <div style={{ width: '80px', visibility: 'hidden' }}></div>
            </div>

            {/* Single Card Display */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        style={{
                            width: '100%',
                            background: 'white',
                            border: `8px solid ${isVarnamala ? '#27AE60' : '#E67E22'}`,
                            borderRadius: '50px',
                            padding: '60px 40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 30px 60px rgba(0,0,0,0.1), 0 10px 0 ${isVarnamala ? '#1E8449' : '#D35400'}`,
                            position: 'relative'
                        }}
                    >
                        {/* Word Display */}
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                            <span className="hindi-text" style={{
                                fontSize: 'clamp(5rem, 15vw, 10rem)',
                                fontWeight: '1000',
                                color: isVarnamala ? '#2E7D32' : '#D35400',
                                lineHeight: 1.1,
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                                wordBreak: 'break-word'
                            }}>
                                {currentItem.text || currentItem.letter}
                            </span>

                            {/* English Word/Translation (Visual Only) */}
                            {currentItem.word && (
                                <span style={{
                                    fontSize: (currentItem.word.length > 8) ? '2rem' : '3.5rem',
                                    fontWeight: '900',
                                    color: '#475569',
                                    background: '#F1F5F9',
                                    padding: '10px 30px',
                                    borderRadius: '20px',
                                    marginTop: '10px',
                                    maxWidth: '90%',
                                    textAlign: 'center',
                                    wordBreak: 'break-word'
                                }}>
                                    {currentItem.word.replace(/[()]/g, '')}
                                </span>
                            )}

                            {/* Icon */}
                            {currentItem.icon && (
                                <span style={{
                                    fontSize: 'clamp(4rem, 12vw, 8rem)',
                                    marginTop: '20px',
                                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))'
                                }}>
                                    {currentItem.icon}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => handleSpeak(currentItem)}
                            style={{
                                marginTop: '40px',
                                padding: '15px 40px',
                                background: isVarnamala ? '#27AE60' : '#E67E22',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                fontWeight: '1000',
                                fontSize: '1.4rem',
                                boxShadow: `0 8px 0 ${isVarnamala ? '#1E8449' : '#C2410C'}`,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            🔊 LISTEN
                        </button>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div style={{
                    display: 'flex',
                    gap: '30px',
                    width: '100%',
                    justifyContent: 'center',
                    padding: '20px 0 60px 0'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={currentIndex === 0}
                        onClick={prevItem}
                        style={{
                            padding: '20px 40px',
                            background: currentIndex === 0 ? '#E2E8F0' : '#334155',
                            color: 'white',
                            borderRadius: '25px',
                            border: 'none',
                            fontSize: '1.5rem',
                            fontWeight: '1000',
                            cursor: currentIndex === 0 ? 'default' : 'pointer',
                            boxShadow: currentIndex === 0 ? 'none' : '0 10px 0 #1E293B',
                            opacity: currentIndex === 0 ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        PREV
                    </motion.button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        padding: '10px 30px',
                        borderRadius: '25px',
                        border: '3px solid #F1F5F9',
                        fontWeight: '1000',
                        fontSize: '1.2rem',
                        color: '#64748B'
                    }}>
                        {currentIndex + 1} / {items.length}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={currentIndex === items.length - 1}
                        onClick={nextItem}
                        style={{
                            padding: '20px 40px',
                            background: currentIndex === items.length - 1 ? '#E2E8F0' : '#334155',
                            color: 'white',
                            borderRadius: '25px',
                            border: 'none',
                            fontSize: '1.5rem',
                            fontWeight: '1000',
                            cursor: currentIndex === items.length - 1 ? 'default' : 'pointer',
                            boxShadow: currentIndex === items.length - 1 ? 'none' : '0 10px 0 #1E293B',
                            opacity: currentIndex === items.length - 1 ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        NEXT
                    </motion.button>
                </div>
            </div>

        </div>
    );
}

export default HindiGame;
