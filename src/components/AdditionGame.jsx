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
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn' ? '➕ Learn Addition' : '➕ Addition Practice'}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: '#495057' }}>Rows:</span>
                        <select value={settings.rows} onChange={e => setSettings({ ...settings, rows: Number(e.target.value) })} style={{ padding: '8px', borderRadius: '10px', border: '2px solid #ced4da', fontWeight: 'bold' }}>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    {mode === 'test' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold', color: '#495057' }}>Carry Mode:</span>
                            <button
                                onClick={() => setSettings(s => ({ ...s, carry: !s.carry }))}
                                style={{
                                    padding: '8px 15px',
                                    borderRadius: '10px',
                                    background: settings.carry ? '#2ecc71' : '#bdc3c7',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {settings.carry ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    )}
                </div>

                {mode === 'learn' ? (
                    // LEARN MODE: Show step-by-step solution
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
                                border: '4px solid #27AE60',
                                fontFamily: 'monospace',
                                display: 'inline-block'
                            }}
                        >
                            {/* Carry indicators */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px', marginBottom: '5px', paddingLeft: '80px' }}>
                                {Array.from({ length: question.columnCount }).map((_, i) => (
                                    <div key={i} style={{ width: '80px', textAlign: 'center' }}>
                                        {question.carries[i] > 0 && (
                                            <span style={{ fontSize: '1.5rem', color: '#E74C3C', fontWeight: '900' }}>
                                                {question.carries[i]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Numbers */}
                            {question.numbers.map((num, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ width: '70px', fontSize: '3rem', fontWeight: '1000', color: '#27AE60' }}>
                                        {idx === question.numbers.length - 1 ? '+' : ''}
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
                                                {getDigit(num, i)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

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
                                const columnSum = getColumnSum(colIndex);
                                const carry = question.carries[colIndex];
                                const previousCarry = (colIndex > 0 && question.carries[colIndex - 1]) || 0;

                                return (
                                    <div key={colIndex} style={{
                                        background: '#E8F5E9',
                                        padding: '20px',
                                        borderRadius: '15px',
                                        border: '3px solid #4CAF50',
                                        marginBottom: '15px'
                                    }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2E7D32', marginBottom: '10px' }}>
                                            Column {colIndex + 1}: {previousCarry > 0 && `(Carry ${previousCarry}) + `}
                                            {question.numbers.map((num, i) => getDigitValue(num, colIndex) || 0).join(' + ')}
                                            {' = '}{columnSum}
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B5E20', margin: 0 }}>
                                            Write: <strong>{columnSum % 10}</strong>
                                            {carry > 0 && <> | Carry: <strong style={{ color: '#E74C3C' }}>{carry}</strong></>}
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
                                background: '#27AE60',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 8px 0 #1E8449',
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
                        {/* Flying Carry Animation */}
                        <AnimatePresence>
                            {animatingCarry && (
                                <motion.div
                                    initial={{ x: animatingCarry.fromCol * -92, y: 150, scale: 1.5, opacity: 1 }}
                                    animate={{ x: animatingCarry.toCol * -92, y: -220, scale: 1, opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '150px',
                                        right: '60px',
                                        width: '40px', height: '40px',
                                        background: '#F1C40F', color: '#2C3E50',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '900', fontSize: '1.5rem',
                                        zIndex: 100,
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {animatingCarry.val}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="columns-container" style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }}>
                            {Array.from({ length: question.columnCount }).map((_, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', position: 'relative' }}>
                                    {/* Carry Area */}
                                    <div style={{ height: '50px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {(settings.carry || carryInputs[i]) && i < question.columnCount - 1 && (
                                            <motion.div
                                                initial={carryInputs[i] ? { scale: 0.5, opacity: 0 } : false}
                                                animate={carryInputs[i] ? { scale: 1, opacity: 1 } : false}
                                                style={{
                                                    width: '45px', height: '45px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    borderRadius: '12px',
                                                    background: carryInputs[i] ? '#F1C40F' : '#f1f2f6',
                                                    color: '#2C3E50',
                                                    fontWeight: '900',
                                                    fontSize: '1.4rem',
                                                    border: '2px solid #ddd'
                                                }}
                                            >
                                                {carryInputs[i] || ''}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Numbers */}
                                    {question.numbers.map((num, idx) => (
                                        <div key={idx} style={{
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
                                            {idx === question.numbers.length - 1 && i === question.columnCount - 1 && (
                                                <span style={{ position: 'absolute', left: '-25px', fontWeight: '900', color: '#E67E22' }}>+</span>
                                            )}
                                            {getDigit(num, i)}
                                        </div>
                                    ))}

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
                            ))}
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

export default AdditionGame;
