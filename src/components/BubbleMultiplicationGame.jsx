import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Rocket, Zap, Trophy, Heart } from 'lucide-react';
import { playSound } from '../utils/sounds';

const TABLES = Array.from({ length: 19 }, (_, i) => i + 2);

const ICONS = [<Star />, <Rocket />, <Zap />, <Trophy />, <Heart />, '🍎', '🐱', '🐶', '🍕', '🚗', '🎈', '🎁', '🍦', '🍩', '🍔', '🐯', '🦄', '🌈', '🔥'];

// ── Particle burst helper (correct answer) ──────────────────────────────────
const BurstParticles = ({ size }) => (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
        {[0, 60, 120, 180, 240, 300].map(deg => (
            <motion.div
                key={deg}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                    x: Math.cos(deg * Math.PI / 180) * size * 0.9,
                    y: Math.sin(deg * Math.PI / 180) * size * 0.9,
                    scale: 0, opacity: 0
                }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{
                    position: 'absolute',
                    width: 10, height: 10,
                    borderRadius: '50%',
                    background: deg % 120 === 0 ? '#FFD700' : '#FFFDE7',
                    top: '50%', left: '50%',
                    marginTop: -5, marginLeft: -5
                }}
            />
        ))}
    </div>
);

const TOTAL_ROUNDS = 10;
// 5 fixed vertical lanes (x positions in %) so bubbles never overlap
const BUBBLE_LANES = [10, 27, 44, 61, 78];
const BUBBLE_SIZE = 62; // fixed px — keeps all bubbles the same size

// Speed presets: timer seconds + bubble velocity multiplier
const SPEED_CONFIG = {
    slow: { label: '🐢 Slow', seconds: 12, speedMult: 0.55, color: '#22C55E', desc: '12 s / question' },
    fast: { label: '⚡ Fast', seconds: 5, speedMult: 1.2, color: '#EF4444', desc: '5 s / question' },
};

const BubbleMultiplicationGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('selection');
    const [selectedTable, setSelectedTable] = useState(null);
    const [score, setScore] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [bubbles, setBubbles] = useState([]);
    const [timeLeft, setTimeLeft] = useState(8);
    const [isPaused, setIsPaused] = useState(false);
    const [roundNumber, setRoundNumber] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [speed, setSpeed] = useState('slow');
    const [missOverlay, setMissOverlay] = useState(false); // ⏰ timeout flash

    const gameLoopRef = useRef();
    const timerRef = useRef();
    const containerRef = useRef();
    // Mutable refs — always have the latest values for use inside closures
    const roundRef = useRef(0);
    const tableRef = useRef(null);
    const handleTimeoutRef = useRef(null); // updated every render
    const speedRef = useRef('slow');       // mirrors `speed` state for closures
    speedRef.current = speed;             // kept in sync every render

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
        tableRef.current = table;
        roundRef.current = 1;
        setSelectedTable(table);
        setScore(0);
        setConsecutiveCorrect(0);
        setRoundNumber(1);
        setCorrectAnswers(0);
        setWrongCount(0);
        startNewRound(table);
        setGameState('playing');
    };

    const advanceRound = (isCorrect) => {
        // Called when a round ends (correct pop, wrong pop, or timeout)
        if (!isCorrect) setWrongCount(w => w + 1);
        const next = roundRef.current + 1;
        roundRef.current = next;
        setRoundNumber(next);
        if (next > TOTAL_ROUNDS) {
            clearInterval(timerRef.current);
            cancelAnimationFrame(gameLoopRef.current);
            setGameState('finished');
        } else {
            startNewRound(tableRef.current);
        }
    };

    // Keep handleTimeoutRef fresh every render — called from inside timer closure
    handleTimeoutRef.current = () => {
        // 1. Freeze all bubbles with 'miss' effect
        setBubbles(prev => prev.map(b => ({ ...b, effect: 'miss', fx: b.x, fy: b.y })));
        setMissOverlay(true);
        setIsPaused(true);   // stop game loop + timer
        // 2. After animation, advance round
        setTimeout(() => {
            setMissOverlay(false);
            setIsPaused(false);
            advanceRound(false);
        }, 850);
    };

    const startNewRound = (table) => {
        const q = generateQuestion(table);
        setCurrentQuestion(q);
        setBubbles([]);
        const duration = SPEED_CONFIG[speedRef.current].seconds;
        setTimeLeft(duration);

        const allAnswers = [q.answer, ...q.wrongAnswers];  // 5 items
        // Shuffle lanes so the correct bubble isn't always in the same column
        const shuffledLanes = [...BUBBLE_LANES].sort(() => Math.random() - 0.5);
        setBubbles(allAnswers.map((val, i) => createBubble(val, val === q.answer, shuffledLanes[i])));
    };

    // laneX: the fixed x% centre for this bubble
    const createBubble = (value, isCorrect, laneX) => {
        const id = Math.random().toString(36).substr(2, 9);
        const colors = [
            'rgba(52, 152, 219, 0.75)',
            'rgba(46, 204, 113, 0.75)',
            'rgba(155, 89, 182, 0.75)',
            'rgba(241, 196, 15,  0.8 )',
            'rgba(231, 76,  60,  0.75)',
            'rgba(230, 126, 34,  0.75)'
        ];
        const lane = laneX ?? BUBBLE_LANES[Math.floor(Math.random() * BUBBLE_LANES.length)];
        const mult = SPEED_CONFIG[speedRef.current].speedMult;
        return {
            id, value, isCorrect,
            laneX: lane,
            x: lane,
            y: 110,
            size: BUBBLE_SIZE,
            speed: (Math.random() * 0.35 + 0.45) * mult,  // scaled by mode
            color: colors[Math.floor(Math.random() * colors.length)],
            swayAmp: 0,   // no lateral sway — bubbles rise straight up
            swaySpeed: Math.random() * 0.015 + 0.008,
            swayOffset: Math.random() * Math.PI * 2
        };
    };

    // Game loop — bubbles float upward, swaying within their fixed lane
    useEffect(() => {
        if (gameState !== 'playing' || isPaused) return;

        const updateBubbles = () => {
            setBubbles(prev => {
                const next = prev.map(b =>
                    b.effect ? b  // freeze effect-bubbles in place
                        : {
                            ...b,
                            y: b.y - b.speed,
                            x: b.laneX + Math.sin(Date.now() * b.swaySpeed + b.swayOffset) * b.swayAmp
                        }
                ).filter(b => b.y > -20 || b.effect); // keep animating bubbles

                // Only respawn correct bubble when no animation is playing
                const hasCorrect = next.some(b => b.isCorrect && !b.effect);
                const animating = next.some(b => b.effect);
                if (!hasCorrect && !animating && currentQuestion) {
                    const usedLanes = next.map(b => b.laneX);
                    const freeLane = BUBBLE_LANES.find(l => !usedLanes.includes(l))
                        ?? BUBBLE_LANES[Math.floor(Math.random() * BUBBLE_LANES.length)];
                    next.push(createBubble(currentQuestion.answer, true, freeLane));
                }

                return next;
            });
            gameLoopRef.current = requestAnimationFrame(updateBubbles);
        };

        gameLoopRef.current = requestAnimationFrame(updateBubbles);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [gameState, isPaused, currentQuestion]);

    // Timer — counts down; on expiry advances round (counts as wrong/missed)
    useEffect(() => {
        if (gameState !== 'playing' || isPaused) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timerRef.current);
                    handleTimeoutRef.current(); // advance round via ref (avoids stale closure)
                    return 8;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timerRef.current);
    }, [gameState, isPaused, roundNumber]); // re-run each new round

    const handleBubbleClick = (bubble) => {
        if (bubble.effect) return; // ignore clicks while animating

        if (bubble.isCorrect) {
            playPop();
            playCorrect();
            const bonus = Math.floor(timeLeft * 2);
            setScore(s => s + 10 + bonus);
            setCorrectAnswers(c => c + 1);
            setConsecutiveCorrect(c => c + 1);
            // Burst correct, vanish all others
            setIsPaused(true);
            setBubbles(prev => prev.map(b => ({
                ...b, fx: b.x, fy: b.y,
                effect: b.id === bubble.id ? 'burst' : 'vanish'
            })));
            setTimeout(() => {
                setIsPaused(false);
                advanceRound(true);
            }, 620);
        } else {
            playWrong();
            setIsPaused(true);
            // Burn the wrong bubble, others stay
            setBubbles(prev => prev.map(b =>
                b.id === bubble.id ? { ...b, effect: 'burn', fx: b.x, fy: b.y } : b
            ));
            setTimeout(() => {
                setIsPaused(false);
                // Count + advance (inline to avoid stale closure)
                setWrongCount(w => w + 1);
                const next = roundRef.current + 1;
                roundRef.current = next;
                setRoundNumber(next);
                if (next > TOTAL_ROUNDS) {
                    clearInterval(timerRef.current);
                    cancelAnimationFrame(gameLoopRef.current);
                    setGameState('finished');
                } else {
                    startNewRound(tableRef.current);
                }
            }, 520);
        }
    };

    const renderSelection = () => (
        <div style={{
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)'
        }}>
            {/* Header row: back button + title on ONE line */}
            <div style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', marginTop: '4px' }}>
                <button onClick={onBack} style={{
                    padding: '8px', background: 'white', borderRadius: '12px',
                    border: 'none', cursor: 'pointer', boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                    flexShrink: 0
                }}>
                    <ChevronLeft size={20} color="#00838F" />
                </button>
                <h1 style={{ flex: 1, textAlign: 'center', color: '#006064', fontSize: '1.1rem', fontWeight: 900, margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                    🫧 Bubble Multiplication
                </h1>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#00838F', fontWeight: 700, margin: '0 0 8px' }}>Select a Table to Start!</p>

            {/* Speed toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '14px', padding: '4px' }}>
                {Object.entries(SPEED_CONFIG).map(([key, cfg]) => (
                    <button
                        key={key}
                        onClick={() => setSpeed(key)}
                        style={{
                            flex: 1, padding: '7px 10px', borderRadius: '10px',
                            border: 'none', cursor: 'pointer', fontWeight: 800,
                            fontSize: '0.82rem', transition: 'all 0.18s',
                            background: speed === key ? cfg.color : 'transparent',
                            color: speed === key ? 'white' : '#64748B',
                            boxShadow: speed === key ? `0 3px 8px ${cfg.color}55` : 'none'
                        }}
                    >
                        {cfg.label}<br />
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.85 }}>{cfg.desc}</span>
                    </button>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%',
                maxWidth: '420px'
            }}>
                {TABLES.map((table, idx) => (
                    <motion.button
                        key={table}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startGame(table)}
                        style={{
                            padding: '12px 8px',
                            background: 'white',
                            borderRadius: '18px',
                            border: '3px solid #4DD0E1',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                        }}
                    >
                        <div style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', color: '#00838F' }}>
                            {typeof ICONS[idx % ICONS.length] === 'string' ?
                                ICONS[idx % ICONS.length] :
                                React.cloneElement(ICONS[idx % ICONS.length], { size: 26 })
                            }
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#00838F', lineHeight: 1.2 }}>TABLE OF<br />{table}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );

    const renderPlaying = () => (
        <div ref={containerRef} style={{
            position: 'fixed',
            top: '68px',        /* sits flush under the fixed GlobalHeader */
            left: 0, right: 0, bottom: 0,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #1A237E 0%, #283593 100%)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10
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
            <div style={{ padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, gap: '6px' }}>
                <button onClick={() => setGameState('selection')} style={{
                    padding: '6px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(5px)', fontSize: '0.8rem'
                }}>QUIT</button>

                {/* Round progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 8px', color: '#E2E8F0', fontWeight: 700, fontSize: '0.78rem' }}>
                        Q {roundNumber}/{TOTAL_ROUNDS}
                    </span>
                    <span style={{ background: 'rgba(34,197,94,0.3)', borderRadius: '8px', padding: '4px 8px', color: '#86EFAC', fontWeight: 700, fontSize: '0.78rem' }}>✓{correctAnswers}</span>
                    <span style={{ background: 'rgba(239,68,68,0.3)', borderRadius: '8px', padding: '4px 8px', color: '#FCA5A5', fontWeight: 700, fontSize: '0.78rem' }}>✗{wrongCount}</span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '14px', backdropFilter: 'blur(5px)' }}>
                    <span style={{ color: '#FBC02D', fontWeight: 900, fontSize: '1.2rem' }}>{score}</span>
                </div>
            </div>

            {/* Question Card */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', zIndex: 10 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentQuestion.table}-${currentQuestion.factor}`}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        style={{
                            background: 'white',
                            padding: '12px 24px',
                            borderRadius: '20px',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
                            textAlign: 'center',
                            border: '4px solid #3498DB'
                        }}
                    >
                        <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#2C3E50', fontWeight: 900, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                            {currentQuestion.table} × {currentQuestion.factor} = ?
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Game Field - Bubbles */}
            <div style={{ flex: 1, position: 'relative' }}>
                {bubbles.map(bubble => {
                    const fx = bubble.fx ?? bubble.x;
                    const fy = bubble.fy ?? bubble.y;
                    const isBurst = bubble.effect === 'burst';
                    const isBurn = bubble.effect === 'burn';
                    const isMiss = bubble.effect === 'miss';
                    const isVanish = bubble.effect === 'vanish';

                    const bgColor =
                        isBurst ? 'radial-gradient(circle, #FFD700 0%, #22C55E 100%)' :
                            isBurn ? 'radial-gradient(circle, #FF6B00 0%, #EF4444 100%)' :
                                isMiss ? '#94A3B8' : bubble.color;

                    const animProps = isBurst ? {
                        animate: { scale: [1, 1.55, 0], opacity: [1, 1, 0] },
                        transition: { duration: 0.58, ease: 'easeOut' }
                    } : isBurn ? {
                        animate: { scale: [1, 1.15, 0.9, 0], x: [0, -12, 12, -8, 0], opacity: [1, 1, 0.7, 0] },
                        transition: { duration: 0.5, times: [0, 0.2, 0.6, 1] }
                    } : isMiss ? {
                        animate: { scale: [1, 0.8, 0], opacity: [1, 0.35, 0], y: [0, -12, 0] },
                        transition: { duration: 0.55 }
                    } : isVanish ? {
                        animate: { scale: [1, 0.7, 0], opacity: [1, 0.4, 0] },
                        transition: { duration: 0.45 }
                    } : {
                        animate: { scale: 1, left: `${bubble.x}%`, top: `${bubble.y}%` },
                        transition: { duration: 0 }
                    };

                    return (
                        <motion.div
                            key={bubble.id}
                            onClick={() => handleBubbleClick(bubble)}
                            initial={{ scale: 0 }}
                            {...animProps}
                            whileTap={!bubble.effect ? { scale: 0.85 } : {}}
                            style={{
                                position: 'absolute',
                                left: `${fx}%`, top: `${fy}%`,
                                width: bubble.size, height: bubble.size,
                                borderRadius: '50%',
                                background: bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: bubble.size * 0.38,
                                fontWeight: 900,
                                cursor: bubble.effect ? 'default' : 'pointer',
                                boxShadow: isBurst ? '0 0 24px #FFD700' :
                                    isBurn ? '0 0 20px #EF4444' :
                                        'inset -5px -5px 15px rgba(0,0,0,0.2), inset 5px 5px 15px rgba(255,255,255,0.3)',
                                border: isBurst ? '3px solid #FFD700' :
                                    isBurn ? '3px solid #FF6B00' :
                                        '2px solid rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(2px)',
                                zIndex: bubble.effect ? 15 : 5,
                                userSelect: 'none'
                            }}
                        >
                            {bubble.value}
                            {/* Shine dot */}
                            {!bubble.effect && (
                                <div style={{
                                    position: 'absolute', top: '15%', left: '15%',
                                    width: '25%', height: '25%',
                                    background: 'rgba(255,255,255,0.4)',
                                    borderRadius: '50%', filter: 'blur(2px)'
                                }} />
                            )}
                            {/* Burst particles */}
                            {isBurst && <BurstParticles size={bubble.size} />}
                            {/* Burn emoji */}
                            {isBurn && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{ scale: [0.5, 1.4, 0], opacity: [1, 1, 0] }}
                                    transition={{ duration: 0.5 }}
                                    style={{ position: 'absolute', fontSize: '1.4rem', pointerEvents: 'none' }}
                                >🔥</motion.div>
                            )}
                        </motion.div>
                    );
                })}

                {/* ⏰ MISSED overlay */}
                <AnimatePresence>
                    {missOverlay && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            style={{
                                position: 'absolute', inset: 0, zIndex: 50,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none'
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem' }}>⏰</div>
                                <div style={{
                                    fontSize: '1.6rem', fontWeight: 900, color: 'white',
                                    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                                    letterSpacing: '2px'
                                }}>MISSED!</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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

    const renderFinished = () => {
        const accuracy = TOTAL_ROUNDS > 0 ? Math.round((correctAnswers / TOTAL_ROUNDS) * 100) : 0;
        const grade = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '⭐' : accuracy >= 50 ? '👍' : '💪';
        const gradeMsg = accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great Job!' : accuracy >= 50 ? 'Good Try!' : 'Keep Practicing!';

        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, backdropFilter: 'blur(10px)'
            }}>
                <motion.div
                    initial={{ scale: 0.5, y: 80 }}
                    animate={{ scale: 1, y: 0 }}
                    style={{
                        background: 'white', padding: '24px 20px',
                        borderRadius: '28px', textAlign: 'center',
                        maxWidth: '340px', width: '92%',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                    }}
                >
                    {/* Grade */}
                    <div style={{ fontSize: '3rem', marginBottom: '2px' }}>{grade}</div>
                    <h2 style={{ fontSize: '1.5rem', color: '#2C3E50', margin: '0 0 4px' }}>Game Over!</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#7F8C8D', fontWeight: 600 }}>{gradeMsg} · Table of {selectedTable}</span>
                        <span style={{
                            padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                            background: SPEED_CONFIG[speed].color, color: 'white'
                        }}>{SPEED_CONFIG[speed].label}</span>
                    </div>

                    {/* Stats: 4 boxes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '12px 8px' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#3B82F6' }}>{score}</div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Score</div>
                        </div>
                        <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 8px' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#22C55E' }}>{correctAnswers}/{TOTAL_ROUNDS}</div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Correct</div>
                        </div>
                        <div style={{ background: '#FFF1F2', borderRadius: '14px', padding: '12px 8px' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444' }}>{wrongCount}</div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Wrong / Missed</div>
                        </div>
                        <div style={{ background: accuracy >= 70 ? '#F0FDF4' : '#FFF7ED', borderRadius: '14px', padding: '12px 8px' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: accuracy >= 70 ? '#22C55E' : '#F97316' }}>{accuracy}%</div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Accuracy</div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => startGame(selectedTable)}
                            style={{
                                flex: 1, padding: '13px', borderRadius: '14px',
                                background: '#3B82F6', color: 'white', fontSize: '0.95rem',
                                fontWeight: 900, border: 'none', cursor: 'pointer',
                                boxShadow: '0 4px 0 #2563EB'
                            }}
                        >RETRY 💪</button>
                        <button
                            onClick={() => setGameState('selection')}
                            style={{
                                flex: 1, padding: '13px', borderRadius: '14px',
                                background: '#F1F5F9', color: '#2C3E50', fontSize: '0.95rem',
                                fontWeight: 700, border: 'none', cursor: 'pointer',
                                boxShadow: '0 4px 0 #CBD5E1'
                            }}
                        >🏠 HOME</button>
                    </div>
                </motion.div>
            </div>
        );
    };


    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
            {gameState === 'selection' && renderSelection()}
            {(gameState === 'playing' || gameState === 'success_celebration') && renderPlaying()}
            {gameState === 'finished' && renderFinished()}
        </div>
    );
};

export default BubbleMultiplicationGame;
