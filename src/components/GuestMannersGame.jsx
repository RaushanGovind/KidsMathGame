import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GUEST_SECTIONS = [
    {
        id: 'welcome',
        title: 'Welcoming',
        icon: '🚪',
        phrases: [
            'Welcome to our home!',
            'Hello, uncle/auntie!',
            'Nice to see you!',
            'Please come in.',
            'We are happy you came.',
            'How are you?'
        ]
    },
    {
        id: 'seat',
        title: 'Offering Seat',
        icon: '🪑',
        phrases: [
            'Please sit here.',
            'Have a seat.',
            'Sit comfortably.',
            'This chair is for you.'
        ]
    },
    {
        id: 'food',
        title: 'Food & Drinks',
        icon: '🍹',
        phrases: [
            'Would you like some water?',
            'Please have some water.',
            'Would you like tea or juice?',
            'I will bring snacks.',
            'Please have some food.',
            'Take some more, please.',
            'Do you like it?'
        ]
    },
    {
        id: 'chat',
        title: 'Polite Talk',
        icon: '😊',
        phrases: [
            'How was your day?',
            'Did you have a good trip?',
            'Please tell us about your family.',
            'I am happy to see you.',
            'That is very nice!'
        ]
    },
    {
        id: 'serve',
        title: 'Serving',
        icon: '🧁',
        phrases: [
            'Here is your tea.',
            'Please take this.',
            'Be careful, it’s hot.',
            'Let me help you.'
        ]
    },
    {
        id: 'care',
        title: 'Showing Care',
        icon: '🎁',
        phrases: [
            'Are you comfortable?',
            'Do you need anything?',
            'Please feel at home.',
            'Take your time.'
        ]
    },
    {
        id: 'thank',
        title: 'Thanking',
        icon: '🙏',
        phrases: [
            'Thank you for coming.',
            'We are glad you visited us.',
            'Please come again.',
            'Visit us soon.'
        ]
    },
    {
        id: 'bye',
        title: 'Goodbye',
        icon: '👋',
        phrases: [
            'Goodbye!',
            'Have a safe journey.',
            'Come again soon.',
            'See you next time!'
        ]
    }
];

function GuestMannersGame({ onBack }) {
    const [activeSection, setActiveSection] = useState(0);

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FDF2E9',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏡</span> GUEST MANNERS
                </div>
            </div>

            <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>

                {/* Navigation Sidebar/Top Bar */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px', width: '100%', paddingBottom: '20px', justifyContent: 'center' }}>
                    {GUEST_SECTIONS.map((section, idx) => (
                        <motion.button
                            key={section.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveSection(idx)}
                            style={{
                                padding: '15px 20px',
                                borderRadius: '15px',
                                border: 'none',
                                background: activeSection === idx ? '#D35400' : 'white',
                                color: activeSection === idx ? 'white' : '#5D6D7E',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                                minWidth: '100px',
                                boxShadow: activeSection === idx ? '0 8px 15px rgba(211, 84, 0, 0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
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
                            {GUEST_SECTIONS[activeSection].icon} {GUEST_SECTIONS[activeSection].title}
                        </h2>
                        <p style={{ color: '#95A5A6', fontSize: '1.2rem', marginTop: '10px' }}>Tap a phrase to hear it!</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {GUEST_SECTIONS[activeSection].phrases.map((phrase, idx) => (
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
        </div>
    );
}

export default GuestMannersGame;
