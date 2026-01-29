import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function HindiGame({ gameType, onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    // gameType can be: 'varnamala', 'two_letter', 'three_letter'

    useEffect(() => {
        const endpoint = gameType === 'varnamala' ? 'varnamala' :
            gameType === 'hindi-2-letter' ? 'two_letter' : 'three_letter';

        fetch(`http://localhost:8000/api/content/hindi_${endpoint}`)
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load Hindi content", err);
                setLoading(false);
            });
    }, [gameType]);

    const playSound = (text) => {
        // Fallback for English logic, ideally Hindi would need specific audio files or Google TTS for Hindi
        // For now, attempting basic TTS which might support Hindi if installed on OS
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN'; // Attempt Hindi
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        const speechText = item.word ? `${item.letter} से ${item.word}` : item.text;
        playSound(speechText || item.letter || item.text);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>नमस्ते... (Loading...)</div>;

    if (!gameData) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Error Loading Data</h2>
            <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 20px' }}>Go Back</button>
        </div>
    );

    // Check if content is array or object categories
    const content = gameData.content;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FEF9E7',
            padding: '20px'
        }}>

            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ Back</button>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#D35400' }}>
                    {gameData.title}
                </div>
                <div style={{ width: '80px' }}></div>
            </div>

            {/* Grid Display */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                width: '100%',
                maxWidth: '1000px',
                paddingBottom: '40px'
            }}>
                {Array.isArray(content) ? content.map((item, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, backgroundColor: '#FFF' }}
                        onClick={() => handleItemClick(item)}
                        style={{
                            background: 'white',
                            border: '3px solid #F39C12',
                            borderRadius: '20px',
                            padding: '20px',
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ fontSize: '4rem', fontWeight: 'bold', color: '#E67E22', lineHeight: 1 }}>{item.letter || item.word || item.text}</span>
                        {item.word && <span style={{ fontSize: '1.5rem', marginTop: '10px', color: '#555' }}>{item.word}</span>}
                        {item.icon && <span style={{ fontSize: '2rem', marginTop: '5px' }}>{item.icon}</span>}
                    </motion.button>
                )) : (
                    // If content is categorized (e.g. Swar / Vyanjan), flatten or show sections
                    // Simplification: We'll assume the backend sends a flat list for now or we just map specific keys
                    Object.keys(content).flatMap(key => content[key]).map((item, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, backgroundColor: '#FFF' }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: 'white',
                                border: '3px solid #2ECC71',
                                borderRadius: '20px',
                                padding: '20px',
                                aspectRatio: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
                                cursor: 'pointer'
                            }}
                        >
                            <span style={{ fontSize: '4rem', fontWeight: 'bold', color: '#27AE60', lineHeight: 1 }}>{item.letter}</span>
                            <span style={{ fontSize: '1.5rem', marginTop: '10px', color: '#555' }}>{item.word}</span>
                            <span style={{ fontSize: '2rem', marginTop: '5px' }}>{item.icon}</span>
                        </motion.button>
                    ))
                )}
            </div>

            {/* Modal for detail view */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 100,
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            style={{
                                background: 'white',
                                padding: '50px',
                                borderRadius: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px',
                                border: '8px solid #E67E22',
                                minWidth: '350px'
                            }}
                        >
                            <span style={{ fontSize: '10rem', fontWeight: 'bold', color: '#D35400' }}>
                                {selectedItem.letter || selectedItem.text}
                            </span>
                            {selectedItem.word &&
                                <span style={{ fontSize: '4rem', color: '#2C3E50' }}>{selectedItem.word}</span>
                            }
                            <span style={{ fontSize: '6rem' }}>{selectedItem.icon}</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default HindiGame;
