import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function TablesGame({ onBack }) {
    const [selectedNum, setSelectedNum] = useState(2);
    const [mode, setMode] = useState('practice'); // 'practice' | 'test'
    const [revealed, setRevealed] = useState({});      // { 3: true, 7: true }
    const [userAnswers, setUserAnswers] = useState({});
    const [testFeedback, setTestFeedback] = useState({});

    const getPronunciation = (num, multiplier) => {
        const result = num * multiplier;
        const tableNames = ["", "ones are", "twos are", "threes are", "fours are", "fives are",
            "sixes are", "sevens are", "eights are", "nines are", "tens are"];
        return `${num} ${tableNames[multiplier] ?? 'times ' + multiplier + ' equals'} ${result}`;
    };

    /* ── Reveal on click ───────────────────────────────────────────────── */
    const toggleReveal = (multiplier) => {
        if (!revealed[multiplier]) {
            setRevealed(prev => ({ ...prev, [multiplier]: true }));
            playSound('pop');
        }
        speak(getPronunciation(selectedNum, multiplier), 'en-IN');
    };

    const revealAll = () => {
        const all = {};
        for (let i = 1; i <= 10; i++) all[i] = true;
        setRevealed(all);
        playSound('star');
    };

    /* ── Test mode input ───────────────────────────────────────────────── */
    const handleMultiplierInput = (multiplier, val) => {
        const digit = val.toString().trim().replace(/\D/g, '');
        setUserAnswers(prev => ({ ...prev, [multiplier]: digit }));
        const correctResult = selectedNum * multiplier;
        if (parseInt(digit) === correctResult) {
            setTestFeedback(prev => ({ ...prev, [multiplier]: 'correct' }));
            playSound('correct');
            speak(getPronunciation(selectedNum, multiplier), 'en-IN');
        } else if (digit.length >= String(correctResult).length && digit !== '') {
            if (testFeedback[multiplier] !== 'incorrect') {
                setTestFeedback(prev => ({ ...prev, [multiplier]: 'incorrect' }));
                playSound('wrong');
            }
        } else if (testFeedback[multiplier]) {
            setTestFeedback(prev => { const n = { ...prev }; delete n[multiplier]; return n; });
        }
    };

    const checkAllAnswers = () => {
        const newFeedback = {};
        let allCorrect = true, anyAnswered = false;
        for (let m = 1; m <= 10; m++) {
            const correct = selectedNum * m;
            const user = parseInt(userAnswers[m]);
            if (userAnswers[m] && userAnswers[m] !== '') {
                anyAnswered = true;
                newFeedback[m] = user === correct ? 'correct' : 'incorrect';
                if (user !== correct) allCorrect = false;
            }
        }
        if (!anyAnswered) { playSound('wrong'); return; }
        setTestFeedback(newFeedback);
        playSound(allCorrect ? 'star' : 'wrong');
    };

    const resetGame = (num, newMode) => {
        if (num !== null) setSelectedNum(num);
        if (newMode) setMode(newMode);
        setRevealed({});
        setUserAnswers({});
        setTestFeedback({});
        playSound('click');
    };

    /* ── Render ────────────────────────────────────────────────────────── */
    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '8px', background: '#F8FAFC' }}>

            {/* ══ HEADER: 3-row compact layout ══ */}
            <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px', marginTop: '8px' }}>

                {/* Row 1: MENU + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={onBack} style={{ padding: '6px 12px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '0.78rem', borderRadius: '10px', boxShadow: '0 3px 0 #bdc3c7', border: '1px solid #ecf0f1', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        ⬅ MENU
                    </button>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '900', color: '#3498DB', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            📋 TIMES TABLES
                        </span>
                    </div>
                </div>

                {/* Row 2: LEARN / TEST */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[['practice', '📖 LEARN', '#3498DB', '#2980B9'], ['test', '✏️ TEST', '#E67E22', '#D35400']].map(([m, label, active, shadow]) => (
                        <button key={m} onClick={() => resetGame(null, m)}
                            style={{ flex: 1, padding: '8px 0', background: mode === m ? active : 'white', color: mode === m ? 'white' : '#2C3E50', fontWeight: '900', borderRadius: '10px', border: 'none', boxShadow: mode === m ? `0 3px 0 ${shadow}` : '0 3px 0 #CBD5E1', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Row 3: TABLE dropdown + SHOW ALL — same pill row */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '6px 10px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.75rem' }}>TABLE</span>
                    <select
                        value={selectedNum}
                        onChange={e => resetGame(parseInt(e.target.value), null)}
                        style={{ padding: '3px 6px', borderRadius: '7px', border: '1px solid #CBD5E1', fontWeight: '900', color: '#1E293B', cursor: 'pointer', outline: 'none', fontSize: '0.95rem', background: 'white' }}
                    >
                        {[...Array(19)].map((_, i) => (
                            <option key={i + 2} value={i + 2}>{i + 2}</option>
                        ))}
                    </select>

                    {mode === 'practice' && (
                        <>
                            <div style={{ width: '1px', height: '18px', background: '#CBD5E1' }} />
                            <button onClick={revealAll}
                                style={{ padding: '4px 12px', background: '#FFD700', color: '#1E293B', fontWeight: '900', borderRadius: '8px', border: 'none', boxShadow: '0 2px 0 #DAA520', cursor: 'pointer', fontSize: '0.8rem' }}>
                                ✨ SHOW ALL
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Glass panel ── */}
            <motion.div layout className="glass-panel" style={{
                padding: '16px 12px',
                background: 'rgba(255,255,255,0.97)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '420px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)'
            }}>
                {/* Title inside panel */}
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '1000', color: '#1E293B', margin: 0 }}>
                        Table of <span style={{ color: mode === 'practice' ? '#3498DB' : '#E67E22' }}>{selectedNum}</span>
                    </h1>
                    <p style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', marginTop: '4px' }}>
                        {mode === 'practice' ? '👆 Tap ? to reveal each answer' : '🎯 Type the answers!'}
                    </p>
                </div>

                {/* Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
                    {[...Array(10)].map((_, i) => {
                        const multiplier = i + 1;
                        const result = selectedNum * multiplier;
                        const isRevealed = !!revealed[multiplier];
                        const fb = testFeedback[multiplier];

                        return (
                            <motion.div
                                key={multiplier}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 16px',
                                    background: fb === 'correct' ? '#ECFDF5' : fb === 'incorrect' ? '#FEF2F2' : 'white',
                                    borderRadius: '16px', width: '100%',
                                    border: `2px solid ${fb === 'correct' ? '#10B981' : fb === 'incorrect' ? '#EF4444' : '#F1F5F9'}`,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                    cursor: mode === 'practice' ? 'pointer' : 'default',
                                    gap: '10px'
                                }}
                                onClick={() => mode === 'practice' && toggleReveal(multiplier)}
                            >
                                {/* Equation */}
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.7rem', fontWeight: '900', color: '#334155', gap: '8px', flex: 1, justifyContent: 'center' }}>
                                    <span style={{ minWidth: '40px', textAlign: 'right' }}>{selectedNum}</span>
                                    <span style={{ color: '#94A3B8', fontSize: '1.3rem' }}>×</span>
                                    <span style={{ minWidth: '28px', textAlign: 'center' }}>{multiplier}</span>
                                    <span style={{ color: '#94A3B8', fontSize: '1.3rem' }}>=</span>
                                </div>

                                {/* Answer area */}
                                {mode === 'practice' ? (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isRevealed ? 'ans' : 'q'}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                width: '72px', height: '48px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: isRevealed ? '#ECFDF5' : '#3498DB',
                                                color: isRevealed ? '#10B981' : 'white',
                                                borderRadius: '12px',
                                                border: isRevealed ? '2px solid #A7F3D0' : 'none',
                                                boxShadow: isRevealed ? 'none' : '0 4px 0 #2980B9',
                                                fontSize: '1.7rem', fontWeight: '900',
                                                cursor: isRevealed ? 'default' : 'pointer',
                                                flexShrink: 0
                                            }}
                                        >
                                            {isRevealed ? result : '?'}
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <input
                                        type="text" inputMode="numeric" placeholder="?"
                                        value={userAnswers[multiplier] || ''}
                                        onChange={e => handleMultiplierInput(multiplier, e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && checkAllAnswers()}
                                        onClick={e => e.stopPropagation()}
                                        style={{
                                            width: '72px', height: '48px',
                                            fontSize: '1.7rem', fontWeight: '900', textAlign: 'center',
                                            borderRadius: '12px',
                                            border: `3px solid ${fb === 'correct' ? '#10B981' : fb === 'incorrect' ? '#EF4444' : '#CBD5E1'}`,
                                            background: 'white', outline: 'none', color: '#1E293B',
                                            transition: 'border-color 0.2s', flexShrink: 0
                                        }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* CHECK ALL button (test mode) */}
                {mode === 'test' && (
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={checkAllAnswers}
                        style={{ marginTop: '18px', padding: '12px 40px', background: '#E67E22', color: 'white', borderRadius: '14px', boxShadow: '0 4px 0 #D35400', fontSize: '1.1rem', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                    >
                        ✅ CHECK ALL
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

export default TablesGame;
