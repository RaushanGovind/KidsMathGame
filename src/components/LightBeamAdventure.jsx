import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Wand2, ChevronLeft, Trophy, Star, Lightbulb, Play } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const LEVELS = [
    {
        id: 1,
        title: "Straight Path",
        instruction: "Point the light at the treasure box!",
        flashlight: { x: 15, y: 50, angle: 0 },
        target: { x: 80, y: 50, size: 70 },
        mirrors: [],
        blocks: []
    },
    {
        id: 2,
        title: "Bouncing Light",
        instruction: "Use the magic mirror to reach the chest!",
        flashlight: { x: 15, y: 20, angle: 0 },
        target: { x: 80, y: 80, size: 70 },
        mirrors: [
            { id: 'm1', x: 50, y: 20, angle: 45 }
        ],
        blocks: []
    },
    {
        id: 3,
        title: "The Zig Zag",
        instruction: "Rotate two mirrors! Avoid the wall!",
        flashlight: { x: 15, y: 15, angle: 0 },
        target: { x: 20, y: 85, size: 70 },
        mirrors: [
            { id: 'm1', x: 80, y: 15, angle: 45 },
            { id: 'm2', x: 80, y: 85, angle: -45 }
        ],
        blocks: [
            { x: 40, y: 35, w: 20, h: 30 }
        ]
    }
];

const LightBeamAdventure = ({ onBack }) => {
    const [levelIdx, setLevelIdx] = useState(0);
    const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'win', 'complete'
    const [mirrors, setMirrors] = useState([]);
    const [flashlightAngle, setFlashlightAngle] = useState(0);
    const [beamPath, setBeamPath] = useState([]);
    const [isHit, setIsHit] = useState(false);
    const [stars, setStars] = useState(0);

    const currentLevel = LEVELS[levelIdx];

    // Load Level
    useEffect(() => {
        if (gameState === 'playing' || gameState === 'win') {
            setMirrors(currentLevel.mirrors);
            setFlashlightAngle(currentLevel.flashlight.angle);
            setIsHit(false);
            if (gameState !== 'win') {
                speak(currentLevel.instruction, 'en-US', 1.0);
            }
        }
    }, [levelIdx, gameState, currentLevel]);

    const calculateBeam = useCallback(() => {
        if (!currentLevel) return;

        let path = [{ x: currentLevel.flashlight.x, y: currentLevel.flashlight.y }];
        let currentPos = { x: currentLevel.flashlight.x, y: currentLevel.flashlight.y };
        let currentAngle = flashlightAngle;
        let active = true;
        let hitTarget = false;
        let bounces = 0;

        while (active && bounces < 6) {
            const rad = (currentAngle * Math.PI) / 180;
            const dx = Math.cos(rad);
            const dy = Math.sin(rad);

            let closestHit = null;
            let minDistance = 200; // Max distance in %
            let hitType = null;
            let hitId = null;

            // 1. Wall Intersections
            const wallDist = findWallIntersection(currentPos, dx, dy);
            if (wallDist < minDistance) {
                minDistance = wallDist;
                hitType = 'wall';
            }

            // 2. Target Interaction
            const targetDist = findCircleIntersection(currentPos, dx, dy, currentLevel.target, currentLevel.target.size / 5);
            if (targetDist !== null && targetDist < minDistance) {
                minDistance = targetDist;
                hitType = 'target';
            }

            // 3. Mirror Intersections
            mirrors.forEach(m => {
                const dist = findMirrorIntersection(currentPos, dx, dy, m);
                if (dist !== null && dist < minDistance) {
                    minDistance = dist;
                    hitType = 'mirror';
                    hitId = m.id;
                }
            });

            // 4. Block Intersections
            currentLevel.blocks.forEach(b => {
                const dist = findRectIntersection(currentPos, dx, dy, b);
                if (dist !== null && dist < minDistance) {
                    minDistance = dist;
                    hitType = 'block';
                }
            });

            // Move to hit point
            const nextX = currentPos.x + dx * minDistance;
            const nextY = currentPos.y + dy * minDistance;

            path.push({ x: nextX, y: nextY });
            currentPos = { x: nextX, y: nextY };

            if (hitType === 'target') {
                hitTarget = true;
                active = false;
            } else if (hitType === 'mirror') {
                const mirror = mirrors.find(m => m.id === hitId);
                // Math reflection
                currentAngle = (2 * mirror.angle - currentAngle);
                bounces++;
            } else {
                active = false;
            }
        }

        setBeamPath(path);

        if (hitTarget && !isHit && gameState === 'playing') {
            setIsHit(true);
            playSound('correct');
            setGameState('win');
            setStars(s => s + 1);
            speak("Brilliant! You mastered the light beam!", 'en-US', 1.1);
        }
    }, [mirrors, flashlightAngle, currentLevel, isHit, gameState]);

    useEffect(() => {
        if (gameState === 'playing' || gameState === 'win') {
            calculateBeam();
        }
    }, [calculateBeam, gameState]);

    const handleNextLevel = () => {
        if (levelIdx < LEVELS.length - 1) {
            setLevelIdx(l => l + 1);
            setGameState('playing');
        } else {
            setGameState('complete');
        }
    };

    const rotateMirror = (id) => {
        if (gameState !== 'playing') return;
        playSound('click');
        setMirrors(prev => prev.map(m =>
            m.id === id ? { ...m, angle: (m.angle + 15) % 360 } : m
        ));
    };

    const rotateFlashlight = () => {
        if (gameState !== 'playing') return;
        playSound('click');
        setFlashlightAngle(a => (a + 15) % 360);
    };

    // --- Math Utils ---
    function findWallIntersection(p, dx, dy) {
        let t = 200;
        if (dx > 0) t = Math.min(t, (100 - p.x) / dx);
        if (dx < 0) t = Math.min(t, -p.x / dx);
        if (dy > 0) t = Math.min(t, (100 - p.y) / dy);
        if (dy < 0) t = Math.min(t, -p.y / dy);
        return t;
    }

    function findCircleIntersection(p, dx, dy, center, radius) {
        const cx = center.x, cy = center.y;
        const ocX = p.x - cx, ocY = p.y - cy;
        const a = dx * dx + dy * dy;
        const b = 2 * (ocX * dx + ocY * dy);
        const c = ocX * ocX + ocY * ocY - radius * radius;
        const disc = b * b - 4 * a * c;
        if (disc < 0) return null;
        const t = (-b - Math.sqrt(disc)) / (2 * a);
        return t > 0.1 ? t : null;
    }

    function findMirrorIntersection(p, dx, dy, m) {
        const mirrorHeight = 12;
        const mRad = (m.angle * Math.PI) / 180;
        const nx = Math.cos(mRad + Math.PI / 2);
        const ny = Math.sin(mRad + Math.PI / 2);
        const denom = dx * nx + dy * ny;
        if (Math.abs(denom) < 0.0001) return null;
        const t = ((m.x - p.x) * nx + (m.y - p.y) * ny) / denom;
        if (t <= 0.1) return null;
        const ix = p.x + dx * t, iy = p.y + dy * t;
        const dist = Math.sqrt(Math.pow(ix - m.x, 2) + Math.pow(iy - m.y, 2));
        return dist < mirrorHeight / 2 ? t : null;
    }

    function findRectIntersection(p, dx, dy, r) {
        const t1 = (r.x - p.x) / dx, t2 = (r.x + r.w - p.x) / dx;
        const t3 = (r.y - p.y) / dy, t4 = (r.y + r.h - p.y) / dy;
        const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
        const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
        if (tmax < 0 || tmin > tmax) return null;
        return tmin > 0.1 ? tmin : null;
    }

    // --- Renders ---

    const renderIntro = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: 'radial-gradient(circle, #0F172A 0%, #020617 100%)', color: 'white', textAlign: 'center', padding: '20px' }}>
            <motion.div animate={{ scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 10px #FFEB3B)', 'drop-shadow(0 0 30px #FFEB3B)', 'drop-shadow(0 0 10px #FFEB3B)'] }} transition={{ repeat: Infinity, duration: 4 }}>
                <Lightbulb size={120} color="#FFEB3B" fill="#FFEB3B" />
            </motion.div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '10px' }}>Light <span style={{ color: '#FFEB3B' }}>Magic</span></h1>
            <p style={{ fontSize: '1.4rem', opacity: 0.8, marginBottom: '40px' }}>Solve puzzles with the power of light! 🔦</p>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { playSound('click'); setGameState('playing'); }}
                style={{ padding: '20px 60px', borderRadius: '40px', background: '#FFEB3B', color: '#000', fontSize: '1.8rem', fontWeight: 900, border: 'none', boxShadow: '0 8px 0 #FBC02D', cursor: 'pointer' }}>
                PLAY NOW! <Play fill="#000" size={24} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
            </motion.button>

            {/* Back Icon */}
            <motion.button onClick={onBack} style={{ position: 'absolute', top: '90px', left: '20px', padding: '15px', background: 'white', borderRadius: '15px', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft color="#0F172A" size={30} />
            </motion.button>
        </div>
    );

    const renderPlaying = () => (
        <div style={{ position: 'relative', width: '100%', height: '100dvh', background: '#020617', overflow: 'hidden' }}>
            {/* Background Dust */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
                {[...Array(30)].map((_, i) => <div key={i} style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', background: 'white' }} />)}
            </div>

            {/* Header */}
            <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <button onClick={() => setGameState('intro')} style={{ padding: '10px 20px', background: '#FFF', borderRadius: '15px', border: 'none', fontWeight: 900 }}>⬅ EXIT</button>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 25px', borderRadius: '20px', color: 'white', fontWeight: 900, border: '1px solid #FFEB3B' }}>Level {levelIdx + 1}</div>
                <div style={{ background: '#FFD700', padding: '10px 20px', borderRadius: '20px', fontWeight: 900 }}>⭐ {stars}</div>
            </div>

            {/* Instruction Banner */}
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <motion.div key={currentLevel.instruction} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 30px', borderRadius: '30px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{currentLevel.instruction}</h2>
                </motion.div>
            </div>

            {/* The Lab Area */}
            <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 200px)', maxWidth: '900px', margin: '0 auto' }}>

                {/* SVG for Beam */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }} viewBox="0 0 100 100">
                    <defs>
                        <filter id="beam-glow">
                            <feGaussianBlur stdDeviation="0.4" />
                            <feComposite in="SourceGraphic" operator="over" />
                        </filter>
                    </defs>
                    <motion.polyline
                        points={beamPath.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none" stroke="#FFEB3B" strokeWidth="0.8"
                        filter="url(#beam-glow)"
                    />
                    <motion.polyline
                        points={beamPath.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none" stroke="#FFF" strokeWidth="0.2"
                    />
                </svg>

                {/* Explorer 🤖 */}
                <motion.div onClick={rotateFlashlight} whileTap={{ scale: 0.9 }}
                    style={{ position: 'absolute', left: `${currentLevel.flashlight.x}%`, top: `${currentLevel.flashlight.y}%`, transform: `translate(-50%, -50%) rotate(${flashlightAngle}deg)`, cursor: 'pointer', zIndex: 20 }}>
                    <div style={{ fontSize: '4.5rem', filter: isHit ? 'drop-shadow(0 0 15px #FFEB3B)' : 'none' }}>🤖</div>
                    <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 900 }}>ROTATE</div>
                </motion.div>

                {/* Target Chest 💎 */}
                <motion.div animate={isHit ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                    style={{ position: 'absolute', left: `${currentLevel.target.x}%`, top: `${currentLevel.target.y}%`, transform: 'translate(-50%, -50%)', fontSize: '5rem', zIndex: 5 }}>
                    {isHit ? '💎' : '📦'}
                </motion.div>

                {/* Mirrors */}
                {mirrors.map(m => (
                    <motion.div key={m.id} onClick={() => rotateMirror(m.id)} whileTap={{ rotate: m.angle + 30 }}
                        style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, transform: `translate(-50%, -50%) rotate(${m.angle}deg)`, cursor: 'pointer', zIndex: 30, padding: '20px' /* bigger hit area */ }}>
                        <div style={{ width: '8px', height: '60px', background: 'linear-gradient(90deg, #64B5F6, #FFF)', border: '2px solid white', borderRadius: '4px', boxShadow: '0 0 10px rgba(100,181,246,0.6)' }} />
                    </motion.div>
                ))}

                {/* Walls 🧱 */}
                {currentLevel.blocks.map((b, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, background: '#2C1810', border: '3px solid #1A0F0A', borderRadius: '8px', boxShadow: '0 4px 10px #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🧱
                    </div>
                ))}
            </div>

            {/* Prompt Footer */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(255,255,255,0.05)', padding: '20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                    <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 800 }}>
                        <Wand2 color="#FFEB3B" size={24} />
                        TAP MIRRORS OR ROBOT TO ROTATE!
                    </div>
                    <button onClick={() => setLevelIdx(levelIdx)} style={{ padding: '12px 25px', background: '#F44336', color: 'white', borderRadius: '20px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>RESET</button>
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {gameState === 'win' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Trophy size={120} color="#FFD700" />
                        </motion.div>
                        <h1 style={{ color: '#FFEB3B', fontSize: '3rem', fontWeight: 900, margin: '20px 0' }}>MISSION CLEAR!</h1>
                        <p style={{ color: 'white', fontSize: '1.4rem' }}>Magic light secured the treasure!</p>
                        <button onClick={handleNextLevel} style={{ marginTop: '30px', padding: '20px 60px', borderRadius: '35px', background: '#FFEB3B', color: '#000', fontSize: '1.8rem', fontWeight: 900, border: 'none', boxShadow: '0 8px 0 #FBC02D', cursor: 'pointer' }}>
                            NEXT LEVEL ➡️
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100dvh', fontFamily: '"Comic Sans MS", cursive' }}>
            {gameState === 'intro' && renderIntro()}
            {(gameState === 'playing' || gameState === 'win') && renderPlaying()}
            {gameState === 'complete' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: '#020617', textAlign: 'center' }}>
                    <div style={{ fontSize: '8rem' }}>💎✨</div>
                    <h1 style={{ fontSize: '3.5rem', color: '#FFEB3B', fontWeight: 900 }}>LIGHT MASTER!</h1>
                    <p style={{ fontSize: '1.5rem', color: 'white' }}>You solved all optical puzzles!</p>
                    <button onClick={onBack} style={{ marginTop: '40px', padding: '20px 60px', borderRadius: '35px', background: '#FFEB3B', color: '#000', fontSize: '1.8rem', fontWeight: 900, cursor: 'pointer' }}>BACK TO HUB</button>
                </div>
            )}
        </div>
    );
};

export default LightBeamAdventure;
