import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Star, Trophy, ChevronLeft, Gauge, Zap } from 'lucide-react';
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
        desc: 'Super smooth! You will slide forever.'
    },
    {
        id: 'grass',
        name: 'Soft Grass',
        icon: '🌱',
        friction: 0.962,
        bg: 'linear-gradient(180deg, #E8F5E9 0%, #A5D6A7 100%)',
        floor: '#C8E6C9',
        accent: '#4CAF50',
        desc: 'Nice and green. Just right!'
    },
    {
        id: 'sand',
        name: 'Sandy Pit',
        icon: '⏳',
        friction: 0.88,
        bg: 'linear-gradient(180deg, #FFF8E1 0%, #FFE082 100%)',
        floor: '#FFECB3',
        accent: '#FFC107',
        desc: 'Lots of friction! It will slow you down.'
    }
];

const PUSH_FORCES = [
    { id: 'small', label: 'TINY PUSH', force: 10, color: '#4CAF50', shadow: '#2E7D32', icon: '🍃', effort: '🙂' },
    { id: 'medium', label: 'BIG PUSH', force: 22, color: '#FF9800', shadow: '#E65100', icon: '⚡', effort: '😲' },
    { id: 'max', label: 'GIANT PUSH', force: 34, color: '#F44336', shadow: '#B71C1C', icon: '🔥', effort: '😫' }
];

const ForceMotionGame = ({ onBack }) => {
    const [surfaceIdx, setSurfaceIdx] = useState(1);
    const [gameState, setGameState] = useState('aiming'); // 'aiming', 'pushing', 'stopped', 'win'
    const [boxPos, setBoxPos] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [targetPos, setTargetPos] = useState(65);
    const [stars, setStars] = useState(0);
    const [lastPush, setLastPush] = useState(null);
    const [showHint, setShowHint] = useState(null); // 'too-far', 'too-short'

    const gameLoopRef = useRef();
    const velocityRef = useRef(0);
    const boxPosRef = useRef(0);
    const gameStateRef = useRef('aiming');

    const currentSurface = SURFACES[surfaceIdx];

    const initRound = useCallback(() => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        setBoxPos(8);
        boxPosRef.current = 8;
        setVelocity(0);
        velocityRef.current = 0;
        setGameState('aiming');
        gameStateRef.current = 'aiming';
        setTargetPos(Math.floor(Math.random() * 50) + 38);
        setShowHint(null);
    }, []);

    useEffect(() => {
        initRound();
        speak("Push the box to the target! Choose your force.", 'en-US', 1.0);
        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
    }, [initRound]);

    const checkResult = useCallback(() => {
        const finalPos = boxPosRef.current;
        const distance = Math.abs(finalPos - targetPos);

        if (distance < 5.5) {
            setGameState('win');
            gameStateRef.current = 'win';
            playSound('correct');
            setStars(s => s + 5);
            speak("PERFECT! You used exactly the right force!", 'en-US', 1.1);
        } else {
            playSound('wrong');
            setGameState('stopped');
            gameStateRef.current = 'stopped';
            const tooFar = finalPos > targetPos;
            setShowHint(tooFar ? 'too-far' : 'too-short');
            speak(tooFar ? "Whoops! Too much force. It slid too far!" : "Almost! Use more force next time.", 'en-US', 1.0);
        }
    }, [targetPos]);

    const handlePush = (push) => {
        if (gameState !== 'aiming') return;
        playSound('click');
        setLastPush(push);
        setGameState('pushing');
        gameStateRef.current = 'pushing';

        velocityRef.current = push.force;
        setVelocity(push.force);

        speak(`${push.label}! Go!`, 'en-US', 1.0);

        // Start Physics Loop
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        gameLoopRef.current = setInterval(() => {
            // Apply Friction
            velocityRef.current *= currentSurface.friction;

            // Move Box
            boxPosRef.current += velocityRef.current * 0.12;

            // Sync React State (Throttled via frame)
            setBoxPos(boxPosRef.current);
            setVelocity(velocityRef.current);

            // Stop Condition
            if (velocityRef.current < 0.16) {
                clearInterval(gameLoopRef.current);
                checkResult();
            }

            // Wall Hit
            if (boxPosRef.current > 100) {
                boxPosRef.current = 100;
                velocityRef.current = 0;
                clearInterval(gameLoopRef.current);
                checkResult();
            }
        }, 30);
    };

    const toggleSurface = () => {
        playSound('click');
        setSurfaceIdx(prev => (prev + 1) % SURFACES.length);
        initRound();
    };

    return (
        <div style={{
            width: '100%', height: '100dvh', background: currentSurface.bg,
            fontFamily: '"Comic Sans MS", cursive', overflow: 'hidden', position: 'relative'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <motion.button onClick={onBack} whileTap={{ scale: 0.9 }}
                    style={{ padding: '12px 25px', background: 'white', border: `4px solid ${currentSurface.accent}`, borderRadius: '20px', fontWeight: 900, cursor: 'pointer', color: currentSurface.accent }}>
                    ⬅ EXIT
                </motion.button>
                <div style={{ background: 'white', padding: '10px 30px', borderRadius: '30px', border: `4px solid ${currentSurface.accent}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Star fill="#FFD700" color="#FFD700" size={24} />
                    <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{stars}</span>
                </div>
            </div>

            {/* Surface Logic Info */}
            <motion.div initial={{ x: -100 }} animate={{ x: 20 }} onClick={toggleSurface}
                style={{ position: 'absolute', top: '15dvh', left: 0, zIndex: 50, cursor: 'pointer' }}>
                <div style={{ background: 'white', padding: '15px 25px', borderRadius: '30px', border: `6px solid ${currentSurface.accent}`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem' }}>{currentSurface.icon}</div>
                    <h3 style={{ margin: '5px 0', fontSize: '1.1rem', color: currentSurface.accent }}>{currentSurface.name}</h3>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94A3B8' }}>TAP TO CHANGE</div>
                </div>
            </motion.div>

            {/* Instruction */}
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={gameState} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        style={{ background: 'white', padding: '12px 35px', borderRadius: '40px', display: 'inline-block', border: `4px solid ${currentSurface.accent}`, boxShadow: '0 8px 0 rgba(0,0,0,0.05)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1E293B', fontWeight: 900 }}>
                            {gameState === 'aiming' ? "Hit the Goal! ⭐" : "Go Box! Go! 📦"}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Ground */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '45dvh', background: currentSurface.floor, borderTop: '10px solid white' }}>
                {/* Friction visual markers */}
                <div style={{ width: '100%', height: '100%', opacity: 0.2, backgroundImage: `radial-gradient(${currentSurface.accent} 2px, transparent 2px)`, backgroundSize: '40px 40px' }} />

                {/* Goal Post */}
                <div style={{ position: 'absolute', left: `${targetPos}%`, bottom: '15%', transform: 'translateX(-50%)' }}>
                    <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Star size={90} fill="#FFD700" color="#FFA000" style={{ filter: 'drop-shadow(0 10px 15px rgba(255,215,0,0.6))' }} />
                    </motion.div>
                    <div style={{ width: '80px', height: '15px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', margin: '5px auto' }} />
                </div>

                {/* Character */}
                <motion.div animate={{ left: gameState === 'aiming' ? '3%' : `${boxPos - 12}%` }}
                    style={{ position: 'absolute', bottom: '18%', fontSize: 'min(9rem, 20vw)', zIndex: 60, transform: 'translateX(-100%)' }}>
                    {gameState === 'pushing' ? lastPush?.effort : '🧒'}
                    {gameState === 'pushing' && velocity > 15 && <motion.div animate={{ opacity: [0, 1, 0] }} style={{ position: 'absolute', top: 0, right: 0 }}>💢</motion.div>}
                </motion.div>

                {/* The Box */}
                <motion.div animate={{ left: `${boxPos}%`, rotate: velocity * 2.5 }}
                    transition={{ left: { type: 'tween', duration: 0.03 } }}
                    style={{ position: 'absolute', bottom: '18%', fontSize: 'min(8rem, 18vw)', zIndex: 70, transform: 'translateX(-50%)' }}>
                    📦
                    {velocity > 2 && currentSurface.id === 'ice' && <motion.div animate={{ opacity: [1, 0] }} style={{ position: 'absolute', bottom: 0, left: -20, height: '4px', width: '60px', background: 'white', borderRadius: '4px' }} />}
                </motion.div>
            </div>

            {/* Controls */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'white', padding: '20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', display: 'flex', justifyContent: 'center', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', zIndex: 200 }}>
                <AnimatePresence mode="wait">
                    {gameState === 'aiming' ? (
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '600px' }}>
                            {PUSH_FORCES.map(p => (
                                <motion.button key={p.id} whileTap={{ scale: 0.9 }} onClick={() => handlePush(p)}
                                    style={{ flex: 1, padding: '15px', borderRadius: '25px', background: p.color, color: 'white', border: 'none', boxShadow: `0 8px 0 ${p.shadow}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                                    <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>{p.label}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                            {showHint && (
                                <div style={{ color: '#E91E63', fontWeight: 900, marginBottom: '10px' }}>
                                    {showHint === 'too-far' ? "WHOOPS! TOO MUCH POWER! 🚀" : "ALMOST! NEED MORE POWER! 💪"}
                                </div>
                            )}
                            <button onClick={initRound} style={{ padding: '18px 50px', borderRadius: '30px', background: '#3498DB', color: 'white', fontSize: '1.4rem', fontWeight: 900, border: 'none', boxShadow: '0 8px 0 #2980B9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RotateCcw /> TRY AGAIN
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {gameState === 'win' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Trophy size={150} color="#FFD700" />
                        </motion.div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#2E7D32', margin: '20px 0' }}>GOAL HIT! 🏆</h1>
                        <p style={{ fontSize: '1.4rem', color: '#555', fontWeight: 700 }}>You are a Force Magic Master!</p>
                        <button onClick={initRound} style={{ marginTop: '30px', padding: '20px 60px', borderRadius: '35px', background: '#4CAF50', color: 'white', fontSize: '1.8rem', fontWeight: 900, border: 'none', boxShadow: '0 10px 0 #1B5E20', cursor: 'pointer' }}>
                            NEXT ROUND 🎮
                        </button>
                        <button onClick={onBack} style={{ marginTop: '15px', fontSize: '1.2rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900 }}>EXIT</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForceMotionGame;
