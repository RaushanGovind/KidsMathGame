import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { setSoundEnabled, setMusicEnabled } from '../utils/sounds';

function Settings({ onClose }) {
    const { userData, updateSettings, resetProgress } = useGame();

    // Local state synced with context
    const [sound, setSound] = useState(userData.settings.sound);
    const [music, setMusic] = useState(userData.settings.music);
    const [theme, setTheme] = useState(userData.settings.theme);
    const [mascot, setMascot] = useState(userData.settings.mascot);
    const [notifications, setNotifications] = useState(userData.settings.notifications);
    const [englishFont, setEnglishFont] = useState(userData.settings.englishFont);
    const [hindiFont, setHindiFont] = useState(userData.settings.hindiFont);
    const [screenTime, setScreenTime] = useState(userData.settings.screenTime);
    const [voiceGender, setVoiceGender] = useState(userData.settings.voiceGender || 'female');

    // Update context when local state changes
    useEffect(() => {
        updateSettings({ sound, music, theme, mascot, notifications, screenTime, englishFont, hindiFont, voiceGender });
        setSoundEnabled(sound);
        setMusicEnabled(music);
    }, [sound, music, theme, mascot, notifications, screenTime, englishFont, hindiFont, voiceGender]);

    // ... (font and card definitions stay same)
    const englishFonts = [
        { id: 'Fredoka', name: 'Fredoka' },
        { id: 'Jolly', name: 'Jolly' },
        { id: 'Slackey', name: 'Slackey' },
        { id: 'Boogaloo', name: 'Boogaloo' },
        { id: 'Bubblegum', name: 'Bubblegum' },
        { id: 'Chewy', name: 'Chewy' },
        { id: 'Comic', name: 'Comic' },
        { id: 'Patrick', name: 'Patrick' },
        { id: 'Schoolbell', name: 'School' },
        { id: 'Balsamiq', name: 'Balsamiq' }
    ];

    const hindiFonts = [
        { id: 'Hind', name: 'हिन्द' },
        { id: 'Kalam', name: 'कलम' },
        { id: 'Amita', name: 'अमिता' },
        { id: 'Rajdhani', name: 'राजधानी' },
        { id: 'Khand', name: 'खण्ड' },
        { id: 'Rozha', name: 'रोझा' },
        { id: 'Martel', name: 'मार्तण्ड' },
        { id: 'Karma', name: 'कर्म' },
        { id: 'Gotu', name: 'गोटू' },
        { id: 'Modak', name: 'मोदक' }
    ];

    const themes = [
        { id: 'sky', name: 'Sky', icon: '☁️' },
        { id: 'space', name: 'Space', icon: '🚀' },
        { id: 'fantasy', name: 'Fantasy', icon: '🏰' }
    ];

    const handleReset = () => {
        if (window.confirm("Are you sure? This will reset all your stars and levels!")) {
            resetProgress();
        }
    };

    const CustomFontDropdown = ({ options, value, onChange, type }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = options.find(o => o.id === value);

        return (
            <div style={{ position: 'relative', width: '100%' }}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%', padding: '12px 15px', borderRadius: '12px',
                        border: `2px solid ${type === 'english' ? '#3498DB' : '#E67E22'}`,
                        background: 'white', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', cursor: 'pointer',
                        fontFamily: `var(--font-family-${value.toLowerCase()})`,
                        fontSize: type === 'english' ? '1rem' : '1.3rem',
                        fontWeight: '800',
                        color: '#2C3E50',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                >
                    <span>{selectedOption?.name || value}</span>
                    <span style={{
                        fontSize: '0.8rem',
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>▼</span>
                </div>

                {isOpen && (
                    <>
                        <div
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                                background: 'white', borderRadius: '15px', border: '1px solid #E2E8F0',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 101,
                                maxHeight: '250px', overflowY: 'auto', padding: '8px'
                            }}
                        >
                            {options.map(opt => (
                                <motion.div
                                    key={opt.id}
                                    whileHover={{ background: '#F8FAFC', x: 5 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(opt.id);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        padding: '12px 15px', borderRadius: '10px', cursor: 'pointer',
                                        fontFamily: `var(--font-family-${opt.id.toLowerCase()})`,
                                        fontSize: type === 'english' ? '1.1rem' : '1.4rem',
                                        fontWeight: '800',
                                        background: value === opt.id ? '#eff6ff' : 'transparent',
                                        color: value === opt.id ? (type === 'english' ? '#3498DB' : '#E67E22') : '#2C3E50',
                                        marginBottom: '4px'
                                    }}
                                >
                                    {opt.name}
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(5px)'
                }}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{
                    position: 'relative',
                    background: 'white',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    borderRadius: '40px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '5px solid #F1F5F9'
                }}
            >
                {/* Modal Header */}
                <div style={{
                    padding: '25px 40px',
                    borderBottom: '2px solid #F1F5F9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#F8FAFC'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#2C3E50', margin: 0 }}>
                        Settings ⚙️
                    </h1>
                    <button
                        onClick={onClose}
                        style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: '#E2E8F0',
                            border: 'none',
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B'
                        }}>
                        ✕
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div style={{
                    padding: '20px',
                    overflowY: 'auto',
                    flex: 1,
                    paddingBottom: '120px' // Extra space for scrolling
                }}>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#7F8C8D', marginBottom: '15px', textTransform: 'uppercase' }}>
                            Kid Zone
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            {/* Sound & Music */}
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '25px', border: '3px solid #eee' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#2C3E50', marginBottom: '15px' }}>🎵 Sound & Voice</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <ToggleButton label="SOUND" value={sound} onChange={setSound} />
                                        <ToggleButton label="MUSIC" value={music} onChange={setMusic} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '15px', border: '1px solid #E2E8F0' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B' }}>VOICE:</span>
                                        <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                                            <button
                                                onClick={() => setVoiceGender('female')}
                                                style={{
                                                    flex: 1, padding: '6px', border: 'none', borderRadius: '8px',
                                                    background: voiceGender === 'female' ? '#EC4899' : '#F1F5F9',
                                                    color: voiceGender === 'female' ? 'white' : '#64748B',
                                                    fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s'
                                                }}>GIRL 👧</button>
                                            <button
                                                onClick={() => setVoiceGender('male')}
                                                style={{
                                                    flex: 1, padding: '6px', border: 'none', borderRadius: '8px',
                                                    background: voiceGender === 'male' ? '#3B82F6' : '#F1F5F9',
                                                    color: voiceGender === 'male' ? 'white' : '#64748B',
                                                    fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s'
                                                }}>BOY 👦</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Choice */}
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '25px', border: '3px solid #eee' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#2C3E50', marginBottom: '15px' }}>🌈 Favorite Theme</div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    {themes.map(t => (
                                        <motion.button
                                            key={t.id}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setTheme(t.id)}
                                            style={{
                                                border: theme === t.id ? '3px solid #3498DB' : '3px solid white',
                                                padding: '8px',
                                                background: 'white',
                                                borderRadius: '15px',
                                                fontSize: '1.8rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 10px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {t.icon}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Font Selection */}
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '25px', border: '3px solid #eee', marginTop: '20px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2C3E50', marginBottom: '15px', textAlign: 'center' }}>
                                🔤 Magic Fonts
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                <div style={{ background: 'white', padding: '12px 15px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#64748B', marginBottom: '8px' }}>ENGLISH FONT</div>
                                    <CustomFontDropdown
                                        type="english"
                                        options={englishFonts}
                                        value={englishFont}
                                        onChange={setEnglishFont}
                                    />
                                </div>

                                <div style={{ background: 'white', padding: '12px 15px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#64748B', marginBottom: '8px' }}>HINDI FONT</div>
                                    <CustomFontDropdown
                                        type="hindi"
                                        options={hindiFonts}
                                        value={hindiFont}
                                        onChange={setHindiFont}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parent Dashboard */}
                    <div style={{ width: '100%', background: '#2C3E50', borderRadius: '30px', padding: '25px', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>Parent Control 🔒</h2>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '15px', fontWeight: '900', fontSize: '0.8rem' }}>
                                KIDS SAFE ✅
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '25px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem' }}>⭐</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{userData.stars}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>STARS</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem' }}>🎯</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{userData.currentLevel}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>LEVEL</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem' }}>⏱️</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{Math.floor(userData.totalPlayTime / 60)}h</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>TIME</div>
                            </div>
                        </div>

                        {/* Screen Time Slider */}
                        <div style={{ marginBottom: '25px' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '15px' }}>DAILY PLAY LIMIT</div>
                            <input
                                type="range"
                                min="15" max="60" step="15"
                                value={screenTime}
                                onChange={(e) => setScreenTime(Number(e.target.value))}
                                style={{ width: '100%', height: '8px', borderRadius: '5px', outline: 'none', cursor: 'pointer' }}
                            />
                            <div style={{ textAlign: 'end', fontSize: '1.4rem', fontWeight: '900', color: '#F1C40F', marginTop: '8px' }}>
                                {screenTime} MIN
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: '#E74C3C',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                fontSize: '1rem',
                                fontWeight: '900',
                                cursor: 'pointer',
                                boxShadow: '0 6px 0 #C0392B'
                            }}
                        >
                            RESET ALL GAME DATA
                        </button>
                    </div>
                </div>
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
