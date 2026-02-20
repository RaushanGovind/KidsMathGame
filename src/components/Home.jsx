import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
    { title: 'Math', icon: '🔢', color: '#3498DB', gradient: 'linear-gradient(135deg,#3498DB,#2980B9)', mode: 'menu' },
    { title: 'English', icon: '📚', color: '#E74C3C', gradient: 'linear-gradient(135deg,#E74C3C,#C0392B)', mode: 'english-menu' },
    { title: 'Logic', icon: '🧠', color: '#8E44AD', gradient: 'linear-gradient(135deg,#8E44AD,#6C3483)', mode: 'reasoning-menu' },
    { title: 'Hindi', icon: '🇮🇳', color: '#F39C12', gradient: 'linear-gradient(135deg,#F39C12,#D68910)', mode: 'hindi-menu' },
    { title: 'GK', icon: '🌍', color: '#16A085', gradient: 'linear-gradient(135deg,#16A085,#1A8C78)', mode: 'bilingual_gk' },
    { title: 'Physics', icon: '⚡', color: '#D4AC0D', gradient: 'linear-gradient(135deg,#F1C40F,#D4AC0D)', mode: 'physics' },
    { title: 'Chemistry', icon: '🧪', color: '#9B59B6', gradient: 'linear-gradient(135deg,#9B59B6,#7D3C98)', mode: 'chemistry' },
    { title: 'Biology', icon: '🌿', color: '#27AE60', gradient: 'linear-gradient(135deg,#27AE60,#1E8449)', mode: 'biology' },
    { title: 'Games', icon: '🎮', color: '#2C3E50', gradient: 'linear-gradient(135deg,#2C3E50,#34495E)', mode: 'games' },
];

function Home({ onNavigate }) {
    // Only show splash on the very first visit in this browser session
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem('splashSeen');
    });

    useEffect(() => {
        if (!showSplash) return; // Skip timer if splash already dismissed
        sessionStorage.setItem('splashSeen', '1'); // Mark as seen immediately
        const timer = setTimeout(() => setShowSplash(false), 2200);
        return () => clearTimeout(timer);
    }, [showSplash]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minHeight: 'calc(100vh - 70px)',
            background: 'linear-gradient(160deg, #F0F7FF 0%, #EDF2FB 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
            <AnimatePresence mode="wait">
                {showSplash ? (
                    /* ——— SPLASH SCREEN ——— */
                    <motion.div
                        key="splash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ scale: 1.3, opacity: 0, filter: 'blur(20px)' }}
                        transition={{ duration: 0.7 }}
                        style={{
                            position: 'fixed', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            zIndex: 3000,
                            background: 'linear-gradient(160deg, #F0F7FF 0%, #EDF2FB 100%)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.3 }}
                            animate={{ scale: [0.3, 1.08, 1] }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {/* Pulse ring */}
                            <motion.div
                                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    position: 'absolute', width: '340px', height: '340px',
                                    border: '4px solid #3498DB', borderRadius: '50%'
                                }}
                            />
                            <img
                                src="/logo.png"
                                alt="Kids Hero"
                                style={{ width: 'min(280px, 65vw)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
                                onError={(e) => {
                                    if (!e.target.src.endsWith('.svg')) {
                                        e.target.src = '/logo.svg';
                                    } else {
                                        e.target.parentElement.innerHTML = '<div style="font-size:80px">⚡</div>';
                                    }
                                }}
                            />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                marginTop: '32px', fontSize: '1.1rem', fontWeight: 900,
                                color: '#1E293B', letterSpacing: '4px', textTransform: 'uppercase'
                            }}
                        >
                            Loading Adventure...
                        </motion.p>
                    </motion.div>
                ) : (
                    /* ——— MAIN MENU ——— */
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px 40px' }}
                    >
                        {/* Logo + tagline */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', gap: '6px' }}
                        >
                            <img
                                src="/logo.png"
                                alt="Kids Hero"
                                style={{ width: '80px', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.12))' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <p style={{
                                margin: 0, fontSize: '0.75rem', fontWeight: 800,
                                color: '#94A3B8', letterSpacing: '3px', textTransform: 'uppercase'
                            }}>
                                Choose Your Adventure
                            </p>
                        </motion.div>

                        {/* ——— MATRIX ICON GRID ——— */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '14px',
                            width: '100%',
                            maxWidth: '400px'
                        }}>
                            {MENU_ITEMS.map((item, i) => (
                                <motion.button
                                    key={item.mode}
                                    onClick={() => onNavigate(item.mode)}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.08, y: -4 }}
                                    whileTap={{ scale: 0.93 }}
                                    style={{
                                        background: item.gradient,
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '18px 8px 14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        boxShadow: `0 8px 20px -4px ${item.color}55`,
                                    }}
                                >
                                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{item.icon}</span>
                                    <span style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 900,
                                        color: 'rgba(255,255,255,0.95)',
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        fontFamily: 'inherit'
                                    }}>
                                        {item.title}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;
