import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = {
    school: {
        title: 'At School',
        theme: '#3498DB',
        bg: '#E3F2FD',
        dialogue: [
            { speaker: 'Teacher', text: 'Good morning, class!', icon: '👩‍🏫', side: 'left' },
            { speaker: 'You', text: 'Good morning, teacher!', icon: '🧒', side: 'right' },
            { speaker: 'Teacher', text: 'How are you today?', icon: '👩‍🏫', side: 'left' },
            { speaker: 'You', text: 'I am happy, thank you!', icon: '🧒', side: 'right' },
            { speaker: 'Teacher', text: 'Great! Let\'s learn math.', icon: '👩‍🏫', side: 'left' },
            { speaker: 'You', text: 'Yes, I like math.', icon: '🧒', side: 'right' },
            { speaker: 'Teacher', text: 'What is 1 + 1?', icon: '👩‍🏫', side: 'left' },
            { speaker: 'You', text: 'It is 2!', icon: '🧒', side: 'right' },
            { speaker: 'Teacher', text: 'Very good job!', icon: '👩‍🏫', side: 'left' }
        ]
    },
    mom: {
        title: 'With Mom',
        theme: '#E91E63',
        bg: '#FCE4EC',
        dialogue: [
            { speaker: 'Mom', text: 'Good morning, sweetie.', icon: '👩', side: 'left' },
            { speaker: 'You', text: 'Good morning, Mom.', icon: '🧒', side: 'right' },
            { speaker: 'Mom', text: 'Are you hungry?', icon: '👩', side: 'left' },
            { speaker: 'You', text: 'Yes, I want breakfast.', icon: '🧒', side: 'right' },
            { speaker: 'Mom', text: 'Here is some milk and toast.', icon: '👩', side: 'left' },
            { speaker: 'You', text: 'Thank you, Mom!', icon: '🧒', side: 'right' },
            { speaker: 'Mom', text: 'Have a good day at school.', icon: '👩', side: 'left' },
            { speaker: 'You', text: 'I love you, Mom.', icon: '🧒', side: 'right' },
            { speaker: 'Mom', text: 'I love you too.', icon: '👩', side: 'left' }
        ]
    },
    sister: {
        title: 'With Sister',
        theme: '#9B59B6',
        bg: '#F3E5F5',
        dialogue: [
            { speaker: 'Sister', text: 'Hi! What are you doing?', icon: '👧', side: 'left' },
            { speaker: 'You', text: 'I am playing with blocks.', icon: '🧒', side: 'right' },
            { speaker: 'Sister', text: 'Can I play too?', icon: '👧', side: 'left' },
            { speaker: 'You', text: 'Yes, come sit here.', icon: '🧒', side: 'right' },
            { speaker: 'Sister', text: 'Let\'s build a castle!', icon: '👧', side: 'left' },
            { speaker: 'You', text: 'That is a great idea.', icon: '🧒', side: 'right' },
            { speaker: 'Sister', text: 'Pass me the blue block.', icon: '👧', side: 'left' },
            { speaker: 'You', text: 'Here you go.', icon: '🧒', side: 'right' },
            { speaker: 'Sister', text: 'This is fun!', icon: '👧', side: 'left' }
        ]
    },
    friend: {
        title: 'With Friend',
        theme: '#F39C12',
        bg: '#FFF3E0',
        dialogue: [
            { speaker: 'Friend', text: 'Hello! What is your name?', icon: '👦', side: 'left' },
            { speaker: 'You', text: 'Hi! My name is Alex.', icon: '🧒', side: 'right' },
            { speaker: 'Friend', text: 'My name is Sam.', icon: '👦', side: 'left' },
            { speaker: 'You', text: 'Nice to meet you, Sam.', icon: '🧒', side: 'right' },
            { speaker: 'Friend', text: 'Do you like soccer?', icon: '👦', side: 'left' },
            { speaker: 'You', text: 'Yes, I like soccer!', icon: '🧒', side: 'right' },
            { speaker: 'Friend', text: 'Let\'s play together.', icon: '👦', side: 'left' },
            { speaker: 'You', text: 'Okay, let\'s go!', icon: '🧒', side: 'right' },
            { speaker: 'Friend', text: 'Kick the ball!', icon: '👦', side: 'left' }
        ]
    }
};

function ConversationGame({ scenarioId, onBack }) {
    const scenario = SCENARIOS[scenarioId];
    const [step, setStep] = useState(0);
    const bottomRef = useRef(null);

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [step]);

    // Speak when step increments
    useEffect(() => {
        if (step < scenario.dialogue.length) {
            // Tiny delay for clear UX
            setTimeout(() => {
                speak(scenario.dialogue[step].text);
            }, 300);
        }
    }, [step, scenario]);

    const handleNext = () => {
        if (step < scenario.dialogue.length - 1) {
            setStep(s => s + 1);
        }
    };

    const handleReplay = (text) => {
        speak(text);
    };

    const handleRestart = () => {
        setStep(0);
    };

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
