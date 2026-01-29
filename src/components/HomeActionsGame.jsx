import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const HOME_ACTIONS = [
    { text: 'I BRUSH TEETH', verb: 'BRUSH', parts: ['I', 'BRUSH', 'TEETH'], icon: '🪥', context: 'Clean and white!' },
    { text: 'I WASH FACE', verb: 'WASH', parts: ['I', 'WASH', 'FACE'], icon: '🧼', context: 'Fresh and clean.' },
    { text: 'I COMB HAIR', verb: 'COMB', parts: ['I', 'COMB', 'HAIR'], icon: '💇', context: 'Look good.' },
    { text: 'MOM COOKS FOOD', verb: 'COOKS', parts: ['MOM', 'COOKS', 'FOOD'], icon: '🍳', context: 'Yummy smell.' },
    { text: 'DAD WASHES CAR', verb: 'WASHES', parts: ['DAD', 'WASHES', 'CAR'], icon: '🚗', context: 'Shiny car.' },
    { text: 'WE WATCH TV', verb: 'WATCH', parts: ['WE', 'WATCH', 'TV'], icon: '📺', context: 'Fun cartoon.' },
    { text: 'I READ BOOK', verb: 'READ', parts: ['I', 'READ', 'BOOK'], icon: '📖', context: 'Quiet time.' },
    { text: 'I SLEEP IN BED', verb: 'SLEEP', parts: ['I', 'SLEEP', 'IN', 'BED'], icon: '🛌', context: 'Goodnight.' },
    { text: 'I EAT LUNCH', verb: 'EAT', parts: ['I', 'EAT', 'LUNCH'], icon: '🍽️', context: 'Full tummy.' },
    { text: 'I DRINK WATER', verb: 'DRINK', parts: ['I', 'DRINK', 'WATER'], icon: '🥤', context: 'Thirsty.' },
    { text: 'I CLEAN ROOM', verb: 'CLEAN', parts: ['I', 'CLEAN', 'ROOM'], icon: '🧹', context: 'Tidy up.' },
    { text: 'I PLAY TOYS', verb: 'PLAY', parts: ['I', 'PLAY', 'TOYS'], icon: '🧸', context: 'Have fun.' },
    { text: 'SHE BAKES CAKE', verb: 'BAKES', parts: ['SHE', 'BAKES', 'CAKE'], icon: '🎂', context: 'Sweet treat.' },
    { text: 'HE WATERS PLANT', verb: 'WATERS', parts: ['HE', 'WATERS', 'PLANT'], icon: '🪴', context: 'Grow green.' },
    { text: 'WE SIT ON SOFA', verb: 'SIT', parts: ['WE', 'SIT', 'ON', 'SOFA'], icon: '🛋️', context: 'Comfy.' },
    { text: 'I OPEN DOOR', verb: 'OPEN', parts: ['I', 'OPEN', 'DOOR'], icon: '🚪', context: 'Welcome home.' },
    { text: 'I CLOSE WINDOW', verb: 'CLOSE', parts: ['I', 'CLOSE', 'WINDOW'], icon: '🪟', context: 'Keep warm.' },
    { text: 'I PUT ON SHOES', verb: 'PUT ON', parts: ['I', 'PUT ON', 'SHOES'], icon: '👟', context: 'Ready to go.' },
    { text: 'SHE SETS TABLE', verb: 'SETS', parts: ['SHE', 'SETS', 'TABLE'], icon: '🍽️', context: 'Dinner time.' },
    { text: 'HE SWEEPS FLOOR', verb: 'SWEEPS', parts: ['HE', 'SWEEPS', 'FLOOR'], icon: '🧹', context: 'No dust.' }
];

function HomeActionsGame({ onBack }) {
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const speak = (text, rate = 0.85) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const currentAction = HOME_ACTIONS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentAction.text}. ${currentAction.context}`);
    };

    const nextAction = () => {
        if (currentIndex < HOME_ACTIONS.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevAction = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = HOME_ACTIONS[Math.floor(Math.random() * HOME_ACTIONS.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = HOME_ACTIONS[Math.floor(Math.random() * HOME_ACTIONS.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Who is doing... ${target.text}`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz') startQuizRound();
    }, [mode]);

    const handleQuizOptionClick = (item) => {
        if (item.text === quizTarget.text) {
            playAppSound('correct');
            setFeedback('correct');
            setScore(s => s + 1);
            speak(`Correct! ${item.text}`);
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
            background: 'linear-gradient(135deg, #FBE9E7 0%, #FFCCBC 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#D35400' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#8E44AD' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
                    <button onClick={prevAction} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentAction.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #D35400', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {HOME_ACTIONS.length}</div>

                        <div style={{ fontSize: '2.5rem', color: '#D35400', marginBottom: '10px', fontWeight: 'bold' }}>AT HOME 🏠</div>

                        {/* Sentence with Highlighted Verb */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
                            {currentAction.parts.map((word, i) => (
                                <motion.span
                                    key={i}
                                    style={{
                                        fontSize: '4rem',
                                        fontWeight: '1000',
                                        color: word === currentAction.verb || (currentAction.verb === 'PUT ON' && (word === 'PUT' || word === 'ON')) ? '#D35400' : '#2C3E50',
                                        textDecoration: word === currentAction.verb || (currentAction.verb === 'PUT ON' && (word === 'PUT' || word === 'ON')) ? 'underline' : 'none',
                                        textDecorationColor: '#F39C12',
                                        textDecorationThickness: '4px'
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>

                        <div style={{ fontSize: '10rem', marginBottom: '10px' }}>{currentAction.icon}</div>

                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#A04000', background: '#FFCCBC', padding: '15px 40px', borderRadius: '30px', textAlign: 'center' }}>
                            "{currentAction.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextAction} disabled={currentIndex === HOME_ACTIONS.length - 1} style={{ background: currentIndex === HOME_ACTIONS.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === HOME_ACTIONS.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.text)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#D35400' }}>Find: "{quizTarget?.text}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #E67E22', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer', minWidth: '250px' }}>
                                <span style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2C3E50' }}>{item.text}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeActionsGame;
