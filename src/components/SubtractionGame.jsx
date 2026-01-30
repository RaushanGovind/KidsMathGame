import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function SubtractionGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [settings, setSettings] = useState({ digits: 2, borrow: false });
    const [question, setQuestion] = useState({ topNumber: 0, bottomNumber: 0, columnCount: 0 });
    const [topNumberState, setTopNumberState] = useState({}); // { colIndex: val } for TEST mode
    const [userInputs, setUserInputs] = useState({}); // { colIndex: val }
    const [feedback, setFeedback] = useState(null);

    const inputsRef = useRef([]);

    useEffect(() => {
        generateQuestion();
    }, [settings]);

    const handleModeChange = (newMode) => {
        setMode(newMode);
        playSound('click');
        setFeedback(null);
        setUserInputs({});
        // Re-generate question to sync state
        generateQuestion();
    };

    const generateQuestion = () => {
        const min = Math.pow(10, settings.digits - 1);
        const max = Math.pow(10, settings.digits) - 1;

        const top = Math.floor(Math.random() * (max - min + 1)) + min;
        const bottom = Math.floor(Math.random() * top); // Ensure bottom < top

        const difference = top - bottom;
        const colCount = String(top).length;

        // Calculate borrows and working digits for LEARN mode
        const borrows = {}; // { colIndex: true }
        const workingTop = {}; // { colIndex: val }
        const topStr = String(top).padStart(colCount, '0');
        const bottomStr = String(bottom).padStart(colCount, '0');

        // Reverse them so index 0 = units
        const topDigits = topStr.split('').reverse().map(d => parseInt(d));
        const bottomDigits = bottomStr.split('').reverse().map(d => parseInt(d));

        const tempTopDigits = [...topDigits];
        for (let i = 0; i < colCount; i++) {
            if (tempTopDigits[i] < bottomDigits[i]) {
                borrows[i] = true;
                tempTopDigits[i] += 10;
                if (i + 1 < colCount) {
                    tempTopDigits[i + 1] -= 1;
                }
            } else {
                borrows[i] = false;
            }
            workingTop[i] = tempTopDigits[i];
        }

        setQuestion({
            topNumber: top,
            bottomNumber: bottom,
            columnCount: colCount,
            answer: difference,
            borrows,
            workingTop
        });

        // Initialize top number state for TEST mode
        const initialTopState = {};
        topDigits.forEach((d, i) => initialTopState[i] = d);
        setTopNumberState(initialTopState);

        setUserInputs({});
        setFeedback(null);

        if (mode === 'test') {
            setTimeout(() => {
                const rightmost = inputsRef.current[0];
                if (rightmost) rightmost.focus();
            }, 100);
        }
    };

    const handleTopNumberClick = (colIndex) => {
        if (!settings.borrow || mode === 'learn') return;

        const currentVal = topNumberState[colIndex];
        if (currentVal <= 0 && colIndex < question.columnCount - 1) return;

        // Borrow logic for TEST mode
        setTopNumberState(prev => {
            const newState = { ...prev };
            newState[colIndex] = prev[colIndex] - 1;
            if (colIndex > 0) {
                newState[colIndex - 1] = (prev[colIndex - 1] || 0) + 10;
            }
            return newState;
        });
        playSound('click');
    };

    const handleInput = (colIndex, val) => {
        const digit = val.slice(-1);
        if (!/^\d*$/.test(digit)) return;
        setUserInputs(prev => ({ ...prev, [colIndex]: digit }));
    };

    const handleKeyDown = (e, colIndex) => {
        if (e.key >= '0' && e.key <= '9') {
            setTimeout(() => {
                const nextInput = inputsRef.current[colIndex + 1];
                if (nextInput) nextInput.focus();
            }, 10);
        }
        if (e.key === 'Backspace' && !userInputs[colIndex]) {
            const prevInput = inputsRef.current[colIndex - 1];
            if (prevInput) prevInput.focus();
        }
        if (e.key === 'ArrowLeft') {
            const nextInput = inputsRef.current[colIndex + 1];
            if (nextInput) nextInput.focus();
        }
        if (e.key === 'ArrowRight') {
            const prevInput = inputsRef.current[colIndex - 1];
            if (prevInput) prevInput.focus();
        }
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    const checkAnswer = () => {
        let constructedString = "";
        for (let i = question.columnCount - 1; i >= 0; i--) {
            constructedString += userInputs[i] || "0";
        }
        const userVal = parseInt(constructedString, 10);

        if (userVal === question.answer) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
    };

    const getDigitValue = (number, colIndex) => {
        const str = String(number);
        const charIndex = str.length - 1 - colIndex;
        if (charIndex < 0) return 0;
        return parseInt(str[charIndex]);
    };

    const getDigit = (number, colIndex) => {
        const str = String(number);
        const charIndex = str.length - 1 - colIndex;
        if (charIndex < 0) return "";
        return str[charIndex];
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '10px', minHeight: '100vh', background: '#F8FAFC' }}>

            {/* Premium Header */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '25px',
                marginTop: '15px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={onBack} style={{ padding: '10px 22px', background: 'white', color: '#2C3E50', fontWeight: '1000', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #bdc3c7', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ MENU</button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => handleModeChange('learn')}
                            style={{
                                padding: '10px 22px',
                                background: mode === 'learn' ? '#EF4444' : 'white',
                                color: mode === 'learn' ? 'white' : '#2C3E50',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === 'learn' ? '0 4px 0 #B91C1C' : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', fontSize: '1.1rem'
                            }}
                        >LEARN</button>
                        <button
                            onClick={() => handleModeChange('test')}
                            style={{
                                padding: '10px 22px',
                                background: mode === 'test' ? '#F97316' : 'white',
                                color: mode === 'test' ? 'white' : '#2C3E50',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === 'test' ? '0 4px 0 #C2410C' : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', fontSize: '1.1rem'
                            }}
                        >TEST</button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ background: 'white', padding: '10px 20px', borderRadius: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '15px', alignItems: 'center', border: '2px solid #F1F5F9' }}>
                        <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '1.1rem' }}>DIGITS:</span>
                        <select
                            value={settings.digits}
                            onChange={e => setSettings({ ...settings, digits: Number(e.target.value) })}
                            style={{ padding: '5px 12px', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: '1000', color: '#1E293B', fontSize: '1.3rem', cursor: 'pointer', background: 'transparent', outline: 'none' }}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>

                    {mode === 'test' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '1.1rem' }}>BORROWING:</span>
                            <button
                                onClick={() => setSettings(s => ({ ...s, borrow: !s.borrow }))}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '15px',
                                    background: settings.borrow ? '#EF4444' : '#94A3B8',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '1000',
                                    cursor: 'pointer',
                                    boxShadow: `0 4px 0 ${settings.borrow ? '#B91C1C' : '#64748B'}`,
                                    fontSize: '1.1rem'
                                }}
                            >
                                {settings.borrow ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '30px 20px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '40px',
                    width: '100%',
                    maxWidth: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(25px)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {mode === 'learn' ? '➖ Learn Subtraction' : '➖ Subtraction Practice'}
                    </h1>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: '#64748B', marginTop: '8px' }}>
                        {mode === 'learn' ? '✨ Step-by-step column method!' : '🎯 Solve the problem!'}
                    </p>
                </div>

                {mode === 'learn' ? (
                    // LEARN MODE
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                background: 'white',
                                padding: '30px 40px',
                                borderRadius: '30px',
                                border: '3px solid #E2E8F0',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end'
                            }}
                        >
                            {/* Original vs Working Top indicator row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '8px', marginRight: '5px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{ width: '70px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {question.borrows[i] && (
                                            <span style={{ fontSize: '1.4rem', color: '#EF4444', fontWeight: '1000', textDecoration: 'line-through', opacity: 0.5 }}>
                                                {getDigit(question.topNumber, i)}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>

                            {/* Working Top Row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '70px',
                                        fontSize: '3rem',
                                        fontWeight: '800',
                                        color: question.borrows[i] ? '#EF4444' : '#1E293B',
                                        textAlign: 'center'
                                    }}>
                                        {question.workingTop[i]}
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>

                            {/* Bottom Row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '70px',
                                        fontSize: '3rem',
                                        fontWeight: '800',
                                        color: '#1E293B',
                                        textAlign: 'center'
                                    }}>
                                        {getDigit(question.bottomNumber, i)}
                                    </div>
                                ))}
                                <div style={{ width: '60px', fontSize: '2.5rem', fontWeight: '900', color: '#EF4444', textAlign: 'center' }}>➖</div>
                            </div>

                            {/* Divider */}
                            <div style={{ width: `calc(${question.columnCount * 70}px + 60px)`, height: '4px', background: '#1E293B', margin: '15px 0', borderRadius: '2px' }}></div>

                            {/* Answer Row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '70px',
                                        fontSize: '3.5rem',
                                        fontWeight: '900',
                                        color: '#F59E0B',
                                        textAlign: 'center'
                                    }}>
                                        {getDigit(question.answer, i)}
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>
                        </motion.div>

                        {/* Explanation Area */}
                        <div style={{ width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {Array.from({ length: question.columnCount }).map((_, idx) => {
                                const colIndex = idx;
                                const topVal = question.workingTop[colIndex];
                                const bottomVal = getDigitValue(question.bottomNumber, colIndex);
                                const borrowed = question.borrows[colIndex];

                                return (
                                    <motion.div
                                        key={colIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{
                                            background: '#FFFFFF',
                                            padding: '20px 25px',
                                            borderRadius: '20px',
                                            border: '2px solid #FEF2F2',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                            borderLeft: '6px solid #EF4444'
                                        }}
                                    >
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#991B1B', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ background: '#EF4444', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{idx + 1}</span>
                                            {colIndex === 0 ? 'Units' : colIndex === 1 ? 'Tens' : colIndex === 2 ? 'Hundreds' : `Column ${colIndex + 1}`} Column
                                        </h3>
                                        {borrowed && (
                                            <div style={{ marginBottom: '5px', color: '#EF4444', fontWeight: '800', fontSize: '1rem' }}>
                                                ✨ Borrowing 10! {getDigit(question.topNumber, colIndex)} becomes {topVal}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#475569' }}>
                                            {topVal} − {bottomVal} = <span style={{ color: '#1E293B', fontWeight: '900' }}>{topVal - bottomVal}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={generateQuestion}
                            style={{
                                padding: '18px 50px',
                                background: '#EF4444',
                                color: 'white',
                                borderRadius: '20px',
                                border: 'none',
                                boxShadow: '0 6px 0 #B91C1C',
                                fontSize: '1.5rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            🔄 NEW PROBLEM
                        </motion.button>
                    </div>
                ) : (
                    // TEST MODE
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            background: 'white',
                            padding: '30px 40px',
                            borderRadius: '30px',
                            border: '3px solid #E2E8F0',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end'
                        }}>
                            {/* Top Number Row (Interative) */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '8px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '70px',
                                        fontSize: '3rem',
                                        fontWeight: '800',
                                        color: topNumberState[i] !== getDigitValue(question.topNumber, i) ? '#EF4444' : '#1E293B',
                                        textAlign: 'center',
                                        cursor: settings.borrow ? 'pointer' : 'default',
                                        padding: '4px',
                                        borderRadius: '12px',
                                        background: settings.borrow ? '#F8FAFC' : 'transparent',
                                        border: settings.borrow ? '2px dashed #E2E8F0' : 'none',
                                        position: 'relative'
                                    }}
                                        onClick={() => handleTopNumberClick(i)}
                                    >
                                        {topNumberState[i]}
                                        <AnimatePresence>
                                            {topNumberState[i] !== getDigitValue(question.topNumber, i) && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    style={{ position: 'absolute', top: '-15px', right: '0', fontSize: '1rem', color: '#94A3B8', textDecoration: 'line-through' }}
                                                >
                                                    {getDigit(question.topNumber, i)}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>

                            {/* Bottom Row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '70px',
                                        fontSize: '3rem',
                                        fontWeight: '800',
                                        color: '#334155',
                                        textAlign: 'center'
                                    }}>
                                        {getDigit(question.bottomNumber, i)}
                                    </div>
                                ))}
                                <div style={{ width: '60px', fontSize: '2.5rem', fontWeight: '900', color: '#FB7185', textAlign: 'center' }}>➖</div>
                            </div>

                            {/* Divider */}
                            <div style={{ width: `calc(${question.columnCount * 70}px + 60px)`, height: '5px', background: '#1E293B', margin: '15px 0', borderRadius: '5px' }}></div>

                            {/* Inputs Row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{ width: '70px', display: 'flex', justifyContent: 'center' }}>
                                        <input
                                            ref={el => inputsRef.current[i] = el}
                                            type="text"
                                            inputMode="numeric"
                                            value={userInputs[i] || ''}
                                            onChange={(e) => handleInput(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, i)}
                                            style={{
                                                width: '55px',
                                                height: '65px',
                                                fontSize: '2.5rem',
                                                textAlign: 'center',
                                                borderRadius: '12px',
                                                border: feedback === 'incorrect' ? '3px solid #EF4444' : feedback === 'correct' ? '3px solid #10B981' : '3px solid #334155',
                                                background: '#FFFFFF',
                                                color: '#1E293B',
                                                fontWeight: '900',
                                                outline: 'none',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                            }}
                                        />
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            <AnimatePresence mode="wait">
                                {feedback && (
                                    <motion.div
                                        key={feedback}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{ fontSize: '1.8rem', fontWeight: '1000', color: feedback === 'correct' ? '#10B981' : '#EF4444' }}
                                    >
                                        {feedback === 'correct' ? '🌟 EXCELLENT!' : '❌ TRY AGAIN!'}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={feedback === 'correct' ? generateQuestion : checkAnswer}
                                style={{
                                    padding: '18px 60px',
                                    fontSize: '1.5rem',
                                    background: feedback === 'correct' ? '#10B981' : '#F97316',
                                    color: 'white',
                                    fontWeight: '1000',
                                    borderRadius: '20px',
                                    border: 'none',
                                    boxShadow: `0 6px 0 ${feedback === 'correct' ? '#059669' : '#C2410C'}`,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {feedback === 'correct' ? 'NEXT PROBLEM ➡' : 'CHECK ANSWER'}
                            </motion.button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default SubtractionGame;
