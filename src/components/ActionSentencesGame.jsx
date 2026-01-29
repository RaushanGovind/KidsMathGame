import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const ACTION_SENTENCES = [
    { text: 'THE BOY RUNS', verb: 'RUNS', parts: ['THE', 'BOY', 'RUNS'], icon: '🏃', context: 'Fast!' },
    { text: 'SHE JUMPS HIGH', verb: 'JUMPS', parts: ['SHE', 'JUMPS', 'HIGH'], icon: '🤸', context: 'Up high!' },
    { text: 'WE EAT PIZZA', verb: 'EAT', parts: ['WE', 'EAT', 'PIZZA'], icon: '🍕', context: 'Yummy!' },
    { text: 'I SLEEP NOW', verb: 'SLEEP', parts: ['I', 'SLEEP', 'NOW'], icon: '🛌', context: 'Goodnight.' },
    { text: 'BIRDS FLY AWAY', verb: 'FLY', parts: ['BIRDS', 'FLY', 'AWAY'], icon: '🦅', context: 'In the sky.' },
    { text: 'FISH SWIM FAST', verb: 'SWIM', parts: ['FISH', 'SWIM', 'FAST'], icon: '🐟', context: 'Splash!' },
    { text: 'HE KICKS BALL', verb: 'KICKS', parts: ['HE', 'KICKS', 'BALL'], icon: '⚽', context: 'Goal!' },
    { text: 'SHE READS BOOK', verb: 'READS', parts: ['SHE', 'READS', 'BOOK'], icon: '📖', context: 'Good story.' },
    { text: 'THEY DANCE WELL', verb: 'DANCE', parts: ['THEY', 'DANCE', 'WELL'], icon: '💃', context: 'Music on.' },
    { text: 'I DRINK MILK', verb: 'DRINK', parts: ['I', 'DRINK', 'MILK'], icon: '🥛', context: 'Healthy!' },
    { text: 'DOG BARKS LOUD', verb: 'BARKS', parts: ['DOG', 'BARKS', 'LOUD'], icon: '🐕', context: 'Woof woof!' },
    { text: 'CAT SITS DOWN', verb: 'SITS', parts: ['CAT', 'SITS', 'DOWN'], icon: '🐈', context: 'On the mat.' },
    { text: 'WE SING SONGS', verb: 'SING', parts: ['WE', 'SING', 'SONGS'], icon: '🎤', context: 'La la la!' },
    { text: 'BABY CRIES NOW', verb: 'CRIES', parts: ['BABY', 'CRIES', 'NOW'], icon: '👶', context: 'Wah wah!' },
    { text: 'SHE WRITES NAME', verb: 'WRITES', parts: ['SHE', 'WRITES', 'NAME'], icon: '✍️', context: 'With a pen.' },
    { text: 'I WASH HANDS', verb: 'WASH', parts: ['I', 'WASH', 'HANDS'], icon: '🧼', context: 'Clean hands.' },
    { text: 'HE DRIVES CAR', verb: 'DRIVES', parts: ['HE', 'DRIVES', 'CAR'], icon: '🚗', context: 'Beep beep.' },
    { text: 'MOM COOKS FOOD', verb: 'COOKS', parts: ['MOM', 'COOKS', 'FOOD'], icon: '🍳', context: 'Smells good.' },
    { text: 'DAD WORKS HARD', verb: 'WORKS', parts: ['DAD', 'WORKS', 'HARD'], icon: '💼', context: 'At office.' },
    { text: 'I LOVE YOU', verb: 'LOVE', parts: ['I', 'LOVE', 'YOU'], icon: '❤️', context: 'Big hug.' }
];

function ActionSentencesGame({ onBack }) {
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

    const currentSentence = ACTION_SENTENCES[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        // Highlighting the verb in speech slightly if possible, or just reading clearly
        speak(`${currentSentence.text}. ${currentSentence.context}`);
    };

    const nextSentence = () => {
        if (currentIndex < ACTION_SENTENCES.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = ACTION_SENTENCES[Math.floor(Math.random() * ACTION_SENTENCES.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = ACTION_SENTENCES[Math.floor(Math.random() * ACTION_SENTENCES.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Show me... ${target.text}`), 500);
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
                    <button onClick={prevSentence} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentSentence.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #E74C3C', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {ACTION_SENTENCES.length}</div>

                        <div style={{ fontSize: '3rem', color: '#E74C3C', marginBottom: '10px', fontWeight: 'bold' }}>ACTION TIME! ⚡</div>

                        {/* Sentence with Highlighted Verb */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
                            {currentSentence.parts.map((word, i) => (
                                <motion.span
                                    key={i}
                                    style={{
                                        fontSize: '4rem',
                                        fontWeight: '1000',
                                        color: word === currentSentence.verb ? '#E74C3C' : '#2C3E50',
                                        textDecoration: word === currentSentence.verb ? 'underline' : 'none',
                                        textDecorationColor: '#F1C40F',
                                        textDecorationThickness: '5px'
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>

                        <div style={{ fontSize: '10rem', marginBottom: '10px' }}>{currentSentence.icon}</div>

                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#C0392B', background: '#FFEBEE', padding: '15px 40px', borderRadius: '30px', textAlign: 'center' }}>
                            "{currentSentence.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextSentence} disabled={currentIndex === ACTION_SENTENCES.length - 1} style={{ background: currentIndex === ACTION_SENTENCES.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === ACTION_SENTENCES.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.text)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E74C3C' }}>Who is doing this? "{quizTarget?.text}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #F1C40F', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #F39C12', cursor: 'pointer', minWidth: '250px' }}>
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

export default ActionSentencesGame;
