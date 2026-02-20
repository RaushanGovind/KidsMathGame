import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_STRUCTURE = {
    root: [
        { id: 'hindi-varnamala', title: 'वर्णमाला', icon: '🕉️', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'hindi-2-letter', title: 'दो अक्षर', icon: '✌️', color: '#F39C12', shadow: '#D68910', type: 'game' },
        { id: 'hindi-3-letter', title: 'तीन अक्षर', icon: '👌', color: '#27AE60', shadow: '#1E8449', type: 'game' },
        { id: 'hindi-stories', title: 'कहानियाँ', icon: '📖', color: '#3498DB', shadow: '#2980B9', type: 'game' },
    ]
};

function HindiMenu({ onSelectMode, onBack }) {
    const [currentFolder, setCurrentFolder] = useState('root');
    const [history, setHistory] = useState([]);

    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            setHistory([...history, currentFolder]);
            setCurrentFolder(item.target);
        } else {
            onSelectMode(item.id);
        }
    };

    const handleFolderBack = () => {
        if (history.length > 0) {
            const prev = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setCurrentFolder(prev);
        } else {
            onBack();
        }
    };

    const currentItems = currentFolder === 'root' ? MENU_STRUCTURE.root : [];

    return (
        <div style={{ width: '100%', padding: '16px' }}>

            {/* Compact Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleFolderBack}
                    style={{
                        padding: '8px 14px', background: 'white', color: '#9A3412',
                        fontWeight: 900, fontSize: '0.8rem', borderRadius: '12px',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.08)', border: '1px solid #FFEDD5',
                        cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                >
                    ⬅ {history.length > 0 ? 'Back' : 'Home'}
                </motion.button>
                <div>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 900, color: '#C2410C', letterSpacing: '2px', textTransform: 'uppercase' }}>Hindi Zone</p>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#7C2D12', fontWeight: 900, lineHeight: 1 }}>🇮🇳 हिन्दी</h1>
                </div>
            </div>

            {/* Compact 3-column grid */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentFolder}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}
                >
                    {currentItems.map((item, index) => (
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
                                letterSpacing: '0.3px', textTransform: 'uppercase',
                                textAlign: 'center', lineHeight: 1.2, fontFamily: 'inherit'
                            }}>{item.title}</span>
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default HindiMenu;
