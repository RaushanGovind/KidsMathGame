import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// Menu Configuration
const MENU_STRUCTURE = {
    root: [
        { id: 'hindi-varnamala', title: 'वर्णमाला (Varnamala)', icon: '🕉️', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'hindi-2-letter', title: 'दो अक्षर वाले शब्द', icon: '📝', color: '#F1C40F', shadow: '#D35400', type: 'game' },
        { id: 'hindi-3-letter', title: 'तीन अक्षर वाले शब्द', icon: '📝', color: '#2ECC71', shadow: '#27AE60', type: 'game' },
        { id: 'hindi-stories', title: 'कहानियाँ (Stories)', icon: '📖', color: '#3498DB', shadow: '#2980B9', type: 'game' }
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
        <div className="menu-container mobile-padding-md" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minHeight: '100vh', padding: '20px',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
        }}>
            {/* Header */}
            <div
                className="mobile-header-stack"
                style={{
                    width: '100%',
                    maxWidth: '1200px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '30px',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="back-btn"
                    onClick={handleFolderBack}
                    style={{
                        padding: '10px 20px',
                        background: 'white',
                        color: '#9A3412',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid #FFEDD5',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    <ChevronLeft size={18} /> {history.length > 0 ? 'Back' : 'Menu'}
                </motion.button>

                <div className="title-container" style={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    left: 0
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            color: '#C2410C',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            marginBottom: '2px'
                        }}>
                            Hindi Zone
                        </span>
                        <h1
                            className="mobile-text-lg"
                            style={{
                                margin: 0,
                                fontSize: '1.8rem',
                                color: '#7C2D12',
                                fontWeight: '900',
                                lineHeight: 1
                            }}
                        >
                            हिन्दी (HINDI)
                        </h1>
                    </div>
                </div>
                <div style={{ width: '100px' }} className="mobile-hide"></div>
            </div>

            {/* Grid */}
            <div
                className="mobile-grid-1"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '1000px',
                    paddingBottom: '40px'
                }}
            >
                <AnimatePresence mode="popLayout">
                    {currentItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: 'white',
                                border: '1px solid #FFEDD5',
                                borderRadius: '24px',
                                padding: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{
                                fontSize: '2.5rem',
                                background: `${item.color}10`,
                                width: '70px',
                                height: '70px',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="hindi-text" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#7C2D12', lineHeight: 1.2 }}>
                                    {item.title}
                                </span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9A3412', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Tap to Start
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default HindiMenu;
