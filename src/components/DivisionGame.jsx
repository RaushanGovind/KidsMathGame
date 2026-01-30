import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function DivisionGame({ onBack }) {
    const [settings, setSettings] = useState({ dividendDigits: 3, divisorDigits: 1 });
    const [question, setQuestion] = useState(null);
    const [userInputs, setUserInputs] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [wrongKeys, setWrongKeys] = useState([]);

    // Board scaling logic
    const [boardScale, setBoardScale] = useState(1);
    const containerRef = useRef(null);
    const boardRef = useRef(null);

    // Dynamic base sizes
    const colWidth = 50;
    const rowHeight = 80;

    useEffect(() => {
        generateQuestion();
    }, [settings]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && boardRef.current) {
                const containerWidth = containerRef.current.clientWidth - 40;
                const boardWidth = boardRef.current.scrollWidth;

                if (boardWidth > containerWidth) {
                    setBoardScale(containerWidth / boardWidth);
                } else {
                    setBoardScale(1);
                }
            }
        };

        // Delay slightly to ensure layout is ready
        const timeout = setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [question]);

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
            if ((userInputs[`q-${i}`] || "") !== step.quotientDigit) currentWrong.push(`q-${i}`);
            for (let j = 0; j < step.productStr.length; j++) {
                if ((userInputs[`p-${i}-${j}`] || "") !== step.productStr[j]) currentWrong.push(`p-${i}-${j}`);
            }
            for (let j = 0; j < step.remainderStr.length; j++) {
                if ((userInputs[`r-${i}-${j}`] || "") !== step.remainderStr[j]) currentWrong.push(`r-${i}-${j}`);
            }
            if (i < question.steps.length - 1) {
                const nextDigit = question.dividendStr[question.steps[i + 1].pointer];
                if ((userInputs[`b-${i}`] || "") !== String(nextDigit)) currentWrong.push(`b-${i}`);
            }
        }

        if (currentWrong.length === 0) {
            playSound('correct');
            setFeedback('correct');
        } else {
            playSound('wrong');
            setFeedback('incorrect');
            setWrongKeys(currentWrong);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    if (!question) return null;

    const divisorStr = String(question.divisor);
    const divisorCols = divisorStr.length;
    const dividendCols = question.dividendStr.length;

    const divisorStartCol = 1;
    const bracketLeftCol = divisorCols + 1;
    const dividendStartIndex = divisorCols + 1;
    const bracketRightCol = divisorCols + dividendCols + 2;
    const quotientStartCol = bracketRightCol;
    const totalCols = bracketRightCol + question.steps.length;

    const getInputStyle = (key, baseType) => {
        const isWrong = wrongKeys.includes(key);
        let style = {
            width: '40px', height: '48px',
            textAlign: 'center', fontSize: '1.5rem', fontWeight: '900',
            outline: 'none', borderRadius: '10px', transition: 'all 0.2s',
            border: isWrong ? '3px solid #EF4444' : (baseType === 'product' ? '2px solid #E2E8F0' : '2px solid #334155'),
            background: isWrong ? '#FFF1F2' : (baseType === 'remainder' ? '#F8FAFC' : 'white'),
            color: isWrong ? '#B91C1C' : '#1E293B',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        };
        if (baseType === 'quotient') {
            style = { ...style, width: '44px', height: '54px', background: isWrong ? '#FFF1F2' : '#F59E0B', border: isWrong ? '3px solid #B91C1C' : 'none', color: 'white', boxShadow: isWrong ? 'none' : '0 4px 0 #D97706', fontSize: '1.7rem' }
        }
        if (baseType === 'bringdown') {
            style = { ...style, border: isWrong ? '3px solid #EF4444' : '2px dashed #3B82F6', background: '#EFF6FF', color: '#1D4ED8' }
        }
        return style;
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '10px', minHeight: '100vh', background: '#F8FAFC', userSelect: 'none', overflowX: 'hidden' }}>

            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={onBack} style={{ padding: '8px 18px', background: 'white', color: '#2C3E50', fontWeight: '1000', borderRadius: '12px', border: 'none', boxShadow: '0 4px 0 #bdc3c7', cursor: 'pointer', fontSize: '1rem' }}>⬅ MENU</button>

                    <div style={{ display: 'flex', gap: '10px', background: 'white', padding: '8px 15px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '2px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '0.8rem' }}>DIVIDEND:</span>
                            <select value={settings.dividendDigits} onChange={e => setSettings({ ...settings, dividendDigits: +e.target.value })} style={{ padding: '2px 5px', borderRadius: '8px', border: '2px solid #E2E8F0', fontWeight: '900', color: '#1E293B', outline: 'none' }}>
                                {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '0.8rem' }}>DIVISOR:</span>
                            <select value={settings.divisorDigits} onChange={e => setSettings({ ...settings, divisorDigits: +e.target.value })} style={{ padding: '2px 5px', borderRadius: '8px', border: '2px solid #E2E8F0', fontWeight: '900', color: '#1E293B', outline: 'none' }}>
                                {[1, 2].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div layout
                className="glass-panel"
                style={{
                    padding: '20px 10px',
                    background: 'white',
                    borderRadius: '35px',
                    width: '95%',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
                    position: 'relative'
                }}
                ref={containerRef}
            >
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase' }}>➗ Long Division</h1>
                    <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', marginTop: '5px' }}>🎯 Fill the gaps to solve!</p>
                </div>

                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflow: 'visible'
                    }}
                >
                    <div
                        ref={boardRef}
                        style={{
                            position: 'relative',
                            padding: '15px',
                            background: 'white',
                            borderRadius: '25px',
                            border: '3px solid #F1F5F9',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                            transform: `scale(${boardScale})`,
                            transformOrigin: 'top center',
                            margin: '0 auto',
                            display: 'inline-block'
                        }}
                    >
                        {/* SVG DOTTED LINES */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                            <svg width="100%" height="100%">
                                {question.steps.map((step, idx) => {
                                    if (idx >= question.steps.length - 1) return null;
                                    const nextPointer = question.steps[idx + 1].pointer;
                                    const x = 15 + (dividendStartIndex + nextPointer) * colWidth + colWidth / 2;
                                    const startY = 55;
                                    const endY = startY + 55 + (idx * (rowHeight * 2));
                                    return (
                                        <line key={idx} x1={x} y1={startY} x2={x} y2={endY + 55} stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6,6" />
                                    );
                                })}
                            </svg>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalCols}, ${colWidth}px)`, alignItems: 'center', zIndex: 2, position: 'relative' }}>
                            <div style={{ gridColumn: `${divisorStartCol} / span ${divisorCols}`, textAlign: 'center', fontSize: '2.8rem', fontWeight: '1000', color: '#3182CE' }}>{question.divisor}</div>
                            <div style={{ gridColumn: `${bracketLeftCol}`, fontSize: '3.5rem', fontWeight: '200', color: '#94A3B8', textAlign: 'center' }}>)</div>
                            {question.dividendStr.split('').map((digit, i) => (
                                <div key={i} style={{ gridColumn: `${dividendStartIndex + i + 1}`, textAlign: 'center', fontSize: '2.8rem', fontWeight: '1000', color: '#1E293B' }}>{digit}</div>
                            ))}
                            <div style={{ gridColumn: `${bracketRightCol}`, fontSize: '3.5rem', fontWeight: '200', color: '#94A3B8', textAlign: 'center' }}> (</div>
                            {question.steps.map((_, idx) => (
                                <div key={idx} style={{ gridColumn: `${quotientStartCol + idx + 1}`, display: 'flex', justifyContent: 'center' }}>
                                    <input type="text" maxLength="1" value={userInputs[`q-${idx}`] || ''} onChange={(e) => handleInput(`q-${idx}`, e.target.value)} style={getInputStyle(`q-${idx}`, 'quotient')} />
                                </div>
                            ))}

                            {question.steps.map((step, idx) => {
                                const productCol = (dividendStartIndex + step.pointer + 1) - (step.productStr.length - 1);
                                const remainderCol = (dividendStartIndex + step.pointer + 1) - (step.remainderStr.length - 1);
                                return (
                                    <React.Fragment key={idx}>
                                        <div style={{
                                            gridColumn: `${productCol - 1} / span ${step.productStr.length + 1}`,
                                            gridRow: `${idx * 2 + 2}`, display: 'flex', alignItems: 'center', height: rowHeight, justifyContent: 'flex-end', marginTop: '10px'
                                        }}>
                                            <span style={{ fontSize: '1.8rem', fontWeight: '1000', color: '#EF4444', marginRight: '8px' }}>−</span>
                                            {step.productStr.split('').map((_, j) => (
                                                <div key={j} style={{ width: colWidth, display: 'flex', justifyContent: 'center' }}>
                                                    <input type="text" value={userInputs[`p-${idx}-${j}`] || ''} onChange={(e) => handleInput(`p-${idx}-${j}`, e.target.value)} style={getInputStyle(`p-${idx}-${j}`, 'product')} />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ gridColumn: `${productCol} / span ${step.productStr.length}`, gridRow: `${idx * 2 + 2}`, alignSelf: 'end', height: '3px', background: '#334155', borderRadius: '4px', marginBottom: '-2px' }}></div>
                                        <div style={{
                                            gridColumn: `${remainderCol} / span ${step.remainderStr.length + 1}`,
                                            gridRow: `${idx * 2 + 3}`, display: 'flex', alignItems: 'center', height: rowHeight, marginTop: '2px'
                                        }}>
                                            {step.remainderStr.split('').map((_, j) => (
                                                <div key={j} style={{ width: colWidth, display: 'flex', justifyContent: 'center' }}>
                                                    <input type="text" value={userInputs[`r-${idx}-${j}`] || ''} onChange={(e) => handleInput(`r-${idx}-${j}`, e.target.value)} style={getInputStyle(`r-${idx}-${j}`, 'remainder')} />
                                                </div>
                                            ))}
                                            {idx < question.steps.length - 1 && (
                                                <div style={{ width: colWidth, display: 'flex', justifyContent: 'center' }}>
                                                    <input type="text" maxLength="1" value={userInputs[`b-${idx}`] || ''} onChange={(e) => handleInput(`b-${idx}`, e.target.value)} style={getInputStyle(`b-${idx}`, 'bringdown')} />
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '15px',
                        width: '100%',
                        zIndex: 10,
                        backgroundColor: 'white',
                        paddingTop: '20px'
                    }}
                >
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ fontSize: '1.8rem', fontWeight: '1000', color: feedback === 'correct' ? '#10B981' : '#EF4444' }}>
                                {feedback === 'correct' ? '🌟 BRILLIANT!' : '❌ TRY AGAIN!'}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={feedback === 'correct' ? generateQuestion : checkAnswer}
                        style={{
                            padding: '12px 50px',
                            fontSize: '1.2rem',
                            background: feedback === 'correct' ? '#10B981' : '#F97316',
                            color: 'white',
                            fontWeight: '1000',
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: `0 5px 0 ${feedback === 'correct' ? '#059669' : '#C2410C'}`,
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

export default DivisionGame;
