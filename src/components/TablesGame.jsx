import { useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function TablesGame({ onBack }) {
    const [selectedNum, setSelectedNum] = useState(2);
    const [mode, setMode] = useState('practice'); // 'practice' or 'test'
    const [revealed, setRevealed] = useState({}); // For practice: { multiplier: true }
    const [userAnswers, setUserAnswers] = useState({}); // For test: { multiplier: 'ans' }
    const [testFeedback, setTestFeedback] = useState({}); // For test: { multiplier: 'correct' | 'incorrect' }

    const getPronunciation = (num, multiplier) => {
        const result = num * multiplier;
        const tableNames = [
            "", "ones are", "twos are", "threes are", "fours are", "fives are",
            "sixes are", "sevens are", "eights are", "nines are", "tens are"
        ];
        return `${num} ${tableNames[multiplier]} ${result}`;
    };

    const toggleReveal = (multiplier) => {
        if (mode === 'practice' && !revealed[multiplier]) {
            playSound('correct');
            setRevealed(prev => ({ ...prev, [multiplier]: true }));
            speak(getPronunciation(selectedNum, multiplier), 'en-US', 1.1);
        }
    };

    const handleMultiplierInput = (multiplier, val) => {
        if (mode === 'test') {
            const digit = val.toString().trim().replace(/\D/g, '');
            setUserAnswers(prev => ({ ...prev, [multiplier]: digit }));

            const correctResult = selectedNum * multiplier;
            const correctStr = String(correctResult);

            if (parseInt(digit) === correctResult) {
                setTestFeedback(prev => ({ ...prev, [multiplier]: 'correct' }));
                playSound('correct');
                speak(getPronunciation(selectedNum, multiplier), 'en-US', 1.1);
            } else if (digit.length >= correctStr.length && digit !== "") {
                // Only speak "Wrong" if it wasn't already marked incorrect to avoid repeating on every digit
                if (testFeedback[multiplier] !== 'incorrect') {
                    setTestFeedback(prev => ({ ...prev, [multiplier]: 'incorrect' }));
                    playSound('wrong');
                    speak("Wrong", 'en-US', 1.1);
                }
            } else if (testFeedback[multiplier]) {
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
        <div className="game-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '10px',
            minHeight: '100vh',
            background: '#F8FAFC'
        }}>

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
                    <button onClick={onBack} style={{ padding: '10px 22px', background: 'white', color: '#1E293B', fontWeight: '1000', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #CBD5E1', cursor: 'pointer', fontSize: '1.1rem' }}>⬅ MENU</button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => resetGame(null, 'practice')}
                            style={{
                                padding: '10px 22px',
                                background: mode === 'practice' ? '#3498DB' : 'white',
                                color: mode === 'practice' ? 'white' : '#1E293B',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === 'practice' ? '0 4px 0 #2980B9' : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', fontSize: '1.1rem'
                            }}
                        >LEARN</button>
                        <button
                            onClick={() => resetGame(null, 'test')}
                            style={{
                                padding: '10px 22px',
                                background: mode === 'test' ? '#E67E22' : 'white',
                                color: mode === 'test' ? 'white' : '#1E293B',
                                fontWeight: '1000', borderRadius: '15px', border: 'none',
                                boxShadow: mode === 'test' ? '0 4px 0 #D35400' : '0 4px 0 #CBD5E1',
                                cursor: 'pointer', fontSize: '1.1rem'
                            }}
                        >TEST</button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ background: 'white', padding: '10px 20px', borderRadius: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '15px', alignItems: 'center', border: '2px solid #F1F5F9' }}>
                        <span style={{ fontWeight: '1000', color: '#64748B', fontSize: '1.1rem' }}>TABLE:</span>
                        <select
                            value={selectedNum}
                            onChange={(e) => resetGame(parseInt(e.target.value), null)}
                            style={{ padding: '5px 12px', borderRadius: '12px', border: '2px solid #E2E8F0', fontWeight: '1000', color: '#1E293B', fontSize: '1.3rem', cursor: 'pointer', background: 'transparent', outline: 'none' }}
                        >
                            {[...Array(19)].map((_, i) => (
                                <option key={i + 2} value={i + 2}>{i + 2}</option>
                            ))}
                        </select>
                    </div>

                    {mode === 'practice' && (
                        <button onClick={revealAll} style={{ padding: '10px 22px', background: '#FFD700', color: '#1E293B', fontWeight: '1000', borderRadius: '15px', border: 'none', boxShadow: '0 4px 0 #DAA520', cursor: 'pointer', fontSize: '1.1rem' }}>✨ SHOW ALL</button>
                    )}
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
                    maxWidth: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(25px)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#1E293B', margin: 0, letterSpacing: '-0.5px' }}>
                        Table of <span style={{ color: mode === 'practice' ? '#3498DB' : '#E67E22', fontSize: '3.8rem', marginLeft: '5px' }}>{selectedNum}</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#64748B', marginTop: '8px' }}>
                        {mode === 'practice' ? '✨ Reveal the answers!' : '🎯 Test your skills!'}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
                    {[...Array(10)].map((_, i) => {
                        const multiplier = i + 1;
                        const result = selectedNum * multiplier;
                        const isRevealed = revealed[multiplier];
                        const feedback = testFeedback[multiplier];

                        return (
                            <motion.div
                                key={multiplier}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '15px 20px',
                                    background: feedback === 'correct' ? '#ECFDF5' : feedback === 'incorrect' ? '#FEF2F2' : 'white',
                                    borderRadius: '25px',
                                    width: '100%',
                                    border: '2px solid',
                                    borderColor: feedback === 'correct' ? '#10B981' : feedback === 'incorrect' ? '#EF4444' : '#F1F5F9',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.02)',
                                    cursor: 'pointer',
                                    gap: '15px'
                                }}
                                onClick={() => {
                                    if (mode === 'practice') {
                                        speak(getPronunciation(selectedNum, multiplier), 'en-US', 1.1);
                                    }
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '2.2rem',
                                    fontWeight: '1000',
                                    color: '#334155',
                                    gap: '12px',
                                    flex: 1,
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ width: '55px', textAlign: 'right' }}>{selectedNum}</span>
                                    <span style={{ color: '#94A3B8', fontSize: '1.6rem' }}>×</span>
                                    <span style={{ width: '55px', textAlign: 'left' }}>{multiplier}</span>
                                    <span style={{ color: '#94A3B8', fontSize: '1.6rem' }}>=</span>
                                </div>

                                {mode === 'practice' ? (
                                    <motion.div
                                        whileHover={{ scale: isRevealed ? 1 : 1.05 }}
                                        whileTap={{ scale: isRevealed ? 1 : 0.95 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleReveal(multiplier);
                                        }}
                                        style={{
                                            width: '100px',
                                            height: '55px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: isRevealed ? '#F8FAFC' : '#3498DB',
                                            color: isRevealed ? '#10B981' : 'white',
                                            borderRadius: '15px',
                                            border: isRevealed ? '3px solid #E2E8F0' : 'none',
                                            cursor: isRevealed ? 'default' : 'pointer',
                                            boxShadow: isRevealed ? 'none' : '0 5px 0 #2980B9',
                                            fontSize: '2rem',
                                            fontWeight: '1000'
                                        }}
                                    >
                                        {isRevealed ? result : '?'}
                                    </motion.div>
                                ) : (
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="?"
                                        value={userAnswers[multiplier] || ''}
                                        onChange={(e) => handleMultiplierInput(multiplier, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && checkAllAnswers()}
                                        style={{
                                            width: '100px',
                                            height: '55px',
                                            fontSize: '2rem',
                                            fontWeight: '1000',
                                            textAlign: 'center',
                                            borderRadius: '15px',
                                            border: '3px solid #CBD5E1',
                                            background: 'white',
                                            outline: 'none',
                                            color: '#1E293B',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {mode === 'test' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkAllAnswers}
                        style={{
                            marginTop: '30px',
                            padding: '15px 50px',
                            background: '#E67E22',
                            color: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 6px 0 #D35400',
                            fontSize: '1.5rem',
                            fontWeight: '1000',
                            border: 'none',
                            cursor: 'pointer'
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
