import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function AdditionGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [settings, setSettings] = useState({ rows: 2, digits: 2, carry: false });
    const [question, setQuestion] = useState({ numbers: [], columnCount: 0 });
    const [userInputs, setUserInputs] = useState({}); // { 0: '5', 1: '2' } keyed by column index (0 is rightmost)
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
    const [carryInputs, setCarryInputs] = useState({}); // { 1: '1' }
    const [animatingCarry, setAnimatingCarry] = useState(null); // { val: '1', fromCol: 0, toCol: 1 }

    const inputsRef = useRef([]);

    // Generate new question when settings change
    useEffect(() => {
        generateQuestion();
    }, [settings]);

    const generateQuestion = () => {
        const min = Math.pow(10, settings.digits - 1);
        const max = Math.pow(10, settings.digits) - 1;
        const nums = Array.from({ length: settings.rows }, () =>
            Math.floor(Math.random() * (max - min + 1)) + min
        );

        // Calculate columns needed (max digits of sum)
        const sum = nums.reduce((a, b) => a + b, 0);
        const colCount = String(sum).length;

        // Calculate carries for LEARN mode
        const carries = [];
        let carry = 0;
        for (let col = 0; col < colCount; col++) {
            let columnSum = carry;
            for (let num of nums) {
                const digit = getDigitValue(num, col);
                columnSum += digit;
            }
            carries[col] = Math.floor(columnSum / 10);
            carry = carries[col];
        }

        setQuestion({ numbers: nums, columnCount: colCount, answer: sum, carries });
        setUserInputs({});
        setCarryInputs({});
        setFeedback(null);

        // Focus rightmost input after render (TEST mode only)
        if (mode === 'test') {
            setTimeout(() => {
                const rightmost = inputsRef.current[0];
                if (rightmost) rightmost.focus();
            }, 100);
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        playSound('click');
        setFeedback(null);
        setUserInputs({});
        setCarryInputs({});
    };

    const handleInput = (colIndex, val) => {
        // Check if user is trying to type a 2-digit number (Carry!)
        if (val.length > 1) {
            const num = parseInt(val);
            if (!isNaN(num) && num >= 10) {
                const ones = num % 10;
                const tens = Math.floor(num / 10);

                // 1. Keep only ones digit here
                setUserInputs(prev => ({ ...prev, [colIndex]: String(ones) }));

                // 2. Trigger Fly Animation
                setAnimatingCarry({ val: String(tens), fromCol: colIndex, toCol: colIndex + 1 });

                // 3. After animation, set carry in next column
                setTimeout(() => {
                    setCarryInputs(prev => ({ ...prev, [colIndex + 1]: String(tens) }));
                    setAnimatingCarry(null);
                }, 800); // Duration of animation
                return;
            }
        }

        // Normal single digit input
        const digit = val.slice(-1);
        if (!/^\d*$/.test(digit)) return;
        setUserInputs(prev => ({ ...prev, [colIndex]: digit }));
    };

    const handleKeyDown = (e, colIndex) => {
        // Navigate between inputs with arrows or auto-move?
        if (e.key >= '0' && e.key <= '9') {
            // Auto move focus to left (index + 1)
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

    // Helper to get digit value at column for a number
    const getDigitValue = (number, colIndex) => {
        const str = String(number);
        const charIndex = str.length - 1 - colIndex;
        if (charIndex < 0) return 0;
        return parseInt(str[charIndex]);
    };

    // Helper to get digit string at column for a number
    const getDigit = (number, colIndex) => {
        const str = String(number);
        const charIndex = str.length - 1 - colIndex;
        if (charIndex < 0) return "";
        return str[charIndex];
    };

    // For LEARN mode: calculate column sum
    const getColumnSum = (colIndex) => {
        let sum = (colIndex > 0 && question.carries[colIndex - 1]) || 0;
        for (let num of question.numbers) {
            sum += getDigitValue(num, colIndex);
        }
        return sum;
    };

    // For LEARN mode: get the answer digit at column
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
                            background: mode === 'learn' ? '#27AE60' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #1E8449' : '0 4px 0 #CBD5E1',
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
                    <h2 style={{ fontSize: '2rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {mode === 'learn' ? '➕ Learn Addition' : '➕ Addition Practice'}
                    </h2>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: '#64748B', marginTop: '5px' }}>
                        {mode === 'learn' ? 'Conventional Column Method!' : 'Solve the problem!'}
                    </p>
                </div>

                {/* Settings Panel */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '35px',
                    padding: '15px 25px',
                    background: '#F1F5F9',
                    borderRadius: '20px',
                    border: '2px solid #E2E8F0',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.9rem' }}>DIGITS:</span>
                        <select
                            value={settings.digits}
                            onChange={e => setSettings({ ...settings, digits: Number(e.target.value) })}
                            style={{ padding: '6px 12px', borderRadius: '10px', border: '2px solid #CBD5E1', fontWeight: '900', color: '#1E293B', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.9rem' }}>ROWS:</span>
                        <select
                            value={settings.rows}
                            onChange={e => setSettings({ ...settings, rows: Number(e.target.value) })}
                            style={{ padding: '6px 12px', borderRadius: '10px', border: '2px solid #CBD5E1', fontWeight: '900', color: '#1E293B', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    {mode === 'test' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.9rem' }}>CARRY BOX:</span>
                            <button
                                onClick={() => setSettings(s => ({ ...s, carry: !s.carry }))}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '12px',
                                    background: settings.carry ? '#10B981' : '#94A3B8',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '900',
                                    cursor: 'pointer',
                                    boxShadow: `0 4px 0 ${settings.carry ? '#059669' : '#64748B'}`,
                                    transition: 'all 0.2s',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {settings.carry ? 'VISIBLE' : 'HIDDEN'}
                            </button>
                        </div>
                    )}
                </div>

                {mode === 'learn' ? (
                    // LEARN MODE: Modern Step-by-Step Visualization
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
                            {/* Carry indicators (Offset to the left by one) */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '10px', marginRight: '5px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{ width: '70px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* Display carry from the PREVIOUS column (i-1) */}
                                        {i > 0 && question.carries[i - 1] > 0 && (
                                            <span style={{ fontSize: '1.4rem', color: '#EF4444', fontWeight: '1000', background: '#FEF2F2', padding: '2px 10px', borderRadius: '10px', border: '2px solid #FEE2E2' }}>
                                                {question.carries[i - 1]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div> {/* Spacer for the + symbol column */}
                            </div>

                            {/* Numbers Rows */}
                            {question.numbers.map((num, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                                    {Array.from({ length: question.columnCount }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '70px',
                                            fontSize: '3rem',
                                            fontWeight: '800',
                                            color: '#1E293B',
                                            textAlign: 'center'
                                        }}>
                                            {getDigit(num, i)}
                                        </div>
                                    ))}
                                    <div style={{
                                        width: '60px',
                                        fontSize: '2.5rem',
                                        fontWeight: '900',
                                        color: '#E67E22',
                                        textAlign: 'center'
                                    }}>
                                        {idx === question.numbers.length - 1 ? '+' : ''}
                                    </div>
                                </div>
                            ))}

                            {/* Horizontal line */}
                            <div style={{
                                width: `calc(${question.columnCount * 70}px + 60px)`,
                                height: '4px',
                                background: '#1E293B',
                                margin: '15px 0',
                                borderRadius: '2px'
                            }}></div>

                            {/* Answer Row */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '70px',
                                        fontSize: '3.5rem',
                                        fontWeight: '900',
                                        color: '#27AE60',
                                        textAlign: 'center'
                                    }}>
                                        {getAnswerDigit(i)}
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>
                        </motion.div>

                        {/* Step-by-Step Explanation Cards */}
                        <div style={{ width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {Array.from({ length: question.columnCount }).map((_, idx) => {
                                const colIndex = idx; // 0=units, 1=tens...
                                const columnSum = getColumnSum(colIndex);
                                const carryOut = question.carries[colIndex];
                                const carryIn = (colIndex > 0 && question.carries[colIndex - 1]) || 0;

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
                                            border: '2px solid #ECFDF5',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                            borderLeft: '6px solid #10B981'
                                        }}
                                    >
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#065F46', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ background: '#10B981', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{idx + 1}</span>
                                            {colIndex === 0 ? 'Units' : colIndex === 1 ? 'Tens' : colIndex === 2 ? 'Hundreds' : `Column ${colIndex + 1}`} Column
                                        </h3>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#475569' }}>
                                            {carryIn > 0 && <span style={{ color: '#EF4444' }}>(Carry {carryIn}) + </span>}
                                            {question.numbers.map((num, i) => getDigitValue(num, colIndex) || 0).join(' + ')}
                                            {' = '}<span style={{ color: '#1E293B', fontWeight: '900' }}>{columnSum}</span>
                                        </div>
                                        <div style={{ marginTop: '5px', fontSize: '1rem', color: '#10B981', fontWeight: '800' }}>
                                            Write: <span style={{ fontSize: '1.3rem' }}>{columnSum % 10}</span>
                                            {carryOut > 0 && <span style={{ marginLeft: '15px', color: '#EF4444' }}>| Carry: {carryOut}</span>}
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
                                background: '#10B981',
                                color: 'white',
                                borderRadius: '20px',
                                border: 'none',
                                boxShadow: '0 6px 0 #059669',
                                fontSize: '1.5rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            🔄 Generate New
                        </motion.button>
                    </div>
                ) : (
                    // TEST MODE: Balanced and Scaled for Mobile
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            background: 'white',
                            padding: '30px 40px',
                            borderRadius: '30px',
                            border: '3px solid #E2E8F0',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            position: 'relative'
                        }}>
                            {/* Interactive Carry Inputs */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '10px', marginRight: '5px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{ width: '70px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {(settings.carry || carryInputs[i]) && i > 0 && (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="1"
                                                value={carryInputs[i] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.slice(-1);
                                                    if (/^\d*$/.test(val)) setCarryInputs(prev => ({ ...prev, [i]: val }));
                                                }}
                                                placeholder="c"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    textAlign: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: '900',
                                                    border: '2px dashed #CBD5E1',
                                                    borderRadius: '10px',
                                                    background: carryInputs[i] ? '#FEF3C7' : '#F8FAFC',
                                                    color: '#92400E',
                                                    outline: 'none'
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>

                            {/* Summands */}
                            {question.numbers.map((num, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                                    {Array.from({ length: question.columnCount }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '70px',
                                            fontSize: '3rem',
                                            fontWeight: '800',
                                            color: '#1E293B',
                                            textAlign: 'center'
                                        }}>
                                            {getDigit(num, i)}
                                        </div>
                                    ))}
                                    <div style={{ width: '60px', fontSize: '2.5rem', fontWeight: '900', color: '#F97316', textAlign: 'center' }}>
                                        {idx === question.numbers.length - 1 ? '+' : ''}
                                    </div>
                                </div>
                            ))}

                            {/* Divider Line */}
                            <div style={{
                                width: `calc(${question.columnCount * 70}px + 60px)`,
                                height: '5px',
                                background: '#1E293B',
                                margin: '15px 0',
                                borderRadius: '5px'
                            }}></div>

                            {/* User Answer Inputs */}
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
                                                transition: 'all 0.2s',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                            }}
                                        />
                                    </div>
                                ))}
                                <div style={{ width: '60px' }}></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            <AnimatePresence mode="wait">
                                {feedback && (
                                    <motion.div
                                        key={feedback}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{
                                            fontSize: '1.8rem',
                                            fontWeight: '1000',
                                            color: feedback === 'correct' ? '#10B981' : '#EF4444'
                                        }}
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

export default AdditionGame;
