import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function TimeArithmeticGame({ onBack }) {
    const [operation, setOperation] = useState('add'); // 'add' or 'subtract'
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [question, setQuestion] = useState({ startH: 10, startM: 30, addH: 2, addM: 45 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [userAnswer, setUserAnswer] = useState({ hours: '', minutes: '' });

    useEffect(() => {
        generateQuestion();
    }, []);

    const formatTime = (h, m) => {
        const hours = h % 12 || 12;
        const period = h >= 12 ? 'PM' : 'AM';
        return `${hours}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const generateQuestion = () => {
        const startH = Math.floor(Math.random() * 12) + 1; // 1-12
        const startM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

        const addH = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        const addM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

        let resultH, resultM;

        if (operation === 'add') {
            resultM = startM + addM;
            resultH = startH + addH;

            if (resultM >= 60) {
                resultM -= 60;
                resultH += 1;
            }
        } else {
            // For subtraction, ensure we don't go negative
            const totalStart = startH * 60 + startM;
            const totalSub = addH * 60 + addM;

            if (totalSub > totalStart) {
                // Regenerate to avoid negative time
                setTimeout(generateQuestion, 0);
                return;
            }

            resultM = startM - addM;
            resultH = startH - addH;

            if (resultM < 0) {
                resultM += 60;
                resultH -= 1;
            }

            if (resultH <= 0) {
                resultH += 12;
            }
        }

        const correctAnswer = formatTime(resultH, resultM);

        // Generate options
        let newOptions = [correctAnswer];
        while (newOptions.length < 4) {
            const offsetH = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
            const offsetM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
            const optH = (resultH + offsetH) % 12 || 12;
            const optM = (resultM + offsetM) % 60;
            const opt = formatTime(optH, optM);
            if (!newOptions.includes(opt)) {
                newOptions.push(opt);
            }
        }

        setQuestion({
            startH,
            startM,
            addH,
            addM,
            resultH,
            resultM,
            answer: correctAnswer
        });
        setOptions(newOptions.sort());
        setFeedback(null);
        setUserAnswer({ hours: '', minutes: '' });
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

    const handleOperationChange = (newOp) => {
        setOperation(newOp);
        playSound('click');
        setTimeout(generateQuestion, 0);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
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
                            background: operation === 'add' ? '#27AE60' : 'white',
                            color: operation === 'add' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: operation === 'add' ? '0 4px 0 #1E8449' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        ADD TIME
                    </button>
                    <button
                        onClick={() => handleOperationChange('subtract')}
                        style={{
                            padding: '12px 24px',
                            background: operation === 'subtract' ? '#E74C3C' : 'white',
                            color: operation === 'subtract' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: operation === 'subtract' ? '0 4px 0 #C0392B' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        SUBTRACT TIME
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => handleModeChange('learn')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'learn' ? '#3498DB' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #2980B9' : '0 4px 0 #CBD5E1',
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
                    maxWidth: mode === 'learn' ? '900px' : '700px'
                }}
            >
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn'
                            ? (operation === 'add' ? '⏰ Learn Time Addition' : '⏰ Learn Time Subtraction')
                            : (operation === 'add' ? '⏰ Time Addition Quiz' : '⏰ Time Subtraction Quiz')
                        }
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn' ? 'Conventional Column Method!' : 'Calculate the result!'}
                    </p>
                </div>

                {/* Problem Display */}
                <div style={{
                    background: '#F8FAFC',
                    padding: '30px',
                    borderRadius: '25px',
                    border: '4px solid #E2E8F0',
                    marginBottom: '40px',
                    width: '100%'
                }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textAlign: 'center' }}>
                        {formatTime(question.startH, question.startM)}
                        <span style={{ color: operation === 'add' ? '#27AE60' : '#E74C3C', margin: '0 20px' }}>
                            {operation === 'add' ? '+' : '-'}
                        </span>
                        {question.addH}h {question.addM}m
                    </p>
                </div>

                {mode === 'learn' ? (
                    // Learn Mode: Conventional Column Method
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
                                border: '4px solid #3498DB',
                                fontFamily: 'monospace',
                                display: 'inline-block'
                            }}
                        >
                            {/* Carry/Borrow indicator */}
                            {((operation === 'add' && question.startM + question.addM >= 60) ||
                                (operation === 'subtract' && question.startM - question.addM < 0)) && (
                                    <div style={{ textAlign: 'right', paddingRight: '20px', marginBottom: '5px' }}>
                                        <span style={{ fontSize: '1.5rem', color: '#E74C3C', fontWeight: '900' }}>
                                            {operation === 'add' ? '¹' : '⁻¹'}
                                        </span>
                                    </div>
                                )}

                            {/* First time */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '10px' }}>
                                <div style={{ width: '80px' }}></div>
                                <div style={{ fontSize: '3rem', fontWeight: '1000', color: '#2C3E50', display: 'flex', gap: '15px' }}>
                                    <span style={{ width: '80px', textAlign: 'right' }}>{question.startH}</span>
                                    <span>:</span>
                                    <span style={{ width: '80px' }}>{question.startM.toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Operation and second time */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '10px' }}>
                                <div style={{ width: '80px', fontSize: '3rem', fontWeight: '1000', color: operation === 'add' ? '#27AE60' : '#E74C3C' }}>
                                    {operation === 'add' ? '+' : '-'}
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: '1000', color: '#2C3E50', display: 'flex', gap: '15px' }}>
                                    <span style={{ width: '80px', textAlign: 'right' }}>{question.addH}</span>
                                    <span>:</span>
                                    <span style={{ width: '80px' }}>{question.addM.toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Horizontal line */}
                            <div style={{ borderTop: '4px solid #2C3E50', margin: '10px 0', marginLeft: '120px' }}></div>

                            {/* Result */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '15px' }}>
                                <div style={{ width: '80px' }}></div>
                                <div style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#FF6F00', display: 'flex', gap: '15px' }}>
                                    <span style={{ width: '80px', textAlign: 'right' }}>{question.resultH}</span>
                                    <span>:</span>
                                    <span style={{ width: '80px' }}>{question.resultM.toString().padStart(2, '0')}</span>
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
                                background: '#E8F5E9',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '3px solid #4CAF50',
                                marginBottom: '15px'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2E7D32', marginBottom: '15px' }}>
                                    📌 Minutes Column:
                                </h3>
                                <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1B5E20', margin: 0 }}>
                                    {question.startM} {operation === 'add' ? '+' : '-'} {question.addM} = {
                                        operation === 'add'
                                            ? (question.startM + question.addM >= 60
                                                ? `${question.startM + question.addM} (carry 1) = ${(question.startM + question.addM) - 60}`
                                                : question.startM + question.addM)
                                            : (question.startM - question.addM < 0
                                                ? `${question.startM - question.addM} (borrow 1) = ${(question.startM - question.addM) + 60}`
                                                : question.startM - question.addM)
                                    } minutes
                                </p>
                            </div>

                            <div style={{
                                background: '#E3F2FD',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '3px solid #2196F3'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1565C0', marginBottom: '15px' }}>
                                    📌 Hours Column:
                                </h3>
                                <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0D47A1', margin: 0 }}>
                                    {question.startH} {operation === 'add' ? '+' : '-'} {question.addH}
                                    {operation === 'add' && question.startM + question.addM >= 60 && ' + 1 (carry)'}
                                    {operation === 'subtract' && question.startM - question.addM < 0 && ' - 1 (borrow)'}
                                    {' = '}
                                    {question.resultH} hours
                                </p>
                            </div>
                        </motion.div>

                        {/* Final Answer */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                background: '#FFF3E0',
                                padding: '30px',
                                borderRadius: '25px',
                                border: '4px solid #FF9800',
                                textAlign: 'center',
                                width: '100%',
                                maxWidth: '700px'
                            }}
                        >
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#E65100', marginBottom: '15px' }}>
                                ✨ Final Answer
                            </h3>
                            <p style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#FF6F00', margin: 0 }}>
                                {question.answer}
                            </p>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateQuestion}
                            style={{
                                padding: '20px 60px',
                                background: '#3498DB',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 8px 0 #2980B9',
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
                    // Test Mode: Input + Multiple Choice
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
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
                                        border: '4px solid #E67E22',
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
                                        border: '4px solid #E67E22',
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

                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#94A3B8', marginBottom: '15px' }}>
                                Or select from these options:
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => checkAnswer(opt)}
                                        style={{
                                            padding: '20px',
                                            fontSize: '2rem',
                                            background: 'white',
                                            color: '#2C3E50',
                                            fontWeight: '900',
                                            border: '3px solid #eee',
                                            borderRadius: '20px',
                                            boxShadow: '0 6px 0 #ddd',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
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

export default TimeArithmeticGame;
