import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    Trophy, Map as MapIcon, Star, Compass, Play
} from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const GRID_SIZE = 5;
const CHARACTERS = [
    { id: 'rabbit', icon: '🐰', name: 'Bunny' },
    { id: 'robot', icon: '🤖', name: 'Beep-Boop' },
    { id: 'cat', icon: '🐱', name: 'Kitty' },
    { id: 'adventurer', icon: '🤠', name: 'Indy' }
];

const OBJECTS = [
    { id: 'apple', icon: '🍎', name: 'Apple' },
    { id: 'tree', icon: '🌳', name: 'Tree' },
    { id: 'carrot', icon: '🥕', name: 'Carrot' },
    { id: 'home', icon: '🏠', name: 'Home' },
    { id: 'sun', icon: '☀️', name: 'Sun' },
    { id: 'cake', icon: '🍰', name: 'Cake' },
    { id: 'chest', icon: '💎', name: 'Treasure' }
];

const DirectionAdventureGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'success', 'complete'
    const [level, setLevel] = useState(1);
    const [character, setCharacter] = useState(CHARACTERS[0]);
    const [characterPos, setCharacterPos] = useState({ x: 2, y: 3 });
    const [targetPos, setTargetPos] = useState({ x: 2, y: 1 });
    const [targetObject, setTargetObject] = useState(OBJECTS[0]);
    const [instruction, setInstruction] = useState('');
    const [path, setPath] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [stars, setStars] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

    // Use refs for logic validation
    const pathRef = useRef([]);
    const stepRef = useRef(0);
    const posRef = useRef({ x: 2, y: 3 });
    const gameStateRef = useRef('intro');

    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

    const initLevel = useCallback((lvl) => {
        let charX = 2, charY = 3;
        let targetX = 2, targetY = 1;
        let newPath = [];
        let newInstr = '';
        let newObj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];

        if (lvl === 1) {
            const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            const dir = directions[Math.floor(Math.random() * 4)];
            newPath = [dir];
            newInstr = `Move ${dir}!`;
            if (dir === 'UP') { charY = 3; targetY = 2; }
            if (dir === 'DOWN') { charY = 1; targetY = 2; }
            if (dir === 'LEFT') { charX = 3; targetX = 2; charY = 2; targetY = 2; }
            if (dir === 'RIGHT') { charX = 1; targetX = 2; charY = 2; targetY = 2; }
        } else if (lvl === 2) {
            const d1 = ['UP', 'DOWN'][Math.floor(Math.random() * 2)];
            const d2 = ['LEFT', 'RIGHT'][Math.floor(Math.random() * 2)];
            newPath = [d1, d2];
            newInstr = `Go ${d1} then ${d2}!`;
            charX = d2 === 'LEFT' ? 3 : 1;
            charY = d1 === 'UP' ? 3 : 1;
            targetX = 2; targetY = 2;
        } else if (lvl === 3) {
            newPath = ['UP', 'UP', 'RIGHT'];
            newInstr = `Follow the path: UP, UP, and RIGHT!`;
            charX = 1; charY = 4;
            targetX = 2; targetY = 2;
            newObj = OBJECTS.find(o => o.id === 'chest');
        } else {
            newPath = ['LEFT', 'UP', 'RIGHT', 'UP'];
            newInstr = `Long journey! LEFT, UP, RIGHT, then UP!`;
            charX = 3; charY = 4;
            targetX = 4; targetY = 2;
            newObj = OBJECTS.find(o => o.id === 'home');
        }

        setCharacterPos({ x: charX, y: charY });
        posRef.current = { x: charX, y: charY };
        setTargetPos({ x: targetX, y: targetY });
        setTargetObject(newObj);
        setPath(newPath);
        pathRef.current = newPath;
        setCurrentStep(0);
        stepRef.current = 0;
        setInstruction(newInstr);
        setFeedback(null);

        speak(newInstr, 'en-US', 1.1);
    }, []);

    const startLevel = useCallback(() => {
        setGameState('playing');
        initLevel(level);
    }, [level, initLevel]);

    const handleDirection = (dir) => {
        if (gameStateRef.current !== 'playing') return;

        const expected = pathRef.current[stepRef.current];
        if (dir === expected) {
            playSound('click');
            let { x, y } = posRef.current;
            if (dir === 'UP') y--;
            else if (dir === 'DOWN') y++;
            else if (dir === 'LEFT') x--;
            else if (dir === 'RIGHT') x++;

            // Bounds check
            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
                triggerMistake("Stay on the map!");
                return;
            }

            posRef.current = { x, y };
            setCharacterPos({ x, y });

            const nextStep = stepRef.current + 1;
            if (nextStep === pathRef.current.length) {
                // Win!
                triggerWin();
            } else {
                stepRef.current = nextStep;
                setCurrentStep(nextStep);
            }
        } else {
            triggerMistake(`Oops! Try moving ${expected}.`);
        }
    };

    const triggerWin = () => {
        playSound('correct');
        setFeedback('correct');
        setStars(s => s + 1);
        speak("Great exploring! You found it!", 'en-US', 1.1);
        setTimeout(() => {
            if (level < 4) setGameState('success');
            else setGameState('complete');
        }, 1500);
    };

    const triggerMistake = (msg) => {
        playSound('wrong');
        setFeedback('wrong');
        speak(msg, 'en-US', 1.0);
        setTimeout(() => setFeedback(null), 1500);
    };

    const handleNextLevel = () => {
        const next = level + 1;
        setLevel(next);
        setGameState('playing');
        initLevel(next);
    };

    // --- Renders ---

    const renderIntro = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
            padding: '20px', color: 'white', fontFamily: '"Comic Sans MS", cursive',
            position: 'relative', overflow: 'hidden'
        }}>
            <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 5 }}>
                <Compass size={120} color="#D32F2F" />
            </motion.div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#D32F2F', textShadow: '0 4px 0 white', margin: '20px 0' }}>Path <span style={{ color: '#FF5252' }}>Explorer</span></h1>

            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                style={{ background: 'white', padding: '30px', borderRadius: '40px', border: '8px solid #FFCDD2', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
                <h3 style={{ textAlign: 'center', color: '#D32F2F', margin: '0 0 20px' }}>Pick Your Explorer</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {CHARACTERS.map(c => (
                        <motion.button key={c.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => { setCharacter(c); playSound('click'); }}
                            style={{
                                padding: '12px 0', borderRadius: '20px', border: character.id === c.id ? '5px solid #FF5252' : '5px solid #F5F5F5',
                                background: character.id === c.id ? '#FFEBEE' : 'white', cursor: 'pointer', fontSize: '2.5rem'
                            }}>
                            {c.icon}
                        </motion.button>
                    ))}
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { playSound('click'); startLevel(); }}
                    style={{
                        width: '100%', marginTop: '30px', padding: '20px', background: '#FF5252', color: 'white',
                        border: 'none', borderRadius: '25px', fontSize: '1.8rem', fontWeight: 900,
                        boxShadow: '0 8px 0 #D32F2F', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
                    }}>
                    GO EXPLORE! <Play fill="white" />
                </motion.button>
            </motion.div>

            {/* Back Icon */}
            <motion.button onClick={onBack} style={{ position: 'absolute', top: '90px', left: '20px', padding: '15px', background: 'white', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 0 #DDD' }}>
                <ChevronLeft color="#D32F2F" size={30} />
            </motion.button>
        </div>
    );

    const renderPlaying = () => (
        <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#F1F8E9', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <button onClick={() => setGameState('intro')} style={{ padding: '10px 20px', background: 'white', border: '3px solid #4CAF50', borderRadius: '15px', fontWeight: 900, color: '#4CAF50' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ background: '#4CAF50', padding: '10px 20px', borderRadius: '20px', color: 'white', fontWeight: 900 }}>Map {level}</div>
                    <div style={{ background: '#FFD700', padding: '10px 20px', borderRadius: '20px', fontWeight: 900 }}>⭐ {stars}</div>
                </div>
            </div>

            {/* Instruction Bubble */}
            <div style={{ textAlign: 'center', padding: '10px 20px' }}>
                <motion.div key={instruction} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    style={{ background: 'white', padding: '15px 30px', borderRadius: '30px', border: '5px solid #AED581', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                    <MapIcon color="#4CAF50" />
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333', fontWeight: 800 }}>{instruction}</h2>
                </motion.div>
            </div>

            {/* The Grid */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: '10px',
                    background: '#DCEDC8', padding: '12px', borderRadius: '30px', border: '10px solid #AED581',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                        const x = i % GRID_SIZE, y = Math.floor(i / GRID_SIZE);
                        const isChar = characterPos.x === x && characterPos.y === y;
                        const isTarget = targetPos.x === x && targetPos.y === y;
                        return (
                            <div key={i} style={{
                                width: 'min(70px, 16vw)', height: 'min(70px, 16vw)',
                                background: 'white', borderRadius: '15px', position: 'relative',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.03)'
                            }}>
                                <AnimatePresence>
                                    {isTarget && !isChar && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '2.5rem' }}>
                                            {targetObject.icon}
                                        </motion.div>
                                    )}
                                    {isChar && (
                                        <motion.div layoutId="explorer" style={{ fontSize: '3.5rem', zIndex: 10 }}>
                                            {character.icon}
                                            {feedback === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} style={{ position: 'absolute', top: 0, left: 0, fontSize: '2rem' }}>✨</motion.div>}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls - Optimized for Mobile Thumb Reach */}
            <div style={{
                padding: '20px', background: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px',
                boxShadow: '0 -15px 40px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'center',
                paddingBottom: 'calc(20px + env(safe-area-inset-bottom))'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div />
                    <DirBtn icon={<ArrowUp size={36} />} color="#42A5F5" shadow="#1E88E5" onClick={() => handleDirection('UP')} />
                    <div />
                    <DirBtn icon={<ArrowLeft size={36} />} color="#FF7043" shadow="#E64A19" onClick={() => handleDirection('LEFT')} />
                    <div />
                    <DirBtn icon={<ArrowRight size={36} />} color="#66BB6A" shadow="#388E3C" onClick={() => handleDirection('RIGHT')} />
                    <div />
                    <DirBtn icon={<ArrowDown size={36} />} color="#AB47BC" shadow="#7B1FA2" onClick={() => handleDirection('DOWN')} />
                    <div />
                </div>
            </div>

            {/* Error Hint */}
            <AnimatePresence>
                {feedback === 'wrong' && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', bottom: '35%', left: '50%', transform: 'translateX(-50%)', background: '#FF5252', color: 'white', padding: '10px 30px', borderRadius: '20px', fontWeight: 900, boxShadow: '0 10px 30px rgba(255,82,82,0.4)', zIndex: 200 }}>
                        TRY AGAIN! 🧩
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderSuccess = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: '#E8F5E9', textAlign: 'center', padding: '20px'
        }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ background: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '8px solid #4CAF50', maxWidth: '400px', width: '100%' }}>
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Trophy size={100} color="#FFD700" />
                </motion.div>
                <h1 style={{ color: '#2E7D32', fontWeight: 900, fontSize: '2.5rem', margin: '20px 0' }}>MAP SECURED!</h1>
                <p style={{ color: '#555', fontSize: '1.2rem', fontWeight: 700 }}>You found the {targetObject.name}! 🌟</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', margin: '20px 0' }}>
                    {[...Array(stars)].map((_, i) => <Star key={i} size={40} fill="#FFD700" color="#FFD700" />)}
                </div>
                <button
                    onClick={handleNextLevel}
                    style={{ width: '100%', padding: '20px', borderRadius: '30px', background: '#4CAF50', color: 'white', border: 'none', fontSize: '1.6rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 0 #1B5E20' }}
                >
                    NEXT MAP 🗺️
                </button>
            </motion.div>
        </div>
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: '"Comic Sans MS", cursive' }}>
            {gameState === 'intro' && renderIntro()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'success' && renderSuccess()}
            {gameState === 'complete' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FFF7E6', textAlign: 'center', padding: '20px' }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Compass size={150} color="#FF9800" />
                    </motion.div>
                    <h1 style={{ fontSize: '3.5rem', color: '#E65100', fontWeight: 900, margin: '20px 0' }}>ULTIMATE EXPLORER!</h1>
                    <p style={{ fontSize: '1.5rem', color: '#FB8C00', fontWeight: 800 }}>You mastered all paths! 🗺️</p>
                    <button onClick={onBack} style={{ marginTop: '40px', padding: '20px 60px', borderRadius: '30px', background: '#FF9800', color: 'white', border: 'none', fontSize: '1.8rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 0 #E65100' }}>BACK TO HUB</button>
                </div>
            )}
        </div>
    );
};

const DirBtn = ({ icon, color, shadow, onClick }) => (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9, y: 4 }} onClick={onClick} style={{ width: 'min(85px, 20vw)', height: 'min(85px, 20vw)', borderRadius: '24px', background: color, color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 0 ${shadow}`, cursor: 'pointer' }}>
        {icon}
    </motion.button>
);

export default DirectionAdventureGame;
