import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

function MultiplicationGame({ onBack }) {
    const [mode, setMode] = useState('learn');
    const [settings, setSettings] = useState({ digits1: 2, digits2: 1 });
    const [question, setQuestion] = useState(null);
    const [userInputs, setUserInputs] = useState({ final: {}, partial1: {}, partial2: {} });
    const [feedback, setFeedback] = useState(null);
    const [carryInputs, setCarryInputs] = useState({});
    const [showCarry, setShowCarry] = useState(false);

    const inputsRef = useRef([]);

    useEffect(() => { generateQuestion(); }, [settings]);

    /* ─── Question generation ─────────────────────────────────────────── */
    const generateQuestion = () => {
        const min1 = Math.pow(10, settings.digits1 - 1);
        const max1 = Math.pow(10, settings.digits1) - 1;
        const top = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;

        const min2 = Math.pow(10, settings.digits2 - 1);
        const max2 = Math.pow(10, settings.digits2) - 1;
        const bottom = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;

        const answer = top * bottom;

        // Pre-compute step-by-step carry data for LEARN mode (1-digit multiplier)
        const steps = [];
        if (settings.digits2 === 1) {
            const topStr = String(top);
            let carry = 0;
            for (let i = topStr.length - 1; i >= 0; i--) {
                const d = parseInt(topStr[i]);
                const prod = d * bottom + carry;
                steps.push({ colName: i === topStr.length - 1 ? 'Units' : i === topStr.length - 2 ? 'Tens' : 'Hundreds', digit: d, prod, write: prod % 10, carry: Math.floor(prod / 10) });
                carry = Math.floor(prod / 10);
            }
            if (carry > 0) steps.push({ colName: 'Carry', digit: null, prod: carry, write: carry, carry: 0 });
        }

        setQuestion({ top, bottom, answer, steps });
        setUserInputs({ final: {}, partial1: {}, partial2: {} });
        setCarryInputs({});
        setFeedback(null);
    };

    const handleModeChange = (m) => {
        setMode(m);
        playSound('click');
        setFeedback(null);
        setUserInputs({ final: {}, partial1: {}, partial2: {} });
        setCarryInputs({});
    };

    /* ─── Input helpers ───────────────────────────────────────────────── */
    const handleInput = (type, pos, val) => {
        const digit = val.slice(-1);
        if (!/^\d*$/.test(digit)) return;
        setUserInputs(prev => ({ ...prev, [type]: { ...prev[type], [pos]: digit } }));
    };

    const getDigit = (num, i) => {
        const s = String(num);
        const idx = s.length - 1 - i;
        return idx >= 0 ? s[idx] : '';
    };

    /* ─── Check answer ────────────────────────────────────────────────── */
    const checkAnswer = () => {
        const getNum = (type) => {
            let s = '';
            for (let i = 10; i >= 0; i--) {
                if (userInputs[type][i] !== undefined) s += userInputs[type][i];
                else if (s.length > 0) s += '0';
            }
            return parseInt(s || '0', 10);
        };
        const finalVal = getNum('final');
        let correct = false;
        if (settings.digits2 === 1) {
            correct = finalVal === question.answer;
        } else {
            const p1 = getNum('partial1');
            const p2 = getNum('partial2');
            const cp1 = question.top * (question.bottom % 10);
            const cp2 = question.top * Math.floor(question.bottom / 10) * 10;
            correct = p1 === cp1 && p2 === cp2 && finalVal === question.answer;
        }
        if (correct) { playSound('correct'); setFeedback('correct'); }
        else { playSound('wrong'); setFeedback('incorrect'); }
    };

    if (!question) return null;

    const totalCols = Math.max(String(question.answer).length, String(question.top).length + 1) + 1;
    const borderFor = (type) => feedback === 'correct' ? '3px solid #10B981' : feedback === 'incorrect' ? '3px solid #EF4444' : type === 'final' ? '3px solid #334155' : '2px solid #CBD5E1';

    /* ─── LEARN mode render ───────────────────────────────────────────── */
    const renderLearnMode = () => (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
            {/* Worked problem */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ background: 'white', padding: '24px 32px', borderRadius: '24px', border: '3px solid #E2E8F0', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}
            >
                {/* Carry indicators (learn mode) */}
                {settings.digits2 === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '6px', marginRight: '4px' }}>
                        {Array.from({ length: totalCols }).map((_, i) => {
                            const stepIdx = totalCols - 1 - i;
                            const step = question.steps[stepIdx - 1];
                            return (
                                <div key={i} style={{ width: '60px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {step && step.carry > 0 && (
                                        <span style={{ fontSize: '1.2rem', color: '#EF4444', fontWeight: '900', background: '#FEF2F2', padding: '2px 8px', borderRadius: '8px', border: '2px solid #FEE2E2' }}>
                                            {step.carry}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                        <div style={{ width: '52px' }} />
                    </div>
                )}

                {/* Top number */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '4px' }}>
                    {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} style={{ width: '60px', fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', textAlign: 'center' }}>
                            {getDigit(question.top, i)}
                        </div>
                    ))}
                    <div style={{ width: '52px' }} />
                </div>

                {/* Bottom number */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '4px' }}>
                    {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} style={{ width: '60px', fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', textAlign: 'center' }}>
                            {getDigit(question.bottom, i)}
                        </div>
                    ))}
                    <div style={{ width: '52px', fontSize: '2.2rem', fontWeight: '900', color: '#F97316', textAlign: 'center' }}>✖</div>
                </div>

                {/* Divider */}
                <div style={{ width: `calc(${totalCols * 60}px + 52px)`, height: '4px', background: '#1E293B', margin: '10px 0', borderRadius: '2px' }} />

                {/* Answer */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                    {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} style={{ width: '60px', fontSize: '3rem', fontWeight: '900', color: '#F97316', textAlign: 'center' }}>
                            {getDigit(question.answer, i)}
                        </div>
                    ))}
                    <div style={{ width: '52px' }} />
                </div>
            </motion.div>

            {/* Step-by-step cards */}
            <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {settings.digits2 === 1 ? (
                    question.steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '2px solid #FFF7ED', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderLeft: '6px solid #F97316' }}
                        >
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#9A3412', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#F97316', color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>{idx + 1}</span>
                                {step.colName} Column
                            </h3>
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#475569' }}>
                                {step.digit !== null
                                    ? <>{step.digit} × {question.bottom}{idx > 0 && question.steps[idx - 1]?.carry > 0 ? <span style={{ color: '#EF4444' }}> + {question.steps[idx - 1].carry} carry</span> : ''} = <strong style={{ color: '#1E293B' }}>{step.prod}</strong></>
                                    : <span style={{ color: '#EF4444' }}>Final carry = <strong>{step.prod}</strong></span>
                                }
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '0.95rem', color: '#F97316', fontWeight: '800' }}>
                                Write: <span style={{ fontSize: '1.2rem' }}>{step.write}</span>
                                {step.carry > 0 && <span style={{ marginLeft: '12px', color: '#EF4444' }}>| Carry: {step.carry}</span>}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    // 2-digit multiplier: show partial products
                    <>
                        {[
                            { label: `× Ones (${question.bottom % 10})`, val: question.top * (question.bottom % 10), note: 'Multiply top by the ones digit' },
                            { label: `× Tens (${Math.floor(question.bottom / 10)})`, val: question.top * Math.floor(question.bottom / 10) * 10, note: 'Multiply top by tens digit, shift left one place (add 0)' },
                            { label: 'Total', val: question.answer, note: 'Add both partial products' }
                        ].map((row, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '2px solid #FFF7ED', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderLeft: `6px solid ${idx === 2 ? '#10B981' : '#F97316'}` }}
                            >
                                <h3 style={{ fontSize: '1rem', fontWeight: '900', color: idx === 2 ? '#065F46' : '#9A3412', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ background: idx === 2 ? '#10B981' : '#F97316', color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>{idx + 1}</span>
                                    {row.label}
                                </h3>
                                <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '2px' }}>{row.note}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: idx === 2 ? '#10B981' : '#F97316' }}>{row.val}</div>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generateQuestion}
                style={{ padding: '14px 40px', background: '#F97316', color: 'white', borderRadius: '18px', border: 'none', boxShadow: '0 5px 0 #C2410C', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}
            >
                🔄 New Problem
            </motion.button>
        </div>
    );

    /* ─── TEST mode render ────────────────────────────────────────────── */
    const renderTestMode = () => (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '24px 32px', borderRadius: '24px', border: '3px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {/* Carry row */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '8px', marginRight: '4px' }}>
                    {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} style={{ width: '60px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {showCarry && i > 0 && (
                                <input
                                    type="text" inputMode="numeric" maxLength="1"
                                    value={carryInputs[i] || ''}
                                    onChange={e => { const v = e.target.value.slice(-1); if (/^\d*$/.test(v)) setCarryInputs(p => ({ ...p, [i]: v })); }}
                                    placeholder="c"
                                    style={{ width: '38px', height: '38px', textAlign: 'center', fontSize: '1.1rem', fontWeight: '900', border: '2px dashed #CBD5E1', borderRadius: '9px', background: carryInputs[i] ? '#FEF3C7' : '#F8FAFC', color: '#92400E', outline: 'none' }}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ width: '52px' }} />
                </div>

                {/* Top number */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '4px' }}>
                    {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} style={{ width: '60px', fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', textAlign: 'center' }}>{getDigit(question.top, i)}</div>
                    ))}
                    <div style={{ width: '52px' }} />
                </div>

                {/* Bottom number */}
                <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '4px' }}>
                    {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} style={{ width: '60px', fontSize: '2.8rem', fontWeight: '800', color: '#1E293B', textAlign: 'center' }}>{getDigit(question.bottom, i)}</div>
                    ))}
                    <div style={{ width: '52px', fontSize: '2.2rem', fontWeight: '900', color: '#F97316', textAlign: 'center' }}>✖</div>
                </div>

                {/* Divider */}
                <div style={{ width: `calc(${totalCols * 60}px + 52px)`, height: '4px', background: '#1E293B', margin: '12px 0', borderRadius: '4px' }} />

                {settings.digits2 === 1 ? (
                    /* ── Single-digit answer inputs ── */
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                        {Array.from({ length: totalCols }).map((_, i) => {
                            const isRelevant = i < String(question.answer).length;
                            return (
                                <div key={i} style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                                    {isRelevant ? (
                                        <input
                                            ref={el => inputsRef.current[i] = el}
                                            type="text" inputMode="numeric"
                                            value={userInputs.final[i] || ''}
                                            onChange={e => handleInput('final', i, e.target.value)}
                                            style={{ width: '50px', height: '60px', fontSize: '2.2rem', textAlign: 'center', borderRadius: '11px', border: borderFor('final'), background: '#fff', color: '#1E293B', fontWeight: '900', outline: 'none' }}
                                        />
                                    ) : <div style={{ width: '60px' }} />}
                                </div>
                            );
                        })}
                        <div style={{ width: '52px' }} />
                    </div>
                ) : (
                    /* ── Two-digit: partial products + final ── */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                        {/* Partial 1 */}
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                            {Array.from({ length: totalCols }).map((_, i) => {
                                const isRel = i < String(question.top * (question.bottom % 10)).length;
                                return (
                                    <div key={i} style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                                        {isRel ? <input type="text" inputMode="numeric" value={userInputs.partial1[i] || ''} onChange={e => handleInput('partial1', i, e.target.value)} style={{ width: '50px', height: '56px', fontSize: '2rem', textAlign: 'center', borderRadius: '10px', border: borderFor('partial'), background: '#F8FAFC', fontWeight: '900', outline: 'none', color: '#1E293B' }} /> : <div style={{ width: '60px' }} />}
                                    </div>
                                );
                            })}
                            <div style={{ width: '52px' }} />
                        </div>

                        {/* Partial 2 */}
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                            {Array.from({ length: totalCols }).map((_, i) => {
                                const p2Val = question.top * Math.floor(question.bottom / 10);
                                const isRel = i > 0 && i <= String(p2Val).length;
                                return (
                                    <div key={i} style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                                        {i === 0
                                            ? <div style={{ width: '50px', height: '56px', border: '2px dashed #CBD5E1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: '#94A3B8', background: '#F1F5F9' }}>0</div>
                                            : isRel ? <input type="text" inputMode="numeric" value={userInputs.partial2[i] || ''} onChange={e => handleInput('partial2', i, e.target.value)} style={{ width: '50px', height: '56px', fontSize: '2rem', textAlign: 'center', borderRadius: '10px', border: borderFor('partial'), background: '#F8FAFC', fontWeight: '900', outline: 'none', color: '#1E293B' }} /> : <div style={{ width: '60px' }} />}
                                    </div>
                                );
                            })}
                            <div style={{ width: '52px', fontSize: '1.8rem', fontWeight: '900', color: '#3B82F6', textAlign: 'center' }}>➕</div>
                        </div>

                        {/* Second divider */}
                        <div style={{ width: `calc(${totalCols * 60}px + 52px)`, height: '4px', background: '#1E293B', borderRadius: '4px' }} />

                        {/* Final */}
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                            {Array.from({ length: totalCols }).map((_, i) => {
                                const isRel = i < String(question.answer).length;
                                return (
                                    <div key={i} style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                                        {isRel ? <input type="text" inputMode="numeric" value={userInputs.final[i] || ''} onChange={e => handleInput('final', i, e.target.value)} style={{ width: '50px', height: '60px', fontSize: '2.2rem', textAlign: 'center', borderRadius: '11px', border: borderFor('final'), background: '#fff', color: '#1E293B', fontWeight: '900', outline: 'none' }} /> : <div style={{ width: '60px' }} />}
                                    </div>
                                );
                            })}
                            <div style={{ width: '52px' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Feedback + action */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <AnimatePresence mode="wait">
                    {feedback && (
                        <motion.div key={feedback} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ fontSize: '1.6rem', fontWeight: '1000', color: feedback === 'correct' ? '#10B981' : '#EF4444' }}>
                            {feedback === 'correct' ? '🌟 BRILLIANT!' : '❌ TRY AGAIN!'}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={feedback === 'correct' ? generateQuestion : checkAnswer}
                    style={{ padding: '14px 50px', fontSize: '1.2rem', background: feedback === 'correct' ? '#10B981' : '#F97316', color: 'white', fontWeight: '900', borderRadius: '18px', border: 'none', boxShadow: `0 5px 0 ${feedback === 'correct' ? '#059669' : '#C2410C'}`, cursor: 'pointer', textTransform: 'uppercase' }}
                >
                    {feedback === 'correct' ? 'NEXT PROBLEM ➡' : 'CHECK ANSWER'}
                </motion.button>
            </div>
        </div>
    );

    /* ─── Main render ─────────────────────────────────────────────────── */
    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '8px', background: '#F8FAFC' }}>

            {/* ══ HEADER: 3-row compact layout (matches AdditionGame) ══ */}
            <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px', marginTop: '8px' }}>

                {/* Row 1: MENU + Game Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={onBack} style={{ padding: '6px 12px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '0.78rem', borderRadius: '10px', boxShadow: '0 3px 0 #bdc3c7', border: '1px solid #ecf0f1', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>⬅ MENU</button>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '900', color: '#F97316', textTransform: 'uppercase', letterSpacing: '1px' }}>✖ MULTIPLICATION</span>
                    </div>
                </div>

                {/* Row 2: LEARN / TEST */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    {['learn', 'test'].map(m => (
                        <button key={m} onClick={() => handleModeChange(m)} style={{ flex: 1, padding: '8px 0', background: mode === m ? '#F97316' : 'white', color: mode === m ? 'white' : '#2C3E50', fontWeight: '900', borderRadius: '10px', border: 'none', boxShadow: mode === m ? '0 3px 0 #C2410C' : '0 3px 0 #CBD5E1', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {m === 'learn' ? '📖 LEARN' : '✏️ TEST'}
                        </button>
                    ))}
                </div>

                {/* Row 3: Settings pill */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '6px 10px', flexWrap: 'wrap' }}>
                    {[{ label: 'TOP', key: 'digits1', opts: [1, 2, 3] }, { label: 'BOTTOM', key: 'digits2', opts: [1, 2] }].map(({ label, key, opts }, i, arr) => (
                        <>
                            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.75rem' }}>{label}</span>
                                <select value={settings[key]} onChange={e => setSettings({ ...settings, [key]: Number(e.target.value) })} style={{ padding: '3px 6px', borderRadius: '7px', border: '1px solid #CBD5E1', fontWeight: '900', color: '#1E293B', cursor: 'pointer', outline: 'none', fontSize: '0.85rem', background: 'white' }}>
                                    {opts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            {i < arr.length - 1 && <div style={{ width: '1px', height: '18px', background: '#CBD5E1' }} />}
                        </>
                    ))}
                    {mode === 'test' && (<>
                        <div style={{ width: '1px', height: '18px', background: '#CBD5E1' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.75rem' }}>CARRY</span>
                            <button onClick={() => setShowCarry(s => !s)} style={{ padding: '3px 10px', borderRadius: '7px', background: showCarry ? '#10B981' : '#94A3B8', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', boxShadow: `0 2px 0 ${showCarry ? '#059669' : '#64748B'}`, fontSize: '0.75rem' }}>
                                {showCarry ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </>)}
                </div>
            </div>

            {/* ── Glass panel ── */}
            <motion.div layout className="glass-panel" style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', background: 'rgba(255,255,255,0.95)', boxShadow: '0 10px 24px rgba(0,0,0,0.08)', borderRadius: '20px', width: '100%', maxWidth: '420px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', margin: '0 0 8px' }}>
                    {mode === 'learn' ? '✨ Step-by-step method' : '🎯 Fill in the answer!'}
                </p>
                {mode === 'learn' ? renderLearnMode() : renderTestMode()}
            </motion.div>
        </div>
    );
}

export default MultiplicationGame;
