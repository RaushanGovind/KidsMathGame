import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Star, Trophy, Wind, Circle, Box, ArrowDown, Globe, Moon as MoonIcon } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const MODES = {
    EARTH: {
        id: 'earth',
        name: 'Earth Lab',
        gravity: 1,
        bg: 'linear-gradient(180deg, #87CEEB 0%, #E1F5FE 100%)',
        accent: '#3498DB',
        icon: <Globe size={24} />,
        desc: "Gravity is strong here!"
    },
    MOON: {
        id: 'moon',
        name: 'Moon Lab',
        gravity: 0.16,
        bg: 'linear-gradient(180deg, #2C3E50 0%, #4B79A1 100%)',
        accent: '#F1C40F',
        icon: <MoonIcon size={24} />,
        desc: "Gravity is weak on the Moon!"
    }
};

const OBJECTS = [
    { id: 'rock', name: 'Rock', icon: '🪨', airRes: 0, weight: 1, color: '#9E9E9E', face: '😐' },
    { id: 'ball', name: 'Ball', icon: '⚽', airRes: 0.1, weight: 0.5, color: '#FF5722', face: '😮' },
    { id: 'feather', name: 'Feather', icon: '🪶', airRes: 0.9, weight: 0.1, color: '#BBDEFB', face: '😌' }
];

const GravityDropLab = ({ onBack }) => {
    const [mode, setMode] = useState('EARTH');
    const [leftObj, setLeftObj] = useState(OBJECTS[0]);
    const [rightObj, setRightObj] = useState(OBJECTS[1]);
    const [gameState, setGameState] = useState('ready'); // 'ready', 'dropping', 'finished'
    const [progress, setProgress] = useState({ left: 0, right: 0 });
    const [instruction, setInstruction] = useState('Pick 2 objects to drop!');
    const [robotFace, setRobotFace] = useState('🤖');

    const dropTimerRef = useRef();

    const currentMode = MODES[mode];

    useEffect(() => {
        speak("Welcome to the Gravity Lab! I'm Beep-Boop. Let's see how things fall!");
    }, []);

    const handleDrop = () => {
        if (gameState !== 'ready') return;

        playSound('click');
        setGameState('dropping');
        setProgress({ left: 0, right: 0 });
        setInstruction("Going down!");
        setRobotFace('😲');

        const g = currentMode.gravity * 0.5; // Base gravity multiplier

        let leftV = 0;
        let rightV = 0;
        let lPos = 0;
        let rPos = 0;

        dropTimerRef.current = setInterval(() => {
            // Left Object Physics
            // Acceleration = gravity - air_resistance
            const lAcc = g * (1 - (leftObj.airRes * (mode === 'EARTH' ? 1 : 0.1)));
            leftV += lAcc;
            lPos += leftV;

            // Right Object Physics
            const rAcc = g * (1 - (rightObj.airRes * (mode === 'EARTH' ? 1 : 0.1)));
            rightV += rAcc;
            rPos += rightV;

            setProgress({
                left: Math.min(lPos, 100),
                right: Math.min(rPos, 100)
            });

            if (lPos >= 100 && rPos >= 100) {
                clearInterval(dropTimerRef.current);
                setGameState('finished');
                provideFeedback();
            }
        }, 30);
    };

    const provideFeedback = () => {
        playSound('correct');
        setRobotFace('😃');

        let msg = "";
        if (mode === 'MOON') {
            msg = "Everything falls slower on the Moon because gravity is weak!";
        } else if (leftObj.id === 'feather' || rightObj.id === 'feather') {
            msg = "The feather is slow because air pushes against it!";
        } else {
            msg = "Gravity pulls everything down to the ground!";
        }

        setInstruction(msg);
        speak(msg);
    };

    const reset = () => {
        setGameState('ready');
        setProgress({ left: 0, right: 0 });
        setInstruction('Pick 2 objects to drop!');
        setRobotFace('🤖');
        if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    };

    const toggleMode = () => {
        playSound('click');
        const nextMode = mode === 'EARTH' ? 'MOON' : 'EARTH';
        setMode(nextMode);
        reset();
        speak(`Switching to ${MODES[nextMode].name}. ${MODES[nextMode].desc}`);
    };

    return (
        <div style={{
            width: '100%', height: '100vh',
            background: currentMode.bg,
            fontFamily: '"Comic Sans MS", cursive',
            overflow: 'hidden', position: 'relative',
            transition: 'background 1s ease'
        }}>
            {/* Lab Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <button onClick={onBack} style={{ padding: '10px 25px', background: 'white', border: '4px solid #333', borderRadius: '15px', fontWeight: 900, cursor: 'pointer' }}>EXIT</button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMode}
                    style={{
                        padding: '12px 30px',
                        background: currentMode.accent,
                        color: 'white',
                        border: '4px solid white',
                        borderRadius: '30px',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
                        cursor: 'pointer'
                    }}
                >
                    {currentMode.icon} {currentMode.name}
                </motion.button>

                <div style={{ width: '100px' }} className="mobile-hide" />
            </div>

            {/* Robot Scientist */}
            <div style={{ position: 'absolute', top: '15%', left: '5%', zIndex: 10 }}>
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{ fontSize: '6rem', position: 'relative' }}
                >
                    {robotFace}
                    <div style={{
                        position: 'absolute', top: -40, left: 80,
                        background: 'white', padding: '15px 30px',
                        borderRadius: '25px', border: '4px solid #333',
                        fontSize: '1rem', width: '200px', fontWeight: 900,
                        boxShadow: '0 10px 0 rgba(0,0,0,0.05)'
                    }}>
                        {instruction}
                    </div>
                </motion.div>
            </div>

            {/* Drop Tubes */}
            <div style={{
                height: '70%', width: '100%',
                display: 'flex', justifyContent: 'center', gap: '40px',
                paddingTop: '60px'
            }}>
                <Tube
                    obj={leftObj}
                    progress={progress.left}
                    isActive={gameState === 'dropping'}
                    onSelect={(obj) => { reset(); setLeftObj(obj); }}
                    disabled={gameState !== 'ready'}
                />
                <Tube
                    obj={rightObj}
                    progress={progress.right}
                    isActive={gameState === 'dropping'}
                    onSelect={(obj) => { reset(); setRightObj(obj); }}
                    disabled={gameState !== 'ready'}
                />
            </div>

            {/* Ground */}
            <div style={{
                position: 'absolute', bottom: 0, width: '100%', height: '10%',
                background: '#455A64', borderTop: '8px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{
                    width: '100%', height: '100%',
                    background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)'
                }} />
            </div>

            {/* Controls */}
            <div style={{
                position: 'absolute', bottom: 0, width: '100%', padding: '30px 20px',
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                display: 'flex', justifyContent: 'center', gap: '20px', zIndex: 200
            }}>
                {gameState === 'ready' ? (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDrop}
                        style={{
                            padding: '20px 80px', borderRadius: '40px',
                            background: 'linear-gradient(to bottom, #4CAF50, #2E7D32)',
                            color: 'white', fontSize: '2rem', fontWeight: 900,
                            boxShadow: '0 10px 0 #1B5E20', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '15px'
                        }}
                    >
                        DROP! <ArrowDown size={32} />
                    </motion.button>
                ) : gameState === 'finished' ? (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={reset}
                        style={{
                            padding: '20px 80px', borderRadius: '40px',
                            background: '#FF9800',
                            color: 'white', fontSize: '1.8rem', fontWeight: 900,
                            boxShadow: '0 10px 0 #E65100', border: 'none', cursor: 'pointer'
                        }}
                    >
                        RESET LAB 🔄
                    </motion.button>
                ) : (
                    <div style={{ height: '80px', display: 'flex', alignItems: 'center', fontWeight: 900, color: '#333' }}>
                        WATCH THEM FALL! 👀
                    </div>
                )}
            </div>
        </div>
    );
};

const Tube = ({ obj, progress, isActive, onSelect, disabled }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            {/* Selector */}
            <div style={{ display: 'flex', gap: '5px' }}>
                {OBJECTS.map(o => (
                    <button
                        key={o.id}
                        disabled={disabled}
                        onClick={() => onSelect(o)}
                        style={{
                            padding: '10px', fontSize: '1.5rem', background: obj.id === o.id ? '#E0E0E0' : 'white',
                            border: obj.id === o.id ? '3px solid #333' : '3px solid #EEE',
                            borderRadius: '12px', cursor: disabled ? 'default' : 'pointer'
                        }}
                    >
                        {o.icon}
                    </button>
                ))}
            </div>

            {/* The Drop Tube */}
            <div style={{
                width: '140px', height: '100%',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '70px', border: '6px solid white',
                position: 'relative', overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            }}>
                {/* Scale Markers */}
                {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ position: 'absolute', top: `${i * 10}%`, right: 10, width: '10px', height: '2px', background: 'rgba(0,0,0,0.1)' }} />
                ))}

                {/* The Object */}
                <motion.div
                    animate={{
                        top: `${progress}%`,
                        x: obj.id === 'feather' && isActive ? [0, 20, -20, 0] : 0,
                        rotate: progress >= 100 ? [0, 10, -10, 0] : 0
                    }}
                    transition={{
                        x: { repeat: Infinity, duration: 1 }
                    }}
                    style={{
                        position: 'absolute', left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '4rem', zIndex: 10
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        {obj.icon}
                        <div style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '1rem' }}>
                            {progress < 100 ? (isActive ? '😲' : obj.face) : '✨'}
                        </div>
                    </div>
                </motion.div>

                {/* Landing Effect */}
                {progress >= 100 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        style={{ position: 'absolute', bottom: 10, left: '30%', width: '40px', height: '40px', background: 'white', borderRadius: '50%' }}
                    />
                )}
            </div>
        </div>
    );
};

export default GravityDropLab;
