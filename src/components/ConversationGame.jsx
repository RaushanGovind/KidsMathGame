import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech';

function ConversationGame({ scenarioId, onBack }) {
    const [scenarios, setScenarios] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);
    const bottomRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/conversation')
            .then(res => res.json())
            .then(data => {
                setScenarios(data.scenarios);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load scenarios", err);
                setLoading(false);
            });
    }, []);

    const scenario = scenarios ? scenarios[scenarioId] : null;

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [step]);

    // Speak when step increments
    useEffect(() => {
        if (scenario && step < scenario.dialogue.length) {
            // Tiny delay for clear UX
            const timeout = setTimeout(() => {
                speak(scenario.dialogue[step].text, 'en-IN');
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [step, scenario]);

    const handleNext = () => {
        if (scenario && step < scenario.dialogue.length - 1) {
            setStep(s => s + 1);
        }
    };

    const handleReplay = (text) => {
        speak(text, 'en-IN');
    };

    const handleRestart = () => {
        setStep(0);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Conversation...</div>;

    if (!scenario) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Scenario not found.</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: scenario.bg,
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <h1 style={{ margin: 0, color: scenario.theme, fontSize: '2rem' }}>{scenario.title}</h1>
                <button onClick={handleRestart} style={{ padding: '10px', background: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>🔄</button>
            </div>

            {/* Chat Area */}
            <div style={{
                flex: 1,
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '30px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                overflowY: 'auto',
                marginBottom: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                {scenario.dialogue.slice(0, step + 1).map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{
                            alignSelf: msg.side === 'right' ? 'flex-end' : 'flex-start',
                            display: 'flex',
                            gap: '10px',
                            flexDirection: msg.side === 'right' ? 'row-reverse' : 'row',
                            maxWidth: '85%',
                            alignItems: 'flex-end'
                        }}
                    >
                        {/* Avatar */}
                        <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{msg.icon}</div>

                        {/* Bubble */}
                        <div
                            onClick={() => handleReplay(msg.text)}
                            style={{
                                background: msg.side === 'right' ? scenario.theme : 'white',
                                color: msg.side === 'right' ? 'white' : '#2C3E50',
                                padding: '15px 25px',
                                borderRadius: msg.side === 'right' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: '0.2s',
                                border: msg.side === 'left' ? '2px solid rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            {msg.text}
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px', textAlign: msg.side === 'right' ? 'right' : 'left' }}>
                                {msg.side === 'right' ? '🔊 Tap to hear' : msg.speaker}
                            </div>
                        </div>
                    </motion.div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Controls */}
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center' }}>
                {step < scenario.dialogue.length - 1 ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        style={{
                            padding: '20px 60px',
                            fontSize: '1.5rem',
                            fontWeight: '900',
                            background: scenario.theme,
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        NEXT ➡️
                    </motion.button>
                ) : (
                    <div style={{
                        padding: '20px',
                        background: '#2ECC71',
                        color: 'white',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 5px 15px rgba(46, 204, 113, 0.4)'
                    }}>
                        Great job! Conversation complete. 🎉
                    </div>
                )}
            </div>

        </div>
    );
}

export default ConversationGame;
