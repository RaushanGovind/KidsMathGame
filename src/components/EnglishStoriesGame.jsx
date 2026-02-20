import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

function EnglishStoriesGame({ onBack }) {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        fetch(`${API_URL}/api/content/english_stories`)
            .then(res => res.json())
            .then(data => {
                if (data && data.content) {
                    setStories(data.content);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load english stories", err);
                setLoading(false);
            });
    }, []);

    const handleSpeak = (text) => {
        // Clear any ongoing speech
        window.speechSynthesis?.cancel();
        speak(text, 'en-IN');
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F0F9FF' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ fontSize: '4rem' }}
            >
                📖
            </motion.div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0284C7', marginTop: '20px' }}>Loading Stories...</div>
        </div>
    );

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh', background: '#F0F9FF', padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <button onClick={handleBack} style={{ padding: '12px 24px', background: 'white', color: '#0369A1', fontWeight: '1000', borderRadius: '15px', border: '2px solid #E0F2FE', boxShadow: '0 4px 0 #BAE6FD', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ BACK</button>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#0369A1', margin: 0 }}>
                    {selectedStory ? "Story Time" : "English Stories"}
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
                                    boxShadow: '0 10px 25px rgba(2, 132, 199, 0.1)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    border: '2px solid transparent'
                                }}
                            >
                                <div style={{ fontSize: '3rem', background: '#E0F2FE', width: '75px', height: '75px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {story.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#0C4A6E', fontWeight: '900' }}>{story.title}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#0369A1', fontWeight: '700' }}>Read Story 📚 ➡</span>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="reader"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            width: '100%',
                            maxWidth: '750px',
                            background: 'white',
                            borderRadius: '40px',
                            padding: '40px',
                            boxShadow: '0 30px 60px rgba(2, 132, 199, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '30px',
                            border: '3px solid #E0F2FE'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '6rem', marginBottom: '10px' }}>{selectedStory.icon}</div>
                            <h2 style={{ fontSize: '2.8rem', fontWeight: '1000', color: '#0C4A6E', margin: 0 }}>{selectedStory.title}</h2>
                        </div>

                        <div style={{
                            fontSize: '1.6rem',
                            lineHeight: '1.8',
                            color: '#1E293B',
                            textAlign: 'justify',
                            background: '#F8FAFC',
                            padding: '35px',
                            borderRadius: '25px',
                            border: '2px dashed #CBD5E1',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                        }}>
                            {selectedStory.content}
                        </div>

                        <div style={{
                            background: '#F0FDFA',
                            padding: '25px 35px',
                            borderRadius: '25px',
                            borderLeft: '10px solid #14B8A6',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            boxShadow: '0 5px 15px rgba(20, 184, 166, 0.1)'
                        }}>
                            <span style={{ fontWeight: '1000', color: '#0D9488', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Moral:</span>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0F766E', fontStyle: 'italic' }}>
                                "{selectedStory.moral}"
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSpeak(`${selectedStory.title}. ${selectedStory.content}. The moral is: ${selectedStory.moral}`)}
                                style={{
                                    padding: '18px 45px',
                                    background: '#0284C7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: '1000',
                                    fontSize: '1.4rem',
                                    boxShadow: '0 8px 0 #0369A1',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}
                            >
                                <span style={{ fontSize: '1.8rem' }}>🔊</span> Read Aloud
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EnglishStoriesGame;
