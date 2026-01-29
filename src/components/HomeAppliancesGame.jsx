import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const APPLIANCES = [
    { word: 'FRIDGE', icon: '❄️', desc: 'Keeps food cold.' },
    { word: 'OVEN', icon: '🍳', desc: 'Cooks our food.' },
    { word: 'TV', icon: '📺', desc: 'Watch cartoons.' },
    { word: 'FAN', icon: '🌬️', desc: 'Blows cool air.' },
    { word: 'LAMP', icon: '🛋️', desc: 'Gives us light.' },
    { word: 'IRON', icon: '👔', desc: 'Smooths clothes.' },
    { word: 'RADIO', icon: '📻', desc: 'Plays music.' },
    { word: 'TOASTER', icon: '🍞', desc: 'Makes bread hot.' },
    { word: 'BLENDER', icon: '🥤', desc: 'Makes juice.' },
    { word: 'WASHER', icon: '🧺', desc: 'Washes clothes.' },
    { word: 'AC', icon: '🥶', desc: 'Makes room cold.' },
    { word: 'HEATER', icon: '🔥', desc: 'Makes room warm.' },
    { word: 'PHONE', icon: '📞', desc: 'Call friends.' },
    { word: 'COMPUTER', icon: '💻', desc: 'Work and play.' },
    { word: 'CLOCK', icon: '⏰', desc: 'Tells the time.' },
    { word: 'CAMERA', icon: '📷', desc: 'Takes photos.' },
    { word: 'VACUUM', icon: '🧹', desc: 'Cleans the floor.' },
    { word: 'HAIRDRYER', icon: '💇', desc: 'Dries wet hair.' },
    { word: 'MICROWAVE', icon: '🍲', desc: 'Heats food fast.' },
    { word: 'SPEAKER', icon: '🔊', desc: 'Loud sound.' }
];

function HomeAppliancesGame({ onBack }) {
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

    const currentItem = APPLIANCES[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentItem.word}. ${currentItem.desc}`);
    };

    const nextItem = () => {
        if (currentIndex < APPLIANCES.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevItem = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = APPLIANCES[Math.floor(Math.random() * APPLIANCES.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = APPLIANCES[Math.floor(Math.random() * APPLIANCES.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Where is the... ${target.word}?`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz') startQuizRound();
    }, [mode]);

    const handleQuizOptionClick = (item) => {
        if (item.word === quizTarget.word) {
            playAppSound('correct');
            setFeedback('correct');
            setScore(s => s + 1);
            speak(`Correct! It is a ${item.word}.`);
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
            background: 'linear-gradient(135deg, #CFD8DC 0%, #B0BEC5 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#607D8B' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
                    <button onClick={prevItem} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentItem.word}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #607D8B', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {APPLIANCES.length}</div>

                        <div style={{ fontSize: '10rem', marginBottom: '20px' }}>{currentItem.icon}</div>

                        <div style={{ fontSize: '4rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px', textAlign: 'center' }}>
                            {currentItem.word}
                        </div>

                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#455A64', background: '#ECEFF1', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>
                            "{currentItem.desc}"
                        </div>
                    </motion.div>

                    <button onClick={nextItem} disabled={currentIndex === APPLIANCES.length - 1} style={{ background: currentIndex === APPLIANCES.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === APPLIANCES.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#607D8B' }}>Find the "{quizTarget?.word}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #F39C12', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer', minWidth: '200px' }}>
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

export default HomeAppliancesGame;
