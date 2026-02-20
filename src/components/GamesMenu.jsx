import React from 'react';
import { motion } from 'framer-motion';

const gameItems = [
    { id: 'bubble-multi', title: 'Bubble Pop!', icon: '🫧', color: '#00C5DE', shadow: '#0099AD' },
    { id: 'direction-adventure', title: 'Explorer', icon: '🗺️', color: '#7CB342', shadow: '#558B2F' },
    { id: 'traffic-hero', title: 'Traffic Hero', icon: '🚦', color: '#F39C12', shadow: '#D68910' },
    { id: 'night-safety', title: 'Night Safety', icon: '🌙', color: '#1565C0', shadow: '#0D47A1' },
    { id: 'force-motion', title: 'Force Play', icon: '🏗️', color: '#2E7D32', shadow: '#1B5E20' },
    { id: 'gravity-drop', title: 'Gravity Lab', icon: '🧪', color: '#7B1FA2', shadow: '#4A148C' },
    { id: 'light-beam', title: 'Light Magic', icon: '🔦', color: '#F9A825', shadow: '#F57F17' },
    { id: 'wordscramble', title: 'Word Jumble', icon: '🔠', color: '#E64A19', shadow: '#BF360C' },
    { id: 'spelling', title: 'Spelling Bee', icon: '🐝', color: '#D4AC0D', shadow: '#B7950B' },
    { id: 'logic-puzzles', title: 'Logic Fun', icon: '🧩', color: '#8E44AD', shadow: '#71368A' },
];

function GamesMenu({ onSelectMode, onBack }) {
    return (
        <div style={{ width: '100%', padding: '16px' }}>

            {/* Compact Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    style={{
                        padding: '8px 14px', background: '#FF2E63', color: 'white',
                        fontWeight: 900, fontSize: '0.8rem', borderRadius: '12px',
                        boxShadow: '0 3px 0 #BD1E4B', border: 'none',
                        cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                >
                    ⬅ Home
                </motion.button>
                <div>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '2px', textTransform: 'uppercase' }}>Fun Zone</p>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#1E293B', fontWeight: 900, lineHeight: 1 }}>🎮 Play Zone</h1>
                </div>
            </div>

            {/* Compact 3-column icon grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {gameItems.map((item, index) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04 }}
                        whileHover={{ scale: 1.06, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => onSelectMode(item.id)}
                        style={{
                            background: `linear-gradient(135deg, ${item.color}, ${item.shadow})`,
                            border: 'none', borderRadius: '16px',
                            padding: '14px 6px 10px',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '6px',
                            cursor: 'pointer',
                            boxShadow: `0 5px 12px -2px ${item.color}66`,
                        }}
                    >
                        <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.icon}</span>
                        <span style={{
                            fontSize: '0.65rem', fontWeight: 900,
                            color: 'rgba(255,255,255,0.95)',
                            letterSpacing: '0.5px', textTransform: 'uppercase',
                            textAlign: 'center', lineHeight: 1.2, fontFamily: 'inherit'
                        }}>{item.title}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

export default GamesMenu;
