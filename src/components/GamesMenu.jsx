import React from 'react';
import { motion } from 'framer-motion';

const gameItems = [
    { id: 'bubble-multi', title: 'Bubble Pop!', icon: '🫧', color: '#00D2FF', shadow: '#00ADDB', desc: 'Pop bubbles to multiply!' },
    { id: 'direction-adventure', title: 'Explorer!', icon: '🗺️', color: '#B2FF59', shadow: '#7CB342', desc: 'Find the secret path!' },
    { id: 'traffic-hero', title: 'Traffic Hero!', icon: '🚦', color: '#FFEB3B', shadow: '#FBC02D', desc: 'Safety first, little hero!' },
    { id: 'night-safety', title: 'Night Safety', icon: '🌙', color: '#0D47A1', shadow: '#01579B', desc: 'Safe walking at night!' },
    { id: 'force-motion', title: 'Force Playground', icon: '🏗️', color: '#4CAF50', shadow: '#2E7D32', desc: 'Push, slide, and learn!' },
    { id: 'gravity-drop', title: 'Gravity Lab', icon: '🧪', color: '#9C27B0', shadow: '#7B1FA2', desc: 'Drop things and see gravity!' },
    { id: 'light-beam', title: 'Light Magic', icon: '🔦', color: '#FFEB3B', shadow: '#FBC02D', desc: 'Bounce light with mirrors!' },
    { id: 'wordscramble', title: 'Word Jumble', icon: '🔠', color: '#FF7043', shadow: '#E64A19', desc: 'Unscramble the letters!' },
    { id: 'spelling', title: 'Spelling Bee', icon: '🐝', color: '#F1C40F', shadow: '#D4AC0D', desc: 'Bee a spelling champ!' },
    { id: 'logic-puzzles', title: 'Logic Fun', icon: '🧩', color: '#9B59B6', shadow: '#8E44AD', desc: 'Solve the brain teaser!' },
];

function GamesMenu({ onSelectMode, onBack }) {
    return (
        <div style={{
            width: '100%', minHeight: '100vh',
            background: 'linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)',
            padding: '40px 20px',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Playful Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '50px' }}>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onBack}
                        style={{
                            padding: '15px 30px',
                            background: '#FF2E63',
                            color: 'white',
                            fontWeight: '900',
                            fontSize: '1.2rem',
                            borderRadius: '25px',
                            boxShadow: '0 8px 0 #BD1E4B',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                        ⬅ HOME
                    </motion.button>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            background: 'white',
                            padding: '20px 40px',
                            borderRadius: '40px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.05)',
                            flex: 1,
                            textAlign: 'center',
                            border: '6px solid #08D9D6'
                        }}>
                        <h1 style={{ color: '#023E8A', fontSize: 'min(3rem, 10vw)', fontWeight: 900, margin: 0, letterSpacing: '2px' }}>
                            KIDS PLAY ZONE! 🎮
                        </h1>
                    </motion.div>
                </div>

                {/* Highly Attractive Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {gameItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectMode(item.id)}
                            style={{
                                cursor: 'pointer',
                                padding: '40px 30px',
                                background: 'white',
                                borderRadius: '50px',
                                boxShadow: '0 20px 0 rgba(0,0,0,0.05)',
                                border: `8px solid ${item.color}`,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: 0, right: 0, width: '100px', height: '100px',
                                background: item.color, opacity: 0.1, borderRadius: '0 0 0 100%',
                                pointerEvents: 'none'
                            }} />

                            <motion.span
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: index * 0.5 }}
                                style={{
                                    fontSize: '6rem', marginBottom: '20px',
                                    filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))'
                                }}>
                                {item.icon}
                            </motion.span>

                            <h2 style={{
                                fontSize: '2.2rem',
                                fontWeight: 900,
                                color: '#1E293B',
                                margin: '0 0 10px 0'
                            }}>
                                {item.title}
                            </h2>

                            <p style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: '#64748B',
                                margin: 0,
                                opacity: 0.8
                            }}>
                                {item.desc}
                            </p>

                            <div style={{
                                marginTop: '25px',
                                width: '60px',
                                height: '12px',
                                background: item.color,
                                borderRadius: '10px'
                            }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GamesMenu;
