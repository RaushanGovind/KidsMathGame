import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const FOUR_WORD_SENTENCES = [
    { text: 'THE CAT IS FAT', w1: 'THE', w2: 'CAT', w3: 'IS', w4: 'FAT', icon: '🐱', context: 'Oh no, the cat is fat.' },
    { text: 'I LIKE MY DOG', w1: 'I', w2: 'LIKE', w3: 'MY', w4: 'DOG', icon: '🐶', context: 'I really like my dog.' },
    { text: 'WE GO TO PARK', w1: 'WE', w2: 'GO', w3: 'TO', w4: 'PARK', icon: '⛲', context: 'Let us go to the park.' },
    { text: 'THE SUN IS HOT', w1: 'THE', w2: 'SUN', w3: 'IS', w4: 'HOT', icon: '☀️', context: 'Wear a hat, the sun is hot.' },
    { text: 'HE HAS A BALL', w1: 'HE', w2: 'HAS', w3: 'A', w4: 'BALL', icon: '⚽', context: 'Look, he has a ball.' },
    { text: 'SHE HAS A DOLL', w1: 'SHE', w2: 'HAS', w3: 'A', w4: 'DOLL', icon: '🎎', context: 'She plays with her doll.' },
    { text: 'THE SKY IS BLUE', w1: 'THE', w2: 'SKY', w3: 'IS', w4: 'BLUE', icon: '☁️', context: 'Look up, the sky is blue.' },
    { text: 'I SEE A BIRD', w1: 'I', w2: 'SEE', w3: 'A', w4: 'BIRD', icon: '🐦', context: 'I see a little bird.' },
    { text: 'MY DAD IS TALL', w1: 'MY', w2: 'DAD', w3: 'IS', w4: 'TALL', icon: '👨', context: 'Wow, my dad is tall.' },
    { text: 'GIVE ME THE TOY', w1: 'GIVE', w2: 'ME', w3: 'THE', w4: 'TOY', icon: '🧸', context: 'Please give me the toy.' },
    { text: 'I CAN JUMP HIGH', w1: 'I', w2: 'CAN', w3: 'JUMP', w4: 'HIGH', icon: '🤸', context: 'Watch me jump high!' },
    { text: 'DO NOT BE SAD', w1: 'DO', w2: 'NOT', w3: 'BE', w4: 'SAD', icon: '😊', context: 'Smile, do not be sad.' },
    { text: 'THE CAR IS RED', w1: 'THE', w2: 'CAR', w3: 'IS', w4: 'RED', icon: '🚗', context: 'See the red car go.' },
    { text: 'LOOK AT THE MOON', w1: 'LOOK', w2: 'AT', w3: 'THE', w4: 'MOON', icon: '🌙', context: 'Look at the bright moon.' },
    { text: 'THIS IS MY HOUSE', w1: 'THIS', w2: 'IS', w3: 'MY', w4: 'HOUSE', icon: '🏠', context: 'Welcome, this is my house.' },
    { text: 'I WANT SOME MILK', w1: 'I', w2: 'WANT', w3: 'SOME', w4: 'MILK', icon: '🥛', context: 'Can I have some milk?' },
    { text: 'THE PIG IS PINK', w1: 'THE', w2: 'PIG', w3: 'IS', w4: 'PINK', icon: '🐷', context: 'The little pig is pink.' },
    { text: 'A BUG IS HERE', w1: 'A', w2: 'BUG', w3: 'IS', w4: 'HERE', icon: '🐞', context: 'Eek, a bug is here!' },
    { text: 'LET US GO OUT', w1: 'LET', w2: 'US', w3: 'GO', w4: 'OUT', icon: '🚪', context: 'Come on, let us go out.' },
    { text: 'TIME TO EAT NOW', w1: 'TIME', w2: 'TO', w3: 'EAT', w4: 'NOW', icon: '🍽️', context: 'Dinner is ready, time to eat.' }
];

function FourWordSentencesGame({ onBack }) {
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

    const currentSentence = FOUR_WORD_SENTENCES[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentSentence.w1}... ${currentSentence.w2}... ${currentSentence.w3}... ${currentSentence.w4}...... ${currentSentence.text}. ${currentSentence.context}`);
    };

    const nextSentence = () => {
        if (currentIndex < FOUR_WORD_SENTENCES.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = FOUR_WORD_SENTENCES[Math.floor(Math.random() * FOUR_WORD_SENTENCES.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = FOUR_WORD_SENTENCES[Math.floor(Math.random() * FOUR_WORD_SENTENCES.length)];
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
            background: 'linear-gradient(135deg, #AED6F1 0%, #EBF5FB 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#2980B9' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1200px', justifyContent: 'center' }}>
                    <button onClick={prevSentence} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentSentence.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '1000px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #2980B9', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {FOUR_WORD_SENTENCES.length}</div>

                        {/* Breakdown */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w1}</div>
                            <div style={{ fontSize: '1.5rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w2}</div>
                            <div style={{ fontSize: '1.5rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w3}</div>
                            <div style={{ fontSize: '1.5rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 15px', borderRadius: '20px' }}>{currentSentence.w4}</div>
                        </div>

                        <div style={{ fontSize: '3rem', color: '#2980B9', marginBottom: '10px' }}>⬇️</div>

                        <div style={{ fontSize: '4rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px', textAlign: 'center' }}>
                            {currentSentence.text}
                        </div>

                        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{currentSentence.icon}</div>

                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1F618D', background: '#D4E6F1', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>
                            "{currentSentence.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextSentence} disabled={currentIndex === FOUR_WORD_SENTENCES.length - 1} style={{ background: currentIndex === FOUR_WORD_SENTENCES.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === FOUR_WORD_SENTENCES.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.text)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#2980B9' }}>Find: "{quizTarget?.text}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #E67E22', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer', minWidth: '280px' }}>
                                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2C3E50' }}>{item.text}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FourWordSentencesGame;
