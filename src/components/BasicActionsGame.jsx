import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const BASIC_ACTIONS = [
    { word: 'RUN', icon: '🏃', context: 'Run fast!' },
    { word: 'JUMP', icon: '🦘', context: 'Jump high!' },
    { word: 'WALK', icon: '🚶', context: 'Walk slowly.' },
    { word: 'SIT', icon: '🪑', context: 'Sit down.' },
    { word: 'STAND', icon: '🧍', context: 'Stand up.' },
    { word: 'EAT', icon: '🍽️', context: 'Eat food.' },
    { word: 'DRINK', icon: '🥤', context: 'Drink water.' },
    { word: 'SLEEP', icon: '😴', context: 'Go to sleep.' },
    { word: 'READ', icon: '📖', context: 'Read a book.' },
    { word: 'WRITE', icon: '✍️', context: 'Write a letter.' },
    { word: 'TALK', icon: '🗣️', context: 'Talk to friends.' },
    { word: 'LISTEN', icon: '👂', context: 'Listen carefully.' },
    { word: 'LAUGH', icon: '😂', context: 'Ha ha ha!' },
    { word: 'CRY', icon: '😢', context: 'Do not cry.' },
    { word: 'SMILE', icon: '😊', context: 'Big smile.' },
    { word: 'PLAY', icon: '🧸', context: 'Play with toys.' },
    { word: 'CLAP', icon: '👏', context: 'Clap your hands.' },
    { word: 'DANCE', icon: '💃', context: 'Dance to music.' }
];

function BasicActionsGame({ onBack }) {
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const speak = (text, rate = 0.9) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const currentAction = BASIC_ACTIONS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentAction.word}. ${currentAction.context}`);
    };

    const nextAction = () => {
        if (currentIndex < BASIC_ACTIONS.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevAction = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = BASIC_ACTIONS[Math.floor(Math.random() * BASIC_ACTIONS.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = BASIC_ACTIONS[Math.floor(Math.random() * BASIC_ACTIONS.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Who provides the action... ${target.word}?`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz') startQuizRound();
    }, [mode]);

    const handleQuizOptionClick = (item) => {
        if (item.word === quizTarget.word) {
            playAppSound('correct');
            setFeedback('correct');
            setScore(s => s + 1);
            speak(`Correct! ${item.word}`);
            setTimeout(startQuizRound, 2000);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak("Try again!");
        }
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#E74C3C' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#8E44AD' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
                    <button onClick={prevAction} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentAction.word}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #E74C3C', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {BASIC_ACTIONS.length}</div>

                        <div style={{ fontSize: '10rem', marginBottom: '20px' }}>{currentAction.icon}</div>

                        <div style={{ fontSize: '4rem', fontWeight: '1000', color: '#C0392B', lineHeight: 1, marginBottom: '20px', textAlign: 'center' }}>
                            {currentAction.word}
                        </div>

                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#C0392B', background: '#FFEBEE', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>
                            "{currentAction.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextAction} disabled={currentIndex === BASIC_ACTIONS.length - 1} style={{ background: currentIndex === BASIC_ACTIONS.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === BASIC_ACTIONS.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E74C3C' }}>Which one is "{quizTarget?.word}"?</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #F1C40F', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #F39C12', cursor: 'pointer', minWidth: '200px' }}>
                                <span style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2C3E50' }}>{item.word}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BasicActionsGame;
