import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MultiplicationGame({ onBack }) {
    const [settings, setSettings] = useState({ digits1: 2, digits2: 1 }); // digits1: top number, digits2: multiplier
    const [question, setQuestion] = useState({ top: 0, bottom: 0, answer: 0 });

    // Inputs stored by row type: 'final', 'partial1', 'partial2'
    const [userInputs, setUserInputs] = useState({ final: {}, partial1: {}, partial2: {} });
    const [feedback, setFeedback] = useState(null);

    // Carry State
    const [carryInputs, setCarryInputs] = useState({}); // { 1: '5' } keyed by column logical index (0=ones, 1=tens...)

    useEffect(() => {
        generateQuestion();
    }, [settings]);

    const generateQuestion = () => {
        const min1 = Math.pow(10, settings.digits1 - 1);
        const max1 = Math.pow(10, settings.digits1) - 1;
        const num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;

        const min2 = Math.pow(10, settings.digits2 - 1);
        const max2 = Math.pow(10, settings.digits2) - 1;
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
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
    };

    const getDigit = (num, i) => {
        const s = String(num);
        const idx = s.length - 1 - i;
        return idx >= 0 ? s[idx] : "";
    };

    const totalCols = String(question.answer).length + 1;

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button onClick={onBack} style={{
                    padding: '12px 24px', background: 'white', color: '#2C3E50',
                    fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px',
                    boxShadow: '0 4px 0 #bdc3c7', border: '2px solid #ecf0f1'
                }}>⬅ MENU</button>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderRadius: '40px', width: '100%', maxWidth: '750px'
                }}
            >
                <div style={{
                    width: '100%', display: 'flex', justifyContent: 'center', gap: '30px',
                    marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.8)',
                    borderRadius: '25px', border: '3px solid white', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '900', color: '#2C3E50' }}>TOP:</span>
                        <select value={settings.digits1} onChange={e => setSettings({ ...settings, digits1: Number(e.target.value) })} style={{ padding: '8px 12px', borderRadius: '12px', border: '2px solid #eee', fontWeight: '900' }}>
                            {[1, 2, 3].map(d => <option key={d} value={d}>{d} Digits</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '900', color: '#2C3E50' }}>BOTTOM:</span>
                        <select value={settings.digits2} onChange={e => setSettings({ ...settings, digits2: Number(e.target.value) })} style={{ padding: '8px 12px', borderRadius: '12px', border: '2px solid #eee', fontWeight: '900' }}>
                            {[1, 2].map(d => <option key={d} value={d}>{d} Digits</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px', marginBottom: '10px' }}>
                        {Array.from({ length: totalCols }).map((_, i) => (
                            <div key={i} style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                                {i > 0 && i < totalCols && (
                                    <input
                                        type="text" maxLength="1"
                                        value={carryInputs[i] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.slice(-1);
                                            if (/^\d*$/.test(val)) setCarryInputs(prev => ({ ...prev, [i]: val }));
                                        }}
                                        style={{
                                            width: '40px', height: '40px', background: '#F1C40F',
                                            border: '2px solid white', borderRadius: '10px',
                                            textAlign: 'center', fontSize: '1.3rem', fontWeight: '900',
                                            color: '#2C3E50', boxShadow: '0 3px 0 rgba(0,0,0,0.1)', outline: 'none'
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px' }}>
                        {Array.from({ length: totalCols }).map((_, i) => (
                            <div key={i} style={{ width: '80px', textAlign: 'center', fontSize: '5.5rem', fontWeight: '900', color: '#2C3E50', lineHeight: '1' }}>
                                {getDigit(question.top, i)}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px', borderBottom: '8px solid #2C3E50', paddingBottom: '20px', marginBottom: '20px', position: 'relative' }}>
                        {Array.from({ length: totalCols }).map((_, i) => {
                            const digit = getDigit(question.bottom, i);
                            const isSignCol = i === String(question.bottom).length;
                            return (
                                <div key={i} style={{ width: '80px', textAlign: 'center', fontSize: '5.5rem', fontWeight: '900', color: '#2C3E50', lineHeight: '1', position: 'relative' }}>
                                    {digit}
                                    {isSignCol && <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '5rem', color: '#E74C3C' }}>×</div>}
                                </div>
                            );
                        })}
                    </div>

                    {settings.digits2 === 1 ? (
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px' }}>
                            {Array.from({ length: totalCols }).map((_, i) => {
                                const isRelevant = i < String(question.answer).length;
                                return (
                                    <div key={i} style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                                        {isRelevant ? (
                                            <motion.input
                                                whileFocus={{ scale: 1.05 }}
                                                type="text" inputMode="numeric"
                                                value={userInputs.final[i] || ''}
                                                onChange={(e) => handleInput('final', i, e.target.value)}
                                                style={{
                                                    width: '80px', height: '80px', fontSize: '3.5rem', textAlign: 'center',
                                                    borderRadius: '20px', border: '4px solid #34495E',
                                                    background: '#fff', color: '#2C3E50', fontWeight: '900',
                                                    boxShadow: '0 8px 0 #eee, inset 0 4px 8px rgba(0,0,0,0.05)', outline: 'none'
                                                }}
                                            />
                                        ) : <div style={{ width: '80px' }} />}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px' }}>
                                {Array.from({ length: totalCols }).map((_, i) => {
                                    const isRelevant = i < String(question.top * (question.bottom % 10)).length;
                                    return (
                                        <div key={i} style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                                            {isRelevant ? (
                                                <input
                                                    type="text" inputMode="numeric"
                                                    value={userInputs.partial1[i] || ''}
                                                    onChange={(e) => handleInput('partial1', i, e.target.value)}
                                                    style={{ width: '70px', height: '70px', fontSize: '3rem', textAlign: 'center', borderRadius: '15px', border: '3px solid #bdc3c7', background: '#f8f9fa', fontWeight: '900', outline: 'none' }}
                                                />
                                            ) : <div style={{ width: '80px' }} />}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px', position: 'relative' }}>
                                {Array.from({ length: totalCols }).map((_, i) => {
                                    const p2Val = question.top * Math.floor(question.bottom / 10);
                                    const isRelevant = i > 0 && i <= String(p2Val).length;
                                    const isShiftZero = i === 0;
                                    const isPlusCol = i === totalCols - 1;

                                    return (
                                        <div key={i} style={{ width: '80px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                            {isPlusCol && <div style={{ position: 'absolute', right: '100%', fontSize: '4rem', fontWeight: '900', paddingRight: '20px' }}>+</div>}
                                            {isShiftZero ? (
                                                <div style={{ width: '70px', height: '70px', border: '3px dashed #bdc3c7', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '900', color: '#bdc3c7' }}>0</div>
                                            ) : isRelevant ? (
                                                <input
                                                    type="text" inputMode="numeric"
                                                    value={userInputs.partial2[i] || ''}
                                                    onChange={(e) => handleInput('partial2', i, e.target.value)}
                                                    style={{ width: '70px', height: '70px', fontSize: '3rem', textAlign: 'center', borderRadius: '15px', border: '3px solid #bdc3c7', background: '#f8f9fa', fontWeight: '900', outline: 'none' }}
                                                />
                                            ) : <div style={{ width: '80px' }} />}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ width: '100%', height: '8px', background: '#2C3E50', borderRadius: '4px', margin: '10px 0' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '15px' }}>
                                {Array.from({ length: totalCols }).map((_, i) => {
                                    const isRelevant = i < String(question.answer).length;
                                    return (
                                        <div key={i} style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                                            {isRelevant ? (
                                                <motion.input
                                                    whileFocus={{ scale: 1.05 }}
                                                    type="text" inputMode="numeric"
                                                    value={userInputs.final[i] || ''}
                                                    onChange={(e) => handleInput('final', i, e.target.value)}
                                                    style={{ width: '80px', height: '80px', fontSize: '3.5rem', textAlign: 'center', borderRadius: '20px', border: '4px solid #34495E', background: '#fff', color: '#2C3E50', fontWeight: '900', boxShadow: '0 8px 0 #eee, inset 0 4px 8px rgba(0,0,0,0.05)', outline: 'none' }}
                                                />
                                            ) : <div style={{ width: '80px' }} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ height: '80px', display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div key={feedback} initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} style={{ fontSize: '2.5rem', fontWeight: '900', color: feedback === 'correct' ? '#27AE60' : '#E74C3C' }}>
                                {feedback === 'correct' ? '🌟 BRILLIANT!' : '❌ TRY AGAIN!'}
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
                            padding: '20px 80px', fontSize: '2.2rem', background: '#27AE60', color: 'white',
                            fontWeight: '900', borderRadius: '30px', border: 'none',
                            boxShadow: '0 10px 0 #219150, 0 15px 30px rgba(0,0,0,0.2)', cursor: 'pointer'
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
                            padding: '20px 80px', fontSize: '2.2rem', background: '#F1C40F', color: '#2C3E50',
                            fontWeight: '900', borderRadius: '30px', border: 'none',
                            boxShadow: '0 10px 0 #D4AC0D, 0 15px 30px rgba(0,0,0,0.2)', cursor: 'pointer'
                        }}
                    >
                        CHECK ANSWER
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

export default MultiplicationGame;
