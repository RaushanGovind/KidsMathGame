import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Trophy, ArrowLeft, ArrowRight, ShieldCheck, Flashlight, MoveHorizontal, CloudRain } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const GEAR_ITEMS = [
    { id: 'jacket', icon: '🦺', name: 'Glow Jacket', desc: 'Makes you bright!' },
    { id: 'light', icon: '🔦', name: 'Flashlight', desc: 'See the road!' },
    { id: 'shoes', icon: '👟', name: 'Neon Shoes', desc: 'Flashy feet!' },
    { id: 'armband', icon: '🎗️', name: 'Reflector', desc: 'Safe arms!' }
];

const NightSafetyGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('gear_selection'); // 'gear_selection', 'spot_selection', 'look_checks', 'crossing', 'success'
    const [level, setLevel] = useState(1);
    const [selectedGear, setSelectedGear] = useState([]);
    const [lookedAround, setLookedAround] = useState({ left: false, right: false });
    const [currentLight, setCurrentLight] = useState('RED');
    const [progress, setProgress] = useState(0);
    const [stars, setStars] = useState(0);
    const [isWalking, setIsWalking] = useState(false);
    const [isRainy, setIsRainy] = useState(false);

    const lightTimerRef = useRef();
    const instructionRef = useRef('');

    // Level setup
    useEffect(() => {
        if (level >= 5) setIsRainy(true);
        else setIsRainy(false);
    }, [level]);

    const playInstruction = (text) => {
        instructionRef.current = text;
        speak(text, 'en-US', 1.0);
    };

    const handleGearSelect = (gear) => {
        playSound('click');
        if (selectedGear.includes(gear)) {
            setSelectedGear(prev => prev.filter(g => g !== gear));
        } else {
            setSelectedGear(prev => [...prev, gear]);
        }
    };

    const startCrossingPart = () => {
        if (selectedGear.length === 0) {
            playInstruction("Choose some safety gear first!");
            return;
        }
        setGameState('spot_selection');
        playInstruction("Find the safest place to cross!");
    };

    const handleSpotSelect = (isZebra) => {
        if (isZebra) {
            playSound('correct');
            setGameState('look_checks');
            playInstruction("Now, look both ways!");
        } else {
            playSound('wrong');
            speak("No, that's not safe! Look for the stripes!");
        }
    };

    const handleLook = (dir) => {
        playSound('click');
        setLookedAround(prev => ({ ...prev, [dir]: true }));
        if ((dir === 'left' && lookedAround.right) || (dir === 'right' && lookedAround.left)) {
            setTimeout(() => {
                setGameState('crossing');
                playInstruction("Green means Go! Hold to cross!");
                startLightLogic();
            }, 800);
        }
    };

    const startLightLogic = () => {
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);

        const cycle = () => {
            setCurrentLight('RED');
            speak("Red light! Stop!");

            const redTime = 3000 + (Math.random() * 2000);
            const greenTime = 4000 + (Math.random() * 2000);

            setTimeout(() => {
                setCurrentLight('GREEN');
                speak("Green light! Cross now!");
                lightTimerRef.current = setTimeout(cycle, greenTime);
            }, redTime);
        };
        cycle();
    };

    useEffect(() => {
        let interval;
        if (gameState === 'crossing' && isWalking) {
            interval = setInterval(() => {
                if (currentLight === 'GREEN') {
                    setProgress(prev => {
                        const next = prev + (isRainy ? 0.4 : 0.6);
                        if (next >= 100) {
                            handleLevelWin();
                            return 100;
                        }
                        return next;
                    });
                } else {
                    playSound('wrong');
                    setIsWalking(false);
                    speak("Stop! It's a red light!");
                }
            }, 30);
        }
        return () => clearInterval(interval);
    }, [gameState, isWalking, currentLight, isRainy]);

    const handleLevelWin = () => {
        setGameState('success');
        playSound('correct');
        setStars(s => s + 1);
        if (lightTimerRef.current) clearTimeout(lightTimerRef.current);
        speak("Great work! You are a Night Safety Hero!", 'en-US', 1.1);
    };

    const nextLevel = () => {
        setLevel(prev => prev + 1);
        setLookedAround({ left: false, right: false });
        setProgress(0);
        setGameState('gear_selection');
    };

    // UI Renders
    const GearSelection = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#E1F5FE', fontSize: '3rem', fontWeight: 900 }}>Night Adventure! 🌙</h1>
            <p style={{ color: '#81D4FA', fontSize: '1.5rem', fontWeight: 700 }}>Dress up for safety!</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '600px', margin: '40px auto' }}>
                {GEAR_ITEMS.map(item => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGearSelect(item.id)}
                        style={{
                            padding: '30px', borderRadius: '40px', background: 'rgba(255,255,255,0.1)',
                            border: selectedGear.includes(item.id) ? '8px solid #00E5FF' : '8px solid rgba(255,255,255,0.2)',
                            boxShadow: selectedGear.includes(item.id) ? '0 0 30px #00E5FF55' : 'none',
                            cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        <span style={{ fontSize: '4.5rem' }}>{item.icon}</span>
                        <h3 style={{ color: 'white', margin: '10px 0 5px 0', fontSize: '1.5rem' }}>{item.name}</h3>
                        <p style={{ color: '#B0BEC5', margin: 0 }}>{item.desc}</p>
                    </motion.button>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startCrossingPart}
                style={{
                    padding: '25px 80px', borderRadius: '40px', background: '#00E5FF',
                    color: '#01579B', fontSize: '2rem', fontWeight: 900, border: 'none',
                    boxShadow: '0 10px 0 #00B8D4', cursor: 'pointer'
                }}
            >
                READY TO GO! 🚍
            </motion.button>
        </motion.div>
    );

    const SpotSelection = () => (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900 }}>Where should we cross? 🤔</h2>
            <div style={{ height: '400px', position: 'relative', marginTop: '40px', background: '#263238', borderRadius: '40px', overflow: 'hidden', border: '10px solid #37474F' }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', cursor: 'pointer' }} onClick={() => handleSpotSelect(false)}>
                    <span style={{ fontSize: '3rem' }}>🚗</span><p style={{ color: 'white' }}>Behind a car?</p>
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} onClick={() => handleSpotSelect(true)}>
                    <div style={{ width: '200px', height: '120px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[...Array(4)].map((_, i) => <div key={i} style={{ height: '20px', background: 'white', borderRadius: '5px' }} />)}
                    </div>
                    <p style={{ color: '#00E5FF', fontWeight: 900, fontSize: '1.5rem' }}>Zebra Crossing!</p>
                </div>
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', cursor: 'pointer' }} onClick={() => handleSpotSelect(false)}>
                    <span style={{ fontSize: '3rem' }}>🏃</span><p style={{ color: 'white' }}>Middle of road?</p>
                </div>
            </div>
        </div>
    );

    const CrossingPhase = () => (
        <div style={{ height: '100vh', position: 'relative', background: '#1A237E', overflow: 'hidden' }}>
            {/* Rainy Effect overlay */}
            {isRainy && (
                <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none', background: 'rgba(0,0,0,0.2)' }}>
                    <motion.div animate={{ y: [0, 1000] }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ height: '200%', width: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100% 20px' }} />
                </div>
            )}

            {/* Header info */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <div style={{ background: 'white', padding: '10px 25px', borderRadius: '25px', fontWeight: 900 }}>Level {level} {isRainy && '🌧️'}</div>
                <div style={{ background: '#FFD700', padding: '10px 25px', borderRadius: '25px', fontWeight: 900 }}>⭐ {stars}</div>
            </div>

            {/* Street Lights */}
            <div style={{ position: 'absolute', top: '20%', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ width: '100px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: '#FFFF00', borderRadius: '50%', boxShadow: '0 0 50px #FFFF00', margin: '0 auto' }} />
                        <div style={{ width: '8px', height: '150px', background: '#333', margin: '0 auto' }} />
                    </div>
                ))}
            </div>

            {/* Look around buttons */}
            {gameState === 'look_checks' && (
                <div style={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-around', gap: '20px', zIndex: 100 }}>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLook('left')}
                        style={{ padding: '30px', borderRadius: '50%', background: lookedAround.left ? '#4CAF50' : '#E91E63', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 10px 0 rgba(0,0,0,0.2)' }}
                    >
                        <ArrowLeft size={60} strokeWidth={4} />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLook('right')}
                        style={{ padding: '30px', borderRadius: '50%', background: lookedAround.right ? '#4CAF50' : '#E91E63', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 10px 0 rgba(0,0,0,0.2)' }}
                    >
                        <ArrowRight size={60} strokeWidth={4} />
                    </motion.button>
                </div>
            )}

            {/* Traffic Signal */}
            {gameState === 'crossing' && (
                <div style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 50 }}>
                    <div style={{ background: '#212121', padding: '15px', borderRadius: '30px', border: '4px solid #424242' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: currentLight === 'RED' ? '#FF1744' : '#111', boxShadow: currentLight === 'RED' ? '0 0 30px #FF1744' : 'none', marginBottom: '10px' }} />
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: currentLight === 'GREEN' ? '#00E676' : '#111', boxShadow: currentLight === 'GREEN' ? '0 0 30px #00E676' : 'none' }} />
                    </div>
                </div>
            )}

            {/* Zebra Crossing Road */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%', background: '#263238' }}>
                <div style={{ height: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '8px solid white', borderBottom: '8px solid white' }}>
                    {[...Array(12)].map((_, i) => <div key={i} style={{ width: '40px', height: '80%', background: 'white', opacity: 0.9, borderRadius: '4px' }} />)}
                </div>
            </div>

            {/* Character */}
            <motion.div
                animate={{
                    left: `${5 + progress}%`,
                    y: isWalking ? [0, -15, 0] : 0
                }}
                style={{ position: 'absolute', bottom: '15%', fontSize: '10rem', zIndex: 60, filter: `drop-shadow(0 0 20px ${selectedGear.some(g => ['jacket', 'shoes', 'armband'].includes(g)) ? '#00E5FF' : 'transparent'})` }}
            >
                🐼
                {selectedGear.includes('light') && <div style={{ position: 'absolute', top: '50%', right: '-80px', width: '200px', height: '100px', background: 'radial-gradient(circle, rgba(255,255,100,0.4) 0%, transparent 70%)', transform: 'rotate(-20deg)', pointerEvents: 'none' }} />}
            </motion.div>

            {/* Touch to Walk area */}
            {gameState === 'crossing' && (
                <div
                    onMouseDown={() => { setIsWalking(true); playSound('click'); }}
                    onMouseUp={() => setIsWalking(false)}
                    onTouchStart={() => { setIsWalking(true); playSound('click'); }}
                    onTouchEnd={() => setIsWalking(false)}
                    style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, cursor: 'pointer' }}
                />
            )}
        </div>
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(180deg, #0D47A1 0%, #01579B 100%)', fontFamily: '"Comic Sans MS", cursive' }}>
            <div style={{ padding: '20px' }}>
                <button onClick={onBack} style={{ background: 'white', border: 'none', padding: '10px 25px', borderRadius: '20px', fontWeight: 900, cursor: 'pointer', color: '#01579B' }}>⬅ BACK</button>
            </div>

            {gameState === 'gear_selection' && <GearSelection />}
            {gameState === 'spot_selection' && <SpotSelection />}
            {(gameState === 'look_checks' || gameState === 'crossing') && <CrossingPhase />}

            {gameState === 'success' && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <Trophy size={180} color="#FFD700" />
                    <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>NIGHT HERO! 🏅</h1>
                    <p style={{ fontSize: '2rem' }}>You reached home safely!</p>
                    <button
                        onClick={nextLevel}
                        style={{ marginTop: '40px', padding: '20px 60px', borderRadius: '30px', background: '#00E676', color: 'white', border: 'none', fontSize: '2rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 0 #1B5E20' }}
                    >
                        NEXT TRIP 🚍
                    </button>
                </div>
            )}
        </div>
    );
};

export default NightSafetyGame;
