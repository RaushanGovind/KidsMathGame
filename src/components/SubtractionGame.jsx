import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function SubtractionGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [settings, setSettings] = useState({ digits: 2, borrow: false });
    const [question, setQuestion] = useState({ topNumber: 0, bottomNumber: 0, columnCount: 0 });
    const [topNumberState, setTopNumberState] = useState([]); // Array of digits for top number (might change with borrowing)
    const [userInputs, setUserInputs] = useState({});
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
    };

    const handleTopNumberClick = (colIndex, currentVal) => {
        if (!settings.borrow || mode === 'learn') return;

        // Borrow: Decrease this column by 1, increase next column (to the right) by 10
        const newTop = [...topNumberState];
        if (currentVal <= 0) return; // Can't borrow if already 0

        newTop[colIndex] = currentVal - 1;
        if (colIndex > 0) {
            newTop[colIndex - 1] = newTop[colIndex - 1] + 10;
        }

        setTopNumberState(newTop);
    };

    const generateQuestion = () => {
        const min = Math.pow(10, settings.digits - 1);
        const max = Math.pow(10, settings.digits) - 1;

        const top = Math.floor(Math.random() * (max - min + 1)) + min;
        const bottom = Math.floor(Math.random() * top); // Ensure bottom < top

        const difference = top - bottom;
        const colCount = String(top).length;

        // Initialize top number state
        const topDigits = String(top).split('').map(d => parseInt(d));

        // Calculate borrows for LEARN mode
        const borrows = [];
        const workingTop = [...topDigits];
        const bottomDigits = String(bottom).padStart(colCount, '0').split('').map(d => parseInt(d));

        for (let i = colCount - 1; i >= 0; i--) {
            if (workingTop[i] < bottomDigits[i]) {
                borrows[i] = true;
                workingTop[i] += 10;
                if (i > 0) {
                    workingTop[i - 1] -= 1;
                }
            } else {
                borrows[i] = false;
            }
        }

        setQuestion({
            topNumber: top,
            bottomNumber: bottom,
            columnCount: colCount,
            answer: difference,
            borrows,
            workingTop
        });
        setTopNumberState(topDigits);
        setUserInputs({});
        setFeedback(null);

        if (mode === 'test') {
            setTimeout(() => {
                const rightmost = inputsRef.current[0];
                if (rightmost) rightmost.focus();
            }, 100);
        }
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

    const getDigit = (number, colIndex) => {
        const str = String(number).padStart(question.columnCount, '0');
        const charIndex = str.length - 1 - colIndex;
        if (charIndex < 0) return "";
        return str[charIndex];
    };

    const getDigitValue = (number, colIndex) => {
        const str = String(number).padStart(question.columnCount, '0');
        const charIndex = str.length - 1 - colIndex;
        if (charIndex < 0) return 0;
        return parseInt(str[charIndex]);
    };

    const getAnswerDigit = (colIndex) => {
        return getDigit(question.answer, colIndex);
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px', minHeight: '100vh', background: '#F8FAFC' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
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
                            background: mode === 'learn' ? '#E74C3C' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #C0392B' : '0 4px 0 #CBD5E1',
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
                    maxWidth: '800px'
                }}
            >
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn' ? '➖ Learn Subtraction' : '➖ Subtraction Practice'}
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn' ? 'Conventional Column Method!' : 'Solve the problem!'}
                    </p>
                </div>

                {/* Settings */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    marginBottom: '30px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '20px',
                    border: '2px dashed #dee2e6',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: '#495057' }}>Digits:</span>
                        <select value={settings.digits} onChange={e => setSettings({ ...settings, digits: Number(e.target.value) })} style={{ padding: '8px', borderRadius: '10px', border: '2px solid #ced4da', fontWeight: 'bold' }}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    {mode === 'test' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold', color: '#495057' }}>Borrow Mode:</span>
                            <button
                                onClick={() => setSettings(s => ({ ...s, borrow: !s.borrow }))}
                                style={{
                                    padding: '8px 15px',
                                    borderRadius: '10px',
                                    background: settings.borrow ? '#e74c3c' : '#bdc3c7',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {settings.borrow ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    )}
                </div>

                {mode === 'learn' ? (
                    // LEARN MODE: Step-by-step solution
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
                        {/* Conventional Column Display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                background: 'white',
                                padding: '40px',
                                borderRadius: '25px',
                                border: '4px solid #E74C3C',
                                fontFamily: 'monospace',
                                display: 'inline-block'
                            }}
                        >
                            {/* Borrow indicators */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px', marginBottom: '5px', paddingLeft: '80px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{ width: '80px', textAlign: 'center' }}>
                                        {question.borrows && question.borrows[i] && (
                                            <span style={{ fontSize: '1.2rem', color: '#E74C3C', fontWeight: '900', textDecoration: 'line-through' }}>
                                                {String(question.topNumber).padStart(question.columnCount, '0')[i]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Top number */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '70px' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }}>
                                    {Array.from({ length: question.columnCount }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '80px',
                                            fontSize: '3rem',
                                            fontWeight: '1000',
                                            color: '#2C3E50',
                                            textAlign: 'center'
                                        }}>
                                            {question.workingTop && question.workingTop[i]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom number */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '70px', fontSize: '3rem', fontWeight: '1000', color: '#E74C3C' }}>
                                    −
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }}>
                                    {Array.from({ length: question.columnCount }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '80px',
                                            fontSize: '3rem',
                                            fontWeight: '1000',
                                            color: '#2C3E50',
                                            textAlign: 'center'
                                        }}>
                                            {getDigit(question.bottomNumber, i)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Horizontal line */}
                            <div style={{ borderTop: '4px solid #2C3E50', margin: '10px 0', marginLeft: '80px' }}></div>

                            {/* Answer */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                                <div style={{ width: '70px' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }}>
                                    {Array.from({ length: question.columnCount }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '80px',
                                            fontSize: '3.5rem',
                                            fontWeight: '1000',
                                            color: '#FF6F00',
                                            textAlign: 'center'
                                        }}>
                                            {getAnswerDigit(i)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Explanation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ width: '100%', maxWidth: '700px' }}
                        >
                            {Array.from({ length: question.columnCount }).reverse().map((_, idx) => {
                                const colIndex = question.columnCount - 1 - idx;
                                const topVal = question.workingTop[colIndex];
                                const bottomVal = getDigitValue(question.bottomNumber, colIndex);
                                const needsBorrow = question.borrows[colIndex];

                                return (
                                    <div key={colIndex} style={{
                                        background: '#FFEBEE',
                                        padding: '20px',
                                        borderRadius: '15px',
                                        border: '3px solid #EF5350',
                                        marginBottom: '15px'
                                    }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#C62828', marginBottom: '10px' }}>
                                            Column {colIndex + 1}: {topVal} − {bottomVal}
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#B71C1C', margin: 0 }}>
                                            {needsBorrow && (
                                                <>Borrow from next column: {String(question.topNumber).padStart(question.columnCount, '0')[colIndex]} becomes {topVal}<br /></>
                                            )}
                                            Result: <strong>{topVal - bottomVal}</strong>
                                        </p>
                                    </div>
                                );
                            })}
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateQuestion}
                            style={{
                                padding: '20px 60px',
                                background: '#E74C3C',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 8px 0 #C0392B',
                                fontSize: '2rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            🔄 NEW PROBLEM
                        </motion.button>
                    </div>
                ) : (
                    // TEST MODE: Interactive solving
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="columns-container" style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }}>
                            {Array.from({ length: question.columnCount }).map((_, i) => {
                                const arrayIndex = question.columnCount - 1 - i;
                                const currentVal = topNumberState[arrayIndex];

                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', position: 'relative' }}>
                                        {/* Borrow Indicator Space */}
                                        <div style={{ height: '50px', marginBottom: '10px' }}></div>

                                        {/* Top Number (clickable for borrowing) */}
                                        <div
                                            onClick={() => handleTopNumberClick(arrayIndex, currentVal)}
                                            style={{
                                                fontSize: '5rem',
                                                fontWeight: '900',
                                                height: '80px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                color: '#2C3E50',
                                                cursor: settings.borrow ? 'pointer' : 'default',
                                                userSelect: 'none',
                                                position: 'relative'
                                            }}
                                        >
                                            {currentVal}
                                        </div>

                                        {/* Bottom Number */}
                                        <div style={{
                                            fontSize: '5rem',
                                            fontWeight: '900',
                                            height: '80px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            position: 'relative',
                                            color: '#2C3E50'
                                        }}>
                                            {i === question.columnCount - 1 && (
                                                <span style={{ position: 'absolute', left: '-25px', fontWeight: '900', color: '#E74C3C' }}>−</span>
                                            )}
                                            {getDigit(question.bottomNumber, i)}
                                        </div>

                                        {/* Answer Input */}
                                        <div style={{ width: '100%', borderTop: '6px solid #2C3E50', marginTop: '10px', paddingTop: '15px', display: 'flex', justifyContent: 'center' }}>
                                            <input
                                                ref={el => inputsRef.current[i] = el}
                                                type="text"
                                                inputMode="numeric"
                                                value={userInputs[i] || ''}
                                                onChange={(e) => handleInput(i, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, i)}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    fontSize: '3rem',
                                                    textAlign: 'center',
                                                    borderRadius: '15px',
                                                    border: '3px solid #34495E',
                                                    background: '#fff',
                                                    color: '#2C3E50',
                                                    fontWeight: '900',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feedback */}
                        <div style={{ height: '60px', marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                            <AnimatePresence mode="wait">
                                {feedback && (
                                    <motion.div
                                        key={feedback}
                                        initial={{ scale: 0, opacity: 0, y: 20 }}
                                        animate={{ scale: 1.2, opacity: 1, y: 0 }}
                                        exit={{ scale: 0, opacity: 0, y: -20 }}
                                        style={{
                                            fontSize: '2.5rem',
                                            fontWeight: '900',
                                            color: feedback === 'correct' ? '#27AE60' : '#E74C3C'
                                        }}
                                    >
                                        {feedback === 'correct' ? '🌟 EXCELLENT!' : '❌ TRY AGAIN!'}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {feedback === 'correct' ? (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generateQuestion}
                                style={{
                                    marginTop: '10px',
                                    padding: '20px 60px',
                                    fontSize: '2rem',
                                    background: '#27AE60',
                                    color: 'white',
                                    fontWeight: '900',
                                    borderRadius: '25px',
                                    border: 'none',
                                    boxShadow: '0 8px 0 #219150',
                                    cursor: 'pointer'
                                }}
                            >
                                NEXT QUESTION
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={checkAnswer}
                                style={{
                                    marginTop: '10px',
                                    padding: '20px 60px',
                                    fontSize: '2rem',
                                    background: '#E67E22',
                                    color: 'white',
                                    fontWeight: '900',
                                    borderRadius: '25px',
                                    border: 'none',
                                    boxShadow: '0 8px 0 #D35400',
                                    cursor: 'pointer'
                                }}
                            >
                                CHECK ANSWER
                            </motion.button>
                        )}
                    </div>
                )}

            </motion.div>
        </div>
    );
}

export default SubtractionGame;
