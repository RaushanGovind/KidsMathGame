import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

function LevelMap({ onBack, onSelectLevel }) {
    const { userData } = useGame();

    const levels = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        locked: !userData.unlockedLevels.includes(i + 1),
        boss: (i + 1) % 5 === 0
    }));

    // Auto-scroll to bottom (Level 1) when component mounts
    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(180deg, #f0f7ff 0%, #e1eefc 100%)',
            padding: '20px',
            position: 'relative'
        }}>
            {/* Top Navigation Bar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%',
                padding: '15px 40px', zIndex: 100,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(10px)',
                borderBottom: '2px solid #f1f2f6',
                boxShadow: '0 5px 20px rgba(0,0,0,0.03)'
            }}>
                <button onClick={onBack} style={{
                    padding: '10px 20px',
                    background: '#2C3E50',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '0.9rem',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    ⬅ MENU
                </button>
                <h1 style={{ color: '#2C3E50', fontSize: '1.8rem', fontWeight: '900', margin: 0, flex: 1, textAlign: 'center' }}>
                    Adventure Map
                </h1>
                <div style={{
                    background: '#F1C40F',
                    padding: '8px 20px',
                    borderRadius: '15px',
                    fontWeight: '900',
                    color: 'white',
                    fontSize: '1.1rem'
                }}>
                    ⭐ {userData.stars}
                </div>
            </div>

            {/* Scrollable Map Area */}
            <div style={{
                marginTop: '100px',
                display: 'flex', flexDirection: 'column-reverse', alignItems: 'center',
                gap: '40px', paddingBottom: '120px',
                position: 'relative'
            }}>
                {levels.map((level, index) => {
                    const offset = index % 2 === 0 ? '50px' : '-50px';

                    return (
                        <div key={level.id} style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
                            {/* Path Connector */}
                            {level.id < levels.length && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    width: '6px',
                                    height: '70px',
                                    background: level.locked ? '#eee' : '#3498DB',
                                    opacity: 0.2,
                                    transform: `translateX(${index % 2 === 0 ? '25px' : '-25px'}) rotate(${index % 2 === 0 ? '-20deg' : '20deg'})`,
                                    transformOrigin: 'bottom center',
                                    borderRadius: '3px',
                                    zIndex: 0
                                }} />
                            )}

                            <motion.div
                                whileHover={!level.locked ? { scale: 1.05 } : {}}
                                whileTap={!level.locked ? { scale: 0.98 } : {}}
                                onClick={() => !level.locked && onSelectLevel(level.id)}
                                style={{
                                    width: level.boss ? '100px' : '80px',
                                    height: level.boss ? '100px' : '80px',
                                    borderRadius: '50%',
                                    background: level.locked
                                        ? '#BDC3C7'
                                        : (level.boss ? '#F1C40F' : '#3498DB'),
                                    border: `5px solid white`,
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: level.boss ? '2.2rem' : '1.8rem',
                                    fontWeight: '900',
                                    color: 'white',
                                    cursor: level.locked ? 'default' : 'pointer',
                                    position: 'relative',
                                    transform: `translateX(${offset})`,
                                    zIndex: 1
                                }}
                            >
                                {level.locked ? '🔒' : (level.boss ? '👑' : level.id)}

                                {/* Current Position Indicator */}
                                {level.id === userData.currentLevel && (
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        style={{
                                            position: 'absolute', top: '-70px',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center'
                                        }}
                                    >
                                        <div style={{
                                            background: '#2C3E50',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            marginBottom: '8px',
                                            fontWeight: '900',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                        }}>
                                            HERE!
                                        </div>
                                        <div style={{ fontSize: '4rem' }}>🦉</div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default LevelMap;
