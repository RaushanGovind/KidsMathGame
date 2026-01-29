import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const TWO_WORD_SENTENCES = [
    { text: 'BIG DOG', w1: 'BIG', w2: 'DOG', icon: '🐕', context: 'The dog is big.' },
    { text: 'RED CAR', w1: 'RED', w2: 'CAR', icon: '🚗', context: 'Drive the red car.' },
    { text: 'HOT TEA', w1: 'HOT', w2: 'TEA', icon: '☕', context: 'Be careful, hot tea.' },
    { text: 'MY BAG', w1: 'MY', w2: 'BAG', icon: '🎒', context: 'This is my bag.' },
    { text: 'RUN FAST', w1: 'RUN', w2: 'FAST', icon: '🏃', context: 'Run fast to win.' },
    { text: 'SIT DOWN', w1: 'SIT', w2: 'DOWN', icon: '🪑', context: 'Please sit down.' },
    { text: 'GO HOME', w1: 'GO', w2: 'HOME', icon: '🏠', context: 'Let us go home.' },
    { text: 'BLUE SKY', w1: 'BLUE', w2: 'SKY', icon: '☁️', context: 'Look at the blue sky.' },
    { text: 'GOOD DAY', w1: 'GOOD', w2: 'DAY', icon: '☀️', context: 'Have a good day.' },
    { text: 'EAT FOOD', w1: 'EAT', w2: 'FOOD', icon: '🍽️', context: 'Eat your food.' },
    { text: 'NEW TOY', w1: 'NEW', w2: 'TOY', icon: '🧸', context: 'I have a new toy.' },
    { text: 'SAD BOY', w1: 'SAD', w2: 'BOY', icon: '😢', context: 'Why is the boy sad?' },
    { text: 'ONE CAT', w1: 'ONE', w2: 'CAT', icon: '🐈', context: 'I see one cat.' },
    { text: 'OLD MAN', w1: 'OLD', w2: 'MAN', icon: '👴', context: 'Kind old man.' },
    { text: 'COLD ICE', w1: 'COLD', w2: 'ICE', icon: '🧊', context: 'Ice is very cold.' },
    { text: 'WET DOG', w1: 'WET', w2: 'DOG', icon: '🚿', context: 'The dog is wet.' },
    { text: 'BIG BOX', w1: 'BIG', w2: 'BOX', icon: '📦', context: 'Open the big box.' },
    { text: 'SEE YOU', w1: 'SEE', w2: 'YOU', icon: '👋', context: 'See you later.' },
    { text: 'LOVE MOM', w1: 'LOVE', w2: 'MOM', icon: '👩‍👦', context: 'I love my mom.' },
    { text: 'NICE CAR', w1: 'NICE', w2: 'CAR', icon: '🚔', context: 'That is a nice car.' },
    { text: 'TOP HAT', w1: 'TOP', w2: 'HAT', icon: '🎩', context: 'Wear a top hat.' },
    { text: 'BUS STOP', w1: 'BUS', w2: 'STOP', icon: '🚏', context: 'Wait at the bus stop.' },
    { text: 'RED ROSE', w1: 'RED', w2: 'ROSE', icon: '🌹', context: 'Smell the red rose.' },
    { text: 'SUN SET', w1: 'SUN', w2: 'SET', icon: '🌇', context: 'Watch the sun set.' },
    { text: 'BAD DAY', w1: 'BAD', w2: 'DAY', icon: '🌧️', context: 'It was a bad day.' }
];

function TwoWordSentencesGame({ onBack }) {
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const speak = (text, rate = 0.8) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const currentSentence = TWO_WORD_SENTENCES[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        // "BIG... DOG... BIG DOG!"
        speak(`${currentSentence.w1}...... ${currentSentence.w2}...... ${currentSentence.text}. ${currentSentence.context}`);
    };

    const nextSentence = () => {
        if (currentIndex < TWO_WORD_SENTENCES.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = TWO_WORD_SENTENCES[Math.floor(Math.random() * TWO_WORD_SENTENCES.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = TWO_WORD_SENTENCES[Math.floor(Math.random() * TWO_WORD_SENTENCES.length)];
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
            background: 'linear-gradient(135deg, #E0F2F1 0%, #A7FFEB 100%)'
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
                            border: '6px solid #16A085', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {TWO_WORD_SENTENCES.length}</div>

                        {/* Breakdown */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 20px', borderRadius: '20px' }}>
                                {currentSentence.w1}
                            </div>
                            <div style={{ fontSize: '2rem', color: '#95A5A6' }}>+</div>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 20px', borderRadius: '20px' }}>
                                {currentSentence.w2}
                            </div>
                        </div>

                        <div style={{ fontSize: '3rem', color: '#16A085', marginBottom: '10px' }}>⬇️</div>

                        {/* Full Sentence */}
                        <div style={{ fontSize: '5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px', textAlign: 'center' }}>
                            {currentSentence.text}
                        </div>

                        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{currentSentence.icon}</div>

                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#117A65', background: '#D1F2EB', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>
                            "{currentSentence.context}"
                        </div>
                    </motion.div>

                    <button onClick={nextSentence} disabled={currentIndex === TWO_WORD_SENTENCES.length - 1} style={{ background: currentIndex === TWO_WORD_SENTENCES.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === TWO_WORD_SENTENCES.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.text)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#16A085' }}>Find: "{quizTarget?.text}"</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #E67E22', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #D35400', cursor: 'pointer', minWidth: '200px' }}>
                                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50' }}>{item.text}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TwoWordSentencesGame;
