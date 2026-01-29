import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function DecimalArithmeticGame({ onBack }) {
    const [operation, setOperation] = useState('add'); // 'add' or 'subtract'
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [settings, setSettings] = useState({ beforeDecimal: 2, afterDecimal: 2 });
    const [question, setQuestion] = useState({ num1: 0, num2: 0 });
    const [userInputs, setUserInputs] = useState({}); // keyed by column index
    const [feedback, setFeedback] = useState(null);
    const [carryInputs, setCarryInputs] = useState({});
    const [animatingCarry, setAnimatingCarry] = useState(null);

    const inputsRef = useRef([]);

    useEffect(() => {
        generateQuestion();
    }, [operation, settings]);

    const generateQuestion = () => {
        const { beforeDecimal, afterDecimal } = settings;
        const maxBefore = Math.pow(10, beforeDecimal) - 1;
        const maxAfter = Math.pow(10, afterDecimal) - 1;

        const num1Before = Math.floor(Math.random() * maxBefore) + 1;
        const num1After = Math.floor(Math.random() * (maxAfter + 1));
        const num1 = parseFloat(`${num1Before}.${String(num1After).padStart(afterDecimal, '0')}`);

        let num2Before, num2After, num2;

        if (operation === 'add') {
            num2Before = Math.floor(Math.random() * maxBefore) + 1;
            num2After = Math.floor(Math.random() * (maxAfter + 1));
            num2 = parseFloat(`${num2Before}.${String(num2After).padStart(afterDecimal, '0')}`);
        } else {
            // For subtraction, ensure num2 < num1
            const maxNum2Before = Math.min(num1Before, maxBefore);
            num2Before = Math.floor(Math.random() * maxNum2Before);
            num2After = Math.floor(Math.random() * (maxAfter + 1));
            num2 = parseFloat(`${num2Before}.${String(num2After).padStart(afterDecimal, '0')}`);

            if (num2 >= num1) {
                setTimeout(generateQuestion, 0);
                return;
            }
        }

        const answer = operation === 'add' ? num1 + num2 : num1 - num2;
        const answerFixed = answer.toFixed(afterDecimal);

        // Convert to digit arrays for column-based work
        const totalColumns = beforeDecimal + afterDecimal;
        const num1Str = num1.toFixed(afterDecimal).replace('.', '');
        const num2Str = num2.toFixed(afterDecimal).replace('.', '');
        const answerStr = answerFixed.replace('.', '');

        // Calculate carries/borrows for LEARN mode
        const carries = [];
        let carry = 0;

        if (operation === 'add') {
            for (let col = totalColumns - 1; col >= 0; col--) {
                const d1 = parseInt(num1Str[col]) || 0;
                const d2 = parseInt(num2Str[col]) || 0;
                const sum = d1 + d2 + carry;
                carries[col] = Math.floor(sum / 10);
                carry = carries[col];
            }
        } else {
            // Borrowing for subtraction
            const workingNum1 = num1Str.split('').map(d => parseInt(d));
            const num2Digits = num2Str.split('').map(d => parseInt(d));

            for (let col = totalColumns - 1; col >= 0; col--) {
                if (workingNum1[col] < num2Digits[col]) {
                    carries[col] = true; // indicates borrow
                    workingNum1[col] += 10;
                    if (col > 0) {
                        workingNum1[col - 1] -= 1;
                    }
                } else {
                    carries[col] = false;
                }
            }
        }

        setQuestion({
            num1,
            num2,
            answer: parseFloat(answerFixed),
            answerStr,
            num1Str,
            num2Str,
            totalColumns,
            decimalPosition: beforeDecimal,
            carries
        });
        setUserInputs({});
        setCarryInputs({});
        setFeedback(null);

        if (mode === 'test') {
            setTimeout(() => {
                const rightmost = inputsRef.current[totalColumns - 1];
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

    const handleOperationChange = (newOp) => {
        setOperation(newOp);
        playSound('click');
        setFeedback(null);
        setUserInputs({});
        setCarryInputs({});
    };

    const handleInput = (colIndex, val) => {
        if (val.length > 1) {
            const num = parseInt(val);
            if (!isNaN(num) && num >= 10 && operation === 'add') {
                const ones = num % 10;
                const tens = Math.floor(num / 10);

                setUserInputs(prev => ({ ...prev, [colIndex]: String(ones) }));
                setAnimatingCarry({ val: String(tens), fromCol: colIndex, toCol: colIndex - 1 });

                setTimeout(() => {
                    setCarryInputs(prev => ({ ...prev, [colIndex - 1]: String(tens) }));
                    setAnimatingCarry(null);
                }, 800);
                return;
            }
        }

        const digit = val.slice(-1);
        if (!/^\d*$/.test(digit)) return;
        setUserInputs(prev => ({ ...prev, [colIndex]: digit }));
    };

    const handleKeyDown = (e, colIndex) => {
        if (e.key >= '0' && e.key <= '9') {
            setTimeout(() => {
                const nextInput = inputsRef.current[colIndex - 1];
                if (nextInput && colIndex !== question.decimalPosition) nextInput.focus();
            }, 10);
        }
        if (e.key === 'Backspace' && !userInputs[colIndex]) {
            const prevInput = inputsRef.current[colIndex + 1];
            if (prevInput) prevInput.focus();
        }
        if (e.key === 'ArrowLeft') {
            const nextInput = inputsRef.current[colIndex - 1];
            if (nextInput && colIndex !== question.decimalPosition) nextInput.focus();
        }
        if (e.key === 'ArrowRight') {
            const prevInput = inputsRef.current[colIndex + 1];
            if (prevInput) prevInput.focus();
        }
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    const checkAnswer = () => {
        let constructedString = "";
        for (let i = 0; i < question.totalColumns; i++) {
            constructedString += userInputs[i] || "0";
        }

        // Insert decimal point
        const beforePart = constructedString.slice(0, question.decimalPosition);
        const afterPart = constructedString.slice(question.decimalPosition);
        const userAnswer = parseFloat(`${beforePart}.${afterPart}`);

        if (Math.abs(userAnswer - question.answer) < 0.001) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
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
                        onClick={() => handleOperationChange('add')}
                        style={{
                            padding: '12px 24px',
                            background: operation === 'add' ? '#3498DB' : 'white',
                            color: operation === 'add' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: operation === 'add' ? '0 4px 0 #2980B9' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        ADD
                    </button>
                    <button
                        onClick={() => handleOperationChange('subtract')}
                        style={{
                            padding: '12px 24px',
                            background: operation === 'subtract' ? '#9B59B6' : 'white',
                            color: operation === 'subtract' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: operation === 'subtract' ? '0 4px 0 #7D3C98' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        SUBTRACT
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => handleModeChange('learn')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'learn' ? '#16A085' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #138D75' : '0 4px 0 #CBD5E1',
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
                    maxWidth: '900px'
                }}
            >
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn'
                            ? (operation === 'add' ? '🔢 Learn Decimal Addition' : '🔢 Learn Decimal Subtraction')
                            : (operation === 'add' ? '🔢 Decimal Addition Practice' : '🔢 Decimal Subtraction Practice')
                        }
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn' ? 'Conventional Column Method!' : 'Align the decimal point!'}
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
                        <span style={{ fontWeight: 'bold', color: '#495057' }}>Before Decimal:</span>
                        <select value={settings.beforeDecimal} onChange={e => setSettings({ ...settings, beforeDecimal: Number(e.target.value) })} style={{ padding: '8px', borderRadius: '10px', border: '2px solid #ced4da', fontWeight: 'bold' }}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: '#495057' }}>After Decimal:</span>
                        <select value={settings.afterDecimal} onChange={e => setSettings({ ...settings, afterDecimal: Number(e.target.value) })} style={{ padding: '8px', borderRadius: '10px', border: '2px solid #ced4da', fontWeight: 'bold' }}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                </div>

                {mode === 'learn' ? (
                    // LEARN MODE
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                background: 'white',
                                padding: '40px',
                                borderRadius: '25px',
                                border: operation === 'add' ? '4px solid #3498DB' : '4px solid #9B59B6',
                                fontFamily: 'monospace',
                                display: 'inline-block'
                            }}
                        >
                            {/* Carry/Borrow indicators */}
                            {operation === 'add' && (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '5px', paddingLeft: '80px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{ width: i === question.decimalPosition ? '20px' : '60px', textAlign: 'center' }}>
                                            {i !== question.decimalPosition && question.carries && question.carries[i] > 0 && (
                                                <span style={{ fontSize: '1.2rem', color: '#E74C3C', fontWeight: '900' }}>
                                                    {question.carries[i]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {operation === 'subtract' && (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '5px', paddingLeft: '80px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{ width: i === question.decimalPosition ? '20px' : '60px', textAlign: 'center' }}>
                                            {i !== question.decimalPosition && question.carries && question.carries[i] && (
                                                <span style={{ fontSize: '1.2rem', color: '#E74C3C', fontWeight: '900', textDecoration: 'line-through' }}>
                                                    {question.num1Str[i]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* First number */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '70px' }}></div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{
                                            width: i === question.decimalPosition ? '20px' : '60px',
                                            fontSize: i === question.decimalPosition ? '3rem' : '2.5rem',
                                            fontWeight: '1000',
                                            color: i === question.decimalPosition ? '#E74C3C' : '#2C3E50',
                                            textAlign: 'center'
                                        }}>
                                            {i === question.decimalPosition ? '.' : question.num1Str[i]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Second number with operation */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '70px', fontSize: '2.5rem', fontWeight: '1000', color: operation === 'add' ? '#3498DB' : '#9B59B6' }}>
                                    {operation === 'add' ? '+' : '−'}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{
                                            width: i === question.decimalPosition ? '20px' : '60px',
                                            fontSize: i === question.decimalPosition ? '3rem' : '2.5rem',
                                            fontWeight: '1000',
                                            color: i === question.decimalPosition ? '#E74C3C' : '#2C3E50',
                                            textAlign: 'center'
                                        }}>
                                            {i === question.decimalPosition ? '.' : question.num2Str[i]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Line */}
                            <div style={{ borderTop: '4px solid #2C3E50', margin: '10px 0', marginLeft: '80px' }}></div>

                            {/* Answer */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                                <div style={{ width: '70px' }}></div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{
                                            width: i === question.decimalPosition ? '20px' : '60px',
                                            fontSize: i === question.decimalPosition ? '3rem' : '3rem',
                                            fontWeight: '1000',
                                            color: i === question.decimalPosition ? '#E74C3C' : '#FF6F00',
                                            textAlign: 'center'
                                        }}>
                                            {i === question.decimalPosition ? '.' : question.answerStr[i]}
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
                            <div style={{
                                background: operation === 'add' ? '#EBF5FB' : '#F4ECF7',
                                padding: '25px',
                                borderRadius: '20px',
                                border: operation === 'add' ? '3px solid #3498DB' : '3px solid #9B59B6',
                                marginBottom: '15px'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: operation === 'add' ? '#1565C0' : '#7D3C98', marginBottom: '15px' }}>
                                    📍 Key Points:
                                </h3>
                                <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2C3E50', margin: 0 }}>
                                    ✓ Align the decimal points vertically<br />
                                    ✓ Start from the rightmost column<br />
                                    ✓ {operation === 'add' ? 'Carry when sum ≥ 10' : 'Borrow when top digit < bottom digit'}<br />
                                    ✓ Place decimal point in the answer
                                </p>
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateQuestion}
                            style={{
                                padding: '20px 60px',
                                background: operation === 'add' ? '#3498DB' : '#9B59B6',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: operation === 'add' ? '0 8px 0 #2980B9' : '0 8px 0 #7D3C98',
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
                    // TEST MODE
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Flying Carry Animation */}
                        <AnimatePresence>
                            {animatingCarry && (
                                <motion.div
                                    initial={{ x: animatingCarry.fromCol * 70, y: 150, scale: 1.5, opacity: 1 }}
                                    animate={{ x: animatingCarry.toCol * 70, y: -220, scale: 1, opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '150px',
                                        left: '50%',
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* Carry row */}
                            <div style={{ display: 'flex', gap: '10px', height: '50px', marginBottom: '10px', paddingLeft: '80px' }}>
                                {Array.from({ length: question.totalColumns }).map((_, i) => (
                                    <div key={i} style={{ width: i === question.decimalPosition ? '20px' : '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {i !== question.decimalPosition && carryInputs[i] && (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                style={{
                                                    width: '40px', height: '40px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    borderRadius: '12px',
                                                    background: '#F1C40F',
                                                    color: '#2C3E50',
                                                    fontWeight: '900',
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                {carryInputs[i]}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* First number */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '70px' }}></div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{
                                            width: i === question.decimalPosition ? '20px' : '60px',
                                            height: '70px',
                                            fontSize: i === question.decimalPosition ? '3rem' : '3rem',
                                            fontWeight: '1000',
                                            color: i === question.decimalPosition ? '#E74C3C' : '#2C3E50',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {i === question.decimalPosition ? '.' : question.num1Str[i]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Second number */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '70px', fontSize: '3rem', fontWeight: '1000', color: operation === 'add' ? '#3498DB' : '#9B59B6' }}>
                                    {operation === 'add' ? '+' : '−'}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{
                                            width: i === question.decimalPosition ? '20px' : '60px',
                                            height: '70px',
                                            fontSize: i === question.decimalPosition ? '3rem' : '3rem',
                                            fontWeight: '1000',
                                            color: i === question.decimalPosition ? '#E74C3C' : '#2C3E50',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {i === question.decimalPosition ? '.' : question.num2Str[i]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Line */}
                            <div style={{ borderTop: '6px solid #2C3E50', marginLeft: '80px', marginTop: '10px' }}></div>

                            {/* Answer inputs */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '15px' }}>
                                <div style={{ width: '70px' }}></div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Array.from({ length: question.totalColumns }).map((_, i) => (
                                        <div key={i} style={{
                                            width: i === question.decimalPosition ? '20px' : '60px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {i === question.decimalPosition ? (
                                                <span style={{ fontSize: '3rem', fontWeight: '1000', color: '#E74C3C' }}>.</span>
                                            ) : (
                                                <input
                                                    ref={el => inputsRef.current[i] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={userInputs[i] || ''}
                                                    onChange={(e) => handleInput(i, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        fontSize: '2.5rem',
                                                        textAlign: 'center',
                                                        borderRadius: '12px',
                                                        border: '3px solid #34495E',
                                                        background: '#fff',
                                                        color: '#2C3E50',
                                                        fontWeight: '900',
                                                        outline: 'none'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
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

export default DecimalArithmeticGame;
