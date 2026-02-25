import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Star, Trophy, ArrowDown, Globe, Moon as MoonIcon, ChevronLeft, FlaskConical } from 'lucide-react';
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
        gravity: 0.165,
        bg: 'linear-gradient(180deg, #1E293B 0%, #334155 100%)',
        accent: '#F1C40F',
        icon: <MoonIcon size={24} />,
        desc: "Gravity is weak on the Moon!"
    }
};

const OBJECTS = [
    { id: 'rock', name: 'Rock', icon: '🪨', airRes: 0, face: '😐' },
    { id: 'ball', name: 'Ball', icon: '⚽', airRes: 0.15, face: '😮' },
    { id: 'feather', name: 'Feather', icon: '🪶', airRes: 0.85, face: '😌' },
    { id: 'paper', name: 'Paper', icon: '📄', airRes: 0.7, face: '🤔' }
];

const GravityDropLab = ({ onBack }) => {
    const [mode, setMode] = useState('EARTH');
    const [leftObj, setLeftObj] = useState(OBJECTS[0]);
    const [rightObj, setRightObj] = useState(OBJECTS[1]);
    const [gameState, setGameState] = useState('ready'); // 'ready', 'dropping', 'finished'
    const [progress, setProgress] = useState({ left: 0, right: 0 });
    const [instruction, setInstruction] = useState('Pick 2 objects to drop!');
    const [robotFace, setRobotFace] = useState('🤖');
    const [stars, setStars] = useState(0);

    const dropTimerRef = useRef();
    const gameStateRef = useRef('ready');
    const currentMode = MODES[mode];

    useEffect(() => {
        speak("Welcome to the Gravity Lab! Let's see how things fall.", 'en-US', 1.0);
        return () => { if (dropTimerRef.current) clearInterval(dropTimerRef.current); };
    }, []);

    const reset = useCallback(() => {
        if (dropTimerRef.current) clearInterval(dropTimerRef.current);
        setGameState('ready');
        gameStateRef.current = 'ready';
        setProgress({ left: 0, right: 0 });
        setInstruction('Pick 2 objects to drop!');
        setRobotFace('🤖');
    }, []);

    const provideFeedback = useCallback(() => {
        playSound('correct');
        setRobotFace('😃');
        setStars(s => s + 5);

        let msg = "";
        if (mode === 'MOON') {
            msg = "On the Moon, everything falls slow because gravity is weak!";
        } else if (leftObj.id === 'feather' || rightObj.id === 'feather' || leftObj.id === 'paper' || rightObj.id === 'paper') {
            msg = "Air resistance slows down light objects like feathers!";
        } else {
            msg = "Gravity pulls all heavy things down fast!";
        }

        setInstruction(msg);
        speak(msg, 'en-US', 1.0);
    }, [mode, leftObj, rightObj]);

    const handleDrop = () => {
        if (gameState !== 'ready') return;

        playSound('click');
        setGameState('dropping');
        gameStateRef.current = 'dropping';
        setProgress({ left: 0, right: 0 });
        setInstruction("Going down! Watch them fall.");
        setRobotFace('😲');

        const g = currentMode.gravity * 0.45;
        let leftV = 0, rightV = 0;
        let lPos = 0, rPos = 0;

        dropTimerRef.current = setInterval(() => {
            // Physics loop
            const lAcc = g * (1 - (leftObj.airRes * (mode === 'EARTH' ? 0.9 : 0.05)));
            leftV += lAcc;
            lPos += leftV;

            const rAcc = g * (1 - (rightObj.airRes * (mode === 'EARTH' ? 0.9 : 0.05)));
            rightV += rAcc;
            rPos += rightV;

            setProgress({
                left: Math.min(lPos, 90),
                right: Math.min(rPos, 90)
            });

            if (lPos >= 90 && rPos >= 90) {
                clearInterval(dropTimerRef.current);
                setGameState('finished');
                gameStateRef.current = 'finished';
                provideFeedback();
            }
        }, 30);
    };

    const toggleMode = () => {
        playSound('click');
        const nextMode = mode === 'EARTH' ? 'MOON' : 'EARTH';
        setMode(nextMode);
        reset();
        speak(`Welcome to the ${MODES[nextMode].name}!`, 'en-US', 1.0);
    };

    return (
        <div style={{
            width: '100%', height: '100dvh', background: currentMode.bg,
            fontFamily: '"Comic Sans MS", cursive', overflow: 'hidden', position: 'relative'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <button onClick={onBack} style={{ padding: '10px 25px', background: 'white', border: '4px solid #333', borderRadius: '15px', fontWeight: 900, cursor: 'pointer' }}>⬅ EXIT</button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleMode}
                    style={{ padding: '10px 30px', background: currentMode.accent, color: 'white', border: '5px solid white', borderRadius: '35px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 0 rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                    {currentMode.icon} {currentMode.name}
                </motion.button>

                <div style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 900 }}>⭐ {stars}</div>
            </div>

            {/* Robot Scientist */}
            <div style={{ position: 'absolute', top: '15dvh', left: '20px', zIndex: 50 }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'relative' }}>
                    <div style={{ fontSize: 'min(5rem, 15vw)' }}>{robotFace}</div>
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={instruction}
                        style={{ position: 'absolute', top: 0, left: '100%', background: 'white', padding: '15px 25px', borderRadius: '25px', border: '4px solid #333', fontSize: '1rem', width: '220px', fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginLeft: '10px' }}>
                        {instruction}
                    </motion.div>
                </motion.div>
            </div>

            {/* Test Area */}
            <div style={{ height: '65dvh', width: '100%', display: 'flex', justifyContent: 'center', gap: '30px', paddingTop: '40px' }}>
                <DropColumn obj={leftObj} progress={progress.left} isActive={gameState === 'dropping'} onSelect={(o) => { reset(); setLeftObj(o); }} disabled={gameState !== 'ready'} />
                <DropColumn obj={rightObj} progress={progress.right} isActive={gameState === 'dropping'} onSelect={(o) => { reset(); setRightObj(o); }} disabled={gameState !== 'ready'} />
            </div>

            {/* Ground */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '14dvh', background: '#455A64', borderTop: '10px solid rgba(255,255,255,0.2)' }}>
                <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)' }} />
            </div>

            {/* Bottom Controls */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '25px', background: 'rgba(255,255,255,0.95)', borderTop: '5px solid #DDD', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', zIndex: 200, paddingBottom: 'calc(25px + env(safe-area-inset-bottom))' }}>
                <AnimatePresence mode="wait">
                    {gameState === 'ready' ? (
                        <motion.button key="drop" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} onClick={handleDrop}
                            style={{ padding: '20px 80px', borderRadius: '40px', background: '#4CAF50', color: 'white', fontSize: '2rem', fontWeight: 900, border: 'none', boxShadow: '0 10px 0 #1B5E20', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            DROP! <ArrowDown />
                        </motion.button>
                    ) : gameState === 'finished' ? (
                        <motion.button key="reset" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={reset}
                            style={{ padding: '20px 80px', borderRadius: '40px', background: '#FF9800', color: 'white', fontSize: '1.8rem', fontWeight: 900, border: 'none', boxShadow: '0 10px 0 #E65100', cursor: 'pointer' }}>
                            RESET 🔄
                        </motion.button>
                    ) : (
                        <div style={{ height: '70px', display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#333' }}>WATCH THE PHYSICS! 🧪</div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const DropColumn = ({ obj, progress, isActive, onSelect, disabled }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
                {OBJECTS.map(o => (
                    <button key={o.id} disabled={disabled} onClick={() => onSelect(o)}
                        style={{ padding: '10px', fontSize: '1.5rem', background: obj.id === o.id ? '#F1F5F9' : 'white', border: obj.id === o.id ? '4px solid #334155' : '4px solid #E2E8F0', borderRadius: '15px', cursor: disabled ? 'default' : 'pointer', transition: '0.2s' }}>
                        {o.icon}
                    </button>
                ))}
            </div>

            <div style={{ width: 'min(140px, 30vw)', height: '100%', background: 'rgba(255,255,255,0.35)', borderRadius: '70px', border: '6px solid white', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 25px rgba(0,0,0,0.06)' }}>
                {/* Scale markers */}
                {[...Array(10)].map((_, i) => <div key={i} style={{ position: 'absolute', top: `${i * 10}%`, right: 10, width: '15px', height: '3px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />)}

                <motion.div
                    animate={{
                        top: `${progress}%`,
                        x: obj.id === 'feather' && isActive ? [0, 20, -20, 0] : obj.id === 'paper' && isActive ? [0, 15, -15, 0] : 0,
                        rotate: progress >= 90 ? [0, 15, -15, 0] : (isActive && (obj.id === 'feather' || obj.id === 'paper') ? [0, 10, -10, 0] : 0)
                    }}
                    transition={{ x: { repeat: Infinity, duration: 1.2 } }}
                    style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '4.5rem', zIndex: 10 }}>
                    <div style={{ position: 'relative' }}>
                        {obj.icon}
                        <div style={{ position: 'absolute', top: '15%', left: '15%', fontSize: '1.2rem', background: 'white', borderRadius: '50%', padding: '2px' }}>
                            {progress >= 90 ? '✨' : (isActive ? '😲' : obj.face)}
                        </div>
                    </div>
                </motion.div>

                {progress >= 90 && (
                    <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }}
                        style={{ position: 'absolute', bottom: '5%', left: '25%', width: '50px', height: '50px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%' }} />
                )}
            </div>
        </div>
    );
};

export default GravityDropLab;
