import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Rocket, Zap, Trophy, Heart } from 'lucide-react';
import { playSound } from '../utils/sounds';

const TABLES = Array.from({ length: 19 }, (_, i) => i + 2);

const ICONS = [<Star />, <Rocket />, <Zap />, <Trophy />, <Heart />, '🍎', '🐱', '🐶', '🍕', '🚗', '🎈', '🎁', '🍦', '🍩', '🍔', '🐯', '🦄', '🌈', '🔥'];

const BubbleMultiplicationGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('selection'); // 'selection', 'playing', 'fail', 'success_celebration'
    const [selectedTable, setSelectedTable] = useState(null);
    const [score, setScore] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [bubbles, setBubbles] = useState([]);
    const [timeLeft, setTimeLeft] = useState(8);
    const [isPaused, setIsPaused] = useState(false);

    const gameLoopRef = useRef();
    const timerRef = useRef();
    const containerRef = useRef();

    // Sound wrappers
    const playPop = () => playSound('click');
    const playCorrect = () => playSound('correct');
    const playWrong = () => playSound('wrong');

    // Generate a new question
    const generateQuestion = (table) => {
        const factor = Math.floor(Math.random() * 10) + 1;
        const answer = table * factor;

        // Generate wrong answers
        const wrongAnswers = new Set();
        while (wrongAnswers.size < 4) {
            const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
            const wrong = answer + offset;
            if (wrong > 0 && wrong !== answer) {
                wrongAnswers.add(wrong);
            }
        }

        return {
            table,
            factor,
            answer,
            wrongAnswers: Array.from(wrongAnswers)
        };
    };

    // Start game
    const startGame = (table) => {
        setSelectedTable(table);
        setScore(0);
        setConsecutiveCorrect(0);
        startNewRound(table);
        setGameState('playing');
    };

    const startNewRound = (table) => {
        const q = generateQuestion(table);
        setCurrentQuestion(q);
        setBubbles([]);
        setTimeLeft(8);

        // Create initial bubbles
        const initialBubbles = [];
        const allAnswers = [q.answer, ...q.wrongAnswers];

        allAnswers.forEach((val, i) => {
            initialBubbles.push(createBubble(val, val === q.answer));
        });

        setBubbles(initialBubbles);
    };

    const createBubble = (value, isCorrect) => {
        const id = Math.random().toString(36).substr(2, 9);
        const colors = [
            'rgba(52, 152, 219, 0.6)', // Blue
            'rgba(46, 204, 113, 0.6)', // Green
            'rgba(155, 89, 182, 0.6)', // Purple
            'rgba(241, 196, 15, 0.6)',  // Yellow
            'rgba(231, 76, 60, 0.6)',   // Red
            'rgba(230, 126, 34, 0.6)'   // Orange
        ];

        return {
            id,
            value,
            isCorrect,
            x: Math.random() * 80 + 10, // 10% to 90%
            y: 110, // Start below screen
            size: Math.random() * 40 + 60, // 60px to 100px
            speed: Math.random() * 0.5 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            swayRange: Math.random() * 20 + 10,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayOffset: Math.random() * Math.PI * 2
        };
    };

    // Game loop for moving bubbles
    useEffect(() => {
        if (gameState !== 'playing' || isPaused) return;

        const updateBubbles = () => {
            setBubbles(prev => {
                const next = prev.map(b => ({
                    ...b,
                    y: b.y - b.speed,
                    x: b.x + Math.sin(Date.now() * b.swaySpeed + b.swayOffset) * 0.2
                })).filter(b => b.y > -20); // Remove when off screen

                // If correct bubble is gone, or all bubbles gone, spawn more
                const hasCorrect = next.some(b => b.isCorrect);
                if (!hasCorrect || next.length < 3) {
                    const newVal = Math.random() > 0.7 ? currentQuestion.answer : currentQuestion.wrongAnswers[Math.floor(Math.random() * 4)];
                    next.push(createBubble(newVal, newVal === currentQuestion.answer));
                }

                return next;
            });
            gameLoopRef.current = requestAnimationFrame(updateBubbles);
        };

        gameLoopRef.current = requestAnimationFrame(updateBubbles);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [gameState, isPaused, currentQuestion]);

    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing' || isPaused) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    setGameState('fail');
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timerRef.current);
    }, [gameState, isPaused]);

    const handleBubbleClick = (bubble) => {
        if (bubble.isCorrect) {
            playPop();
            playCorrect();

            // Calculate bonus
            const bonus = Math.floor(timeLeft * 2);
            setScore(s => s + 10 + bonus);

            const newConsecutive = consecutiveCorrect + 1;
            setConsecutiveCorrect(newConsecutive);

            if (newConsecutive % 5 === 0) {
                setGameState('success_celebration');
                setTimeout(() => {
                    setGameState('playing');
                    startNewRound(selectedTable);
                }, 2000);
            } else {
                startNewRound(selectedTable);
            }
        } else {
            playWrong();
            // Optional: shake screen or something
            // For now just remove the bubble
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        }
    };

    const renderSelection = () => (
        <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <button onClick={onBack} style={{
                    padding: '12px', background: 'white', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <ChevronLeft size={24} color="#00838F" />
                </button>
                <h1 style={{ flex: 1, textAlign: 'center', color: '#006064', fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>
                    Bubble Multiplication
                </h1>
            </div>

            <p style={{ fontSize: '1.2rem', color: '#00838F', fontWeight: 700, marginBottom: '20px' }}>Select a Table to Start!</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '15px',
                width: '100%',
                maxWidth: '900px'
            }}>
                {TABLES.map((table, idx) => (
                    <motion.button
                        key={table}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startGame(table)}
                        style={{
                            padding: '20px',
                            background: 'white',
                            borderRadius: '24px',
                            border: '4px solid #4DD0E1',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', color: '#00838F' }}>
                            {typeof ICONS[idx % ICONS.length] === 'string' ?
                                ICONS[idx % ICONS.length] :
                                React.cloneElement(ICONS[idx % ICONS.length], { size: 40 })
                            }
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00838F' }}>Table of {table}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );

    const renderPlaying = () => (
        <div ref={containerRef} style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #1A237E 0%, #283593 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Background Bubbles (Static Decor) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.2 }}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: Math.random() * 100 + 50,
                        height: Math.random() * 100 + 50,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        border: '1px solid rgba(255,255,255,0.3)'
                    }} />
                ))}
            </div>

            {/* Timer Bar */}
            <div style={{ width: '100%', height: '15px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
                <motion.div
                    animate={{
                        width: `${(timeLeft / 8) * 100}%`,
                        backgroundColor: timeLeft < 2 ? '#FF1744' : '#00E676'
                    }}
                    transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                    style={{
                        height: '100%',
                        borderRadius: '0 10px 10px 0',
                        boxShadow: '0 0 10px rgba(0,230,118,0.5)'
                    }}
                />
            </div>

            {/* Top Stats */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <button onClick={() => setGameState('selection')} style={{
                    padding: '8px 15px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(5px)'
                }}>
                    QUIT
                </button>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '20px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1.2rem' }}>SCORE: </span>
                    <span style={{ color: '#FBC02D', fontWeight: 900, fontSize: '1.8rem' }}>{score}</span>
                </div>
            </div>

            {/* Question Card */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', zIndex: 10 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentQuestion.table}-${currentQuestion.factor}`}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        style={{
                            background: 'white',
                            padding: '30px 60px',
                            borderRadius: '30px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            textAlign: 'center',
                            border: '5px solid #3498DB'
                        }}
                    >
                        <h2 style={{ fontSize: '4rem', margin: 0, color: '#2C3E50', fontWeight: 900, fontFamily: 'monospace' }}>
                            {currentQuestion.table} × {currentQuestion.factor} = ?
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Game Field - Bubbles */}
            <div style={{ flex: 1, position: 'relative' }}>
                {bubbles.map(bubble => (
                    <motion.div
                        key={bubble.id}
                        onClick={() => handleBubbleClick(bubble)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, left: `${bubble.x}%`, top: `${bubble.y}%` }}
                        whileTap={{ scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            width: bubble.size,
                            height: bubble.size,
                            borderRadius: '50%',
                            background: bubble.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: bubble.size * 0.4,
                            fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.2), inset 5px 5px 15px rgba(255,255,255,0.3)',
                            border: '2px solid rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(2px)',
                            zIndex: 5
                        }}
                    >
                        {bubble.value}
                        {/* Shine effect */}
                        <div style={{
                            position: 'absolute',
                            top: '15%',
                            left: '15%',
                            width: '25%',
                            height: '25%',
                            background: 'rgba(255,255,255,0.4)',
                            borderRadius: '50%',
                            filter: 'blur(2px)'
                        }} />
                    </motion.div>
                ))}
            </div>

            {/* Celebration (Confetti simulation) */}
            <AnimatePresence>
                {gameState === 'success_celebration' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(255,255,255,0.1)',
                            zIndex: 200,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                background: 'white', padding: '50px', borderRadius: '40px',
                                textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                                border: '10px solid #FFD700'
                            }}
                        >
                            <span style={{ fontSize: '6rem' }}>🏆</span>
                            <h1 style={{ fontSize: '3rem', color: '#2C3E50', fontWeight: 900, margin: '20px 0' }}>AWESOME!</h1>
                            <p style={{ fontSize: '1.5rem', color: '#7F8C8D', fontWeight: 600 }}>You're a Table Champion!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderFail = () => (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <motion.div
                initial={{ scale: 0.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                style={{
                    background: 'white',
                    padding: '50px',
                    borderRadius: '40px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '90%'
                }}
            >
                <div style={{ fontSize: '6rem', marginBottom: '20px' }}>😢</div>
                <h2 style={{ fontSize: '2.5rem', color: '#2C3E50', margin: 0 }}>Time's Up!</h2>
                <p style={{ fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '30px' }}>Don't give up! You were doing great.</p>

                <div style={{ background: '#F8F9FA', padding: '20px', borderRadius: '20px', marginBottom: '30px' }}>
                    <span style={{ fontSize: '1rem', color: '#95A5A6', display: 'block' }}>YOUR SCORE</span>
                    <span style={{ fontSize: '2.5rem', color: '#2C3E50', fontWeight: 900 }}>{score}</span>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => startGame(selectedTable)}
                        style={{
                            flex: 1, padding: '20px', borderRadius: '20px',
                            background: '#3498DB', color: 'white', fontSize: '1.25rem',
                            fontWeight: 900, border: 'none', cursor: 'pointer',
                            boxShadow: '0 8px 0 #2980B9'
                        }}
                    >
                        RETRY 💪
                    </button>
                    <button
                        onClick={() => setGameState('selection')}
                        style={{
                            flex: 1, padding: '20px', borderRadius: '15px',
                            background: '#ECF0F1', color: '#2C3E50', fontSize: '1.25rem',
                            fontWeight: 700, border: 'none', cursor: 'pointer'
                        }}
                    >
                        HOME
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
            {gameState === 'selection' && renderSelection()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'success_celebration' && renderPlaying()}
            {gameState === 'fail' && renderFail()}
        </div>
    );
};

export default BubbleMultiplicationGame;
