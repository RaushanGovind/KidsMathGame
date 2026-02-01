import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function UnitaryMethodGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [question, setQuestion] = useState({ items: '', quantity1: 5, cost1: 10, quantity2: 8 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [itemTypes, setItemTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || \'http://localhost:8000\';
        fetch(`${API_URL}/api/content/unitary_method`)
            .then(res => res.json())
            .then(data => {
                setItemTypes(data.item_types);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load unitary method data", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!loading && itemTypes.length > 0) {
            generateQuestion();
        }
    }, [loading, itemTypes]);

    const generateQuestion = () => {
        if (itemTypes.length === 0) return;
        const item = itemTypes[Math.floor(Math.random() * itemTypes.length)];

        // Generate quantities
        const qty1 = Math.floor(Math.random() * 8) + 2; // 2-10
        const unitCost = Math.floor(Math.random() * 9) + 1; // 1-10
        const cost1 = qty1 * unitCost;
        const qty2 = Math.floor(Math.random() * 8) + 2; // 2-10

        const correctAnswer = qty2 * unitCost;

        // Generate options for test mode
        let newOptions = [correctAnswer];
        while (newOptions.length < 4) {
            const offset = Math.floor(Math.random() * 20) - 10;
            const opt = Math.max(1, correctAnswer + offset);
            if (!newOptions.includes(opt)) {
                newOptions.push(opt);
            }
        }

        setQuestion({
            items: item.name,
            icon: item.icon,
            quantity1: qty1,
            cost1: cost1,
            quantity2: qty2,
            unitCost: unitCost,
            answer: correctAnswer
        });
        setOptions(newOptions.sort((a, b) => a - b));
        setFeedback(null);
        setUserAnswer('');
    };

    const checkAnswer = (selected) => {
        if (parseInt(selected) === question.answer) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        playSound('click');
    };

    const handleInputChange = (value) => {
        const digit = value.toString().replace(/\D/g, '');
        setUserAnswer(digit);
        if (feedback) setFeedback(null);
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading...</div>;

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
                    maxWidth: mode === 'learn' ? '900px' : '700px'
                }}
            >
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>
                        {mode === 'learn' ? '💡 Learn Unitary Method' : '🎯 Unitary Method Quiz'}
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn' ? 'Step-by-step solution!' : 'Solve the problem!'}
                    </p>
                </div>

                {/* Problem Statement */}
                <div style={{
                    background: '#F8FAFC',
                    padding: '30px',
                    borderRadius: '25px',
                    border: '4px solid #E2E8F0',
                    marginBottom: '40px',
                    width: '100%'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '4rem' }}>{question.icon}</span>
                    </div>
                    <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2C3E50', margin: 0, textAlign: 'center', lineHeight: '1.6' }}>
                        If <span style={{ color: '#3498DB' }}>{question.quantity1}</span> {question.items} cost{' '}
                        <span style={{ color: '#E74C3C' }}>${question.cost1}</span>,
                    </p>
                    <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2C3E50', margin: '10px 0 0 0', textAlign: 'center' }}>
                        what is the cost of <span style={{ color: '#16A085' }}>{question.quantity2}</span> {question.items}?
                    </p>
                </div>

                {mode === 'learn' ? (
                    // Learn Mode: Step-by-step solution
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                background: '#E8F5E9',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '3px solid #4CAF50'
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2E7D32', marginBottom: '15px' }}>
                                📌 Step 1: Find cost of 1 {question.items.slice(0, -1)}
                            </h3>
                            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1B5E20', margin: 0 }}>
                                Cost of 1 {question.items.slice(0, -1)} = Total Cost ÷ Quantity
                            </p>
                            <p style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2E7D32', margin: '10px 0 0 0' }}>
                                = ${question.cost1} ÷ {question.quantity1} = <span style={{ fontSize: '2rem', color: '#1B5E20' }}>${question.unitCost}</span>
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                background: '#E3F2FD',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '3px solid #2196F3'
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1565C0', marginBottom: '15px' }}>
                                📌 Step 2: Find cost of {question.quantity2} {question.items}
                            </h3>
                            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0D47A1', margin: 0 }}>
                                Cost of {question.quantity2} {question.items} = Unit Cost × Quantity
                            </p>
                            <p style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1565C0', margin: '10px 0 0 0' }}>
                                = ${question.unitCost} × {question.quantity2} = <span style={{ fontSize: '2rem', color: '#0D47A1' }}>${question.answer}</span>
                            </p>
                        </motion.div>

                        {/* Answer */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                background: '#FFF3E0',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '4px solid #FF9800',
                                textAlign: 'center'
                            }}
                        >
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#E65100', marginBottom: '10px' }}>
                                ✨ Final Answer
                            </h3>
                            <p style={{ fontSize: '3rem', fontWeight: '1000', color: '#FF6F00', margin: 0 }}>
                                ${question.answer}
                            </p>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateQuestion}
                            style={{
                                padding: '20px 60px',
                                background: '#16A085',
                                color: 'white',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 8px 0 #138D75',
                                fontSize: '2rem',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                alignSelf: 'center'
                            }}
                        >
                            🔄 NEW PROBLEM
                        </motion.button>
                    </div>
                ) : (
                    // Test Mode: Input + Multiple Choice
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#2C3E50' }}>$</span>
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkAnswer(userAnswer)}
                                    placeholder="?"
                                    style={{
                                        width: '180px', padding: '20px', fontSize: '3rem',
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
                                onClick={() => userAnswer && checkAnswer(userAnswer)}
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
                                            fontSize: '2.5rem',
                                            background: 'white',
                                            color: '#2C3E50',
                                            fontWeight: '900',
                                            border: '3px solid #eee',
                                            borderRadius: '20px',
                                            boxShadow: '0 6px 0 #ddd',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ${opt}
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

export default UnitaryMethodGame;
