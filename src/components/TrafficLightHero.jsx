import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, Play } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const LIGHT_DATA = {
    RED: { color: '#FF2E63', glow: 'rgba(255,46,99,0.6)', face: '😠', msg: 'STOP!', hint: 'RED means STOP! Wait for green.' },
    YELLOW: { color: '#FFD700', glow: 'rgba(255,215,0,0.6)', face: '😮', msg: 'WAIT...', hint: 'YELLOW means WAIT! Almost time to go.' },
    GREEN: { color: '#08D9D6', glow: 'rgba(8,217,214,0.6)', face: '😃', msg: 'GO GO!', hint: 'GREEN means GO! Walk safely.' },
};

const CHARACTERS = [
    { id: 'girl', icon: '👧', name: 'Leila' },
    { id: 'puppy', icon: '🐶', name: 'Puddles' },
    { id: 'robot', icon: '🤖', name: 'Bolts' },
    { id: 'hero', icon: '🦸', name: 'SuperKid' },
];

// Sequences per level
const LEVEL_SEQUENCES = {
    1: ['RED', 'GREEN'],
    2: ['RED', 'YELLOW', 'GREEN'],
    3: ['RED', 'YELLOW', 'GREEN', 'YELLOW'],
};

// Duration (ms) each light stays on per level
const LIGHT_DURATIONS = (light, level) => {
    if (light === 'YELLOW') return 2200;
    if (light === 'RED') return level === 1 ? 4000 : level === 2 ? 3500 : 2800;
    /* GREEN */             return level === 1 ? 5000 : level === 2 ? 4500 : 3800;
};

const TrafficLightHero = ({ onBack }) => {
    const [gameState, setGameState] = useState('intro');   // 'intro' | 'playing' | 'success'
    const [level, setLevel] = useState(1);
    const [character, setCharacter] = useState(CHARACTERS[0]);
    const [currentLight, setCurrentLight] = useState('RED');
    const [progress, setProgress] = useState(0);
    const [stars, setStars] = useState(0);
    const [isWalking, setIsWalking] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintMsg, setHintMsg] = useState('');
    const [mistakeCount, setMistakeCount] = useState(0);

    // Use refs for values needed inside timers / intervals without re-creating them
    const currentLightRef = useRef('RED');
    const gameStateRef = useRef('intro');
    const isWalkingRef = useRef(false);
    const progressRef = useRef(0);
    const lightTimerRef = useRef(null);
    const walkIntervalRef = useRef(null);
    const hintTimerRef = useRef(null);
    const levelRef = useRef(1);

    // Keep refs in sync with state
    useEffect(() => { currentLightRef.current = currentLight; }, [currentLight]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    useEffect(() => { isWalkingRef.current = isWalking; }, [isWalking]);
    useEffect(() => { progressRef.current = progress; }, [progress]);
    useEffect(() => { levelRef.current = level; }, [level]);

    // ─────────────────────────────────────────────────────────────
    //  Clean-up all timers
    // ─────────────────────────────────────────────────────────────
    const clearAllTimers = useCallback(() => {
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);
        if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        lightTimerRef.current = null;
        walkIntervalRef.current = null;
        hintTimerRef.current = null;
    }, []);

    useEffect(() => () => clearAllTimers(), [clearAllTimers]);

    // ─────────────────────────────────────────────────────────────
    //  Win / Mistake handlers (use refs → no stale closure)
    // ─────────────────────────────────────────────────────────────
    const triggerWin = useCallback(() => {
        clearAllTimers();
        setIsWalking(false);
        setGameState('success');
        setProgress(100);
        playSound('correct');
        speak("Yay! You are a road safety hero!", 'en-US', 1.1);
        setStars(s => s + 1);
    }, [clearAllTimers]);

    const triggerMistake = useCallback(() => {
        setIsWalking(false);
        isWalkingRef.current = false;
        playSound('wrong');
        const msg = LIGHT_DATA[currentLightRef.current].hint;
        setHintMsg(msg);
        setShowHint(true);
        setMistakeCount(c => c + 1);
        speak(msg, 'en-US', 1.0);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setShowHint(false), 2500);
    }, []);

    // ─────────────────────────────────────────────────────────────
    //  Light cycle engine
    // ─────────────────────────────────────────────────────────────
    const startLightCycle = useCallback((forLevel) => {
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);
        const sequence = LEVEL_SEQUENCES[forLevel] || LEVEL_SEQUENCES[1];
        let idx = 0;

        const next = () => {
            if (gameStateRef.current !== 'playing') return;
            const light = sequence[idx];
            setCurrentLight(light);
            currentLightRef.current = light;
            speak(LIGHT_DATA[light].hint, 'en-US', 1.1);
            idx = (idx + 1) % sequence.length;
            lightTimerRef.current = setTimeout(next, LIGHT_DURATIONS(light, forLevel));
        };
        next();
    }, []);

    // ─────────────────────────────────────────────────────────────
    //  Walking engine (runs every 30 ms while isWalking)
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (gameState !== 'playing') {
            if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
            return;
        }

        if (isWalking) {
            walkIntervalRef.current = setInterval(() => {
                const light = currentLightRef.current;
                if (light === 'GREEN') {
                    setProgress(prev => {
                        const next = prev + 0.9;
                        progressRef.current = next;
                        if (next >= 88) {
                            triggerWin();
                            return 88;
                        }
                        return next;
                    });
                } else {
                    // Player walked on RED or YELLOW → mistake
                    triggerMistake();
                }
            }, 30);
        } else {
            if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
            walkIntervalRef.current = null;
        }

        return () => {
            if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
            walkIntervalRef.current = null;
        };
    }, [gameState, isWalking, triggerWin, triggerMistake]);

    // ─────────────────────────────────────────────────────────────
    //  Start / restart level
    // ─────────────────────────────────────────────────────────────
    const beginLevel = useCallback((forLevel) => {
        clearAllTimers();
        setProgress(0);
        progressRef.current = 0;
        setCurrentLight('RED');
        currentLightRef.current = 'RED';
        setIsWalking(false);
        isWalkingRef.current = false;
        setShowHint(false);
        setMistakeCount(0);
        setGameState('playing');
        gameStateRef.current = 'playing';
        // Small delay so state settles before timers fire
        setTimeout(() => startLightCycle(forLevel), 200);
    }, [clearAllTimers, startLightCycle]);

    const handleNextLevel = useCallback(() => {
        const next = Math.min(level + 1, 3);
        setLevel(next);
        levelRef.current = next;
        beginLevel(next);
    }, [level, beginLevel]);

    const handlePlayAgain = useCallback(() => {
        beginLevel(level);
    }, [level, beginLevel]);

    // ─────────────────────────────────────────────────────────────
    //  Touch / mouse walk controls (pointer events)
    // ─────────────────────────────────────────────────────────────
    const startWalking = () => {
        if (gameStateRef.current !== 'playing') return;
        setIsWalking(true);
        isWalkingRef.current = true;
        playSound('click');
    };
    const stopWalking = () => {
        setIsWalking(false);
        isWalkingRef.current = false;
    };

    // ─────────────────────────────────────────────────────────────
    //  INTRO SCREEN
    // ─────────────────────────────────────────────────────────────
    const renderIntro = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
            padding: '20px', color: 'white',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Animated background circles */}
            {[...Array(6)].map((_, i) => (
                <motion.div key={i}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
                    transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
                    style={{
                        position: 'absolute',
                        width: `${80 + i * 60}px`, height: `${80 + i * 60}px`,
                        borderRadius: '50%',
                        background: i % 3 === 0 ? '#FF2E63' : i % 3 === 1 ? '#FFD700' : '#08D9D6',
                        top: `${10 + i * 13}%`, left: `${5 + i * 15}%`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* Stars display */}
            {stars > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                        position: 'absolute', top: '100px', right: '20px',
                        background: '#FFD700', borderRadius: '20px',
                        padding: '8px 18px', fontWeight: 900, fontSize: '1.2rem',
                        border: '4px solid white', color: '#333',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                    }}>⭐ {stars}</motion.div>
            )}

            {/* Title */}
            <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                style={{ textAlign: 'center', marginBottom: '32px', zIndex: 1 }}>
                <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    style={{ fontSize: 'min(5rem, 18vw)', lineHeight: 1, marginBottom: '10px' }}>
                    🚦
                </motion.div>
                <h1 style={{
                    fontSize: 'min(2.8rem, 9vw)', fontWeight: 900, margin: 0,
                    textShadow: '0 6px 0 rgba(0,0,0,0.3)'
                }}>
                    Traffic Light{' '}
                    <span style={{ color: '#FFD700' }}>Hero!</span>
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.85, margin: '8px 0 0' }}>
                    🚸 Learn road safety the fun way!
                </p>
            </motion.div>

            {/* Level badge */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 }}
                style={{
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.25)', borderRadius: '30px',
                    padding: '8px 28px', marginBottom: '28px', fontWeight: 900,
                    fontSize: '1rem', letterSpacing: '2px', zIndex: 1,
                }}>
                🏙️ LEVEL {level}
            </motion.div>

            {/* Character select card */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    background: 'rgba(255,255,255,0.95)', padding: '28px 24px',
                    borderRadius: '36px', maxWidth: '420px', width: '100%',
                    border: '6px solid #FFD700',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)', zIndex: 1,
                }}>
                <h3 style={{
                    textAlign: 'center', color: '#0F2027', fontSize: '1.4rem',
                    margin: '0 0 20px', fontFamily: 'inherit'
                }}>
                    🎭 Pick Your Hero!
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {CHARACTERS.map(c => (
                        <motion.button key={c.id}
                            whileHover={{ scale: 1.12, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setCharacter(c); playSound('click'); }}
                            style={{
                                padding: '14px 6px', borderRadius: '20px',
                                border: character.id === c.id ? '5px solid #08D9D6' : '5px solid #E2E8F0',
                                background: character.id === c.id
                                    ? 'linear-gradient(135deg, #CAF0F8, #ADE8F4)'
                                    : 'white',
                                cursor: 'pointer', fontSize: '2.2rem',
                                boxShadow: character.id === c.id
                                    ? '0 6px 0 #00B4D8' : '0 4px 0 #CBD5E1',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '4px',
                            }}>
                            {c.icon}
                            <span style={{
                                fontSize: '0.55rem', fontWeight: 900, color: '#64748B',
                                textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}>
                                {c.name}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Rules summary */}
                <div style={{
                    background: '#F8FAFC', borderRadius: '20px',
                    padding: '14px 16px', margin: '20px 0', border: '2px solid #E2E8F0'
                }}>
                    <p style={{
                        margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#334155',
                        fontFamily: 'inherit', lineHeight: 1.6
                    }}>
                        <span style={{ color: '#FF2E63' }}>🔴 RED</span> → STOP &nbsp;|&nbsp;
                        <span style={{ color: '#D4A017' }}>🟡 YELLOW</span> → WAIT &nbsp;|&nbsp;
                        <span style={{ color: '#08D9D6' }}>🟢 GREEN</span> → GO!
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>
                        👆 Tap &amp; hold to walk. Only walk on GREEN!
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { playSound('click'); beginLevel(level); }}
                    style={{
                        width: '100%', padding: '20px',
                        background: 'linear-gradient(to bottom, #4CAF50, #2E7D32)',
                        color: 'white', border: 'none', borderRadius: '24px',
                        fontSize: '1.6rem', fontWeight: 900, fontFamily: 'inherit',
                        boxShadow: '0 10px 0 #1B5E20', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    }}>
                    LET&apos;S GO! <Play fill="white" size={28} />
                </motion.button>
            </motion.div>
        </div>
    );

    // ─────────────────────────────────────────────────────────────
    //  PLAYING SCREEN
    // ─────────────────────────────────────────────────────────────
    const renderPlaying = () => (
        <div style={{
            position: 'relative', width: '100%', height: '100vh', overflow: 'hidden',
            background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0FF 55%, #7F8C8D 55%, #5D6D7E 100%)',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
            userSelect: 'none',
        }}>
            {/* ——— TAP ZONE (behind all UI controls) ——— */}
            <div
                onMouseDown={startWalking}
                onMouseUp={stopWalking}
                onMouseLeave={stopWalking}
                onTouchStart={(e) => { e.preventDefault(); startWalking(); }}
                onTouchEnd={stopWalking}
                onTouchCancel={stopWalking}
                style={{
                    position: 'absolute', inset: 0,
                    zIndex: 5, cursor: 'pointer',
                    touchAction: 'none',
                }}
            />

            {/* ——— HEADER (above tap zone) ——— */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                padding: '12px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 100,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
            }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { clearAllTimers(); setGameState('intro'); }}
                    style={{
                        padding: '10px 20px', background: 'white',
                        border: '4px solid #023E8A', borderRadius: '16px',
                        fontWeight: 900, cursor: 'pointer', color: '#023E8A',
                        fontFamily: 'inherit', fontSize: '0.9rem',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                        zIndex: 101,
                    }}>
                    ⬅ HOME
                </motion.button>

                <div style={{ display: 'flex', gap: '10px', zIndex: 101 }}>
                    <div style={{
                        background: '#FFD700', padding: '8px 18px', borderRadius: '20px',
                        fontWeight: 900, border: '4px solid white',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.15)', fontSize: '1rem',
                    }}>
                        ⭐ {stars}
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.9)', padding: '8px 14px',
                        borderRadius: '20px', fontWeight: 900, border: '4px solid white',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.15)', color: '#1E293B', fontSize: '0.85rem',
                    }}>
                        LVL {level}
                    </div>
                </div>
            </div>

            {/* ——— PROGRESS BAR ——— */}
            <div style={{
                position: 'absolute', top: '72px', left: '16px', right: '16px',
                height: '16px', background: 'rgba(255,255,255,0.4)',
                borderRadius: '10px', overflow: 'hidden', zIndex: 50,
                border: '3px solid rgba(255,255,255,0.6)',
            }}>
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'tween', duration: 0.1 }}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                        borderRadius: '8px',
                    }}
                />
            </div>

            {/* ——— CITY SKYLINE ——— */}
            <div style={{
                position: 'absolute', bottom: '45%', width: '100%',
                display: 'flex', justifyContent: 'space-around',
                pointerEvents: 'none', zIndex: 6,
            }}>
                {['🏠', '🏙️', '🌳', '🏫', '🌳'].map((icon, i) => (
                    <motion.span key={i}
                        animate={{ y: [0, -4 - i * 2, 0] }}
                        transition={{ repeat: Infinity, duration: 3 + i * 0.5 }}
                        style={{ fontSize: `${4 + i * 0.5}rem`, opacity: 0.9 }}>
                        {icon}
                    </motion.span>
                ))}
            </div>

            {/* ——— ROAD / ZEBRA CROSSING ——— */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                background: '#4A5568',
                borderTop: '6px solid #718096',
                zIndex: 4,
            }}>
                {/* Zebra stripes */}
                <div style={{
                    position: 'absolute', top: '30%', left: '10%', right: '20%',
                    height: '50%', display: 'flex', gap: '8px', alignItems: 'center',
                }}>
                    {[...Array(14)].map((_, i) => (
                        <div key={i} style={{
                            flex: 1, height: '100%',
                            background: 'rgba(255,255,255,0.85)',
                            borderRadius: '3px',
                        }} />
                    ))}
                </div>
                {/* Road markings */}
                <div style={{
                    position: 'absolute', bottom: '15px', left: 0, right: 0,
                    borderTop: '4px dashed rgba(255,255,255,0.4)',
                }} />
            </div>

            {/* ——— TRAFFIC LIGHT ——— */}
            <div style={{
                position: 'absolute', top: '12%', right: '8%', zIndex: 50,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                <motion.div
                    animate={{ rotate: currentLight === 'RED' ? [-1, 1] : 0 }}
                    transition={{ repeat: Infinity, duration: 0.15, repeatType: 'reverse' }}
                    style={{
                        width: 'min(90px, 22vw)',
                        background: 'linear-gradient(to bottom, #1A1A2E, #16213E)',
                        padding: '16px',
                        borderRadius: '32px',
                        display: 'flex', flexDirection: 'column', gap: '14px',
                        border: '6px solid #0F3460',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}>
                    {(['RED', 'YELLOW', 'GREEN']).map(light => (
                        <motion.div key={light}
                            animate={{
                                scale: currentLight === light ? 1.15 : 1,
                                opacity: currentLight === light ? 1 : 0.2,
                            }}
                            style={{
                                width: 'min(52px, 14vw)', height: 'min(52px, 14vw)',
                                borderRadius: '50%',
                                background: LIGHT_DATA[light].color,
                                boxShadow: currentLight === light
                                    ? `0 0 30px 10px ${LIGHT_DATA[light].glow}` : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.4rem',
                            }}>
                            {currentLight === light ? LIGHT_DATA[light].face : ''}
                        </motion.div>
                    ))}
                </motion.div>
                {/* Pole */}
                <div style={{ width: '10px', height: '100px', background: '#1A1A2E', borderRadius: '5px' }} />
                {/* Base */}
                <div style={{ width: '40px', height: '14px', background: '#0F3460', borderRadius: '6px' }} />
            </div>

            {/* ——— LIGHT INDICATOR BANNER ——— */}
            <div style={{
                position: 'absolute', top: '15%', left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50, textAlign: 'center',
            }}>
                <AnimatePresence mode="wait">
                    <motion.div key={currentLight}
                        initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.4, rotate: 15, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                            background: 'white', padding: '14px 32px', borderRadius: '30px',
                            border: `7px solid ${LIGHT_DATA[currentLight].color}`,
                            boxShadow: `0 10px 30px ${LIGHT_DATA[currentLight].glow}`,
                            whiteSpace: 'nowrap',
                        }}>
                        <h2 style={{
                            margin: 0, fontSize: 'min(2.6rem, 8vw)', fontWeight: 900,
                            color: LIGHT_DATA[currentLight].color,
                            fontFamily: 'inherit',
                        }}>
                            {LIGHT_DATA[currentLight].msg}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ——— CHARACTER ——— */}
            <motion.div
                animate={{
                    left: `${4 + progress * 0.85}%`,
                    y: isWalking ? [0, -12, 0] : 0,
                    scaleX: 1,
                }}
                transition={{
                    left: { type: 'tween', duration: 0.08 },
                    y: { repeat: Infinity, duration: 0.28 },
                }}
                style={{
                    position: 'absolute', bottom: '18%',
                    fontSize: 'min(5.5rem, 16vw)',
                    transform: 'translateX(-50%)',
                    zIndex: 40,
                    filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))',
                    pointerEvents: 'none',
                }}>
                {character.icon}
            </motion.div>

            {/* ——— WALKING PROMPT ——— */}
            <div style={{
                position: 'absolute', bottom: '6%', left: '50%',
                transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none',
            }}>
                <motion.div
                    animate={{ scale: isWalking ? 0.95 : [1, 1.06, 1] }}
                    transition={{ repeat: isWalking ? 0 : Infinity, duration: 1.8 }}
                    style={{
                        background: isWalking
                            ? 'rgba(8,217,214,0.95)'
                            : 'rgba(255,255,255,0.92)',
                        padding: '12px 32px', borderRadius: '28px',
                        fontWeight: 900, fontSize: '1.2rem',
                        color: isWalking ? 'white' : '#023E8A',
                        border: `4px solid ${isWalking ? '#48CAE4' : '#00B4D8'}`,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        fontFamily: 'inherit',
                    }}>
                    {isWalking ? '🏃 Walking...' : '👆 TAP & HOLD TO WALK!'}
                </motion.div>
            </div>

            {/* ——— MISTAKE HINT OVERLAY ——— */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 200,
                            background: 'rgba(255,46,99,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            pointerEvents: 'none',
                        }}>
                        <motion.div
                            animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            style={{
                                background: 'white', padding: '32px 40px',
                                borderRadius: '36px', border: '10px solid #FF2E63',
                                textAlign: 'center',
                                boxShadow: '0 20px 60px rgba(255,46,99,0.5)',
                            }}>
                            <div style={{ fontSize: '5rem' }}>⚠️</div>
                            <h2 style={{
                                color: '#FF2E63', fontSize: '2rem', fontWeight: 900,
                                margin: '8px 0', fontFamily: 'inherit',
                            }}>OOPS!</h2>
                            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', margin: 0 }}>
                                {hintMsg}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ─────────────────────────────────────────────────────────────
    //  SUCCESS SCREEN
    // ─────────────────────────────────────────────────────────────
    const renderSuccess = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0F9B58 0%, #2E8B57 40%, #006400 100%)',
            textAlign: 'center', padding: '20px',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
        }}>
            {/* Confetti-like floating emojis */}
            {['🎊', '⭐', '🏅', '🎉', '✨', '🌟'].map((e, i) => (
                <motion.span key={i}
                    animate={{ y: [-20, -80, -20], x: [0, (i % 2 === 0 ? 30 : -30), 0], opacity: [0.8, 0.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3 }}
                    style={{
                        position: 'absolute', fontSize: '2rem',
                        top: `${10 + (i * 12)}%`,
                        left: `${5 + (i * 15)}%`,
                        pointerEvents: 'none',
                    }}>
                    {e}
                </motion.span>
            ))}

            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{
                    background: 'white', padding: '40px 36px', borderRadius: '48px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                    border: '10px solid #FFD700',
                    maxWidth: '440px', width: '100%', position: 'relative', zIndex: 1,
                }}>

                <motion.div
                    animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 2 }}>
                    <Trophy size={100} color="#FFD700" />
                </motion.div>

                <h1 style={{
                    fontSize: '2.4rem', color: '#1B5E20', fontWeight: 900,
                    margin: '16px 0 8px', fontFamily: 'inherit',
                }}>
                    SAFE WALKER! 🦺
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#4A5568', fontWeight: 700, margin: '0 0 8px' }}>
                    You crossed like a true road hero! 🎖️
                </p>
                {mistakeCount === 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
                        style={{
                            background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                            borderRadius: '16px', padding: '8px 20px',
                            fontWeight: 900, color: 'white', fontSize: '0.95rem',
                            display: 'inline-block', margin: '8px 0',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                        }}>
                        🌟 PERFECT — No Mistakes!
                    </motion.div>
                )}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', margin: '16px 0 0' }}>
                    {[...Array(stars)].map((_, i) => (
                        <motion.span key={i}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.12 }}
                            style={{ fontSize: '2rem' }}>⭐</motion.span>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
                    {level < 3 && (
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={handleNextLevel}
                            style={{
                                padding: '18px', borderRadius: '24px',
                                background: 'linear-gradient(to bottom, #4CAF50, #2E7D32)',
                                color: 'white', border: 'none', fontWeight: 900,
                                fontSize: '1.4rem', cursor: 'pointer',
                                boxShadow: '0 8px 0 #1B5E20', fontFamily: 'inherit',
                            }}>
                            NEXT LEVEL {level + 1} 🚍
                        </motion.button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={handlePlayAgain}
                        style={{
                            padding: '14px', borderRadius: '20px',
                            background: 'linear-gradient(to bottom, #00B4D8, #0077B6)',
                            color: 'white', border: 'none', fontWeight: 900,
                            fontSize: '1.1rem', cursor: 'pointer',
                            boxShadow: '0 6px 0 #005F8F', fontFamily: 'inherit',
                        }}>
                        🔄 Play Again
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => { clearAllTimers(); setGameState('intro'); }}
                        style={{
                            padding: '12px', borderRadius: '18px',
                            background: '#F1F5F9', color: '#334155',
                            border: '4px solid #CBD5E1', fontWeight: 900,
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        🏠 Menu
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh' }}>
            {gameState === 'intro' && renderIntro()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'success' && renderSuccess()}
        </div>
    );
};

export default TrafficLightHero;
