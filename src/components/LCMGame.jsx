import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function LCMGame({ onBack }) {
    const [topic, setTopic] = useState('lcm'); // 'lcm' or 'hcf'
    const [mode, setMode] = useState('learn'); // 'learn' or 'test'
    const [question, setQuestion] = useState({ num1: 4, num2: 6 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        generateQuestion();
    }, []);

    const gcd = (a, b) => {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    };

    const lcm = (a, b) => {
        return (a * b) / gcd(a, b);
    };

    const getFactors = (num) => {
        const factors = [];
        for (let i = 1; i <= num; i++) {
            if (num % i === 0) {
                factors.push(i);
            }
        }
        return factors;
    };

    const generateQuestion = () => {
        // Generate two numbers between 2 and 12
        const num1 = Math.floor(Math.random() * 9) + 2; // 2-10
        const num2 = Math.floor(Math.random() * 9) + 2; // 2-10

        // Ensure they're not equal
        const n1 = num1;
        const n2 = num1 === num2 ? num2 + 1 : num2;

        const correctLCM = lcm(n1, n2);
        const correctHCF = gcd(n1, n2);
        const correctAnswer = topic === 'lcm' ? correctLCM : correctHCF;

        // Generate options
        let newOptions = [correctAnswer];

        if (topic === 'lcm') {
            while (newOptions.length < 4) {
                const offset = Math.floor(Math.random() * 20) - 10;
                const opt = Math.max(Math.max(n1, n2), correctLCM + offset);
                if (!newOptions.includes(opt) && opt > 0) {
                    newOptions.push(opt);
                }
            }
        } else {
            // HCF options
            const factors1 = getFactors(n1);
            const factors2 = getFactors(n2);
            const commonFactors = factors1.filter(f => factors2.includes(f));

            // Add some common factors as distractors
            for (let factor of commonFactors) {
                if (factor !== correctHCF && newOptions.length < 4) {
                    newOptions.push(factor);
                }
            }

            // Fill remaining with other factors
            while (newOptions.length < 4) {
                const factor = factors1[Math.floor(Math.random() * factors1.length)];
                if (!newOptions.includes(factor)) {
                    newOptions.push(factor);
                }
            }
        }

        setQuestion({ num1: n1, num2: n2, answer: correctAnswer, lcm: correctLCM, hcf: correctHCF });
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

    const handleTopicChange = (newTopic) => {
        setTopic(newTopic);
        playSound('click');
        // Regenerate question immediately when topic changes
        setTimeout(() => {
            const correctAnswer = newTopic === 'lcm' ? question.lcm : question.hcf;

            let newOptions = [correctAnswer];

            if (newTopic === 'lcm') {
                while (newOptions.length < 4) {
                    const offset = Math.floor(Math.random() * 20) - 10;
                    const opt = Math.max(Math.max(question.num1, question.num2), question.lcm + offset);
                    if (!newOptions.includes(opt) && opt > 0) {
                        newOptions.push(opt);
                    }
                }
            } else {
                const factors1 = getFactors(question.num1);
                const factors2 = getFactors(question.num2);
                const commonFactors = factors1.filter(f => factors2.includes(f));

                for (let factor of commonFactors) {
                    if (factor !== correctAnswer && newOptions.length < 4) {
                        newOptions.push(factor);
                    }
                }

                while (newOptions.length < 4) {
                    const factor = factors1[Math.floor(Math.random() * factors1.length)];
                    if (!newOptions.includes(factor)) {
                        newOptions.push(factor);
                    }
                }
            }

            setQuestion(prev => ({ ...prev, answer: correctAnswer }));
            setOptions(newOptions.sort((a, b) => a - b));
            setFeedback(null);
            setUserAnswer('');
        }, 0);
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

    // Generate multiples for LCM visualization (memoized for performance)
    const multiples1 = useMemo(() => {
        const multiples = [];
        for (let i = 1; i <= 12; i++) {
            multiples.push(question.num1 * i);
        }
        return multiples;
    }, [question.num1]);

    const multiples2 = useMemo(() => {
        const multiples = [];
        for (let i = 1; i <= 12; i++) {
            multiples.push(question.num2 * i);
        }
        return multiples;
    }, [question.num2]);

    const commonMultiples = useMemo(() => {
        return multiples1.filter(m => multiples2.includes(m));
    }, [multiples1, multiples2]);

    // Generate factors for HCF visualization (memoized for performance)
    const factors1 = useMemo(() => {
        const factors = [];
        for (let i = 1; i <= question.num1; i++) {
            if (question.num1 % i === 0) {
                factors.push(i);
            }
        }
        return factors;
    }, [question.num1]);

    const factors2 = useMemo(() => {
        const factors = [];
        for (let i = 1; i <= question.num2; i++) {
            if (question.num2 % i === 0) {
                factors.push(i);
            }
        }
        return factors;
    }, [question.num2]);

    const commonFactors = useMemo(() => {
        return factors1.filter(f => factors2.includes(f));
    }, [factors1, factors2]);

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
                        onClick={() => handleTopicChange('lcm')}
                        style={{
                            padding: '12px 24px',
                            background: topic === 'lcm' ? '#3498DB' : 'white',
                            color: topic === 'lcm' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: topic === 'lcm' ? '0 4px 0 #2980B9' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        LCM
                    </button>
                    <button
                        onClick={() => handleTopicChange('hcf')}
                        style={{
                            padding: '12px 24px',
                            background: topic === 'hcf' ? '#E74C3C' : 'white',
                            color: topic === 'hcf' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: topic === 'hcf' ? '0 4px 0 #C0392B' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        HCF
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => handleModeChange('learn')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'learn' ? '#8E44AD' : 'white',
                            color: mode === 'learn' ? 'white' : '#2C3E50',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'learn' ? '0 4px 0 #71368A' : '0 4px 0 #CBD5E1',
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
                            ? (topic === 'lcm' ? '🔢 Learn LCM' : '🧮 Learn HCF')
                            : (topic === 'lcm' ? '🔢 LCM Challenge' : '🧮 HCF Challenge')
                        }
                    </h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'learn'
                            ? (topic === 'lcm' ? 'Find the Least Common Multiple!' : 'Find the Highest Common Factor!')
                            : (topic === 'lcm' ? 'Calculate the LCM!' : 'Calculate the HCF!')
                        }
                    </p>
                </div>

                {/* Question Display */}
                <div style={{
                    background: '#F8FAFC',
                    padding: '25px 40px',
                    borderRadius: '25px',
                    border: '4px solid #E2E8F0',
                    marginBottom: '40px'
                }}>
                    <p style={{ fontSize: '3rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textAlign: 'center' }}>
                        {topic === 'lcm' ? 'LCM' : 'HCF'} of <span style={{ color: '#3498DB' }}>{question.num1}</span> and <span style={{ color: '#E74C3C' }}>{question.num2}</span>
                    </p>
                </div>

                {mode === 'learn' ? (
                    topic === 'lcm' ? (
                        // LCM Learn Mode: Show multiples
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3498DB', marginBottom: '15px' }}>
                                    Multiples of {question.num1}:
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {multiples1.map((mult, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '12px 18px',
                                                background: commonMultiples.includes(mult) ? '#27AE60' : '#3498DB',
                                                color: 'white',
                                                fontWeight: '900',
                                                fontSize: '1.5rem',
                                                borderRadius: '12px',
                                                boxShadow: commonMultiples.includes(mult) ? '0 4px 0 #1E8449' : '0 4px 0 #2980B9',
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {mult}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#E74C3C', marginBottom: '15px' }}>
                                    Multiples of {question.num2}:
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {multiples2.map((mult, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '12px 18px',
                                                background: commonMultiples.includes(mult) ? '#27AE60' : '#E74C3C',
                                                color: 'white',
                                                fontWeight: '900',
                                                fontSize: '1.5rem',
                                                borderRadius: '12px',
                                                boxShadow: commonMultiples.includes(mult) ? '0 4px 0 #1E8449' : '0 4px 0 #C0392B',
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {mult}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                background: '#ECFDF5',
                                padding: '20px',
                                borderRadius: '20px',
                                border: '3px solid #27AE60'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#27AE60', marginBottom: '10px' }}>
                                    Common Multiples (Green):
                                </h3>
                                <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1E8449', margin: 0 }}>
                                    {commonMultiples.slice(0, 5).join(', ')}...
                                </p>
                                <p style={{ fontSize: '1.8rem', fontWeight: '1000', color: '#27AE60', marginTop: '15px', margin: 0 }}>
                                    The smallest is: <span style={{ fontSize: '2.5rem' }}>{question.answer}</span>
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generateQuestion}
                                style={{
                                    padding: '20px 60px',
                                    background: '#8E44AD',
                                    color: 'white',
                                    borderRadius: '30px',
                                    border: 'none',
                                    boxShadow: '0 8px 0 #71368A',
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
                        // HCF Learn Mode: Show factors
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3498DB', marginBottom: '15px' }}>
                                    Factors of {question.num1}:
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {factors1.map((factor, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '12px 18px',
                                                background: commonFactors.includes(factor) ? '#27AE60' : '#3498DB',
                                                color: 'white',
                                                fontWeight: '900',
                                                fontSize: '1.5rem',
                                                borderRadius: '12px',
                                                boxShadow: commonFactors.includes(factor) ? '0 4px 0 #1E8449' : '0 4px 0 #2980B9',
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {factor}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#E74C3C', marginBottom: '15px' }}>
                                    Factors of {question.num2}:
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {factors2.map((factor, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '12px 18px',
                                                background: commonFactors.includes(factor) ? '#27AE60' : '#E74C3C',
                                                color: 'white',
                                                fontWeight: '900',
                                                fontSize: '1.5rem',
                                                borderRadius: '12px',
                                                boxShadow: commonFactors.includes(factor) ? '0 4px 0 #1E8449' : '0 4px 0 #C0392B',
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {factor}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                background: '#ECFDF5',
                                padding: '20px',
                                borderRadius: '20px',
                                border: '3px solid #27AE60'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#27AE60', marginBottom: '10px' }}>
                                    Common Factors (Green):
                                </h3>
                                <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1E8449', margin: 0 }}>
                                    {commonFactors.join(', ')}
                                </p>
                                <p style={{ fontSize: '1.8rem', fontWeight: '1000', color: '#27AE60', marginTop: '15px', margin: 0 }}>
                                    The highest is: <span style={{ fontSize: '2.5rem' }}>{question.answer}</span>
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generateQuestion}
                                style={{
                                    padding: '20px 60px',
                                    background: '#8E44AD',
                                    color: 'white',
                                    borderRadius: '30px',
                                    border: 'none',
                                    boxShadow: '0 8px 0 #71368A',
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
                    )
                ) : (
                    // Test Mode: Input + Multiple Choice (same for both LCM and HCF)
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkAnswer(userAnswer)}
                                placeholder="Your Answer"
                                style={{
                                    width: '200px', padding: '20px', fontSize: '3rem',
                                    fontWeight: '1000', textAlign: 'center', borderRadius: '20px',
                                    border: '4px solid #E67E22',
                                    background: 'white',
                                    outline: 'none', color: '#2C3E50'
                                }}
                            />
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

export default LCMGame;
