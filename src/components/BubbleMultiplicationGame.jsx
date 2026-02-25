import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Rocket, Zap, Trophy, Heart, Play, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/sounds';
import { speak } from '../utils/speech';

const TABLES = Array.from({ length: 19 }, (_, i) => i + 2); // Tables 2 to 20

const ICONS = ['⭐', '🚀', '⚡', '🏆', '❤️', '🍎', '🐱', '🐶', '🍕', '🚗', '🎈', '🎨', '🧩', '🌈', '🍦', '🛸', '🦖', '🏀', '🎸'];

const BUBBLE_LANES = [12, 31, 50, 69, 87]; // Centered lanes in %
const BUBBLE_SIZE = 75; // Enhanced size for mobile

const SPEED_CONFIG = {
    slow: { label: '🐢 Slow', seconds: 12, speedMult: 0.5, color: '#22C55E', desc: 'Relaxed' },
    medium: { label: '⚡ Fast', seconds: 7, speedMult: 1.0, color: '#EAB308', desc: 'Challenging' },
};

const BurstParticles = ({ size, color }) => (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
        {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2 + (Math.random() * 0.2);
            const dist = size * (1.2 + Math.random() * 0.8);
            return (
                <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0.8, opacity: 1 }}
                    animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist,
                        scale: 0,
                        opacity: 0,
                        rotate: Math.random() * 360
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        width: size * 0.25,
                        height: size * 0.35,
                        borderRadius: '40% 40% 60% 60%',
                        background: color,
                        top: '50%',
                        left: '50%',
                        marginTop: -(size * 0.175),
                        marginLeft: -(size * 0.125),
                        transform: `rotate(${angle + Math.PI / 2}rad)`,
                        boxShadow: '0 0 10px rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}
                />
            );
        })}
    </div>
);

const BubbleMultiplicationGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('selection'); // 'selection', 'playing', 'finished'
    const [selectedTable, setSelectedTable] = useState(null);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [bubbles, setBubbles] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [round, setRound] = useState(1);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [speedMode, setSpeedMode] = useState('slow');
    const [showTimeout, setShowTimeout] = useState(false);

    const gameLoopRef = useRef();
    const timerRef = useRef();
    const tableRef = useRef(null);
    const roundRef = useRef(1);

    const generateQuestion = useCallback((table) => {
        const factor = Math.floor(Math.random() * 10) + 1;
        const answer = table * factor;
        const choices = new Set([answer]);
        while (choices.size < 5) {
            const wrong = answer + (Math.floor(Math.random() * 6) - 3) * (Math.random() > 0.5 ? 1 : table);
            if (wrong > 0 && wrong !== answer) choices.add(wrong);
        }
        return { table, factor, answer, choices: [...choices].sort(() => Math.random() - 0.5) };
    }, []);

    const createBubble = useCallback((val, isCorrect, laneIdx) => {
        const scale = 0.8 + Math.random() * 0.6; // Varied sizes: 80% to 140%
        return {
            id: Math.random().toString(36).substr(2, 9),
            value: val,
            isCorrect,
            laneX: BUBBLE_LANES[laneIdx],
            x: BUBBLE_LANES[laneIdx],
            y: 110,
            size: BUBBLE_SIZE * scale,
            speed: (0.4 + Math.random() * 0.3) * SPEED_CONFIG[speedMode].speedMult,
            color: `hsl(${Math.random() * 360}, 75%, 60%)`,
            effect: null
        };
    }, [speedMode]);

    const startRound = useCallback((table) => {
        const q = generateQuestion(table);
        setCurrentQuestion(q);
        const newBubbles = q.choices.map((val, i) => createBubble(val, val === q.answer, i));
        setBubbles(newBubbles);
        setTimeLeft(SPEED_CONFIG[speedMode].seconds);
        setIsPaused(false);
        setShowTimeout(false);
    }, [generateQuestion, createBubble, speedMode]);

    const startGame = (table) => {
        tableRef.current = table;
        roundRef.current = 1;
        setSelectedTable(table);
        setScore(0);
        setRound(1);
        setCorrectCount(0);
        setWrongCount(0);
        setGameState('playing');
        startRound(table);
        speak(`Table of ${table}! Pop the bubbles!`, 'en-US', 1.1);
    };

    const nextRound = useCallback((isCorrect) => {
        if (isCorrect) setCorrectCount(c => c + 1);
        else setWrongCount(w => w + 1);

        if (roundRef.current >= 10) {
            setGameState('finished');
        } else {
            roundRef.current += 1;
            setRound(roundRef.current);
            startRound(tableRef.current);
        }
    }, [startRound]);

    // Timer Logic
    useEffect(() => {
        if (gameState !== 'playing' || isPaused) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 0) {
                    clearInterval(timerRef.current);
                    setIsPaused(true);
                    setShowTimeout(true);
                    playSound('wrong');
                    setBubbles(prev => prev.map(b => ({ ...b, effect: 'miss' })));
                    setTimeout(() => nextRound(false), 1200);
                    return 0;
                }
                return t - 0.1;
            });
        }, 100);

        return () => clearInterval(timerRef.current);
    }, [gameState, isPaused, nextRound]);

    // Physics Loop
    useEffect(() => {
        if (gameState !== 'playing' || isPaused) return;

        const update = () => {
            setBubbles(prev => {
                const next = prev.map(b => {
                    if (b.effect) return b;
                    return { ...b, y: b.y - b.speed, x: b.laneX };
                });

                // Respawn correct if it flies away
                if (!next.some(b => b.isCorrect && !b.effect && b.y > -10)) {
                    const q = currentQuestion;
                    if (q) {
                        next.push(createBubble(q.answer, true, Math.floor(Math.random() * 5)));
                    }
                }
                return next.filter(b => b.y > -30 || b.effect);
            });
            gameLoopRef.current = requestAnimationFrame(update);
        };

        gameLoopRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [gameState, isPaused, currentQuestion, createBubble]);

    const handlePop = (bubble) => {
        if (bubble.effect || isPaused) return;
        setIsPaused(true);

        if (bubble.isCorrect) {
            playSound('pop'); // Better pop sound
            setScore(s => s + 10 + Math.floor(timeLeft * 5));
            setBubbles(prev => prev.map(b => ({
                ...b, effect: b.id === bubble.id ? 'burst' : 'fade'
            })));
            setTimeout(() => nextRound(true), 800);
        } else {
            playSound('wrong');
            setBubbles(prev => prev.map(b => ({
                ...b, effect: b.id === bubble.id ? 'burn' : null
            })));
            setTimeout(() => nextRound(false), 800);
        }
    };

    return (
        <div style={{ width: '100%', height: '100dvh', fontFamily: '"Comic Sans MS", cursive', overflow: 'hidden', touchAction: 'none' }}>
            <AnimatePresence mode="wait">
                {gameState === 'selection' && (
                    <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ height: '100%', background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button onClick={onBack} style={{ padding: '12px', background: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                <ChevronLeft size={24} color="#00838F" />
                            </button>
                            <h1 style={{ flex: 1, fontSize: '1.6rem', fontWeight: 900, color: '#006064', textAlign: 'center' }}>Bubble Math 🫧</h1>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                            {Object.entries(SPEED_CONFIG).map(([k, v]) => (
                                <button key={k} onClick={() => setSpeedMode(k)}
                                    style={{ padding: '10px 30px', borderRadius: '20px', background: speedMode === k ? v.color : 'white', color: speedMode === k ? 'white' : '#666', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 6px 0 rgba(0,0,0,0.1)' }}>
                                    {v.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', width: '100%', maxWidth: '400px', overflowY: 'auto', paddingBottom: '40px' }}>
                            {TABLES.map((t, idx) => (
                                <motion.button key={t} whileTap={{ scale: 0.9 }} onClick={() => startGame(t)}
                                    style={{ padding: '20px 10px', background: 'white', borderRadius: '25px', border: 'none', boxShadow: '0 10px 0 #4DD0E1', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ fontSize: '2rem' }}>{ICONS[idx % ICONS.length]}</span>
                                    <span style={{ fontWeight: 900, color: '#00838F' }}>TABLE {t}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ height: '100%', background: 'linear-gradient(180deg, #1A237E 0%, #0D47A1 100%)', position: 'relative' }}>
                        {/* Status Bar */}
                        <div style={{ padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                            <button onClick={() => setGameState('selection')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '12px', fontWeight: 900 }}>QUIT</button>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Round {round}/10</div>
                            <div style={{ background: '#FFD700', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 950 }}>⭐ {score}</div>
                        </div>

                        {/* Timer Bar */}
                        <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)' }}>
                            <motion.div animate={{ width: `${(timeLeft / SPEED_CONFIG[speedMode].seconds) * 100}%`, background: timeLeft < 3 ? '#F44336' : '#4CAF50' }} style={{ height: '100%' }} />
                        </div>

                        {/* Question */}
                        {currentQuestion && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <motion.div key={`${currentQuestion.table}-${currentQuestion.factor}`} initial={{ y: -50, scale: 0.5 }} animate={{ y: 0, scale: 1 }}
                                    style={{ background: 'white', padding: '15px 40px', borderRadius: '30px', border: '6px solid #4FC3F7', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 900, color: '#01579B' }}>{currentQuestion.table} × {currentQuestion.factor}</h2>
                                </motion.div>
                            </div>
                        )}

                        {/* Bubble Field */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            {bubbles.map(b => (
                                <motion.div key={b.id}
                                    onPointerDown={() => handlePop(b)}
                                    animate={{
                                        left: `${b.x}%`,
                                        top: `${b.y}%`,
                                        scale: b.effect === 'burst' ? [1, 1.3, 0] : b.effect === 'fade' || b.effect === 'miss' ? 0 : 1,
                                        opacity: b.effect === 'fade' ? 0 : 1,
                                        borderRadius: b.effect === 'burst' ? '40%' : '50%'
                                    }}
                                    transition={{ duration: b.effect ? 0.4 : 0 }}
                                    style={{
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)',
                                        width: b.size,
                                        height: b.size,
                                        borderRadius: '50%',
                                        background: b.effect === 'burn' ? '#F44336' : b.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: `${(b.size / BUBBLE_SIZE) * 1.8}rem`,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        pointerEvents: 'auto',
                                        border: '4px solid rgba(255,255,255,0.6)',
                                        boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.3), inset 8px 8px 20px rgba(255,255,255,0.4)',
                                        backdropFilter: 'blur(3px)',
                                        userSelect: 'none'
                                    }}>
                                    {b.value}
                                    {/* Highlighting sheen for water balloon effect */}
                                    <div style={{ position: 'absolute', top: '15%', left: '20%', width: '25%', height: '25%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />

                                    {b.effect === 'burst' && <BurstParticles size={b.size} color={b.color} />}
                                    {b.effect === 'burn' && <motion.div animate={{ y: -60, opacity: 0 }} style={{ position: 'absolute', fontSize: '2.5rem' }}>🔥</motion.div>}
                                </motion.div>
                            ))}
                        </div>

                        {/* Timeout Indicator */}
                        <AnimatePresence>
                            {showTimeout && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }}
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white', textShadow: '0 5px 15px rgba(0,0,0,0.5)', zIndex: 200 }}>
                                    <div style={{ fontSize: '6rem' }}>⏰</div>
                                    <h1 style={{ fontSize: '3rem', fontWeight: 950 }}>TIME'S UP!</h1>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {gameState === 'finished' && (
                    <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ height: '100%', background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Trophy size={140} color="#FFD700" />
                        </motion.div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', margin: '20px 0' }}>WELL DONE!</h1>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '400px', marginBottom: '40px' }}>
                            <div style={{ background: '#FFF59D', padding: '20px', borderRadius: '25px', boxShadow: '0 8px 0 #FBC02D' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#FBC02D' }}>{score}</div>
                                <div style={{ fontWeight: 800 }}>POINTS</div>
                            </div>
                            <div style={{ background: '#A5D6A7', padding: '20px', borderRadius: '25px', boxShadow: '0 8px 0 #4CAF50' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#4CAF50' }}>{Math.round((correctCount / 10) * 100)}%</div>
                                <div style={{ fontWeight: 800 }}>ACCURACY</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => startGame(selectedTable)} style={{ padding: '20px 50px', borderRadius: '35px', background: '#3498DB', color: 'white', fontSize: '1.5rem', fontWeight: 900, border: 'none', boxShadow: '0 10px 0 #2980B9', cursor: 'pointer' }}>REPLAY 🔄</button>
                            <button onClick={() => setGameState('selection')} style={{ padding: '20px 50px', borderRadius: '35px', background: 'white', color: '#333', fontSize: '1.5rem', fontWeight: 900, border: 'none', boxShadow: '0 10px 0 #BDC3C7', cursor: 'pointer' }}>HOME 🏠</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BubbleMultiplicationGame;
