import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function TimeGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [question, setQuestion] = useState({ h: 10, m: 10 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [userAnswer, setUserAnswer] = useState({ hours: '', minutes: '' });

    useEffect(() => {
        generateQuestion();
    }, []);

    const generateQuestion = () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const m = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];

        // Convert to text for options
        const correctText = formatTime(h, m);

        // Generate distractors for learn mode
        let newOptions = [correctText];
        while (newOptions.length < 4) {
            const rh = Math.floor(Math.random() * 12) + 1;
            const rm = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];
            const txt = formatTime(rh, rm);
            if (!newOptions.includes(txt)) newOptions.push(txt);
        }

        setQuestion({ h, m, answer: correctText });
        setOptions(newOptions.sort(() => Math.random() - 0.5));
        setFeedback(null);
        setUserAnswer({ hours: '', minutes: '' });
    };

    const formatTime = (h, m) => {
        return `${h}:${m < 10 ? '0' + m : m}`;
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

    const checkTestAnswer = () => {
        const userH = parseInt(userAnswer.hours);
        const userM = parseInt(userAnswer.minutes);

        if (isNaN(userH) || isNaN(userM)) {
            playSound('wrong');
            setFeedback('incorrect');
            return;
        }

        const userTime = formatTime(userH, userM);
        if (userTime === question.answer) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        generateQuestion();
        playSound('click');
    };

    const handleInputChange = (field, value) => {
        const digit = value.toString().replace(/\D/g, '');
        if (field === 'hours') {
            const h = parseInt(digit);
            if (digit === '' || (h >= 1 && h <= 12)) {
                setUserAnswer(prev => ({ ...prev, hours: digit }));
            }
        } else {
            const m = parseInt(digit);
            if (digit === '' || (m >= 0 && m <= 59)) {
                setUserAnswer(prev => ({ ...prev, minutes: digit }));
            }
        }
        if (feedback) setFeedback(null);
    };

    // Clock Rendering Helpers
    const getHandAngle = (value, total) => {
        return (value / total) * 360;
    };

    const hourAngle = getHandAngle(question.h % 12 + question.m / 60, 12);
    const minAngle = getHandAngle(question.m, 60);

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
                            background: mode === 'learn' ? '#9B59B6' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #8E44AD' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        LEARN
                    </button>
                    <button
                        onClick={() => handleModeChange('test')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'test' ? '#E67E22' : 'white',
                            color: mode === 'test' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'test' ? '0 4px 0 #D35400' : '0 4px 0 #CBD5E1',
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
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn' ? '⏰ Reading Time' : '⏰ Time Test'}
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn' ? 'Select the correct time!' : 'Type the time shown on the clock!'}
                    </p>
                </div>

                {/* Clock Face */}
                <div style={{
                    position: 'relative',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'white',
                    border: '12px solid #2C3E50',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    marginBottom: '40px'
                }}>
                    {/* Center Dot */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '20px', height: '20px', background: '#2C3E50', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}></div>

                    {/* Numbers */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            width: '40px', height: '40px',
                            textAlign: 'center', fontWeight: '900', fontSize: '1.8rem', color: '#2C3E50',
                            transform: `translate(-50%, -50%) rotate(${(i + 1) * 30}deg) translate(0, -120px) rotate(-${(i + 1) * 30}deg)`
                        }}>
                            {i + 1}
                        </div>
                    ))}

                    {/* Hour Hand */}
                    <motion.div
                        animate={{ rotate: hourAngle }}
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '12px', height: '80px', background: '#2C3E50', borderRadius: '6px',
                            transformOrigin: 'bottom center', x: '-50%', y: '-100%'
                        }}
                    />

                    {/* Minute Hand */}
                    <motion.div
                        animate={{ rotate: minAngle }}
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '8px', height: '115px', background: '#E74C3C', borderRadius: '4px',
                            transformOrigin: 'bottom center', x: '-50%', y: '-100%'
                        }}
                    />
                </div>

                {mode === 'learn' ? (
                    // Learn Mode: Multiple Choice Options
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', width: '100%' }}>
                        {options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => checkAnswer(opt)}
                                style={{
                                    padding: '20px',
                                    fontSize: '2.5rem',
                                    background: 'white',
                                    color: '#2C3E50',
                                    fontWeight: '900',
                                    borderRadius: '25px',
                                    border: '3px solid #eee',
                                    boxShadow: '0 8px 0 #ddd, 0 10px 20px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                {opt}
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    // Test Mode: Input Fields
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <input
                                type="text"
                                value={userAnswer.hours}
                                onChange={(e) => handleInputChange('hours', e.target.value)}
                                placeholder="HH"
                                maxLength="2"
                                style={{
                                    width: '100px', padding: '15px', fontSize: '3rem',
                                    fontWeight: '1000', textAlign: 'center', borderRadius: '20px',
                                    border: '4px solid #C8A2C8',
                                    background: 'white',
                                    outline: 'none', color: '#2C3E50'
                                }}
                            />
                            <span style={{ fontSize: '3rem', fontWeight: '1000', color: '#2C3E50' }}>:</span>
                            <input
                                type="text"
                                value={userAnswer.minutes}
                                onChange={(e) => handleInputChange('minutes', e.target.value)}
                                placeholder="MM"
                                maxLength="2"
                                style={{
                                    width: '100px', padding: '15px', fontSize: '3rem',
                                    fontWeight: '1000', textAlign: 'center', borderRadius: '20px',
                                    border: '4px solid #C8A2C8',
                                    background: 'white',
                                    outline: 'none', color: '#2C3E50'
                                }}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={checkTestAnswer}
                            style={{
                                padding: '20px 60px',
                                background: '#E67E22',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 8px 0 #D35400',
                                fontSize: '2rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            ✅ CHECK
                        </motion.button>
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

export default TimeGame;
