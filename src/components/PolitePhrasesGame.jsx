import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const POLITE_PHRASES = [
    { text: 'THANK YOU', icon: '🙏', context: 'When someone helps you.' },
    { text: 'THANK YOU VERY MUCH', icon: '🙏❤️', context: 'Big thanks!' },
    { text: 'YOU ARE WELCOME', icon: '🤲', context: 'After someone says thanks.' },
    { text: 'PLEASE WAIT A MOMENT', icon: '✋', context: 'Just a little time.' },
    { text: 'EXCUSE ME', icon: '🙋', context: 'Polite attention.' },
    { text: 'SORRY FOR THE WAIT', icon: '🙇', context: 'Apologize for delay.' },
    { text: 'HAVE A NICE DAY', icon: '👋☀️', context: 'Friendly goodbye.' },
    { text: 'MAY I HELP YOU?', icon: '💁', context: 'Offering help.' },
    { text: 'NICE TO MEET YOU', icon: '🤝', context: 'Meeting a new friend.' },
    { text: 'GOOD MORNING', icon: '🌅', context: 'Start of the day.' },
    { text: 'GOOD NIGHT', icon: '🌙', context: 'End of the day.' },
    { text: 'GOODBYE', icon: '👋', context: 'Saying farewell.' },
    { text: 'HAVE A SAFE TRIP', icon: '✈️', context: 'Travel safely.' },
    { text: 'PLEASE VISIT AGAIN', icon: '🏠', context: 'Come back soon.' },
    { text: 'SEE YOU SOON', icon: '🔜', context: 'We will meet again.' }
];

function PolitePhrasesGame({ onBack }) {
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

    const currentPhrase = POLITE_PHRASES[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentPhrase.text}. ${currentPhrase.context}`);
    };

    const nextPhrase = () => {
        if (currentIndex < POLITE_PHRASES.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevPhrase = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = POLITE_PHRASES[Math.floor(Math.random() * POLITE_PHRASES.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = POLITE_PHRASES[Math.floor(Math.random() * POLITE_PHRASES.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`When do we say... ${target.text}?`), 500);
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
            background: 'linear-gradient(135deg, #E8F8F5 0%, #D1F2EB 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#16A085' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
                    <button onClick={prevPhrase} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentPhrase.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #16A085', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {POLITE_PHRASES.length}</div>

                        <div style={{ fontSize: '10rem', marginBottom: '20px' }}>{currentPhrase.icon}</div>

                        <div style={{ fontSize: '3.5rem', fontWeight: '1000', color: '#0E6251', lineHeight: 1.2, marginBottom: '20px', textAlign: 'center' }}>
                            {currentPhrase.text}
                        </div>

                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#117864', background: '#E8F8F5', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>
                            "{currentPhrase.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextPhrase} disabled={currentIndex === POLITE_PHRASES.length - 1} style={{ background: currentIndex === POLITE_PHRASES.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === POLITE_PHRASES.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.text)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#16A085' }}>Be polite: "{quizTarget?.text}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #F39C12', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer', minWidth: '250px' }}>
                                <span style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2C3E50', textAlign: 'center' }}>{item.text}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PolitePhrasesGame;
