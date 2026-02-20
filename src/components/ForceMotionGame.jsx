import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Star, Trophy, ChevronLeft, Wind, Gauge } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const SURFACES = [
    {
        id: 'ice',
        name: 'Slippery Ice',
        icon: '❄️',
        friction: 0.992,
        bg: 'linear-gradient(180deg, #E0F7FA 0%, #80DEEA 100%)',
        floor: '#B2EBF2',
        accent: '#00BCD4',
        desc: 'Whoa! No friction here. You will slide super far!'
    },
    {
        id: 'grass',
        name: 'Soft Grass',
        icon: '🌱',
        friction: 0.965,
        bg: 'linear-gradient(180deg, #E8F5E9 0%, #A5D6A7 100%)',
        floor: '#C8E6C9',
        accent: '#4CAF50',
        desc: 'Nice and green! Just the right amount of friction.'
    },
    {
        id: 'sand',
        name: 'Sandy Pit',
        icon: '⏳',
        friction: 0.88,
        bg: 'linear-gradient(180deg, #FFF8E1 0%, #FFE082 100%)',
        floor: '#FFECB3',
        accent: '#FFC107',
        desc: 'Crunchy sand! Lots of friction will slow you down.'
    }
];

const PUSH_FORCES = [
    { id: 'small', label: 'LITTLE PUSH', force: 10, color: '#4CAF50', shadow: '#2E7D32', icon: '🍃', effort: '🙂' },
    { id: 'medium', label: 'MEDIUM PUSH', force: 20, color: '#FF9800', shadow: '#E65100', icon: '⚡', effort: '😲' },
    { id: 'big', label: 'GIANT PUSH', force: 32, color: '#F44336', shadow: '#B71C1C', icon: '🔥', effort: '😫' }
];

const ForceMotionGame = ({ onBack }) => {
    const [surfaceIdx, setSurfaceIdx] = useState(1);
    const [gameState, setGameState] = useState('aiming'); // 'aiming', 'pushing', 'stopped', 'win'
    const [boxPos, setBoxPos] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [targetPos, setTargetPos] = useState(65);
    const [stars, setStars] = useState(0);
    const [lastPush, setLastPush] = useState(null);
    const [showHint, setShowHint] = useState(false);

    const gameLoopRef = useRef();
    const currentSurface = SURFACES[surfaceIdx];

    const initRound = useCallback(() => {
        setBoxPos(5);
        setVelocity(0);
        setGameState('aiming');
        setTargetPos(Math.floor(Math.random() * 50) + 35);
        setShowHint(false);
    }, []);

    useEffect(() => {
        initRound();
        speak("Welcome to the Playground! Choose a surface and push the box to the star!");
    }, [initRound]);

    const handlePush = (push) => {
        if (gameState !== 'aiming') return;
        playSound('click');
        setLastPush(push);
        setGameState('pushing');
        setVelocity(push.force);
        speak(`${push.label}! Go!`);
    };

    useEffect(() => {
        if (gameState === 'pushing') {
            gameLoopRef.current = setInterval(() => {
                setVelocity(v => {
                    const nextV = v * currentSurface.friction;
                    if (nextV < 0.15) {
                        clearInterval(gameLoopRef.current);
                        setGameState('stopped');
                        checkResult();
                        return 0;
                    }
                    return nextV;
                });

                setBoxPos(prev => prev + velocity * 0.12);
            }, 30);
        }
        return () => clearInterval(gameLoopRef.current);
    }, [gameState, velocity, currentSurface.friction]);

    const checkResult = () => {
        const distance = Math.abs(boxPos - targetPos);
        if (distance < 6) {
            setGameState('win');
            playSound('correct');
            setStars(s => s + 5);
            speak("PERFECT! You used exactly the right force!", 'en-US', 1.1);
        } else {
            playSound('wrong');
            const tooFar = boxPos > targetPos;
            speak(tooFar ? "Whoops! Too much force. It slid too far!" : "Almost! Use more force next time.");
            setShowHint(true);
        }
    };

    const toggleSurface = () => {
        playSound('click');
        setSurfaceIdx(prev => (prev + 1) % SURFACES.length);
        initRound();
    };

    return (
        <div style={{
            width: '100%', height: '100vh',
            background: currentSurface.bg,
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            overflow: 'hidden', position: 'relative'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={onBack}
                    style={{ padding: '12px 25px', background: 'white', border: `4px solid ${currentSurface.accent}`, borderRadius: '20px', fontWeight: 900, cursor: 'pointer', color: currentSurface.accent }}
                >
                    ⬅ EXIT
                </motion.button>
                <div style={{ background: 'white', padding: '12px 30px', borderRadius: '30px', border: `4px solid ${currentSurface.accent}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Star fill="#FFD700" color="#FFD700" size={24} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#333' }}>{stars}</span>
                </div>
            </div>

            {/* Instruction Banner */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{ background: 'white', padding: '15px 40px', borderRadius: '40px', display: 'inline-block', boxShadow: '0 10px 0 rgba(0,0,0,0.05)', border: `5px solid ${currentSurface.accent}` }}
                >
                    <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1E293B', fontWeight: 900 }}>
                        {gameState === 'aiming' ? "Can you hit the Star? ⭐" :
                            gameState === 'pushing' ? "Wheeeee! Look at it go!" : "Try Again! 🔄"}
                    </h2>
                </motion.div>
            </div>

            {/* Surface Selector Card */}
            <motion.div
                initial={{ x: -100 }} animate={{ x: 20 }}
                style={{ position: 'absolute', top: '20%', left: 0, zIndex: 50, cursor: 'pointer' }}
                onClick={toggleSurface}
            >
                <div style={{ background: 'white', padding: '20px', borderRadius: '35px', border: `6px solid ${currentSurface.accent}`, boxShadow: '0 15px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '4rem' }}>{currentSurface.icon}</motion.div>
                    <h3 style={{ margin: '10px 0', fontSize: '1.2rem', color: currentSurface.accent }}>{currentSurface.name}</h3>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Tap to Change!</div>
                </div>
            </motion.div>

            {/* Ground / Road */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '45%', background: currentSurface.floor, borderTop: '10px solid white' }}>
                {/* Visual texture for the floor */}
                <div style={{ width: '130%', height: '100%', position: 'absolute', left: '-10%', opacity: 0.3, background: `repeating-linear-gradient(90deg, transparent, transparent 150px, rgba(255,255,255,0.4) 150px, rgba(255,255,255,0.4) 155px)` }} />

                {/* Target Star */}
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: 'absolute', left: `${targetPos}%`, bottom: '25%', transform: 'translateX(-50%)', textAlign: 'center' }}
                >
                    <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Star size={100} fill="#FFD700" color="#FFA000" style={{ filter: 'drop-shadow(0 10px 15px rgba(255,215,0,0.5))' }} />
                    </motion.div>
                    <div style={{ width: '120px', height: '20px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', margin: '0 auto' }} />
                </motion.div>

                {/* The Box */}
                <motion.div
                    animate={{
                        left: `${boxPos}%`,
                        rotate: velocity * 2,
                        scale: velocity > 2 ? [1, 1.02, 1] : 1
                    }}
                    style={{ position: 'absolute', left: '0%', bottom: '20%', fontSize: 'min(9rem, 20vw)', transform: 'translate(-50%, 0)', zIndex: 60 }}
                >
                    📦
                    {/* Sliding Effects */}
                    {velocity > 1 && (
                        <div style={{ position: 'absolute', bottom: 10, left: -40, zIndex: -1 }}>
                            {currentSurface.id === 'ice' && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.2 }} style={{ width: '100px', height: '5px', background: 'white', borderRadius: '5px' }} />}
                            {currentSurface.id === 'sand' && <motion.div animate={{ y: [0, -20], x: [0, -30], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.3 }} style={{ fontSize: '1.5rem' }}>💨</motion.div>}
                        </div>
                    )}
                </motion.div>

                {/* The Character */}
                <motion.div
                    animate={{
                        left: gameState === 'aiming' ? '5%' : `${boxPos - 12}%`,
                        scale: gameState === 'pushing' ? 1.1 : 1,
                    }}
                    style={{ position: 'absolute', bottom: '18%', fontSize: 'min(10rem, 22vw)', zIndex: 55, transform: 'translateX(-100%)' }}
                >
                    {gameState === 'pushing' ? lastPush?.effort : '🧒'}
                    {/* Effort lines */}
                    {gameState === 'pushing' && velocity > 20 && (
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.2 }} style={{ position: 'absolute', top: 0, left: -30, fontSize: '2rem' }}>💢</motion.div>
                    )}
                </motion.div>
            </div>

            {/* Bottom Controls */}
            <div style={{
                position: 'absolute', bottom: 0, width: '100%', padding: '20px',
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                borderTop: '5px solid #E2E8F0', display: 'flex', justifyContent: 'center', gap: '20px',
                zIndex: 200
            }}>
                <AnimatePresence mode="wait">
                    {gameState === 'aiming' ? (
                        <motion.div
                            key="buttons" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
                            style={{ display: 'flex', gap: '20px' }}
                        >
                            {PUSH_FORCES.map(p => (
                                <motion.button
                                    key={p.id}
                                    whileHover={{ scale: 1.1, y: -10 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePush(p)}
                                    style={{
                                        padding: '15px 25px', borderRadius: '30px', background: p.color,
                                        color: 'white', fontWeight: 900, border: 'none',
                                        boxShadow: `0 10px 0 ${p.shadow}`, cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        minWidth: '150px'
                                    }}
                                >
                                    <span style={{ fontSize: '2.5rem' }}>{p.icon}</span>
                                    <span style={{ fontSize: '1.1rem' }}>{p.label}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="retry-panel" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                            {showHint && (
                                <div style={{ color: '#E91E63', fontWeight: 900, marginBottom: '10px', fontSize: '1.2rem' }}>
                                    {boxPos > targetPos ? "Too Much Power! 🚀" : "Need More Power! 💪"}
                                </div>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={initRound}
                                style={{
                                    padding: '20px 60px', borderRadius: '40px', background: '#3498DB',
                                    color: 'white', fontWeight: 900, fontSize: '1.5rem', border: 'none',
                                    boxShadow: '0 10px 0 #2980B9', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '15px'
                                }}
                            >
                                <RotateCcw size={32} /> TRY AGAIN
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Victory Screen */}
            <AnimatePresence>
                {gameState === 'win' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                    >
                        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Trophy size={180} color="#FFD700" style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.5))' }} />
                        </motion.div>
                        <h1 style={{ fontSize: '4rem', color: '#2E7D32', fontWeight: 900, margin: '20px 0' }}>FORCE CHAMPION! 🏆</h1>
                        <p style={{ fontSize: '1.8rem', color: '#666', fontWeight: 700 }}>You mastered friction and force!</p>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={initRound}
                                style={{ padding: '25px 50px', borderRadius: '40px', background: '#4CAF50', color: 'white', border: 'none', fontSize: '1.8rem', fontWeight: 900, boxShadow: '0 12px 0 #2E7D32', cursor: 'pointer' }}
                            >
                                PLAY AGAIN 🎮
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={onBack}
                                style={{ padding: '25px 50px', borderRadius: '40px', background: 'white', color: '#333', border: '6px solid #DDD', fontSize: '1.8rem', fontWeight: 900, cursor: 'pointer' }}
                            >
                                BACK 🏠
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForceMotionGame;
