import React from 'react';
import { motion } from 'framer-motion';

const menuItems = [
    { id: 'addition', title: 'Addition', icon: '➕', color: '#3498DB', shadow: '#2980B9' },
    { id: 'subtraction', title: 'Subtract', icon: '➖', color: '#E74C3C', shadow: '#C0392B' },
    { id: 'multiplication', title: 'Multiply', icon: '✖️', color: '#27AE60', shadow: '#1E8449' },
    { id: 'division', title: 'Division', icon: '➗', color: '#F39C12', shadow: '#D68910' },
    { id: 'time', title: 'Time', icon: '⏰', color: '#9B59B6', shadow: '#7D3C98' },
    { id: 'fractions', title: 'Fractions', icon: '🍰', color: '#E67E22', shadow: '#CA6F1E' },
    { id: 'tables', title: 'Tables', icon: '🔢', color: '#6A5ACD', shadow: '#483D8B' },
    { id: 'mentalmath', title: 'Mental', icon: '⚡', color: '#D4AC0D', shadow: '#B7950B' },
    { id: 'lcm', title: 'LCM & HCF', icon: '🧮', color: '#8E44AD', shadow: '#71368A' },
    { id: 'unitary', title: 'Unitary', icon: '💰', color: '#16A085', shadow: '#138D75' },
    { id: 'timearithmetic', title: 'Time Math', icon: '⏱️', color: '#9B59B6', shadow: '#7D3C98' },
    { id: 'decimals', title: 'Decimals', icon: '🔣', color: '#1ABC9C', shadow: '#16A085' },
    { id: 'leaderboard', title: 'Leaderboard', icon: '🏆', color: '#F1C40F', shadow: '#D4AC0D' },
    { id: 'levelmap', title: 'Adv. Map', icon: '🗺️', color: '#E67E22', shadow: '#D35400' },
];

function Menu({ onSelectMode, onBack }) {
    return (
        <div style={{ width: '100%', padding: '16px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    style={{
                        padding: '8px 14px',
                        background: 'white',
                        color: '#2C3E50',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        borderRadius: '12px',
                        boxShadow: '0 3px 0 #bdc3c7',
                        border: '2px solid #f1f2f6',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}>
                    ⬅ Home
                </motion.button>
                <h1 style={{
                    color: '#2C3E50', fontSize: '1.3rem', fontWeight: 900,
                    margin: 0, textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                    🔢 Math Modes
                </h1>
            </div>

            {/* Compact 3-column icon grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
            }}>
                {menuItems.map((item, i) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.06, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => onSelectMode(item.id)}
                        style={{
                            background: `linear-gradient(135deg, ${item.color}, ${item.shadow})`,
                            border: 'none',
                            borderRadius: '16px',
                            padding: '14px 6px 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            boxShadow: `0 5px 12px -2px ${item.color}66`,
                        }}
                    >
                        <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.icon}</span>
                        <span style={{
                            fontSize: '0.68rem', fontWeight: 900,
                            color: 'rgba(255,255,255,0.95)',
                            letterSpacing: '0.5px', textTransform: 'uppercase',
                            textAlign: 'center', lineHeight: 1.2,
                            fontFamily: 'inherit'
                        }}>
                            {item.title}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

export default Menu;
