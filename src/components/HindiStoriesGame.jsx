import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';



function HindiStoriesGame({ onBack }) {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/hindi_stories')
            .then(res => res.json())
            .then(data => {
                if (data && data.content) {
                    setStories(data.content);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load stories", err);
                setLoading(false);
            });
    }, []);

    const handleSpeak = (text) => {
        speak(text, 'hi-IN', 0.8);
    };

    const handleStorySelect = (story) => {
        setSelectedStory(story);
        playSound('click');
        handleSpeak(story.title);
    };

    const handleBack = () => {
        if (selectedStory) {
            setSelectedStory(null);
            window.speechSynthesis?.cancel();
        } else {
            onBack();
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FDFCFB' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: '4rem' }}>📖</motion.div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#D35400', marginTop: '20px' }}>कहानियाँ आ रही हैं...</div>
        </div>
    );

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh', background: '#FDFCFB', padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <button onClick={handleBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '1000', borderRadius: '15px', border: '2px solid #F1F5F9', boxShadow: '0 4px 0 #CBD5E1', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ BACK</button>
                <h1 style={{ fontSize: '2rem', fontWeight: '1000', color: '#D35400', margin: 0, fontFamily: 'serif' }}>
                    {selectedStory ? "कहानी (Story)" : "हिंदी कहानियाँ"}
                </h1>
                <div style={{ width: '80px', visibility: 'hidden' }}></div>
            </div>

            <AnimatePresence mode="wait">
                {!selectedStory ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            width: '100%',
                            maxWidth: '1000px',
                            paddingBottom: '40px'
                        }}
                    >
                        {stories.map((story) => (
                            <motion.button
                                key={story.id}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleStorySelect(story)}
                                style={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ fontSize: '3rem', background: '#FEF3C7', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {story.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#1E293B', fontWeight: '900', fontFamily: 'serif' }}>{story.title}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '700' }}>देखें कहानी ➡</span>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="reader"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        style={{
                            width: '100%',
                            maxWidth: '700px',
                            background: 'white',
                            borderRadius: '40px',
                            padding: '40px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '30px',
                            border: '1px solid #F1F5F9'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{selectedStory.icon}</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#1E293B', margin: 0, fontFamily: 'serif' }}>{selectedStory.title}</h2>
                        </div>

                        <div style={{
                            fontSize: '1.6rem',
                            lineHeight: '1.8',
                            color: '#334155',
                            fontFamily: 'serif',
                            textAlign: 'justify',
                            background: '#FFFBEB',
                            padding: '30px',
                            borderRadius: '25px',
                            border: '2px solid #FEF3C7'
                        }}>
                            {selectedStory.content}
                        </div>

                        <div style={{
                            background: '#ECFDF5',
                            padding: '20px 30px',
                            borderRadius: '20px',
                            borderLeft: '10px solid #10B981',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                        }}>
                            <span style={{ fontWeight: '1000', color: '#047857', fontSize: '1.2rem' }}>सीख (Moral):</span>
                            <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#065F46', fontFamily: 'serif' }}>
                                {selectedStory.moral}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
                            <button
                                onClick={() => handleSpeak(`${selectedStory.title}. ${selectedStory.content}. सीख. ${selectedStory.moral}`)}
                                style={{
                                    padding: '15px 40px',
                                    background: '#D35400',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontWeight: '1000',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 6px 0 #A04000',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                🔊 पूरी कहानी सुनें (Listen All)
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default HindiStoriesGame;
