import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function TimeGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [question, setQuestion] = useState({ h: 10, m: 10, s: 0 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [userAnswer, setUserAnswer] = useState({ hours: '', minutes: '' });

    useEffect(() => {
        generateQuestion();
    }, []);

    const generateQuestion = () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const m = Math.floor(Math.random() * 12) * 5; // Clean 5-min intervals
        const s = Math.floor(Math.random() * 12) * 5; // Seconds hand still exists

        const correctText = formatTime(h, m);

        // Generate distractors
        let newOptions = [correctText];
        while (newOptions.length < 4) {
            const rh = Math.floor(Math.random() * 12) + 1;
            const rm = Math.floor(Math.random() * 12) * 5;
            const txt = formatTime(rh, rm);
            if (!newOptions.includes(txt)) newOptions.push(txt);
        }

        setQuestion({ h, m, s, answer: correctText });
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
        const digit = value.toString().replace(/\D/g, '').slice(0, 2);
        const num = parseInt(digit);

        if (field === 'hours') {
            if (digit === '' || (num >= 1 && num <= 12)) {
                setUserAnswer(prev => ({ ...prev, hours: digit }));
            }
        } else if (field === 'minutes') {
            if (digit === '' || (num >= 0 && num <= 59)) {
                setUserAnswer(prev => ({ ...prev, minutes: digit }));
            }
        }
        if (feedback) setFeedback(null);
    };

    const getHandAngle = (value, total) => {
        return (value / total) * 360;
    };

    const hourAngle = getHandAngle((question.h % 12) + question.m / 60 + question.s / 3600, 12);
    const minAngle = getHandAngle(question.m + question.s / 60, 60);
    const secAngle = getHandAngle(question.s, 60);

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '10px', minHeight: '100vh', background: '#F8FAFC' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '25px', marginTop: '15px' }}>
                <button onClick={onBack} style={{ padding: '10px 22px', background: 'white', color: '#2C3E50', fontWeight: '1000', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #bdc3c7', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ MENU</button>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {['learn', 'test'].map(m => (
                        <button
                            key={m}
                            onClick={() => handleModeChange(m)}
                            style={{
                                padding: '10px 22px',
                                background: mode === m ? (m === 'learn' ? '#9B59B6' : '#F97316') : 'white',
                                color: mode === m ? 'white' : '#64748B',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === m ? `0 4px 0 ${m === 'learn' ? '#8E44AD' : '#C2410C'}` : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', textTransform: 'uppercase'
                            }}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '30px 20px',
                    background: 'white',
                    borderRadius: '40px',
                    width: '100%',
                    maxWidth: '650px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏰</div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {mode === 'learn' ? 'Reading Time' : 'Time Test'}
                    </h1>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: '#64748B', marginTop: '8px' }}>
                        {mode === 'learn' ? 'Select the correct time match!' : 'Type the time shown on the clock!'}
                    </p>
                </div>

                {/* Styled Clock Face */}
                <div style={{
                    position: 'relative',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'white',
                    border: '14px solid #334155',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05), 0 15px 35px rgba(0,0,0,0.1)',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Tick Marks */}
                    {[...Array(60)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: i % 5 === 0 ? '4px' : '2px',
                            height: i % 5 === 0 ? '15px' : '8px',
                            background: i % 5 === 0 ? '#334155' : '#94A3B8',
                            transform: `rotate(${i * 6}deg) translateY(-140px)`,
                            borderRadius: '2px'
                        }} />
                    ))}

                    {/* Numbers */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: '40px', height: '40px',
                            textAlign: 'center', fontWeight: '1000', fontSize: '1.8rem', color: '#1E293B',
                            transform: `rotate(${(i + 1) * 30}deg) translateY(-105px) rotate(-${(i + 1) * 30}deg)`
                        }}>
                            {i + 1}
                        </div>
                    ))}

                    {/* Hour Hand */}
                    <motion.div
                        animate={{ rotate: hourAngle }}
                        transition={{ type: 'spring', damping: 20 }}
                        style={{
                            position: 'absolute', width: '10px', height: '75px', background: '#334155', borderRadius: '10px',
                            transformOrigin: 'bottom center', top: '50%', marginTop: '-75px', zIndex: 4
                        }}
                    />

                    {/* Minute Hand */}
                    <motion.div
                        animate={{ rotate: minAngle }}
                        transition={{ type: 'spring', damping: 20 }}
                        style={{
                            position: 'absolute', width: '6px', height: '110px', background: '#334155', borderRadius: '10px',
                            transformOrigin: 'bottom center', top: '50%', marginTop: '-110px', zIndex: 3
                        }}
                    />

                    {/* Second Hand (The Request) */}
                    <motion.div
                        animate={{ rotate: secAngle }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'absolute', width: '2px', height: '125px', background: '#EF4444', borderRadius: '2px',
                            transformOrigin: 'bottom center', top: '50%', marginTop: '-125px', zIndex: 5
                        }}
                    >
                        {/* Circle on second hand */}
                        <div style={{ position: 'absolute', top: '20px', left: '50%', width: '10px', height: '100px', transform: 'translateX(-50%)' }}>
                            <div style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', margin: '0 auto' }}></div>
                        </div>
                    </motion.div>

                    {/* Center Cap */}
                    <div style={{ position: 'absolute', width: '16px', height: '16px', background: '#1E293B', borderRadius: '50%', zIndex: 6, border: '3px solid white' }}></div>
                </div>

                {mode === 'learn' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        {options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => checkAnswer(opt)}
                                style={{
                                    padding: '20px',
                                    fontSize: '2.2rem',
                                    background: 'white',
                                    color: '#1E293B',
                                    fontWeight: '1000',
                                    borderRadius: '25px',
                                    border: '3px solid #E2E8F0',
                                    boxShadow: '0 8px 0 #CBD5E1',
                                    cursor: 'pointer'
                                }}
                            >
                                {opt}
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="text" inputMode="numeric"
                                    value={userAnswer.hours}
                                    onChange={(e) => handleInputChange('hours', e.target.value)}
                                    placeholder="HH"
                                    style={{
                                        width: '110px', height: '100px', fontSize: '3.5rem',
                                        fontWeight: '1000', textAlign: 'center', borderRadius: '25px',
                                        border: '4px solid #DDD6FE', background: 'white',
                                        color: '#4B5563', outline: 'none', transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => e.target.parentElement.style.transform = 'scale(1.05)'}
                                    onBlur={(e) => e.target.parentElement.style.transform = 'scale(1)'}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: '1000', color: '#94A3B8' }}>HOURS</span>
                            </div>

                            <span style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#CBD5E1', paddingBottom: '30px' }}>:</span>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="text" inputMode="numeric"
                                    value={userAnswer.minutes}
                                    onChange={(e) => handleInputChange('minutes', e.target.value)}
                                    placeholder="MM"
                                    style={{
                                        width: '110px', height: '100px', fontSize: '3.5rem',
                                        fontWeight: '1000', textAlign: 'center', borderRadius: '25px',
                                        border: '4px solid #DDD6FE', background: 'white',
                                        color: '#4B5563', outline: 'none', transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => e.target.parentElement.style.transform = 'scale(1.05)'}
                                    onBlur={(e) => e.target.parentElement.style.transform = 'scale(1)'}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: '1000', color: '#94A3B8' }}>MINUTES</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={checkTestAnswer}
                            style={{
                                padding: '18px 80px',
                                background: '#F97316',
                                color: 'white',
                                borderRadius: '25px',
                                border: 'none',
                                boxShadow: '0 8px 0 #C2410C',
                                fontSize: '1.8rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '2rem' }}>✅</span> CHECK ANSWER
                            </span>
                        </motion.button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {feedback === 'correct' && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(255,255,255,0.9)', borderRadius: '40px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            zIndex: 100
                        }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '6rem', marginBottom: '20px' }}>🎉</motion.div>
                            <motion.div style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#10B981', marginBottom: '30px' }}>EXCELLENT!</motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={generateQuestion}
                                style={{
                                    padding: '18px 50px',
                                    background: '#10B981',
                                    color: 'white',
                                    borderRadius: '20px',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    fontWeight: '1000',
                                    boxShadow: '0 6px 0 #059669',
                                    cursor: 'pointer'
                                }}
                            >
                                NEXT PROBLEM ➡
                            </motion.button>
                        </div>
                    )}
                </AnimatePresence>

                {feedback === 'incorrect' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2 }}
                        exit={{ scale: 0 }}
                        style={{
                            position: 'absolute',
                            top: '40%',
                            background: '#EF4444',
                            color: 'white',
                            width: '100px', height: '100px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem',
                            zIndex: 100,
                            boxShadow: '0 10px 20px rgba(239, 68, 68, 0.4)'
                        }}
                    >
                        ❌
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default TimeGame;
