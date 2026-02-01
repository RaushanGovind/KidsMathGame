import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

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
            <div
                className="mobile-header-stack"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    position: 'relative',
                    justifyContent: 'space-between'
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="back-btn"
                    onClick={handleBack}
                    style={{
                        padding: '10px 20px',
                        background: 'white',
                        color: '#475569',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    <ChevronLeft size={18} /> {currentView === 'root' ? 'Menu' : 'Back'}
                </motion.button>

                <div
                    className="title-container"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        left: 0
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            color: '#94A3B8',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            marginBottom: '2px'
                        }}>
                            IQ Booster
                        </span>
                        <h1
                            className="mobile-text-lg"
                            style={{
                                margin: 0,
                                fontSize: '1.8rem',
                                color: '#1E293B',
                                fontWeight: '900',
                                lineHeight: 1
                            }}
                        >
                            REASONING
                        </h1>
                    </div>
                </div>

                <div style={{ width: '100px' }} className="mobile-hide"></div>
            </div>

            {/* Grid */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="mobile-grid-1"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px'
                    }}
                >
                    {MENU_STRUCTURE[currentView].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: '24px',
                                padding: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '15px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                fontSize: '4rem',
                                background: `${item.color}10`,
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{
                                    fontSize: '1.6rem',
                                    fontWeight: '900',
                                    color: item.color,
                                    lineHeight: '1.2'
                                }}>
                                    {item.title}
                                </span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Play Now
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default ReasoningMenu;
