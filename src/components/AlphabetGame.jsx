import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { speak } from '../utils/speech';

function AlphabetGame({ onBack }) {
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [alphabetData, setAlphabetData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        fetch(`${API_URL}/api/content/alphabet`)
            .then(res => res.json())
            .then(data => {
                setAlphabetData(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load alphabet", err);
                setLoading(false);
            });
    }, []);

    const handleLetterClick = (item) => {
        setSelectedLetter(item);
        speak(`${item.letter} is for ${item.word}`, 'en-IN');
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading...</div>;

    return (
        <div className="game-container mobile-padding-md" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)'
        }}>

            {/* Header */}
            <div
                className="mobile-header-stack"
                style={{
                    width: '100%',
                    maxWidth: '1200px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '30px',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="back-btn"
                    onClick={onBack}
                    style={{
                        padding: '10px 20px',
                        background: 'white',
                        color: '#9F1239',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid #FFE4E6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    <ChevronLeft size={18} /> Menu
                </motion.button>

                <div className="title-container" style={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    left: 0
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            color: '#E11D48',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            marginBottom: '2px'
                        }}>
                            Alphabet Zone
                        </span>
                        <h1
                            className="mobile-text-lg"
                            style={{
                                margin: 0,
                                fontSize: '1.8rem',
                                color: '#881337',
                                fontWeight: '900',
                                lineHeight: 1
                            }}
                        >
                            LEARN ABC
                        </h1>
                    </div>
                </div>
                <div style={{ width: '100px' }} className="mobile-hide"></div>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '20px',
                width: '100%',
                maxWidth: '1000px',
                paddingBottom: '40px'
            }}>
                {alphabetData.map((item, index) => (
                    <motion.button
                        key={item.letter}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0], backgroundColor: '#FFF' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLetterClick(item)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '20px',
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <span style={{ fontSize: '4rem', fontWeight: '900', color: '#E74C3C', lineHeight: 1 }}>{item.letter}</span>
                        <span style={{ fontSize: '2rem', marginTop: '5px' }}>{item.icon}</span>
                    </motion.button>
                ))}
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {selectedLetter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedLetter(null)}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 100,
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.5, rotate: 10 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                speak(`${selectedLetter.letter} is for ${selectedLetter.word}`, 'en-IN', 1.0);
                            }}
                            style={{
                                background: 'white',
                                padding: '60px',
                                borderRadius: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                minWidth: '350px',
                                border: '8px solid #E74C3C',
                                cursor: 'pointer'
                            }}
                        >
                            <span style={{ fontSize: '10rem', fontWeight: '900', color: '#E74C3C', lineHeight: 1 }}>
                                {selectedLetter.letter}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '6rem' }}>{selectedLetter.icon}</span>
                                <span style={{ fontSize: '3rem', fontWeight: '900', color: '#2C3E50', marginTop: '10px' }}>
                                    {selectedLetter.word}
                                </span>
                            </div>
                            <div style={{ marginTop: '20px', color: '#95A5A6', fontWeight: 'bold' }}>
                                (Click to hear again 🔊)
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default AlphabetGame;
