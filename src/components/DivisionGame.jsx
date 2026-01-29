import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DivisionGame({ onBack }) {
    const [settings, setSettings] = useState({ dividendDigits: 3, divisorDigits: 1 });
    const [question, setQuestion] = useState(null);
    const [userInputs, setUserInputs] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [wrongKeys, setWrongKeys] = useState([]);

    const colWidth = 50;
    const rowHeight = 90;

    useEffect(() => {
        generateQuestion();
    }, [settings]);

    const generateQuestion = () => {
        const divMin = Math.pow(10, settings.dividendDigits - 1);
        const divMax = Math.pow(10, settings.dividendDigits) - 1;
        const dividend = Math.floor(Math.random() * (divMax - divMin + 1)) + divMin;

        const dMin = Math.pow(10, settings.divisorDigits - 1);
        const dMax = Math.pow(10, settings.divisorDigits) - 1;
        const divisor = Math.floor(Math.random() * (dMax - dMin + 1)) + dMin;

        const steps = [];
        const dividendStr = String(dividend);
        let currentWorkingNum = "";
        let pointer = 0;

        while (pointer < dividendStr.length) {
            currentWorkingNum += dividendStr[pointer];
            let workingInt = parseInt(currentWorkingNum);

            if (workingInt < divisor && pointer < dividendStr.length - 1 && steps.length === 0) {
                pointer++;
                continue;
            }

            const q = Math.floor(workingInt / divisor);
            const p = q * divisor;
            const r = workingInt - p;

            steps.push({
                quotientDigit: String(q),
                productStr: String(p),
                remainderStr: String(r),
                pointer: pointer
            });

            currentWorkingNum = String(r);
            pointer++;
        }

        setQuestion({ dividend, divisor, steps, dividendStr });
        setUserInputs({});
        setFeedback(null);
        setWrongKeys([]);
    };

    const handleInput = (key, val) => {
        const digit = val.toString().trim().slice(-1).replace(/\D/g, '');
        setUserInputs(prev => ({ ...prev, [key]: digit }));
        if (wrongKeys.includes(key)) {
            setWrongKeys(prev => prev.filter(k => k !== key));
        }
    };

    const checkAnswer = () => {
        let currentWrong = [];

        for (let i = 0; i < question.steps.length; i++) {
            const step = question.steps[i];

            // 1. Quotient Check
            const uQ = (userInputs[`q-${i}`] || "").toString().trim();
            if (uQ !== step.quotientDigit) currentWrong.push(`q-${i}`);

            // 2. Product Digits Check
            for (let j = 0; j < step.productStr.length; j++) {
                const uP = (userInputs[`p-${i}-${j}`] || "").toString().trim();
                if (uP !== step.productStr[j]) currentWrong.push(`p-${i}-${j}`);
            }

            // 3. Remainder Digits Check
            for (let j = 0; j < step.remainderStr.length; j++) {
                const uR = (userInputs[`r-${i}-${j}`] || "").toString().trim();
                if (uR !== step.remainderStr[j]) currentWrong.push(`r-${i}-${j}`);
            }

            // 4. Bring Down Digit Check
            if (i < question.steps.length - 1) {
                const nextDigit = question.dividendStr[question.steps[i + 1].pointer];
                const uB = (userInputs[`b-${i}`] || "").toString().trim();
                if (uB !== String(nextDigit)) currentWrong.push(`b-${i}`);
            }
        }

        if (currentWrong.length === 0) {
            setFeedback('correct');
            setWrongKeys([]);
        } else {
            setFeedback('incorrect');
            setWrongKeys(currentWrong);
            // Don't auto-clear feedback instantly so they can see the red marks
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    if (!question) return null;

    const divisorStr = String(question.divisor);
    const divisorCols = divisorStr.length;
    const dividendCols = question.dividendStr.length;

    // Column Index Mapping
    const dividendStartCol = divisorCols + 2;
    const bracketRightCol = dividendStartCol + dividendCols + 1;
    const quotientStartCol = bracketRightCol + 1;
    const totalCols = quotientStartCol + question.steps.length;

    const getInputStyle = (key, baseType) => {
        const isWrong = wrongKeys.includes(key);
        let style = {
            width: '40px', height: '40px',
            textAlign: 'center', fontSize: '1.5rem', fontWeight: '900',
            outline: 'none', borderRadius: '10px', transition: 'border 0.2s',
            border: isWrong ? '3px solid #EF4444' : (baseType === 'product' ? '2px solid #E2E8F0' : '2px solid #334155'),
            background: isWrong ? '#FFF1F2' : (baseType === 'remainder' ? '#F1F5F9' : 'white'),
            color: isWrong ? '#B91C1C' : '#1E293B'
        };

        if (baseType === 'quotient') {
            style = {
                ...style, width: '45px', height: '45px',
                background: isWrong ? '#FFF1F2' : '#F1C40F',
                border: isWrong ? '3px solid #B91C1C' : 'none',
                color: isWrong ? '#B91C1C' : 'white',
                boxShadow: isWrong ? 'none' : '0 4px 0 #D4AC0D'
            }
        }

        if (baseType === 'bringdown') {
            style = { ...style, border: isWrong ? '3px solid #EF4444' : '2px dashed #CBD5E1', background: isWrong ? '#FFF1F2' : '#F8FAFC' }
        }

        return style;
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px', minHeight: '100vh', background: '#F8FAFC', userSelect: 'none' }}>

            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#1E293B', fontWeight: '900', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #CBD5E1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', display: 'flex', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: '900', color: '#64748B' }}>DIVIDEND:
                        <select value={settings.dividendDigits} onChange={e => setSettings({ ...settings, dividendDigits: +e.target.value })} style={{ marginLeft: '10px', padding: '5px', borderRadius: '8px', fontWeight: '900' }}>
                            {[2, 3, 4].map(n => <option key={n} value={n}>{n} Digits</option>)}
                        </select>
                    </div>
                    <div style={{ fontWeight: '900', color: '#64748B' }}>DIVISOR:
                        <select value={settings.divisorDigits} onChange={e => setSettings({ ...settings, divisorDigits: +e.target.value })} style={{ marginLeft: '10px', padding: '5px', borderRadius: '8px', fontWeight: '900' }}>
                            {[1, 2].map(n => <option key={n} value={n}>{n} Digit</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <motion.div layout
                className="glass-panel"
                style={{
                    padding: '40px',
                    background: 'white',
                    borderRadius: '50px',
                    width: '100%',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.05)',
                    position: 'relative',
                    // Scale down on smaller screens
                    transformOrigin: 'top center',
                }}
            >

                {/* SCROLLABLE BOARD CONTAINER */}
                <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', padding: '20px' }}>

                        {/* SVG DOTTED LINES */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                            <svg width="100%" height="100%">
                                {question.steps.map((step, idx) => {
                                    if (idx >= question.steps.length - 1) return null;
                                    const nextPointer = question.steps[idx + 1].pointer;
                                    const x = 20 + (dividendStartCol + nextPointer - 1) * colWidth + colWidth / 2;
                                    const startY = 130;
                                    const endY = startY + 95 + (idx * 180 * (rowHeight / 90));
                                    return (
                                        <line key={idx} x1={x} y1={startY} x2={x} y2={endY + 50} stroke="red" strokeWidth="2.5" strokeDasharray="6,6" />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* BOARD GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalCols}, ${colWidth}px)`, alignItems: 'center', zIndex: 2 }}>

                            {/* TOP LINE */}
                            <div style={{ gridColumn: `1 / span ${divisorCols}`, textAlign: 'right', fontSize: '3rem', fontWeight: '900', color: '#3498DB', paddingRight: '10px' }}>{question.divisor}</div>
                            <div style={{ gridColumn: `${divisorCols + 1}`, fontSize: '4rem', fontWeight: '200', color: '#1E293B', textAlign: 'center' }}>)</div>
                            {question.dividendStr.split('').map((digit, i) => (
                                <div key={i} style={{ gridColumn: `${dividendStartCol + i + 1}`, textAlign: 'center', fontSize: '3rem', fontWeight: '900', color: '#1E293B' }}>{digit}</div>
                            ))}
                            <div style={{ gridColumn: `${bracketRightCol + 1}`, fontSize: '4rem', fontWeight: '200', color: '#1E293B', textAlign: 'center', paddingLeft: '10px' }}>(</div>
                            {question.steps.map((_, idx) => (
                                <div key={idx} style={{ gridColumn: `${quotientStartCol + idx + 1}`, display: 'flex', justifyContent: 'center', paddingLeft: '5px' }}>
                                    <input type="text" maxLength="1" value={userInputs[`q-${idx}`] || ''} onChange={(e) => handleInput(`q-${idx}`, e.target.value)} style={getInputStyle(`q-${idx}`, 'quotient')} />
                                </div>
                            ))}

                            {/* WORK STEPS */}
                            {question.steps.map((step, idx) => {
                                const productCol = (dividendStartCol + step.pointer + 1) - (step.productStr.length - 1);
                                const remainderCol = (dividendStartCol + step.pointer + 1) - (step.remainderStr.length - 1);
                                return (
                                    <React.Fragment key={idx}>
                                        {/* Product */}
                                        <div style={{
                                            gridColumn: `${productCol - 1} / span ${step.productStr.length + 1}`,
                                            gridRow: `${idx * 2 + 2}`, display: 'flex', alignItems: 'center', height: rowHeight, justifyContent: 'flex-end', marginTop: '10px'
                                        }}>
                                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E74C3C', marginRight: '10px' }}>-</span>
                                            {step.productStr.split('').map((_, j) => (
                                                <div key={j} style={{ width: colWidth, display: 'flex', justifyContent: 'center' }}>
                                                    <input type="text" value={userInputs[`p-${idx}-${j}`] || ''} onChange={(e) => handleInput(`p-${idx}-${j}`, e.target.value)} style={getInputStyle(`p-${idx}-${j}`, 'product')} />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ gridColumn: `${productCol} / span ${step.productStr.length}`, gridRow: `${idx * 2 + 2}`, alignSelf: 'end', height: '4px', background: '#334155', borderRadius: '2px', marginBottom: '-5px' }}></div>

                                        {/* Remainder + Bring Down */}
                                        <div style={{
                                            gridColumn: `${remainderCol} / span ${step.remainderStr.length + 1}`,
                                            gridRow: `${idx * 2 + 3}`, display: 'flex', alignItems: 'center', height: rowHeight, marginTop: '5px'
                                        }}>
                                            {step.remainderStr.split('').map((_, j) => (
                                                <div key={j} style={{ width: colWidth, display: 'flex', justifyContent: 'center' }}>
                                                    <input type="text" value={userInputs[`r-${idx}-${j}`] || ''} onChange={(e) => handleInput(`r-${idx}-${j}`, e.target.value)} style={getInputStyle(`r-${idx}-${j}`, 'remainder')} />
                                                </div>
                                            ))}
                                            {idx < question.steps.length - 1 && (
                                                <div style={{ width: colWidth, display: 'flex', justifyContent: 'center' }}>
                                                    <input type="text" maxLength="1" placeholder={question.dividendStr[question.steps[idx + 1].pointer]} value={userInputs[`b-${idx}`] || ''} onChange={(e) => handleInput(`b-${idx}`, e.target.value)} style={getInputStyle(`b-${idx}`, 'bringdown')} />
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                                {feedback === 'correct' ? <span style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#10B981' }}>🌟 BRILLIANT!</span>
                                    : <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><span style={{ fontSize: '4rem' }}>❌</span><span style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#EF4444' }}>TRY AGAIN!</span></div>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {feedback === 'correct' ? (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateQuestion}
                            style={{ padding: '25px 120px', fontSize: '2.5rem', background: '#10B981', color: 'white', fontWeight: '1000', borderRadius: '40px', border: 'none', boxShadow: '0 12px 0 #059669', cursor: 'pointer' }}
                        >
                            NEXT QUESTION
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={checkAnswer}
                            style={{ padding: '25px 120px', fontSize: '2.5rem', background: '#F1C40F', color: 'white', fontWeight: '1000', borderRadius: '40px', border: 'none', boxShadow: '0 12px 0 #D4AC0D', cursor: 'pointer' }}
                        >
                            CHECK ANSWER
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default DivisionGame;
