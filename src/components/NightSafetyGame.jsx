import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, ArrowLeft, ArrowRight, Star, Moon, CloudRain, Lightbulb } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const GEAR_ITEMS = [
    { id: 'jacket', icon: '🦺', name: 'Glow Vest', desc: 'Makes you bright!' },
    { id: 'light', icon: '🔦', name: 'Flashlight', desc: 'See the road!' },
    { id: 'shoes', icon: '👟', name: 'Neon Shoes', desc: 'Flashy feet!' },
    { id: 'armband', icon: '🎗️', name: 'Reflector', desc: 'Safe arms!' }
];

const NightSafetyGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('intro'); // 'intro', 'gear_selection', 'spot_selection', 'look_checks', 'crossing', 'success'
    const [level, setLevel] = useState(1);
    const [selectedGear, setSelectedGear] = useState([]);
    const [lookedAround, setLookedAround] = useState({ left: false, right: false });
    const [currentLight, setCurrentLight] = useState('RED');
    const [progress, setProgress] = useState(0);
    const [stars, setStars] = useState(0);
    const [isWalking, setIsWalking] = useState(false);
    const [isRainy, setIsRainy] = useState(false);
    const [hintMsg, setHintMsg] = useState('');
    const [showHint, setShowHint] = useState(false);

    // Refs for stable access in intervals/timers
    const gameStateRef = useRef('intro');
    const currentLightRef = useRef('RED');
    const isWalkingRef = useRef(false);
    const progressRef = useRef(0);
    const levelRef = useRef(1);
    const lightTimerRef = useRef(null);
    const walkIntervalRef = useRef(null);
    const hintTimerRef = useRef(null);

    // Sync refs
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    useEffect(() => { currentLightRef.current = currentLight; }, [currentLight]);
    useEffect(() => { isWalkingRef.current = isWalking; }, [isWalking]);
    useEffect(() => { progressRef.current = progress; }, [progress]);
    useEffect(() => { levelRef.current = level; }, [level]);

    // Cleanup all timers
    const clearAllTimers = useCallback(() => {
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);
        if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        lightTimerRef.current = null;
        walkIntervalRef.current = null;
        hintTimerRef.current = null;
    }, []);

    useEffect(() => () => clearAllTimers(), [clearAllTimers]);

    // Level settings
    useEffect(() => {
        setIsRainy(level >= 3);
    }, [level]);

    // --- ACTIONS ---

    const triggerWin = useCallback(() => {
        clearAllTimers();
        setIsWalking(false);
        setGameState('success');
        setProgress(100);
        playSound('correct');
        setStars(s => s + 1);
        speak("Fantastic! You are a Night Safety Hero!", 'en-US', 1.1);
    }, [clearAllTimers]);

    const triggerMistake = useCallback((msg) => {
        setIsWalking(false);
        playSound('wrong');
        setHintMsg(msg);
        setShowHint(true);
        speak(msg, 'en-US', 1.0);
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setShowHint(false), 2500);
    }, []);

    const startLightCycle = useCallback(() => {
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);

        const cycle = () => {
            if (gameStateRef.current !== 'crossing') return;

            setCurrentLight('RED');
            currentLightRef.current = 'RED';
            speak("Red light! Stop and wait.", 'en-US', 1.0);

            const redTime = 3500 + (Math.random() * 2000);
            const greenTime = 4000 + (Math.random() * 2000);

            lightTimerRef.current = setTimeout(() => {
                if (gameStateRef.current !== 'crossing') return;
                setCurrentLight('GREEN');
                currentLightRef.current = 'GREEN';
                speak("Green light! Now you can cross.", 'en-US', 1.0);
                lightTimerRef.current = setTimeout(cycle, greenTime);
            }, redTime);
        };
        cycle();
    }, []);

    // Walking interval
    useEffect(() => {
        if (gameState !== 'crossing') {
            if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
            return;
        }

        if (isWalking) {
            walkIntervalRef.current = setInterval(() => {
                if (currentLightRef.current === 'GREEN') {
                    setProgress(prev => {
                        const speed = isRainy ? 0.7 : 1.0;
                        const next = prev + speed;
                        if (next >= 88) {
                            triggerWin();
                            return 88;
                        }
                        return next;
                    });
                } else {
                    triggerMistake("STOP! Wait for the Green light!");
                }
            }, 30);
        } else {
            if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
        }

        return () => clearInterval(walkIntervalRef.current);
    }, [gameState, isWalking, isRainy, triggerWin, triggerMistake]);

    const handleGearSelect = (gearId) => {
        playSound('click');
        setSelectedGear(prev =>
            prev.includes(gearId) ? prev.filter(g => g !== gearId) : [...prev, gearId]
        );
    };

    const handleSpotSelect = (isSafe) => {
        if (isSafe) {
            playSound('correct');
            setGameState('look_checks');
            speak("Good choice! Now look both ways.", 'en-US', 1.0);
        } else {
            playSound('wrong');
            speak("That's not safe! Always cross at the zebra crossing.", 'en-US', 1.0);
        }
    };

    const handleLook = (dir) => {
        playSound('click');
        const nextLook = { ...lookedAround, [dir]: true };
        setLookedAround(nextLook);

        if (nextLook.left && nextLook.right) {
            setTimeout(() => {
                setGameState('crossing');
                startLightCycle();
            }, 800);
        }
    };

    const startLevel = useCallback(() => {
        clearAllTimers();
        setProgress(0);
        setLookedAround({ left: false, right: false });
        setCurrentLight('RED');
        setGameState('gear_selection');
        speak("Let's get ready for a night walk! Pick your gear.", 'en-US', 1.0);
    }, [clearAllTimers]);

    // --- UI RENDERS ---

    const renderIntro = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'radial-gradient(circle at center, #1A237E 0%, #0D47A1 100%)',
            padding: '20px', color: 'white', fontFamily: '"Comic Sans MS", cursive', textAlign: 'center'
        }}>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                <Moon size={100} color="#FFD700" fill="#FFD700" />
            </motion.div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '10px' }}>Night Safety <span style={{ color: '#00E5FF' }}>Hero</span></h1>
            <p style={{ fontSize: '1.4rem', opacity: 0.8, marginBottom: '30px' }}>Stay bright, stay safe at night! 🌙</p>

            <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { playSound('click'); startLevel(); }}
                style={{
                    padding: '20px 60px', borderRadius: '30px', background: '#00E5FF',
                    color: '#01579B', fontSize: '1.8rem', fontWeight: 900, border: 'none',
                    boxShadow: '0 10px 0 #00B8D4', cursor: 'pointer'
                }}
            >
                START ADVENTURE! 🚀
            </motion.button>

            {/* Back Button */}
            <motion.button
                onClick={onBack}
                style={{ position: 'absolute', top: '90px', left: '20px', padding: '15px', background: 'white', borderRadius: '15px', border: 'none', cursor: 'pointer' }}
            >
                <ChevronLeft color="#01579B" size={30} />
            </motion.button>
        </div>
    );

    const renderGearSelection = () => (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: '#0D47A1' }}>
            <h2 style={{ color: '#00E5FF', fontSize: '2.5rem', fontWeight: 900 }}>Step 1: Get Ready! 🦺</h2>
            <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '30px' }}>Choose gear to help people see you!</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', maxWidth: '500px', margin: '0 auto 40px' }}>
                {GEAR_ITEMS.map(item => (
                    <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGearSelect(item.id)}
                        style={{
                            padding: '20px', borderRadius: '30px', background: selectedGear.includes(item.id) ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: selectedGear.includes(item.id) ? '5px solid #00E5FF' : '5px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer', textAlign: 'center', transition: '0.3s'
                        }}
                    >
                        <span style={{ fontSize: '3.5rem' }}>{item.icon}</span>
                        <h4 style={{ color: 'white', margin: '5px 0' }}>{item.name}</h4>
                    </motion.button>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => {
                    if (selectedGear.length === 0) {
                        speak("Pick some gear first!", 'en-US', 1.0);
                        return;
                    }
                    playSound('click');
                    setGameState('spot_selection');
                    speak("Great! Now find a safe place to cross.", 'en-US', 1.0);
                }}
                style={{
                    padding: '18px 50px', borderRadius: '25px', background: selectedGear.length > 0 ? '#4CAF50' : '#78909C',
                    color: 'white', fontSize: '1.5rem', fontWeight: 900, border: 'none',
                    boxShadow: `0 8px 0 ${selectedGear.length > 0 ? '#2E7D32' : '#546E7A'}`, cursor: 'pointer'
                }}
            >
                I&apos;M READY! ➡️
            </motion.button>
        </div>
    );

    const renderSpotSelection = () => (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: '#0D47A1' }}>
            <h2 style={{ color: '#FFD700', fontSize: '2.2rem', fontWeight: 900 }}>Step 2: Find Safe Spot 🛑</h2>
            <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '40px' }}>Tap the safest place to cross the road!</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSpotSelect(false)} style={{ padding: '20px', background: '#B71C1C', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>
                    <span style={{ fontSize: '3rem' }}>🚗</span>
                    <h3>Between Cars?</h3>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSpotSelect(true)} style={{ padding: '20px', background: '#4CAF50', borderRadius: '20px', color: 'white', cursor: 'pointer', border: '5px solid #FFD700' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '10px' }}>
                        {[...Array(5)].map((_, i) => <div key={i} style={{ width: '30px', height: '10px', background: 'white' }} />)}
                    </div>
                    <h3>Zebra Crossing!</h3>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} onClick={() => handleSpotSelect(false)} style={{ padding: '20px', background: '#B71C1C', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>
                    <span style={{ fontSize: '3rem' }}>🏃</span>
                    <h3>Run Across?</h3>
                </motion.div>
            </div>
        </div>
    );

    const renderCrossing = () => (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: 'linear-gradient(180deg, #050A30 0%, #000C66 60%, #1A237E 60%, #121212 100%)' }}>

            {/* Rain effect */}
            {isRainy && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
                    <motion.div
                        animate={{ y: [0, 800] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        style={{ height: '200%', width: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100% 20px' }}
                    />
                </div>
            )}

            {/* Header info */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '15px', display: 'flex', justifyContent: 'space-between', zIndex: 100 }}>
                <button onClick={() => setGameState('intro')} style={{ padding: '10px 20px', background: 'white', borderRadius: '15px', border: 'none', fontWeight: 900 }}>⬅ HOME</button>
                <div style={{ background: '#FFD700', padding: '10px 25px', borderRadius: '20px', fontWeight: 900 }}>⭐ {stars}</div>
            </div>

            {/* Street Lights */}
            <div style={{ position: 'absolute', top: '15%', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                        <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2 + i, repeat: Infinity }} style={{ width: '40px', height: '40px', background: '#FFF59D', borderRadius: '50%', boxShadow: '0 0 40px #FFEB3B' }} />
                        <div style={{ width: '6px', height: '100px', background: '#333', margin: '0 auto' }} />
                    </div>
                ))}
            </div>

            {/* Look Actions */}
            {gameState === 'look_checks' && (
                <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '40px', zIndex: 50 }}>
                    <motion.button onClick={() => handleLook('left')} whileTap={{ scale: 0.9 }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: lookedAround.left ? '#4CAF50' : '#E91E63', color: 'white', border: '4px solid white', cursor: 'pointer' }}>
                        <ArrowLeft size={40} />
                    </motion.button>
                    <motion.button onClick={() => handleLook('right')} whileTap={{ scale: 0.9 }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: lookedAround.right ? '#4CAF50' : '#E91E63', color: 'white', border: '4px solid white', cursor: 'pointer' }}>
                        <ArrowRight size={40} />
                    </motion.button>
                </div>
            )}

            {/* Signal */}
            {gameState === 'crossing' && (
                <div style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 50 }}>
                    <div style={{ background: '#212121', padding: '12px', borderRadius: '25px', border: '4px solid #444' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentLight === 'RED' ? '#FF1744' : '#111', boxShadow: currentLight === 'RED' ? '0 0 20px #FF1744' : 'none', marginBottom: '8px' }} />
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentLight === 'GREEN' ? '#00E676' : '#111', boxShadow: currentLight === 'GREEN' ? '0 0 20px #00E676' : 'none' }} />
                    </div>
                    <div style={{ width: '8px', height: '120px', background: '#212121', margin: '0 auto' }} />
                </div>
            )}

            {/* Road */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%', background: '#121212' }}>
                <div style={{ height: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '6px solid rgba(255,255,255,0.3)', borderBottom: '6px solid rgba(255,255,255,0.3)' }}>
                    {[...Array(12)].map((_, i) => <div key={i} style={{ width: '35px', height: '80%', background: 'white', opacity: 0.8, borderRadius: '4px' }} />)}
                </div>
                {/* Reflective glow on road */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', background: 'linear-gradient(rgba(255,255,255,0.1), transparent)' }} />
            </div>

            {/* Character */}
            <motion.div
                animate={{
                    left: `${5 + progress}%`,
                    y: isWalking ? [0, -12, 0] : 0,
                    rotate: isWalking ? [-2, 2, -2] : 0
                }}
                transition={{
                    left: { type: 'tween', duration: 0.08 },
                    y: { repeat: Infinity, duration: 0.3 }
                }}
                style={{
                    position: 'absolute', bottom: '15%', fontSize: 'min(8rem, 20vw)',
                    zIndex: 60, transform: 'translateX(-50%)',
                    filter: selectedGear.length > 0 ? 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.6))' : 'none'
                }}
            >
                {selectedGear.includes('jacket') ? '👷' : '🐼'}
                {selectedGear.includes('light') && (
                    <div style={{
                        position: 'absolute', top: '50%', right: '-150%', width: '200px', height: '120px',
                        background: 'radial-gradient(ellipse at left, rgba(255,255,150,0.3) 0%, transparent 80%)',
                        transform: 'rotate(-10deg)', pointerEvents: 'none'
                    }} />
                )}
            </motion.div>

            {/* Touch Action */}
            {gameState === 'crossing' && (
                <div
                    onMouseDown={() => setIsWalking(true)}
                    onMouseUp={() => setIsWalking(false)}
                    onMouseLeave={() => setIsWalking(false)}
                    onTouchStart={(e) => { e.preventDefault(); setIsWalking(true); }}
                    onTouchEnd={() => setIsWalking(false)}
                    style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'pointer', touchAction: 'none' }}
                />
            )}

            {/* Walk Indicator */}
            {gameState === 'crossing' && (
                <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
                    <div style={{ background: 'rgba(255,255,255,0.9)', padding: '10px 30px', borderRadius: '20px', fontWeight: 900, color: '#01579B', border: '3px solid #00E5FF' }}>
                        {isWalking ? '🏃 WALKING...' : '👆 TAP & HOLD TO WALK'}
                    </div>
                </div>
            )}

            {/* Mistake Hint */}
            <AnimatePresence>
                {showHint && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(255,46,99,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} style={{ background: 'white', padding: '30px', borderRadius: '30px', border: '8px solid #FF2E63', textAlign: 'center' }}>
                            <h2 style={{ color: '#FF2E63', fontSize: '2rem', fontWeight: 900, margin: 0 }}>STOP!</h2>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 0' }}>{hintMsg}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderSuccess = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)', textAlign: 'center', padding: '20px'
        }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ background: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '8px solid #FFD700', maxWidth: '400px', width: '100%' }}>
                <Trophy size={120} color="#FFD700" />
                <h1 style={{ color: '#1B5E20', fontWeight: 900, fontSize: '2.5rem', margin: '20px 0' }}>SAFE HOME! 🏠</h1>
                <p style={{ color: '#333', fontSize: '1.3rem', fontWeight: 700 }}>You are a true Night Hero!</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', margin: '20px 0' }}>
                    {[...Array(stars)].map((_, i) => <Star key={i} size={40} fill="#FFD700" color="#FFD700" />)}
                </div>
                <button
                    onClick={() => { setLevel(l => l + 1); startLevel(); }}
                    style={{ width: '100%', padding: '20px', borderRadius: '25px', background: '#4CAF50', color: 'white', border: 'none', fontSize: '1.5rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 0 #1B5E20' }}
                >
                    NEXT TRIP 🚍
                </button>
                <button
                    onClick={() => setGameState('intro')}
                    style={{ width: '100%', padding: '15px', borderRadius: '25px', background: '#F5F5F5', color: '#555', border: '4px solid #DDD', fontWeight: 900, marginTop: '15px', cursor: 'pointer' }}
                >
                    MENU
                </button>
            </motion.div>
        </div>
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: '"Comic Sans MS", cursive' }}>
            {gameState === 'intro' && renderIntro()}
            {gameState === 'gear_selection' && renderGearSelection()}
            {gameState === 'spot_selection' && renderSpotSelection()}
            {(gameState === 'look_checks' || gameState === 'crossing') && renderCrossing()}
            {gameState === 'success' && renderSuccess()}
        </div>
    );
};

export default NightSafetyGame;
