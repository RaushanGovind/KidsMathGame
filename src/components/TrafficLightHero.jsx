import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Trophy, AlertTriangle, Play, ChevronRight, Volume2 } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const LIGHT_DATA = {
    RED: { color: '#FF2E63', glow: '#FF2E6366', face: '😠', msg: 'STOP!', sound: 'RED means STOP!' },
    YELLOW: { color: '#FFD700', glow: '#FFD70066', face: '😮', msg: 'WAIT...', sound: 'YELLOW means WAIT!' },
    GREEN: { color: '#08D9D6', glow: '#08D9D666', face: '😃', msg: 'GO GO!', sound: 'GREEN means GO!' }
};

const CHARACTERS = [
    { id: 'boy', icon: '👧', name: 'Leila' },
    { id: 'puppy', icon: '🐶', name: 'Puddles' },
    { id: 'robot', icon: '🤖', name: 'Bolts' },
    { id: 'hero', icon: '🦸', name: 'SuperKid' }
];

const TrafficLightHero = ({ onBack }) => {
    const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'success'
    const [level, setLevel] = useState(1);
    const [character, setCharacter] = useState(CHARACTERS[0]);
    const [currentLight, setCurrentLight] = useState('RED');
    const [progress, setProgress] = useState(0);
    const [stars, setStars] = useState(0);
    const [isWalking, setIsWalking] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const lightTimerRef = useRef();
    const walkIntervalRef = useRef();

    const playLightSound = (light) => {
        speak(LIGHT_DATA[light].sound, 'en-US', 1.1);
    };

    const startLevel = useCallback(() => {
        setProgress(0);
        setCurrentLight('RED');
        setGameState('playing');
        startLightCycle();
    }, [level]);

    const startLightCycle = () => {
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);

        const sequence = level === 1 ? ['RED', 'GREEN'] : ['RED', 'YELLOW', 'GREEN'];
        let currentIndex = 0;

        const next = () => {
            const nextLight = sequence[currentIndex];
            setCurrentLight(nextLight);
            playLightSound(nextLight);

            const duration = nextLight === 'YELLOW' ? 2000 : (Math.random() * 3000 + 3000);
            currentIndex = (currentIndex + 1) % sequence.length;
            lightTimerRef.current = setTimeout(next, duration);
        };
        next();
    };

    useEffect(() => {
        if (gameState === 'playing' && isWalking) {
            walkIntervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (currentLight === 'GREEN') {
                        const next = prev + 0.8;
                        if (next >= 90) {
                            handleWin();
                            return 90;
                        }
                        return next;
                    } else {
                        handleMistake();
                        return prev;
                    }
                });
            }, 30);
        } else {
            clearInterval(walkIntervalRef.current);
        }
        return () => clearInterval(walkIntervalRef.current);
    }, [gameState, isWalking, currentLight]);

    const handleMistake = () => {
        setIsWalking(false);
        playSound('wrong');
        setShowHint(true);
        setTimeout(() => setShowHint(false), 2000);
    };

    const handleWin = () => {
        setGameState('success');
        playSound('correct');
        setStars(s => s + 1);
        speak("Yay! You are a road safety hero!", 'en-US', 1.1);
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);
    };

    const handleNextLevel = () => {
        setLevel(prev => Math.min(prev + 1, 3));
        startLevel();
    };

    const renderIntro = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', padding: '20px',
            color: 'white', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
        }}>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', marginBottom: '40px' }}
            >
                <h1 style={{ fontSize: 'min(4rem, 12vw)', fontWeight: 900, textShadow: '0 8px 0 rgba(0,0,0,0.2)', margin: 0 }}>
                    Traffic Light <span style={{ color: '#FFD700' }}>Hero</span>! 🚦
                </h1>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, opacity: 0.9 }}>Be a safe walker! 🚸</p>
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '500px', width: '100%',
                    border: '8px solid #FFD700'
                }}
            >
                <h3 style={{ textAlign: 'center', color: '#023E8A', fontSize: '1.8rem', margin: '0 0 25px 0' }}>Pick Your Hero!</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    {CHARACTERS.map(c => (
                        <motion.button
                            key={c.id}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setCharacter(c); playSound('click'); }}
                            style={{
                                padding: '15px', borderRadius: '25px',
                                border: character.id === c.id ? '6px solid #00B4D8' : '6px solid #CAF0F8',
                                background: character.id === c.id ? '#CAF0F8' : 'white', cursor: 'pointer', fontSize: '2.5rem'
                            }}
                        >
                            {c.icon}
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playSound('click'); startLevel(); }}
                    style={{
                        width: '100%', marginTop: '30px', padding: '22px',
                        background: 'linear-gradient(to bottom, #4CAF50, #2E7D32)', color: 'white', border: 'none',
                        borderRadius: '30px', fontSize: '1.8rem', fontWeight: 900,
                        boxShadow: '0 10px 0 #1B5E20', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
                    }}
                >
                    LET'S GO! <Play fill="white" />
                </motion.button>
            </motion.div>
        </div>
    );

    const renderPlaying = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: 'linear-gradient(180deg, #90E0EF 0%, #CAF0F8 60%, #95A5A6 60%, #7F8C8D 100%)',
            overflow: 'hidden', position: 'relative'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGameState('intro')}
                    style={{ padding: '12px 25px', background: 'white', border: '4px solid #023E8A', borderRadius: '20px', fontWeight: 900, cursor: 'pointer', color: '#023E8A' }}
                >
                    ⬅ HOME
                </motion.button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: '#FFD700', padding: '10px 25px', borderRadius: '25px', fontWeight: 900, border: '4px solid white', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⭐ {stars}</div>
                </div>
            </div>

            {/* City Decor */}
            <div style={{ position: 'absolute', bottom: '40%', width: '100%', display: 'flex', justifyContent: 'space-around', pointerEvents: 'none', px: '20px' }}>
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ fontSize: '6rem' }}>🏠</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ fontSize: '8rem' }}>🏙️</motion.span>
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ fontSize: '5rem' }}>🌳</motion.span>
            </div>

            {/* Zebra Crossing Area */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '60%', background: '#333', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '8px solid white', borderBottom: '8px solid white' }}>
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{ width: '40px', height: '80%', background: 'white', borderRadius: '4px' }} />
                    ))}
                </div>
            </div>

            {/* Traffic Light - Stylized */}
            <div style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 50, textAlign: 'center' }}>
                <motion.div
                    animate={{ rotate: currentLight === 'RED' ? [-1, 1, -1] : 0 }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    style={{
                        width: '100px', background: '#2C3E50', padding: '20px', borderRadius: '40px',
                        display: 'flex', flexDirection: 'column', gap: '20px', border: '8px solid #34495E',
                        boxShadow: '0 20px 0 rgba(0,0,0,0.2)'
                    }}
                >
                    {/* Red */}
                    <motion.div
                        animate={{ scale: currentLight === 'RED' ? 1.2 : 1, opacity: currentLight === 'RED' ? 1 : 0.3 }}
                        style={{
                            width: '60px', height: '60px', borderRadius: '50%', background: '#FF2E63',
                            boxShadow: currentLight === 'RED' ? '0 0 30px #FF2E63' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                        }}
                    >
                        {currentLight === 'RED' ? '😠' : ''}
                    </motion.div>
                    {/* Yellow */}
                    <motion.div
                        animate={{ scale: currentLight === 'YELLOW' ? 1.2 : 1, opacity: currentLight === 'YELLOW' ? 1 : 0.3 }}
                        style={{
                            width: '60px', height: '60px', borderRadius: '50%', background: '#FFD700',
                            boxShadow: currentLight === 'YELLOW' ? '0 0 30px #FFD700' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                        }}
                    >
                        {currentLight === 'YELLOW' ? '😮' : ''}
                    </motion.div>
                    {/* Green */}
                    <motion.div
                        animate={{ scale: currentLight === 'GREEN' ? 1.2 : 1, opacity: currentLight === 'GREEN' ? 1 : 0.3 }}
                        style={{
                            width: '60px', height: '60px', borderRadius: '50%', background: '#08D9D6',
                            boxShadow: currentLight === 'GREEN' ? '0 0 30px #08D9D6' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                        }}
                    >
                        {currentLight === 'GREEN' ? '😃' : ''}
                    </motion.div>
                </motion.div>
                <div style={{ width: '15px', height: '150px', background: '#2C3E50', margin: '0 auto', border: '4px solid #34495E' }} />
            </div>

            {/* Big Instruction Indicator */}
            <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentLight}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        style={{
                            background: 'white', padding: '20px 50px', borderRadius: '40px',
                            border: `8px solid ${LIGHT_DATA[currentLight].color}`,
                            boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 900, color: LIGHT_DATA[currentLight].color }}>
                            {LIGHT_DATA[currentLight].msg}
                        </h1>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Character */}
            <motion.div
                animate={{
                    left: `${5 + progress}%`,
                    y: isWalking ? [0, -15, 0] : 0,
                    rotate: isWalking ? [-2, 2, -2] : 0
                }}
                transition={{
                    left: { type: 'tween', duration: 0.1 },
                    y: { repeat: Infinity, duration: 0.25 }
                }}
                style={{
                    position: 'absolute', bottom: '12%',
                    fontSize: 'min(10rem, 25vw)', transform: 'translateX(-50%)', zIndex: 60,
                    filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.1))'
                }}
            >
                {character.icon}
            </motion.div>

            {/* Controls Info */}
            <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        background: 'rgba(255,255,255,0.9)', padding: '15px 40px', borderRadius: '30px',
                        fontWeight: 900, color: '#023E8A', fontSize: '1.4rem', border: '4px solid #00B4D8'
                    }}
                >
                    TAP & HOLD TO WALK! 🏃‍♂️
                </motion.div>
            </div>

            {/* Error Hint Overlay */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(255, 46, 99, 0.4)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            pointerEvents: 'none'
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [-2, 2, -2] }}
                            style={{ background: 'white', padding: '40px', borderRadius: '40px', border: '10px solid #FF2E63', textAlign: 'center' }}
                        >
                            <span style={{ fontSize: '8rem' }}>⚠️</span>
                            <h2 style={{ fontSize: '3rem', color: '#FF2E63', fontWeight: 900, margin: '10px 0' }}>STOP!</h2>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>Wait for the GREEN light!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL SCREEN TOUCH AREA */}
            <div
                onMouseDown={() => { setIsWalking(true); playSound('click'); }}
                onMouseUp={() => setIsWalking(false)}
                onMouseLeave={() => setIsWalking(false)}
                onTouchStart={() => { setIsWalking(true); playSound('click'); }}
                onTouchEnd={() => setIsWalking(false)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'pointer' }}
            />
        </div>
    );

    const renderSuccess = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #00F260 0%, #0575E6 100%)', textAlign: 'center', padding: '20px'
        }}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                style={{
                    background: 'white', padding: '50px', borderRadius: '50px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '10px solid #FFD700',
                    maxWidth: '500px', width: '100%'
                }}
            >
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <Trophy size={120} color="#FFD700" />
                </motion.div>
                <h1 style={{ fontSize: '3rem', color: '#1B5E20', fontWeight: 900, margin: '20px 0' }}>SAFE WALKER!</h1>
                <p style={{ fontSize: '1.5rem', color: '#666', fontWeight: 700 }}>You crossed like a pro hero! 🎖️</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '40px' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextLevel}
                        style={{
                            padding: '22px', borderRadius: '30px', background: 'linear-gradient(to bottom, #4CAF50, #2E7D32)',
                            color: 'white', border: 'none', fontWeight: 900, fontSize: '1.6rem',
                            cursor: 'pointer', boxShadow: '0 10px 0 #1B5E20'
                        }}
                    >
                        NEXT CITY 🚍
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('intro')}
                        style={{
                            padding: '15px', borderRadius: '25px', background: '#F5F5F5',
                            color: '#333', border: '4px solid #DDD', fontWeight: 900, cursor: 'pointer'
                        }}
                    >
                        GO HOME 🏠
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100vh', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
            {gameState === 'intro' && renderIntro()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'success' && renderSuccess()}
        </div>
    );
};

export default TrafficLightHero;
