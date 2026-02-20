import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { speak } from '../utils/speech';
import { playSound } from '../utils/sounds';

const LEVELS = [
    {
        id: 1,
        title: "Straight Path",
        instruction: "Turn on the lantern to find the chest!",
        flashlight: { x: 10, y: 50, angle: 0 },
        target: { x: 80, y: 50, size: 60 },
        mirrors: [],
        blocks: []
    },
    {
        id: 2,
        title: "Bouncing Light",
        instruction: "Rotate the magic mirror to bounce the light!",
        flashlight: { x: 10, y: 20, angle: 0 },
        target: { x: 80, y: 80, size: 60 },
        mirrors: [
            { id: 'm1', x: 50, y: 20, angle: 45 }
        ],
        blocks: []
    },
    {
        id: 3,
        title: "Zig Zag",
        instruction: "Use two mirrors to reach the hidden treasure!",
        flashlight: { x: 10, y: 10, angle: 0 },
        target: { x: 15, y: 85, size: 60 },
        mirrors: [
            { id: 'm1', x: 80, y: 10, angle: 45 },
            { id: 'm2', x: 80, y: 85, angle: -45 }
        ],
        blocks: [
            { x: 40, y: 40, w: 20, h: 20 }
        ]
    }
];

const LightBeamAdventure = ({ onBack }) => {
    const [levelIdx, setLevelIdx] = useState(0);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'win'
    const [mirrors, setMirrors] = useState(LEVELS[0].mirrors);
    const [beamPath, setBeamPath] = useState([]);
    const [isHit, setIsHit] = useState(false);
    const [flashlightAngle, setFlashlightAngle] = useState(LEVELS[0].flashlight.angle);

    const currentLevel = LEVELS[levelIdx];

    // Load Level
    useEffect(() => {
        setMirrors(currentLevel.mirrors);
        setFlashlightAngle(currentLevel.flashlight.angle);
        setGameState('playing');
        setIsHit(false);
        speak(currentLevel.instruction);
    }, [levelIdx]);

    // Physics Engine: Calculate Beam Path
    const calculateBeam = useCallback(() => {
        let path = [{ x: currentLevel.flashlight.x, y: currentLevel.flashlight.y }];
        let currentPos = { x: currentLevel.flashlight.x, y: currentLevel.flashlight.y };
        let currentAngle = flashlightAngle;
        let active = true;
        let hitTarget = false;
        let bounces = 0;

        while (active && bounces < 5) {
            const rad = (currentAngle * Math.PI) / 180;
            const dx = Math.cos(rad);
            const dy = Math.sin(rad);

            let closestHit = null;
            let minDistance = 1000;
            let hitType = null;
            let hitId = null;

            // Check Wall Intersections
            const wallDist = findWallIntersection(currentPos, dx, dy);
            if (wallDist < minDistance) {
                minDistance = wallDist;
                hitType = 'wall';
            }

            // Check Target Interaction
            const targetDist = findCircleIntersection(currentPos, dx, dy, currentLevel.target, currentLevel.target.size / 2);
            if (targetDist !== null && targetDist < minDistance) {
                minDistance = targetDist;
                hitType = 'target';
            }

            // Check Mirror Intersections
            mirrors.forEach(m => {
                const dist = findMirrorIntersection(currentPos, dx, dy, m);
                if (dist !== null && dist < minDistance) {
                    minDistance = dist;
                    hitType = 'mirror';
                    hitId = m.id;
                }
            });

            // Check Block Intersections
            currentLevel.blocks.forEach(b => {
                const dist = findRectIntersection(currentPos, dx, dy, b);
                if (dist !== null && dist < minDistance) {
                    minDistance = dist;
                    hitType = 'block';
                }
            });

            // Update Position with small offset to avoid re-hitting same surface
            const nextX = currentPos.x + dx * (minDistance + 0.01);
            const nextY = currentPos.y + dy * (minDistance + 0.01);
            currentPos = { x: nextX, y: nextY };
            path.push({ x: nextX, y: nextY });

            if (hitType === 'target') {
                hitTarget = true;
                active = false;
            } else if (hitType === 'mirror') {
                const mirror = mirrors.find(m => m.id === hitId);
                // Simple reflection: 2 * mirrorAngle - currentAngle (this is a simplified 2D approximation)
                // More accurate: currentAngle should reflect based on mirror normal
                // For this game, let's assume vertical/horizontal mirrors or diagonal
                currentAngle = 2 * mirror.angle - currentAngle;
                bounces++;
            } else {
                active = false;
            }
        }

        setBeamPath(path);
        if (hitTarget && !isHit) {
            setIsHit(true);
            handleWin();
        } else if (!hitTarget) {
            setIsHit(false);
        }
    }, [mirrors, flashlightAngle, currentLevel]);

    useEffect(() => {
        calculateBeam();
    }, [calculateBeam]);

    const handleWin = () => {
        playSound('correct');
        setGameState('win');
        speak("Yay! You found the treasure! Light travels in straight lines and bounces off mirrors!");
    };

    const nextLevel = () => {
        if (levelIdx < LEVELS.length - 1) {
            setLevelIdx(l => l + 1);
        } else {
            onBack();
        }
    };

    const rotateMirror = (id) => {
        playSound('click');
        setMirrors(prev => prev.map(m =>
            m.id === id ? { ...m, angle: (m.angle + 15) % 360 } : m
        ));
    };

    // --- MATH UTILS ---
    function findWallIntersection(p, dx, dy) {
        let dist = 1000;
        if (dx > 0) dist = Math.min(dist, (100 - p.x) / dx);
        if (dx < 0) dist = Math.min(dist, -p.x / dx);
        if (dy > 0) dist = Math.min(dist, (100 - p.y) / dy);
        if (dy < 0) dist = Math.min(dist, -p.y / dy);
        return dist;
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
        return t > 0 ? t : null;
    }

    function findMirrorIntersection(p, dx, dy, m) {
        // Treat mirror as a small line segment
        const length = 10;
        const mAngleRad = (m.angle * Math.PI) / 180;
        // Normal vector of mirror
        const nx = Math.cos(mAngleRad + Math.PI / 2);
        const ny = Math.sin(mAngleRad + Math.PI / 2);

        // Plane intersection
        const denom = dx * nx + dy * ny;
        if (Math.abs(denom) < 0.0001) return null;

        const t = ((m.x - p.x) * nx + (m.y - p.y) * ny) / denom;
        if (t <= 0) return null;

        // Check if intersection is within mirror length
        const ix = p.x + dx * t;
        const iy = p.y + dy * t;
        const distToCenter = Math.sqrt(Math.pow(ix - m.x, 2) + Math.pow(iy - m.y, 2));

        return distToCenter < length / 2 ? t : null;
    }

    function findRectIntersection(p, dx, dy, r) {
        const t1 = (r.x - p.x) / dx;
        const t2 = (r.x + r.w - p.x) / dx;
        const t3 = (r.y - p.y) / dy;
        const t4 = (r.y + r.h - p.y) / dy;

        const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
        const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

        if (tmax < 0 || tmin > tmax) return null;
        return tmin > 0 ? tmin : null;
    }

    return (
        <div style={{
            width: '100%', height: '100vh',
            background: 'radial-gradient(circle at center, #1A1A2E 0%, #0F0F1A 100%)',
            fontFamily: '"Comic Sans MS", cursive', overflow: 'hidden', position: 'relative'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <button onClick={onBack} style={{ padding: '10px 25px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '15px', color: 'white', fontWeight: 900, cursor: 'pointer' }}>BACK</button>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 30px', borderRadius: '30px', color: 'white', fontWeight: 900, border: '2px solid #64B5F6' }}> Level {levelIdx + 1}: {currentLevel.title} </div>
                <div style={{ width: '80px' }} />
            </div>

            {/* Game Canvas */}
            <div style={{ position: 'relative', width: '100%', height: '70%', margin: '0 auto', maxWidth: '1000px' }}>

                {/* Dust Particles Overlay */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3 }}>
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ x: [0, 50, -20, 0], y: [0, 20, -10, 0], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 5 + Math.random() * 5, delay: i }}
                            style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}
                        />
                    ))}
                </div>

                {/* SVG for Beam */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <motion.polyline
                        points={beamPath.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="#FFEB3B"
                        strokeWidth="1"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                    {isHit && (
                        <motion.circle
                            cx={currentLevel.target.x} cy={currentLevel.target.y} r="2"
                            fill="#FFEB3B" animate={{ r: [2, 4, 2], opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                    )}
                </svg>

                {/* Objects */}
                {/* Robot/Flashlight */}
                <motion.div
                    style={{ position: 'absolute', left: `${currentLevel.flashlight.x}%`, top: `${currentLevel.flashlight.y}%`, transform: `translate(-50%, -50%) rotate(${flashlightAngle}deg)` }}
                >
                    <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px #FFEB3B)' }}>🤖🔦</div>
                </motion.div>

                {/* Target Chest */}
                <motion.div
                    animate={isHit ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    style={{ position: 'absolute', left: `${currentLevel.target.x}%`, top: `${currentLevel.target.y}%`, transform: 'translate(-50%, -50%)', fontSize: '5rem' }}
                >
                    {isHit ? '💎' : '📦'}
                </motion.div>

                {/* Mirrors */}
                {mirrors.map(m => (
                    <motion.div
                        key={m.id}
                        onClick={() => rotateMirror(m.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            position: 'absolute', left: `${m.x}%`, top: `${m.y}%`,
                            transform: `translate(-50%, -50%) rotate(${m.angle}deg)`,
                            width: '10px', height: '60px', borderRadius: '5px',
                            background: 'linear-gradient(90deg, #90CAF9, #E3F2FD)',
                            border: '2px solid white', cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(100, 181, 246, 0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Sparkles size={20} color="white" style={{ opacity: 0.5 }} />
                    </motion.div>
                ))}

                {/* Obstacles */}
                {currentLevel.blocks.map((b, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute', left: `${b.x}%`, top: `${b.y}%`,
                            width: `${b.w}%`, height: `${b.h}%`,
                            background: '#5D4037', border: '4px solid #3E2723',
                            borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)'
                        }}
                    >
                        🧱
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ position: 'absolute', bottom: '5%', width: '100%', textAlign: 'center' }}>
                <AnimatePresence>
                    {gameState === 'win' ? (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <h2 style={{ color: '#FFEB3B', fontSize: '2rem', marginBottom: '20px' }}>GREAT JOB! ⭐️</h2>
                            <button
                                onClick={nextLevel}
                                style={{ padding: '20px 60px', background: '#4CAF50', color: 'white', borderRadius: '40px', border: 'none', fontSize: '1.8rem', fontWeight: 900, boxShadow: '0 10px 0 #2E7D32', cursor: 'pointer' }}
                            >
                                NEXT LEVEL 🚀
                            </button>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px 30px', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Wand2 color="#64B5F6" />
                                <span>Tap mirrors to rotate them!</span>
                            </div>
                            <button onClick={() => setLevelIdx(levelIdx)} style={{ padding: '15px 30px', background: '#FF5252', color: 'white', borderRadius: '25px', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 0 #D32F2F', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RotateCcw size={20} /> RESET
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LightBeamAdventure;
