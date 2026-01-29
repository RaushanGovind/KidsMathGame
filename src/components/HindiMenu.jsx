import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Menu Configuration
const MENU_STRUCTURE = {
    root: [
        { id: 'hindi-varnamala', title: 'वर्णमाला (Varnamala)', icon: '🕉️', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'hindi-2-letter', title: 'दो अक्षर वाले शब्द', icon: '📝', color: '#F1C40F', shadow: '#D35400', type: 'game' },
        { id: 'hindi-3-letter', title: 'तीन अक्षर वाले शब्द', icon: '📝', color: '#2ECC71', shadow: '#27AE60', type: 'game' }
    ]
};

function HindiMenu({ onSelectMode, onBack }) {
    const [currentFolder, setCurrentFolder] = useState('root');
    const [history, setHistory] = useState([]);

    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            setHistory([...history, currentFolder]);
            setCurrentFolder(item.target);
        } else if (item.type === 'game') {
            onSelectMode(item.id);
        }
    };

    const handleFolderBack = () => {
        if (history.length > 0) {
            const previousFolder = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setCurrentFolder(previousFolder);
        } else {
            onBack();
        }
    };

    const currentItems = currentFolder === 'root' ? MENU_STRUCTURE.root : MENU_STRUCTURE.folders[currentFolder];

    return (
        <div className="menu-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minHeight: '100vh', padding: '20px',
            background: '#FDF2E9'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <button onClick={handleFolderBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 0 #BDC3C7',
                    border: '2px solid #ECF0F1',
                    cursor: 'pointer'
                }}>
                    ⬅ MENU
                </button>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
                >
                    हिंदी (HINDI)
                </motion.div>
                <div style={{ width: '80px' }}></div>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '25px',
                width: '100%',
                maxWidth: '1000px',
                paddingBottom: '40px'
            }}>
                <AnimatePresence mode="popLayout">
                    {currentItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: item.color,
                                border: 'none',
                                borderRadius: '30px',
                                padding: '30px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                boxShadow: `0 8px 0 ${item.shadow}`,
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                fontSize: '4rem',
                                background: 'rgba(255,255,255,0.2)',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>
                            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                {item.title}
                            </span>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default HindiMenu;
