import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function TablesGame({ onBack }) {
    const [selectedNum, setSelectedNum] = useState(2);
    const [mode, setMode] = useState('practice'); // 'practice' or 'test'
    const [revealed, setRevealed] = useState({}); // For practice: { multiplier: true }
    const [userAnswers, setUserAnswers] = useState({}); // For test: { multiplier: 'ans' }
    const [testFeedback, setTestFeedback] = useState({}); // For test: { multiplier: 'correct' | 'incorrect' }

    const toggleReveal = (multiplier) => {
        if (mode === 'practice' && !revealed[multiplier]) {
            playSound('correct');
            setRevealed(prev => ({ ...prev, [multiplier]: true }));
            speak(`${selectedNum} times ${multiplier} equals ${selectedNum * multiplier}`, 'en-US', 1.1);
        }
    };

    // Local speak removed, imported from utils

    const handleMultiplierInput = (multiplier, val) => {
        if (mode === 'test') {
            const digit = val.toString().trim().replace(/\D/g, '');
            setUserAnswers(prev => ({ ...prev, [multiplier]: digit }));
            // Clear feedback for this row as they type
            if (testFeedback[multiplier]) {
                const newFeedback = { ...testFeedback };
                delete newFeedback[multiplier];
                setTestFeedback(newFeedback);
            }
        }
    };

    const checkAllAnswers = () => {
        const newFeedback = {};
        let allCorrect = true;
        let anyAnswered = false;

        for (let multiplier = 1; multiplier <= 10; multiplier++) {
            const correctResult = selectedNum * multiplier;
            const userVal = parseInt(userAnswers[multiplier]);

            if (userAnswers[multiplier] && userAnswers[multiplier] !== '') {
                anyAnswered = true;
                if (userVal === correctResult) {
                    newFeedback[multiplier] = 'correct';
                } else {
                    newFeedback[multiplier] = 'incorrect';
                    allCorrect = false;
                }
            }
        }

        if (!anyAnswered) {
            playSound('wrong');
            return;
        }

        setTestFeedback(newFeedback);

        if (allCorrect && anyAnswered) {
            playSound('star');
        } else {
            playSound('wrong');
        }
    };

    const resetGame = (num, newMode) => {
        if (num) setSelectedNum(num);
        if (newMode) setMode(newMode);
        setRevealed({});
        setUserAnswers({});
        setTestFeedback({});
        playSound('click');
    };

    const revealAll = () => {
        if (mode === 'practice') {
            const newRevealed = {};
            for (let i = 1; i <= 10; i++) newRevealed[i] = true;
            setRevealed(newRevealed);
            playSound('star');
        }
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px', minHeight: '100vh', background: '#F8FAFC' }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#1E293B', fontWeight: '900', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #CBD5E1', cursor: 'pointer' }}>⬅ MENU</button>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => resetGame(null, 'practice')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'practice' ? '#3498DB' : 'white',
                            color: mode === 'practice' ? 'white' : '#1E293B',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'practice' ? '0 4px 0 #2980B9' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        LEARN
                    </button>
                    <button
                        onClick={() => resetGame(null, 'test')}
                        style={{
                            padding: '12px 24px',
                            background: mode === 'test' ? '#E67E22' : 'white',
                            color: mode === 'test' ? 'white' : '#1E293B',
                            fontWeight: '1000', borderRadius: '15px', border: 'none',
                            boxShadow: mode === 'test' ? '0 4px 0 #D35400' : '0 4px 0 #CBD5E1',
                            cursor: 'pointer'
                        }}
                    >
                        TEST
                    </button>
                </div>

                <div style={{ background: 'white', padding: '10px 20px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{ fontWeight: '900', color: '#64748B' }}>TABLE:</span>
                    <select
                        value={selectedNum}
                        onChange={(e) => resetGame(parseInt(e.target.value), null)}
                        style={{ padding: '5px 15px', borderRadius: '10px', border: '2px solid #E2E8F0', fontWeight: '900', color: '#2C3E50', fontSize: '1.2rem', cursor: 'pointer' }}
                    >
                        {[...Array(19)].map((_, i) => (
                            <option key={i + 2} value={i + 2}>{i + 2}</option>
                        ))}
                    </select>
                </div>

                {mode === 'practice' && (
                    <button onClick={revealAll} style={{ padding: '12px 24px', background: '#FFD700', color: '#1E293B', fontWeight: '900', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #DAA520', cursor: 'pointer' }}>✨ SHOW ALL</button>
                )}
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '40px', background: 'white', borderRadius: '50px',
                    width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#2C3E50', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Table of <span style={{ color: mode === 'practice' ? '#3498DB' : '#E67E22' }}>{selectedNum}</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B', marginTop: '10px' }}>
                        {mode === 'practice' ? 'Click on "?" to reveal the answer!' : 'Type all answers and click "CHECK ALL"!'}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                    {[...Array(10)].map((_, i) => {
                        const multiplier = i + 1;
                        const result = selectedNum * multiplier;
                        const isRevealed = revealed[multiplier];
                        const feedback = testFeedback[multiplier];

                        return (
                            <motion.div
                                key={multiplier}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '15px 30px', background: '#F8FAFC', borderRadius: '25px',
                                    border: '2px solid #EDF2F7', transition: 'all 0.2s',
                                    boxShadow: (mode === 'practice' && isRevealed) ? 'none' : '0 4px 6px rgba(0,0,0,0.02)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => speak(`${selectedNum} times ${multiplier} equals ${result}`, 'en-US', 1.1)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '2.5rem', fontWeight: '1000', color: '#334155' }}>
                                    <span style={{ minWidth: '80px', textAlign: 'center' }}>{selectedNum}</span>
                                    <span style={{ color: '#94A3B8' }}>×</span>
                                    <span style={{ minWidth: '80px', textAlign: 'center' }}>{multiplier}</span>
                                    <span style={{ color: '#94A3B8' }}>=</span>

                                    {mode === 'practice' ? (
                                        <motion.div
                                            whileHover={{ scale: isRevealed ? 1 : 1.05 }}
                                            whileTap={{ scale: isRevealed ? 1 : 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleReveal(multiplier);
                                            }}
                                            style={{
                                                width: '150px', height: '100%', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                background: isRevealed ? 'white' : '#3498DB',
                                                color: isRevealed ? '#27AE60' : 'white',
                                                padding: '10px',
                                                borderRadius: '15px', border: isRevealed ? '3px solid #E2E8F0' : 'none',
                                                cursor: isRevealed ? 'default' : 'pointer',
                                                boxShadow: isRevealed ? 'none' : '0 6px 0 #2980B9',
                                                fontSize: '2.5rem', fontWeight: '1000'
                                            }}
                                        >
                                            {isRevealed ? result : '?'}
                                        </motion.div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={userAnswers[multiplier] || ''}
                                            onChange={(e) => handleMultiplierInput(multiplier, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && checkAllAnswers()}
                                            style={{
                                                width: '150px', padding: '10px', fontSize: '2.5rem',
                                                fontWeight: '1000', textAlign: 'center', borderRadius: '15px',
                                                border: feedback === 'correct' ? '4px solid #10B981' : feedback === 'incorrect' ? '4px solid #EF4444' : '3px solid #334155',
                                                background: feedback === 'correct' ? '#ECFDF5' : feedback === 'incorrect' ? '#FEF2F2' : 'white',
                                                outline: 'none', color: '#1E293B'
                                            }}
                                            placeholder="?"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Check All Button for Test Mode */}
                {mode === 'test' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkAllAnswers}
                        style={{
                            marginTop: '40px',
                            padding: '20px 80px',
                            background: '#E67E22',
                            color: 'white',
                            borderRadius: '30px',
                            border: 'none',
                            boxShadow: '0 8px 0 #D35400',
                            fontSize: '2rem',
                            fontWeight: '1000',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}
                    >
                        ✅ CHECK ALL
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

export default TablesGame;
