import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_STRUCTURE = {
    root: [
        { id: 'reasoning-basics', title: 'Reasoning Basics', icon: '🧠', color: '#E67E22', shadow: '#D35400', type: 'game' },
        { id: 'logic-puzzles', title: 'Logic Puzzles', icon: '🧩', color: '#9B59B6', shadow: '#8E44AD', type: 'game' },
    ]
};

function ReasoningMenu({ onSelectMode, onBack }) {
    const [currentView, setCurrentView] = useState('root');

    const handleItemClick = (item) => {
        if (item.type === 'folder') setCurrentView(item.target);
        else onSelectMode(item.id);
    };

    const handleBack = () => {
        if (currentView === 'root') onBack();
        else setCurrentView('root');
    };

    return (
        <div style={{ width: '100%', padding: '16px' }}>

            {/* Compact Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    style={{
                        padding: '8px 14px', background: 'white', color: '#475569',
                        fontWeight: 900, fontSize: '0.8rem', borderRadius: '12px',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0',
                        cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                >
                    ⬅ Home
                </motion.button>
                <div>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '2px', textTransform: 'uppercase' }}>IQ Booster</p>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#1E293B', fontWeight: 900, lineHeight: 1 }}>🧠 Reasoning</h1>
                </div>
            </div>

            {/* Compact 3-column grid */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}
                >
                    {MENU_STRUCTURE[currentView].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ scale: 1.06, y: -3 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: `linear-gradient(135deg, ${item.color}, ${item.shadow})`,
                                border: 'none', borderRadius: '16px',
                                padding: '14px 6px 10px',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '6px',
                                cursor: 'pointer',
                                boxShadow: `0 5px 12px -2px ${item.color}66`
                            }}
                        >
                            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.icon}</span>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 900,
                                color: 'rgba(255,255,255,0.95)',
                                letterSpacing: '0.5px', textTransform: 'uppercase',
                                textAlign: 'center', lineHeight: 1.2, fontFamily: 'inherit'
                            }}>{item.title}</span>
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default ReasoningMenu;
