import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech';

function MorningRoutineGame({ onBack }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(0);
    const [mode, setMode] = useState('steps'); // 'steps' | 'story' | 'practice' | 'dialogue'
    const [storyIndex, setStoryIndex] = useState(0);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        fetch(`${API_URL}/api/content/morning_routine`)
            .then(res => res.json())
            .then(data => {
                setGameData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load morning routine content", err);
                setLoading(false);
            });
    }, []);

    const nextStory = () => {
        if (gameData && storyIndex < gameData.stories.length - 1) setStoryIndex(i => i + 1);
    };

    const prevStory = () => {
        if (storyIndex > 0) setStoryIndex(i => i - 1);
    };

    const nextDialogue = () => {
        if (gameData && dialogueIndex < gameData.dialogues.length - 1) setDialogueIndex(i => i + 1);
    };

    const prevDialogue = () => {
        if (dialogueIndex > 0) setDialogueIndex(i => i - 1);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Morning Routine...</div>;

    if (!gameData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No content found.</div>;

    const { sections, stories, dialogues, practice_lines } = gameData;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FEF9E7',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#F39C12', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🌅</span> MORNING ROUTINE
                </div>
            </div>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => setMode('steps')} style={{ padding: '12px 25px', background: mode === 'steps' ? '#F39C12' : 'white', color: mode === 'steps' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Steps 👣</button>
                <button onClick={() => setMode('practice')} style={{ padding: '12px 25px', background: mode === 'practice' ? '#2ECC71' : 'white', color: mode === 'practice' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🗣️</button>
                <button onClick={() => setMode('story')} style={{ padding: '12px 25px', background: mode === 'story' ? '#E67E22' : 'white', color: mode === 'story' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Stories 📖</button>
                <button onClick={() => setMode('dialogue')} style={{ padding: '12px 25px', background: mode === 'dialogue' ? '#3498DB' : 'white', color: mode === 'dialogue' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Dialogues 💬</button>
            </div>


            {mode === 'steps' && sections && (
                <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Navigation Sidebar/Top Bar */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px', width: '100%', paddingBottom: '20px', justifyContent: 'center' }}>
                        {sections.map((section, idx) => (
                            <motion.button
                                key={section.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveSection(idx)}
                                style={{
                                    padding: '15px 20px',
                                    borderRadius: '15px',
                                    border: 'none',
                                    background: activeSection === idx ? '#F39C12' : 'white',
                                    color: activeSection === idx ? 'white' : '#7F8C8D',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '5px',
                                    minWidth: '100px',
                                    boxShadow: activeSection === idx ? '0 8px 15px rgba(243, 156, 18, 0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ fontSize: '2rem' }}>{section.icon}</span>
                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{section.title}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: 'white',
                            borderRadius: '30px',
                            padding: '40px',
                            width: '100%',
                            maxWidth: '800px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            border: '4px solid #FAD7A0'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '2.5rem', color: '#E67E22', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                {sections[activeSection].icon} {sections[activeSection].title}
                            </h2>
                            <p style={{ color: '#95A5A6', fontSize: '1.2rem', marginTop: '10px' }}>Tap a phrase to hear it!</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {sections[activeSection].phrases.map((phrase, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => speak(phrase)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '20px 30px',
                                        fontSize: '1.4rem',
                                        color: '#2C3E50',
                                        background: '#FEF5E7',
                                        border: 'none',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 4px 0 rgba(0,0,0,0.05)',
                                        fontWeight: '600'
                                    }}
                                >
                                    {phrase}
                                    <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🔊</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {mode === 'practice' && practice_lines && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Simple Lines */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.8rem', color: '#27AE60', marginBottom: '20px', borderBottom: '2px solid #EAFAF1', paddingBottom: '10px' }}>🌅 Read Aloud</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                            {practice_lines.simple.map((line, i) => (
                                <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => speak(line)}
                                    style={{ padding: '15px', borderRadius: '15px', border: '2px solid #EAFAF1', background: 'white', color: '#2C3E50', fontSize: '1.1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {line} <span style={{ opacity: 0.3 }}>🔊</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Longer Lines */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.8rem', color: '#2980B9', marginBottom: '20px', borderBottom: '2px solid #EBF5FB', paddingBottom: '10px' }}>🎯 Longer Sentences</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {practice_lines.longer.map((line, i) => (
                                <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => speak(line)}
                                    style={{ padding: '20px', borderRadius: '15px', border: 'left', borderLeft: '5px solid #2980B9', background: '#F4F6F7', color: '#2C3E50', fontSize: '1.2rem', textAlign: 'left', cursor: 'pointer' }}>
                                    {line}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Expressions */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.8rem', color: '#8E44AD', marginBottom: '20px', borderBottom: '2px solid #F4ECF7', paddingBottom: '10px' }}>🗣️ Say with Feeling!</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            {practice_lines.expressive.map((item, i) => (
                                <motion.button key={i} whileHover={{ scale: 1.1, rotate: [-1, 1, -1, 1, 0] }} whileTap={{ scale: 0.9 }} onClick={() => speak(item.text)}
                                    style={{ padding: '20px 30px', borderRadius: '50px', border: 'none', background: '#9B59B6', color: 'white', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 0 #71368A' }}>
                                    {item.icon} {item.text}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {mode === 'story' && stories && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <motion.div
                        key={storyIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%' }}
                    >
                        <h2 style={{ fontSize: '2.5rem', color: '#D35400', textAlign: 'center', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            {stories[storyIndex].icon} {stories[storyIndex].title}
                        </h2>

                        <div style={{ fontSize: '1.4rem', color: '#95A5A6', textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' }}>
                            Story {storyIndex + 1} of {stories.length}
                        </div>

                        <p style={{ fontSize: '1.6rem', lineHeight: '1.8', color: '#2C3E50', textAlign: 'justify', marginBottom: '30px' }}>
                            {stories[storyIndex].text}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={() => speak(stories[storyIndex].text)}
                                style={{
                                    padding: '15px 40px',
                                    background: '#E67E22',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 5px 15px rgba(230, 126, 34, 0.4)'
                                }}
                            >
                                🔊 Read Aloud
                            </button>
                        </div>
                    </motion.div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                        <button onClick={prevStory} disabled={storyIndex === 0} style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: storyIndex === 0 ? '#E5E7E9' : '#F39C12', color: storyIndex === 0 ? '#BDC3C7' : 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: storyIndex === 0 ? 'default' : 'pointer' }}>⬅ Prev</button>
                        <button onClick={nextStory} disabled={storyIndex === stories.length - 1} style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: storyIndex === stories.length - 1 ? '#E5E7E9' : '#F39C12', color: storyIndex === stories.length - 1 ? '#BDC3C7' : 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: storyIndex === stories.length - 1 ? 'default' : 'pointer' }}>Next ➡</button>
                    </div>

                </div>
            )}

            {mode === 'dialogue' && dialogues && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <motion.div
                        key={dialogueIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%' }}
                    >
                        <h2 style={{ fontSize: '2.5rem', color: '#2980B9', textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            {dialogues[dialogueIndex].icon} {dialogues[dialogueIndex].title}
                        </h2>

                        <div style={{ fontSize: '1.2rem', color: '#95A5A6', textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' }}>
                            Dialogue {dialogueIndex + 1} of {dialogues.length}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {dialogues[dialogueIndex].lines.map((line, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => speak(line.text)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: line.speaker === 'Child' ? 'flex-end' : 'flex-start',
                                        background: 'transparent',
                                        border: 'none',
                                        width: '100%',
                                        padding: 0,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{
                                        background: line.speaker === 'Child' ? '#D6EAF8' : '#EAEDED',
                                        color: '#2C3E50',
                                        padding: '15px 25px',
                                        borderRadius: line.speaker === 'Child' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                        fontSize: '1.3rem',
                                        fontWeight: '500',
                                        maxWidth: '80%',
                                        textAlign: 'left',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        borderLeft: line.speaker !== 'Child' ? '5px solid #2980B9' : 'none',
                                        borderRight: line.speaker === 'Child' ? '5px solid #3498DB' : 'none',
                                    }}>
                                        <div style={{ fontSize: '0.9rem', color: '#7F8C8D', marginBottom: '5px', fontWeight: 'bold' }}>{line.speaker}</div>
                                        {line.text} <span style={{ opacity: 0.4, fontSize: '1rem', marginLeft: '5px' }}>🔊</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                        <button onClick={prevDialogue} disabled={dialogueIndex === 0} style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: dialogueIndex === 0 ? '#E5E7E9' : '#3498DB', color: dialogueIndex === 0 ? '#BDC3C7' : 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: dialogueIndex === 0 ? 'default' : 'pointer' }}>⬅ Prev</button>
                        <button onClick={nextDialogue} disabled={dialogueIndex === dialogues.length - 1} style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: dialogueIndex === dialogues.length - 1 ? '#E5E7E9' : '#3498DB', color: dialogueIndex === dialogues.length - 1 ? '#BDC3C7' : 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: dialogueIndex === dialogues.length - 1 ? 'default' : 'pointer' }}>Next ➡</button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default MorningRoutineGame;
