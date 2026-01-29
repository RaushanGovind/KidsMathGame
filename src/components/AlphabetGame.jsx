import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech';

function AlphabetGame({ onBack }) {
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [alphabetData, setAlphabetData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/alphabet')
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
        speak(`${item.letter} is for ${item.word}`, 'en-US', 1.0);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading...</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
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
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#C0392B', textShadow: '2px 2px 0px rgba(255,255,255,0.5)' }}>
                    ABC LEARNING
                </div>
                <div style={{ width: '80px' }}></div> {/* Spacer */}
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
                                speak(`${selectedLetter.letter} is for ${selectedLetter.word}`, 'en-US', 1.0);
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
