import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Star, Trophy, Map } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const GRID_SIZE = 5;
const CHARACTERS = [
    { id: 'rabbit', icon: '🐰', name: 'Bunny' },
    { id: 'robot', icon: '🤖', name: 'Beep-Boop' },
    { id: 'cat', icon: '🐱', name: 'Kitty' },
    { id: 'spaceship', icon: '🚀', name: 'Starship' }
];

const OBJECTS = [
    { id: 'apple', icon: '🍎', name: 'Apple' },
    { id: 'tree', icon: '🌳', name: 'Tree' },
    { id: 'carrot', icon: '🥕', name: 'Carrot' },
    { id: 'home', icon: '🏠', name: 'Home' },
    { id: 'sun', icon: '☀️', name: 'Sun' },
    { id: 'cake', icon: '🍰', name: 'Cake' }
];

const DirectionAdventureGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'level_complete', 'game_complete'
    const [level, setLevel] = useState(1);
    const [character, setCharacter] = useState(CHARACTERS[0]);
    const [characterPos, setCharacterPos] = useState({ x: 2, y: 2 });
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
    const [targetObject, setTargetObject] = useState(null);
    const [instruction, setInstruction] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [path, setPath] = useState([]);
    const [stars, setStars] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const initLevel = useCallback((lvl) => {
        const center = Math.floor(GRID_SIZE / 2);
        let charX = center;
        let charY = center;
        let targetX, targetY;
        let newInstruction = '';
        let newPath = [];
        let newTargetObject = null;

        if (lvl === 1) {
            const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            newInstruction = `Go ${dir}!`;
            newPath = [dir];
            if (dir === 'UP') { charY = 3; targetY = 2; targetX = charX; }
            else if (dir === 'DOWN') { charY = 1; targetY = 2; targetX = charX; }
            else if (dir === 'LEFT') { charX = 3; targetX = 2; targetY = charY; }
            else if (dir === 'RIGHT') { charX = 1; targetX = 2; targetY = charY; }
        } else if (lvl === 2) {
            const dir1 = ['UP', 'DOWN'][Math.floor(Math.random() * 2)];
            const dir2 = ['LEFT', 'RIGHT'][Math.floor(Math.random() * 2)];
            newPath = [dir1, dir2];
            newInstruction = `Go ${dir1}, then ${dir2}!`;
            charX = dir2 === 'LEFT' ? 3 : 1;
            charY = dir1 === 'UP' ? 3 : 1;
            targetX = 2; targetY = 2;
        } else if (lvl === 3) {
            const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
            newTargetObject = obj;
            const dir = ['UP', 'DOWN', 'LEFT', 'RIGHT'][Math.floor(Math.random() * 4)];
            newInstruction = `Move to the ${obj.name.toUpperCase()} on the ${dir}!`;
            newPath = [dir];
            if (dir === 'UP') { charY = 3; targetY = 2; targetX = charX; }
            else if (dir === 'DOWN') { charY = 1; targetY = 2; targetX = charX; }
            else if (dir === 'LEFT') { charX = 3; targetX = 2; targetY = charY; }
            else if (dir === 'RIGHT') { charX = 1; targetX = 2; targetY = charY; }
        } else {
            const p = ['UP', 'RIGHT', 'UP'];
            newPath = p;
            newInstruction = `Help the explorer reach home! ${p.join(' then ')}`;
            charX = 1; charY = 3;
            targetX = 2; targetY = 1;
            newTargetObject = OBJECTS.find(o => o.id === 'home');
        }

        setCharacterPos({ x: charX, y: charY });
        setTargetPos({ x: targetX, y: targetY });
        setTargetObject(newTargetObject);
        setInstruction(newInstruction);
        setPath(newPath);
        setCurrentStep(0);
        setFeedback(null);
        setTimeout(() => speak(newInstruction), 500);
    }, []);

    useEffect(() => {
        if (gameState === 'playing') initLevel(level);
    }, [level, gameState, initLevel]);

    const handleDirection = (dir) => {
        if (feedback === 'correct') return;
        const expectedDir = path[currentStep];
        if (dir === expectedDir) {
            playSound('click');
            let nextX = characterPos.x, nextY = characterPos.y;
            if (dir === 'UP') nextY--;
            else if (dir === 'DOWN') nextY++;
            else if (dir === 'LEFT') nextX--;
            else if (dir === 'RIGHT') nextX++;

            setCharacterPos({ x: nextX, y: nextY });
            if (currentStep === path.length - 1) {
                setFeedback('correct');
                playSound('correct');
                setStars(s => s + 1);
                speak("Yippee! You are an expert explorer!");
                setTimeout(() => level < 4 ? setGameState('level_complete') : setGameState('game_complete'), 2000);
            } else setCurrentStep(s => s + 1);
        } else {
            playSound('wrong');
            setFeedback('wrong');
            speak(`Oops! Try going ${expectedDir}!`);
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const renderIntro = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)', padding: '20px',
            fontFamily: '"Comic Sans MS", cursive'
        }}>
            <motion.h1
                animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ fontSize: 'min(4rem, 12vw)', fontWeight: 900, color: '#D32F2F', textAlign: 'center', marginBottom: '30px' }}
            >
                Path Explorer! 🗺️
            </motion.h1>

            <motion.div style={{ background: 'white', padding: '30px', borderRadius: '40px', border: '8px solid #FFCDD2', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', color: '#D32F2F', margin: '0 0 20px 0' }}>Who is exploring today?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {CHARACTERS.map(c => (
                        <motion.button
                            key={c.id}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setCharacter(c); playSound('click'); }}
                            style={{
                                padding: '15px', borderRadius: '20px',
                                border: character.id === c.id ? '5px solid #FF5252' : '5px solid #F5F5F5',
                                background: character.id === c.id ? '#FFEBEE' : 'white', cursor: 'pointer', fontSize: '2.5rem'
                            }}
                        >
                            {c.icon}
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playSound('click'); setGameState('playing'); }}
                    style={{
                        width: '100%', marginTop: '30px', padding: '20px',
                        background: '#FF5252', color: 'white', border: 'none',
                        borderRadius: '25px', fontSize: '1.8rem', fontWeight: 900,
                        boxShadow: '0 8px 0 #D32F2F', cursor: 'pointer'
                    }}
                >
                    LET'S GO! 🚀
                </motion.button>
            </motion.div>
        </div>
    );

    const renderLevelComplete = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#E3F2FD' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }}>
                <span style={{ fontSize: '10rem' }}>⭐</span>
                <h1 style={{ fontSize: '3rem', color: '#1976D2', fontWeight: 900, margin: '20px 0' }}>AWESOME!</h1>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setLevel(l => l + 1); setGameState('playing'); }}
                    style={{ padding: '20px 60px', borderRadius: '50px', background: '#4CAF50', color: 'white', border: 'none', fontSize: '1.8rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 0 #2E7D32' }}
                >
                    NEXT MAP ➡️
                </motion.button>
            </motion.div>
        </div>
    );

    const renderPlaying = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F1F8E9' }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <button onClick={() => setGameState('intro')} style={{ padding: '10px 20px', background: 'white', border: '4px solid #4CAF50', borderRadius: '15px', fontWeight: 900, color: '#4CAF50', cursor: 'pointer' }}>QUIT</button>
                <div style={{ background: '#4CAF50', padding: '10px 25px', borderRadius: '25px', color: 'white', fontWeight: 900, border: '4px solid white' }}>Level {level}</div>
                <div style={{ background: '#FFD700', padding: '10px 20px', borderRadius: '25px', fontWeight: 900, border: '4px solid white' }}>⭐ {stars}</div>
            </div>

            {/* Instruction */}
            <div style={{ textAlign: 'center', padding: '10px 20px' }}>
                <motion.div key={instruction} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'white', padding: '15px 40px', borderRadius: '50px', display: 'inline-block', border: '6px solid #4CAF50', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333', fontWeight: 800 }}>{instruction}</h2>
                </motion.div>
            </div>

            {/* Adventure Grid */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gap: '12px', background: '#DCEDC8', padding: '15px',
                    borderRadius: '25px', border: '10px solid #AED581',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                        const x = i % GRID_SIZE, y = Math.floor(i / GRID_SIZE);
                        const isChar = characterPos.x === x && characterPos.y === y, isTarget = targetPos.x === x && targetPos.y === y;
                        return (
                            <div key={i} style={{
                                width: 'min(70px, 15vw)', height: 'min(70px, 15vw)',
                                background: '#FFF', borderRadius: '15px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderBottom: '6px solid #E0E0E0'
                            }}>
                                <AnimatePresence>
                                    {isChar && <motion.span layoutId="char" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '3.5rem', zIndex: 5 }}>{character.icon}</motion.span>}
                                    {isTarget && !isChar && <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '2.5rem' }}>{targetObject ? targetObject.icon : '✨'}</motion.span>}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Huge Big Buttons */}
            <div style={{ padding: '20px 20px 40px 20px', background: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', boxShadow: '0 -20px 40px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    <div />
                    <BigDirBtn icon={<ArrowUp size={40} />} color="#42A5F5" shadow="#1E88E5" onClick={() => handleDirection('UP')} />
                    <div />
                    <BigDirBtn icon={<ArrowLeft size={40} />} color="#FFA726" shadow="#FB8C00" onClick={() => handleDirection('LEFT')} />
                    <div />
                    <BigDirBtn icon={<ArrowRight size={40} />} color="#66BB6A" shadow="#43A047" onClick={() => handleDirection('RIGHT')} />
                    <div />
                    <BigDirBtn icon={<ArrowDown size={40} />} color="#AB47BC" shadow="#8E24AA" onClick={() => handleDirection('DOWN')} />
                    <div />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100vh', fontFamily: '"Comic Sans MS", cursive' }}>
            {gameState === 'intro' && renderIntro()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'level_complete' && renderLevelComplete()}
            {gameState === 'game_complete' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FFF', textAlign: 'center' }}>
                    <Trophy size={150} color="#FFD700" />
                    <h1 style={{ fontSize: '4rem', color: '#E91E63', fontWeight: 900 }}>🏆 MASTER EXPLORER!</h1>
                    <button onClick={onBack} style={{ marginTop: '40px', padding: '20px 50px', background: '#E91E63', color: 'white', borderRadius: '30px', border: 'none', fontSize: '1.5rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 0 #AD1457' }}>MAIN MENU</button>
                </div>
            )}
        </div>
    );
};

const BigDirBtn = ({ icon, color, shadow, onClick }) => (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9, y: 5 }} onClick={onClick} style={{ width: '80px', height: '80px', borderRadius: '25px', background: color, color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 0 ${shadow}`, cursor: 'pointer' }}>
        {icon}
    </motion.button>
);

export default DirectionAdventureGame;
