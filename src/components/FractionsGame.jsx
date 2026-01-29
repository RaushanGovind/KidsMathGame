import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function FractionsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [question, setQuestion] = useState({ num: 1, den: 2 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [selectedSlices, setSelectedSlices] = useState([]); // For learn mode

    useEffect(() => {
        generateQuestion();
    }, []);

    const generateQuestion = () => {
        const den = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
        const num = Math.floor(Math.random() * (den - 1)) + 1;

        const correct = `${num}/${den}`;

        let newOptions = [correct];
        while (newOptions.length < 4) {
            const d = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
            const n = Math.floor(Math.random() * (d - 1)) + 1;
            const txt = `${n}/${d}`;
            if (!newOptions.includes(txt)) newOptions.push(txt);
        }

        setQuestion({ num, den, answer: correct });
        setOptions(newOptions.sort(() => Math.random() - 0.5));
        setFeedback(null);
        setSelectedSlices([]);
    };

    const checkAnswer = (selected) => {
        if (selected === question.answer) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
    };

    const handleSliceClick = (index) => {
        if (mode === 'learn') {
            if (selectedSlices.includes(index)) {
                setSelectedSlices(selectedSlices.filter(i => i !== index));
                playSound('click');
            } else {
                setSelectedSlices([...selectedSlices, index]);
                playSound('click');
            }
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        generateQuestion();
        playSound('click');
    };

    const checkLearnAnswer = () => {
        const numSelected = selectedSlices.length;
        if (numSelected === question.num) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
    };

    // SVG Helper
    const polarToCartesian = (cx, cy, r, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: cx + (r * Math.cos(angleInRadians)),
            y: cy + (r * Math.sin(angleInRadians))
        };
    };

    const describeArc = (cx, cy, r, startAngle, endAngle) => {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", cx, cy,
            "L", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px', minHeight: '100vh', background: '#F8FAFC' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <button onClick={onBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 0 #bdc3c7',
                    border: '2px solid #ecf0f1',
                    cursor: 'pointer'
                }}>
                    ⬅ MENU
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => handleModeChange('learn')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'learn' ? '#4ECDC4' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #3BB5AC' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        LEARN
                    </button>
                    <button
                        onClick={() => handleModeChange('test')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'test' ? '#FF6B6B' : 'white',
                            color: mode === 'test' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'test' ? '0 4px 0 #E85555' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        TEST
                    </button>
                </div>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderRadius: '40px',
                    width: '100%',
                    maxWidth: '700px'
                }}
            >
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn' ? '🍰 Learn Fractions' : '🍰 Fraction Quiz'}
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn' ? `Click to select ${question.num} out of ${question.den} slices!` : 'What fraction is shaded?'}
                    </p>
                </div>

                {/* Fraction Visual */}
                <div style={{ width: '320px', height: '320px', marginBottom: '40px', position: 'relative' }}>
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                        {Array.from({ length: question.den }).map((_, i) => {
                            const isShaded = mode === 'learn'
                                ? selectedSlices.includes(i)
                                : i < question.num;

                            const fillColor = isShaded ? '#4ECDC4' : '#f1f2f6';

                            return (
                                <path
                                    key={i}
                                    d={describeArc(100, 100, 95, (i * 360) / question.den, ((i + 1) * 360) / question.den)}
                                    fill={fillColor}
                                    stroke="#2C3E50"
                                    strokeWidth="3"
                                    style={{
                                        cursor: mode === 'learn' ? 'pointer' : 'default',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => handleSliceClick(i)}
                                    onMouseEnter={(e) => {
                                        if (mode === 'learn') {
                                            e.target.style.opacity = '0.7';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (mode === 'learn') {
                                            e.target.style.opacity = '1';
                                        }
                                    }}
                                />
                            );
                        })}
                    </svg>

                    {/* Display fraction in center for learn mode */}
                    {mode === 'learn' && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '3rem',
                            fontWeight: '1000',
                            color: '#2C3E50',
                            background: 'white',
                            padding: '10px 20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            pointerEvents: 'none'
                        }}>
                            {selectedSlices.length}/{question.den}
                        </div>
                    )}
                </div>

                {mode === 'learn' ? (
                    // Learn Mode: Interactive Selection + Check Button
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            background: '#F8FAFC',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '3px solid #E2E8F0',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#64748B', margin: 0 }}>
                                Target: <span style={{ color: '#4ECDC4', fontSize: '2rem' }}>{question.answer}</span>
                            </p>
                            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#94A3B8', margin: '5px 0 0 0' }}>
                                You selected: <span style={{ color: selectedSlices.length === question.num ? '#27AE60' : '#E74C3C' }}>
                                    {selectedSlices.length}/{question.den}
                                </span>
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={checkLearnAnswer}
                            style={{
                                padding: '20px 60px',
                                background: '#4ECDC4',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 8px 0 #3BB5AC',
                                fontSize: '2rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            ✅ CHECK
                        </motion.button>
                    </div>
                ) : (
                    // Test Mode: Multiple Choice Options
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', width: '100%' }}>
                        {options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => checkAnswer(opt)}
                                style={{
                                    padding: '25px',
                                    fontSize: '3rem',
                                    background: 'white',
                                    color: '#2C3E50',
                                    fontWeight: '900',
                                    border: '3px solid #eee',
                                    borderRadius: '25px',
                                    boxShadow: '0 8px 0 #ddd, 0 10px 20px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                {opt}
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Feedback Overlay & Next Button */}
                <AnimatePresence mode="wait">
                    {feedback === 'correct' ? (
                        <motion.button
                            key="next"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.1 }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateQuestion}
                            style={{
                                position: 'absolute',
                                top: '40%',
                                background: '#27AE60',
                                color: 'white',
                                padding: '25px 50px',
                                borderRadius: '40px',
                                fontSize: '2.5rem',
                                fontWeight: '900',
                                border: 'none',
                                boxShadow: '0 10px 0 #219150',
                                cursor: 'pointer',
                                zIndex: 101
                            }}
                        >
                            NEXT QUESTION 🌟
                        </motion.button>
                    ) : feedback === 'incorrect' && (
                        <motion.div
                            key="wrong"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            exit={{ scale: 0 }}
                            style={{
                                position: 'absolute',
                                top: '40%',
                                background: '#E74C3C',
                                color: 'white',
                                padding: '20px 40px',
                                borderRadius: '30px',
                                fontSize: '4rem',
                                zIndex: 100,
                                fontWeight: '900'
                            }}
                        >
                            ❌
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
}

export default FractionsGame;
