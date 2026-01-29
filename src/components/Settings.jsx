import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { setSoundEnabled, setMusicEnabled } from '../utils/sounds';

function Settings({ onBack }) {
    const { userData, updateSettings, resetProgress } = useGame();

    // Local state synced with context
    const [sound, setSound] = useState(userData.settings.sound);
    const [music, setMusic] = useState(userData.settings.music);
    const [theme, setTheme] = useState(userData.settings.theme);
    const [mascot, setMascot] = useState(userData.settings.mascot);
    const [notifications, setNotifications] = useState(userData.settings.notifications);
    const [screenTime, setScreenTime] = useState(userData.settings.screenTime);

    // Update context when local state changes
    useEffect(() => {
        updateSettings({ sound, music, theme, mascot, notifications, screenTime });
        setSoundEnabled(sound);
        setMusicEnabled(music);
    }, [sound, music, theme, mascot, notifications, screenTime]);

    const themes = [
        { id: 'sky', name: 'Sky', icon: '☁️' },
        { id: 'space', name: 'Space', icon: '🚀' },
        { id: 'fantasy', name: 'Fantasy', icon: '🏰' }
    ];

    const mascots = [
        { id: 'owl', name: 'Owl', icon: '🦉' },
        { id: 'robot', name: 'Robot', icon: '🤖' },
        { id: 'bunny', name: 'Bunny', icon: '🐰' }
    ];

    const handleReset = () => {
        resetProgress();
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e1e7ed 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>

            {/* Top Navigation */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'flex-start', marginBottom: '30px', zIndex: 10 }}>
                <button onClick={onBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 0 #bdc3c7',
                    border: '2px solid #ecf0f1',
                    cursor: 'pointer'
                }}>
                    ⬅ MENU
                </button>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '50px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderRadius: '40px',
                    width: '100%',
                    maxWidth: '800px'
                }}
            >
                {/* Title */}
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    color: '#2C3E50',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    Settings ⚙️
                </h1>

                {/* Section: Kid Fun */}
                <div style={{ width: '100%', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#7F8C8D', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Kid Zone
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {/* Sound & Music */}
                        <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '30px', border: '3px solid #eee' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#2C3E50', marginBottom: '20px' }}>🎵 Sound & Music</div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <ToggleButton label="SOUND" value={sound} onChange={setSound} />
                                <ToggleButton label="MUSIC" value={music} onChange={setMusic} />
                            </div>
                        </div>

                        {/* Theme Choice */}
                        <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '30px', border: '3px solid #eee' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#2C3E50', marginBottom: '20px' }}>🌈 Favorite Theme</div>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                {themes.map(t => (
                                    <motion.button
                                        key={t.id}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setTheme(t.id)}
                                        style={{
                                            border: theme === t.id ? '4px solid #3498DB' : '4px solid white',
                                            background: 'white',
                                            borderRadius: '20px',
                                            padding: '10px',
                                            fontSize: '2rem',
                                            cursor: 'pointer',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {t.icon}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parent Dashboard */}
                <div style={{ width: '100%', background: '#2C3E50', borderRadius: '35px', padding: '40px', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>Parent Control 🔒</h2>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '20px', fontWeight: '900' }}>
                            KIDS SAFE ✅
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '40px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '25px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>⭐</div>
                            <div style={{ fontSize: '2rem', fontWeight: '900' }}>{userData.stars}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>STARS</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '25px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>🎯</div>
                            <div style={{ fontSize: '2rem', fontWeight: '900' }}>{userData.currentLevel}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>LEVEL</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '25px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>⏱️</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{Math.floor(userData.totalPlayTime / 60)}h</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>TIME</div>
                        </div>
                    </div>

                    {/* Screen Time Slider */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px' }}>DAILY PLAY LIMIT</div>
                        <input
                            type="range"
                            min="15" max="60" step="15"
                            value={screenTime}
                            onChange={(e) => setScreenTime(Number(e.target.value))}
                            style={{ width: '100%', height: '10px', borderRadius: '5px', outline: 'none', cursor: 'pointer' }}
                        />
                        <div style={{ textAlign: 'end', fontSize: '2rem', fontWeight: '900', color: '#F1C40F', marginTop: '10px' }}>
                            {screenTime} MIN
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        style={{
                            width: '100%',
                            padding: '20px',
                            background: '#E74C3C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            boxShadow: '0 8px 0 #C0392B'
                        }}
                    >
                        RESET ALL GAME DATA
                    </button>
                </div>

                {/* Mascot Corner */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: '-40px', right: '40px', fontSize: '10rem' }}
                >
                    🦉
                </motion.div>
            </motion.div>
        </div>
    );
}

function SettingCard({ title, icon, color, children }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
                background: color,
                borderRadius: '25px',
                padding: '20px',
                marginBottom: '20px',
                border: '4px solid white',
                boxShadow: `0 6px 0 ${color}99, 0 8px 15px rgba(0,0,0,0.1)`
            }}
        >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '15px', textAlign: 'center' }}>
                {icon} {title}
            </div>
            {children}
        </motion.div>
    );
}

function ToggleButton({ label, value, onChange }) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(!value)}
            style={{
                background: value ? '#4CAF50' : '#ddd',
                color: value ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: value ? '0 0 15px rgba(76,175,80,0.5)' : 'none',
                transition: 'all 0.3s'
            }}
        >
            {label || (value ? 'ON' : 'OFF')}
        </motion.button>
    );
}

function InfoBubble({ icon, value, label, color }) {
    return (
        <div style={{
            background: color,
            borderRadius: '20px',
            padding: '15px',
            minWidth: '90px',
            textAlign: 'center',
            border: '3px solid white',
            boxShadow: `0 4px 0 ${color}99`
        }}>
            <div style={{ fontSize: '1.8rem' }}>{icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2C3E50' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: '#555' }}>{label}</div>
        </div>
    );
}

export default Settings;
