import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const THREE_WORD_SENTENCES = [
    { text: 'I LOVE YOU', w1: 'I', w2: 'LOVE', w3: 'YOU', icon: '❤️', context: 'Tell mom I love you.' },
    { text: 'THE BIG DOG', w1: 'THE', w2: 'BIG', w3: 'DOG', icon: '🐕', context: 'Look at the big dog.' },
    { text: 'SEE THE CAT', w1: 'SEE', w2: 'THE', w3: 'CAT', icon: '🐈', context: 'Can you see the cat?' },
    { text: 'I CAN RUN', w1: 'I', w2: 'CAN', w3: 'RUN', icon: '🏃', context: 'Watch me, I can run!' },
    { text: 'SHE IS NICE', w1: 'SHE', w2: 'IS', w3: 'NICE', icon: '👧', context: 'My friend, she is nice.' },
    { text: 'HE HAS TOYS', w1: 'HE', w2: 'HAS', w3: 'TOYS', icon: '🧸', context: 'He has many toys.' },
    { text: 'SUN IS HOT', w1: 'SUN', w2: 'IS', w3: 'HOT', icon: '☀️', context: 'The sun is very hot.' },
    { text: 'BAT IS BLACK', w1: 'BAT', w2: 'IS', w3: 'BLACK', icon: '🦇', context: 'The bat is black.' },
    { text: 'EAT THE EGG', w1: 'EAT', w2: 'THE', w3: 'EGG', icon: '🥚', context: 'Please eat the egg.' },
    { text: 'GO TO BED', w1: 'GO', w2: 'TO', w3: 'BED', icon: '🛏️', context: 'Time to go to bed.' },
    { text: 'MY RED CAR', w1: 'MY', w2: 'RED', w3: 'CAR', icon: '🚗', context: 'Drive my red car.' },
    { text: 'SEE YOU LATER', w1: 'SEE', w2: 'YOU', w3: 'LATER', icon: '👋', context: 'Bye, see you later.' },
    { text: 'MOM IS HOME', w1: 'MOM', w2: 'IS', w3: 'HOME', icon: '🏠', context: 'Yay, mom is home!' },
    { text: 'DAD IS TALL', w1: 'DAD', w2: 'IS', w3: 'TALL', icon: '👨', context: 'My dad is tall.' },
    { text: 'SKY IS BLUE', w1: 'SKY', w2: 'IS', w3: 'BLUE', icon: '☁️', context: 'The sky is blue today.' },
    { text: 'ANT IS SMALL', w1: 'ANT', w2: 'IS', w3: 'SMALL', icon: '🐜', context: 'The ant is very small.' },
    { text: 'BOX IS OPEN', w1: 'BOX', w2: 'IS', w3: 'OPEN', icon: '📦', context: 'The box is open.' },
    { text: 'WE ARE HAPPY', w1: 'WE', w2: 'ARE', w3: 'HAPPY', icon: '😊', context: 'We are happy family.' },
    { text: 'IT IS COLD', w1: 'IT', w2: 'IS', w3: 'COLD', icon: '❄️', context: 'Brrr, it is cold.' },
    { text: 'FISH CAN SWIM', w1: 'FISH', w2: 'CAN', w3: 'SWIM', icon: '🐠', context: 'Fish can swim fast.' }
];

function ThreeWordSentencesGame({ onBack }) {
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

    const currentSentence = THREE_WORD_SENTENCES[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentSentence.w1}... ${currentSentence.w2}... ${currentSentence.w3}...... ${currentSentence.text}. ${currentSentence.context}`);
    };

    const nextSentence = () => {
        if (currentIndex < THREE_WORD_SENTENCES.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = THREE_WORD_SENTENCES[Math.floor(Math.random() * THREE_WORD_SENTENCES.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = THREE_WORD_SENTENCES[Math.floor(Math.random() * THREE_WORD_SENTENCES.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Find... ${target.text}`), 500);
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
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#27AE60' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1100px', justifyContent: 'center' }}>
                    <button onClick={prevSentence} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentSentence.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '900px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #27AE60', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {THREE_WORD_SENTENCES.length}</div>

                        {/* Breakdown */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w1}</div>
                            <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w2}</div>
                            <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w3}</div>
                        </div>

                        <div style={{ fontSize: '3rem', color: '#27AE60', marginBottom: '10px' }}>⬇️</div>

                        <div style={{ fontSize: '4.5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px', textAlign: 'center' }}>
                            {currentSentence.text}
                        </div>

                        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{currentSentence.icon}</div>

                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1E8449', background: '#D5F5E3', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>
                            "{currentSentence.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextSentence} disabled={currentIndex === THREE_WORD_SENTENCES.length - 1} style={{ background: currentIndex === THREE_WORD_SENTENCES.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === THREE_WORD_SENTENCES.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.text)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#27AE60' }}>Find: "{quizTarget?.text}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #E67E22', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer', minWidth: '250px' }}>
                                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2C3E50' }}>{item.text}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThreeWordSentencesGame;
