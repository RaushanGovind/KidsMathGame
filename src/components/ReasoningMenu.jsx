import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Menu Configuration
const MENU_STRUCTURE = {
    root: [
        { id: 'reasoning-basics', title: 'Reasoning Basics', icon: '🧠', color: '#E67E22', shadow: '#D35400', type: 'game' },
        { id: 'logic-puzzles', title: 'Logic Puzzles', icon: '🧩', color: '#9B59B6', shadow: '#8E44AD', type: 'game' }
        // Future interactions: Logic Puzzles, Critical Thinking, etc.
    ]
};

function ReasoningMenu({ onSelectMode, onBack }) {
    const [currentView, setCurrentView] = useState('root');

    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            setCurrentView(item.target);
        } else {
            onSelectMode(item.id);
        }
    };

    const handleBack = () => {
        if (currentView === 'root') {
            onBack();
        } else {
            setCurrentView('root');
        }
    };

    const getTitle = () => {
        return 'REASONING ZONE 🧠';
    };

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
                position: 'relative'
            }}>
                <button onClick={handleBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.2rem',
                    borderRadius: '20px',
                    boxShadow: '0 4px 0 #BDC3C7',
                    border: '2px solid #ECF0F1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 10
                }}>
                    <span>⬅</span> {currentView === 'root' ? 'HOME' : 'BACK'}
                </button>

                <div style={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '3rem',
                        color: '#2C3E50',
                        fontWeight: '900',
                        textShadow: '0 2px 0 rgba(255,255,255,0.5)'
                    }}>
                        {getTitle()}
                    </h1>
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px'
                    }}
                >
                    {MENU_STRUCTURE[currentView].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: item.color,
                                border: 'none',
                                borderRadius: '30px',
                                padding: '30px',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 10px 0 ${item.shadow}`,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '220px',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Shine Effect */}
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                                transform: 'rotate(45deg)',
                                pointerEvents: 'none'
                            }} />

                            <span style={{
                                fontSize: '5rem',
                                marginBottom: '15px',
                                filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.1))'
                            }}>
                                {item.icon}
                            </span>

                            <span style={{
                                fontSize: '1.8rem',
                                fontWeight: '900',
                                color: 'white',
                                lineHeight: '1.2',
                                textShadow: '0 2px 0 rgba(0,0,0,0.1)'
                            }}>
                                {item.title}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default ReasoningMenu;
