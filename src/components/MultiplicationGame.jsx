import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function MultiplicationGame({ onBack }) {
    const [settings, setSettings] = useState({ digits1: 2, digits2: 1 }); // digits1: top number, digits2: multiplier
    const [question, setQuestion] = useState({ top: 0, bottom: 0, answer: 0 });

    // Inputs stored by row type: 'final', 'partial1', 'partial2'
    const [userInputs, setUserInputs] = useState({ final: {}, partial1: {}, partial2: {} });
    const [feedback, setFeedback] = useState(null);

    // Carry State
    const [carryInputs, setCarryInputs] = useState({}); // { 1: '5' } keyed by column logical index (0=ones, 1=tens...)

    const inputsRef = useRef([]);

    useEffect(() => {
        generateQuestion();
    }, [settings]);

    const generateQuestion = () => {
        const min1 = Math.pow(10, settings.digits1 - 1);
        const max1 = Math.pow(10, settings.digits1) - 1;
        const num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;

        const max2 = Math.pow(10, settings.digits2) - 1;
        const min2 = Math.pow(10, settings.digits2 - 1);
        const num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;

        setQuestion({ top: num1, bottom: num2, answer: num1 * num2 });
        setUserInputs({ final: {}, partial1: {}, partial2: {} });
        setCarryInputs({});
        setFeedback(null);
    };

    const handleInput = (type, pos, val) => {
        const digit = val.slice(-1);
        if (!/^\d*$/.test(digit)) return;

        setUserInputs(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [pos]: digit
            }
        }));
    };

    const checkAnswer = () => {
        const multiplierDigits = String(question.bottom).length;
        let isCorrect = false;

        const getNumberFromInputs = (type) => {
            let constructed = "";
            for (let i = 10; i >= 0; i--) {
                if (userInputs[type][i] !== undefined) {
                    constructed += userInputs[type][i];
                } else if (constructed.length > 0) {
                    constructed += "0";
                }
            }
            return parseInt(constructed || "0", 10);
        };

        const finalVal = getNumberFromInputs('final');

        if (multiplierDigits === 1) {
            if (finalVal === question.answer) isCorrect = true;
        } else {
            const onesToken = question.bottom % 10;
            const tensToken = Math.floor(question.bottom / 10);

            const partial1Val = getNumberFromInputs('partial1');
            const partial2Val = getNumberFromInputs('partial2');

            const correctP1 = question.top * onesToken;
            const correctP2 = (question.top * tensToken) * 10;

            if (partial1Val === correctP1 && partial2Val === correctP2 && finalVal === question.answer) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
        }
    };

    const getDigit = (num, i) => {
        const s = String(num);
        const idx = s.length - 1 - i;
        return idx >= 0 ? s[idx] : "";
    };

    const totalCols = Math.max(String(question.answer).length, String(question.top).length + 1) + 1;

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

                    <div style={{ display: 'flex', gap: '15px', background: 'white', padding: '10px 20px', borderRadius: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '2px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '0.9rem' }}>TOP:</span>
                            <select value={settings.digits1} onChange={e => setSettings({ ...settings, digits1: Number(e.target.value) })} style={{ padding: '4px 10px', borderRadius: '10px', border: '2px solid #E2E8F0', fontWeight: '900', color: '#1E293B', cursor: 'pointer', outline: 'none' }}>
                                {[1, 2, 3].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '0.9rem' }}>BOTTOM:</span>
                            <select value={settings.digits2} onChange={e => setSettings({ ...settings, digits2: Number(e.target.value) })} style={{ padding: '4px 10px', borderRadius: '10px', border: '2px solid #E2E8F0', fontWeight: '900', color: '#1E293B', cursor: 'pointer', outline: 'none' }}>
                                {[1, 2].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
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
                    maxWidth: '650px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(25px)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>✖ Multiplication</h1>
                    <p style={{ fontSize: '1rem', fontWeight: '800', color: '#64748B', marginTop: '8px' }}>🎯 Fill in the partial products and total!</p>
                </div>

                <div style={{ background: 'white', padding: '30px 40px', borderRadius: '30px', border: '3px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {/* Carry Row */}
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '10px', marginRight: '5px' }}>
                        {Array.from({ length: totalCols }).map((_, i) => (
                            <div key={i} style={{ width: '70px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {i > 0 && i < totalCols && (
                                    <input
                                        type="text" maxLength="1"
                                        value={carryInputs[i] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.slice(-1);
                                            if (/^\d*$/.test(val)) setCarryInputs(prev => ({ ...prev, [i]: val }));
                                        }}
                                        placeholder="c"
                                        style={{
                                            width: '40px', height: '40px', background: '#FEF3C7',
                                            border: '2px dashed #FDE68A', borderRadius: '10px',
                                            textAlign: 'center', fontSize: '1.2rem', fontWeight: '900',
                                            color: '#92400E', outline: 'none'
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                        <div style={{ width: '60px' }}></div>
                    </div>

                    {/* Top Number */}
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                        {Array.from({ length: totalCols }).map((_, i) => (
                            <div key={i} style={{ width: '70px', fontSize: '3rem', fontWeight: '800', color: '#1E293B', textAlign: 'center' }}>
                                {getDigit(question.top, i)}
                            </div>
                        ))}
                        <div style={{ width: '60px' }}></div>
                    </div>

                    {/* Bottom Number */}
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '5px' }}>
                        {Array.from({ length: totalCols }).map((_, i) => (
                            <div key={i} style={{ width: '70px', fontSize: '3rem', fontWeight: '800', color: '#1E293B', textAlign: 'center' }}>
                                {getDigit(question.bottom, i)}
                            </div>
                        ))}
                        <div style={{ width: '60px', fontSize: '2.5rem', fontWeight: '900', color: '#F97316', textAlign: 'center' }}>✖</div>
                    </div>

                    {/* First Divider */}
                    <div style={{ width: `calc(${totalCols * 70}px + 60px)`, height: '4px', background: '#1E293B', margin: '15px 0', borderRadius: '5px' }}></div>

                    {/* Multiplication Body */}
                    {settings.digits2 === 1 ? (
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                            {Array.from({ length: totalCols }).map((_, i) => {
                                const isRelevant = i < String(question.answer).length;
                                return (
                                    <div key={i} style={{ width: '70px', display: 'flex', justifyContent: 'center' }}>
                                        {isRelevant ? (
                                            <input
                                                type="text" inputMode="numeric"
                                                value={userInputs.final[i] || ''}
                                                onChange={(e) => handleInput('final', i, e.target.value)}
                                                style={{ width: '55px', height: '65px', fontSize: '2.5rem', textAlign: 'center', borderRadius: '12px', border: feedback === 'incorrect' ? '3px solid #EF4444' : feedback === 'correct' ? '3px solid #10B981' : '3px solid #334155', background: '#fff', color: '#1E293B', fontWeight: '900', outline: 'none' }}
                                            />
                                        ) : <div style={{ width: '70px' }} />}
                                    </div>
                                );
                            })}
                            <div style={{ width: '60px' }}></div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
                            {/* Partial 1 */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                                {Array.from({ length: totalCols }).map((_, i) => {
                                    const isRelevant = i < String(question.top * (question.bottom % 10)).length;
                                    return (
                                        <div key={i} style={{ width: '70px', display: 'flex', justifyContent: 'center' }}>
                                            {isRelevant ? (
                                                <input
                                                    type="text" inputMode="numeric"
                                                    value={userInputs.partial1[i] || ''}
                                                    onChange={(e) => handleInput('partial1', i, e.target.value)}
                                                    style={{ width: '55px', height: '60px', fontSize: '2.2rem', textAlign: 'center', borderRadius: '12px', border: '2px solid #CBD5E1', background: '#F8FAFC', fontWeight: '900', outline: 'none' }}
                                                />
                                            ) : <div style={{ width: '70px' }} />}
                                        </div>
                                    );
                                })}
                                <div style={{ width: '60px' }}></div>
                            </div>

                            {/* Partial 2 */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                                {Array.from({ length: totalCols }).map((_, i) => {
                                    const p2Val = question.top * Math.floor(question.bottom / 10);
                                    const isRelevant = i > 0 && i <= String(p2Val).length;
                                    const isShiftZero = i === 0;

                                    return (
                                        <div key={i} style={{ width: '70px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                            {isShiftZero ? (
                                                <div style={{ width: '55px', height: '60px', border: '2px dashed #CBD5E1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: '900', color: '#94A3B8', background: '#F1F5F9' }}>0</div>
                                            ) : isRelevant ? (
                                                <input
                                                    type="text" inputMode="numeric"
                                                    value={userInputs.partial2[i] || ''}
                                                    onChange={(e) => handleInput('partial2', i, e.target.value)}
                                                    style={{ width: '55px', height: '60px', fontSize: '2.2rem', textAlign: 'center', borderRadius: '12px', border: '2px solid #CBD5E1', background: '#F8FAFC', fontWeight: '900', outline: 'none' }}
                                                />
                                            ) : <div style={{ width: '70px' }} />}
                                        </div>
                                    );
                                })}
                                <div style={{ width: '60px', fontSize: '2rem', fontWeight: '1000', color: '#3B82F6', textAlign: 'center' }}>➕</div>
                            </div>

                            <div style={{ width: `calc(${totalCols * 70}px + 60px)`, height: '5px', background: '#1E293B', margin: '5px 0', borderRadius: '5px' }}></div>

                            {/* Final Sum */}
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                                {Array.from({ length: totalCols }).map((_, i) => {
                                    const isRelevant = i < String(question.answer).length;
                                    return (
                                        <div key={i} style={{ width: '70px', display: 'flex', justifyContent: 'center' }}>
                                            {isRelevant ? (
                                                <input
                                                    type="text" inputMode="numeric"
                                                    value={userInputs.final[i] || ''}
                                                    onChange={(e) => handleInput('final', i, e.target.value)}
                                                    style={{ width: '55px', height: '65px', fontSize: '2.5rem', textAlign: 'center', borderRadius: '12px', border: feedback === 'incorrect' ? '3px solid #EF4444' : feedback === 'correct' ? '3px solid #10B981' : '3px solid #334155', background: '#fff', color: '#1E293B', fontWeight: '900', outline: 'none' }}
                                                />
                                            ) : <div style={{ width: '70px' }} />}
                                        </div>
                                    );
                                })}
                                <div style={{ width: '60px' }}></div>
                            </div>
                        </div>
                    )}
                </div>

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
                                {feedback === 'correct' ? '🌟 BRILLIANT!' : '❌ TRY AGAIN!'}
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
            </motion.div>
        </div>
    );
}

export default MultiplicationGame;
