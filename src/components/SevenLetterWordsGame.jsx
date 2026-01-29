import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const SEVEN_LETTER_WORDS = [
    { word: 'AIRPORT', p1: 'A', p2: 'I', p3: 'R', p4: 'P', p5: 'O', p6: 'R', p7: 'T', icon: '🛫', sentence: 'Fly from the airport.' },
    { word: 'BALLOON', p1: 'B', p2: 'A', p3: 'L', p4: 'L', p5: 'O', p6: 'O', p7: 'N', icon: '🎈', sentence: 'Red floating balloon.' },
    { word: 'BEDROOM', p1: 'B', p2: 'E', p3: 'D', p4: 'R', p5: 'O', p6: 'O', p7: 'M', icon: '🛌', sentence: 'Sleep in your bedroom.' },
    { word: 'BICYCLE', p1: 'B', p2: 'I', p3: 'C', p4: 'Y', p5: 'C', p6: 'L', p7: 'E', icon: '🚲', sentence: 'Ride your bicycle.' },
    { word: 'BLANKET', p1: 'B', p2: 'L', p3: 'A', p4: 'N', p5: 'K', p6: 'E', p7: 'T', icon: '🛌', sentence: 'Warm soft blanket.' },
    { word: 'BROTHER', p1: 'B', p2: 'R', p3: 'O', p4: 'T', p5: 'H', p6: 'E', p7: 'R', icon: '👦', sentence: 'Play with brother.' },
    { word: 'CHICKEN', p1: 'C', p2: 'H', p3: 'I', p4: 'C', p5: 'K', p6: 'E', p7: 'N', icon: '🐔', sentence: 'Cluck cluck chicken.' },
    { word: 'CUPCAKE', p1: 'C', p2: 'U', p3: 'P', p4: 'C', p5: 'A', p6: 'K', p7: 'E', icon: '🧁', sentence: 'Sweet frosting cupcake.' },
    { word: 'DOLPHIN', p1: 'D', p2: 'O', p3: 'L', p4: 'P', p5: 'H', p6: 'I', p7: 'N', icon: '🐬', sentence: 'Jumping blue dolphin.' },
    { word: 'EVENING', p1: 'E', p2: 'V', p3: 'E', p4: 'N', p5: 'I', p6: 'N', p7: 'G', icon: '🌇', sentence: 'Sun sets in the evening.' },
    { word: 'FARMING', p1: 'F', p2: 'A', p3: 'R', p4: 'M', p5: 'I', p6: 'N', p7: 'G', icon: '🚜', sentence: 'Tractor farming field.' },
    { word: 'FEATHER', p1: 'F', p2: 'E', p3: 'A', p4: 'T', p5: 'H', p6: 'E', p7: 'R', icon: '🪶', sentence: 'Light bird feather.' },
    { word: 'GIRAFFE', p1: 'G', p2: 'I', p3: 'R', p4: 'A', p5: 'F', p6: 'F', p7: 'E', icon: '🦒', sentence: 'Tall neck giraffe.' },
    { word: 'HAMSTER', p1: 'H', p2: 'A', p3: 'M', p4: 'S', p5: 'T', p6: 'E', p7: 'R', icon: '🐹', sentence: 'Cute little hamster.' },
    { word: 'HOLIDAY', p1: 'H', p2: 'O', p3: 'L', p4: 'I', p5: 'D', p6: 'A', p7: 'Y', icon: '🎉', sentence: 'Happy holiday fun.' },
    { word: 'KITCHEN', p1: 'K', p2: 'I', p3: 'T', p4: 'C', p5: 'H', p6: 'E', p7: 'N', icon: '🍳', sentence: 'Cook in the kitchen.' },
    { word: 'LIBRARY', p1: 'L', p2: 'I', p3: 'B', p4: 'R', p5: 'A', p6: 'R', p7: 'Y', icon: '📚', sentence: 'Quiet reading library.' },
    { word: 'LOBSTER', p1: 'L', p2: 'O', p3: 'B', p4: 'S', p5: 'T', p6: 'E', p7: 'R', icon: '🦞', sentence: 'Red ocean lobster.' },
    { word: 'MESSAGE', p1: 'M', p2: 'E', p3: 'S', p4: 'S', p5: 'A', p6: 'G', p7: 'E', icon: '💬', sentence: 'Send a message.' },
    { word: 'MORNING', p1: 'M', p2: 'O', p3: 'R', p4: 'N', p5: 'I', p6: 'N', p7: 'G', icon: '🌅', sentence: 'Good morning sun.' },
    { word: 'OCTOPUS', p1: 'O', p2: 'C', p3: 'T', p4: 'O', p5: 'P', p6: 'U', p7: 'S', icon: '🐙', sentence: 'Eight-legged octopus.' },
    { word: 'OUTSIDE', p1: 'O', p2: 'U', p3: 'T', p4: 'S', p5: 'I', p6: 'D', p7: 'E', icon: '🌳', sentence: 'Play outside today.' },
    { word: 'PAINTER', p1: 'P', p2: 'A', p3: 'I', p4: 'N', p5: 'T', p6: 'E', p7: 'R', icon: '🎨', sentence: 'Colorful art painter.' },
    { word: 'PAJAMAS', p1: 'P', p2: 'A', p3: 'J', p4: 'A', p5: 'M', p6: 'A', p7: 'S', icon: '👚', sentence: 'Wear cozy pajamas.' },
    { word: 'PENGUIN', p1: 'P', p2: 'E', p3: 'N', p4: 'G', p5: 'U', p6: 'I', p7: 'N', icon: '🐧', sentence: 'Waddle little penguin.' },
    { word: 'PICTURE', p1: 'P', p2: 'I', p3: 'C', p4: 'T', p5: 'U', p6: 'R', p7: 'E', icon: '🖼️', sentence: 'Draw a nice picture.' },
    { word: 'POPCORN', p1: 'P', p2: 'O', p3: 'P', p4: 'C', p5: 'O', p6: 'R', p7: 'N', icon: '🍿', sentence: 'Crunchy movie popcorn.' },
    { word: 'PUMPKIN', p1: 'P', p2: 'U', p3: 'M', p4: 'P', p5: 'K', p6: 'I', p7: 'N', icon: '🎃', sentence: 'Orange halloween pumpkin.' },
    { word: 'RAINBOW', p1: 'R', p2: 'A', p3: 'I', p4: 'N', p5: 'B', p6: 'O', p7: 'W', icon: '🌈', sentence: 'Colorful sky rainbow.' },
    { word: 'SCOOTER', p1: 'S', p2: 'C', p3: 'O', p4: 'O', p5: 'T', p6: 'E', p7: 'R', icon: '🛴', sentence: 'Ride my scooter.' },
    { word: 'SNOWMAN', p1: 'S', p2: 'N', p3: 'O', p4: 'W', p5: 'M', p6: 'A', p7: 'N', icon: '⛄', sentence: 'Frosty the snowman.' },
    { word: 'STADIUM', p1: 'S', p2: 'T', p3: 'A', p4: 'D', p5: 'I', p6: 'U', p7: 'M', icon: '🏟️', sentence: 'Big sports stadium.' },
    { word: 'TEACHER', p1: 'T', p2: 'E', p3: 'A', p4: 'C', p5: 'H', p6: 'E', p7: 'R', icon: '👩‍🏫', sentence: 'Listen to the teacher.' },
    { word: 'THEATER', p1: 'T', p2: 'H', p3: 'E', p4: 'A', p5: 'T', p6: 'E', p7: 'R', icon: '🎭', sentence: 'Movie theater fun.' },
    { word: 'TORNADO', p1: 'T', p2: 'O', p3: 'R', p4: 'N', p5: 'A', p6: 'D', p7: 'O', icon: '🌪️', sentence: 'Spinning wind tornado.' },
    { word: 'TRACTOR', p1: 'T', p2: 'R', p3: 'A', p4: 'C', p5: 'T', p6: 'O', p7: 'R', icon: '🚜', sentence: 'Drive the tractor.' },
    { word: 'TRUMPET', p1: 'T', p2: 'R', p3: 'U', p4: 'M', p5: 'P', p6: 'E', p7: 'T', icon: '🎺', sentence: 'Blow the trumpet.' },
    { word: 'UNICORN', p1: 'U', p2: 'N', p3: 'I', p4: 'C', p5: 'O', p6: 'R', p7: 'N', icon: '🦄', sentence: 'Magical pretty unicorn.' },
    { word: 'VACATIO', p1: 'V', p2: 'A', p3: 'C', p4: 'A', p5: 'T', p6: 'I', p7: 'O', icon: '🏖️', sentence: 'Summer vacation trip.' }, // Fix? VACATION is 8. Replacing with VOLCANO
    { word: 'VOLCANO', p1: 'V', p2: 'O', p3: 'L', p4: 'C', p5: 'A', p6: 'N', p7: 'O', icon: '🌋', sentence: 'Hot lava volcano.' },
    { word: 'WEATHER', p1: 'W', p2: 'E', p3: 'A', p4: 'T', p5: 'H', p6: 'E', p7: 'R', icon: '🌦️', sentence: 'Check the weather.' },
    { word: 'WHISTLE', p1: 'W', p2: 'H', p3: 'I', p4: 'S', p5: 'T', p6: 'L', p7: 'E', icon: '😗', sentence: 'Blow the whistle.' }
].filter(w => w.word.length === 7);

function SevenLetterWordsGame({ onBack }) {
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

    const currentWord = SEVEN_LETTER_WORDS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentWord.p1}... ${currentWord.p2}... ${currentWord.p3}... ${currentWord.p4}... ${currentWord.p5}... ${currentWord.p6}... ${currentWord.p7}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < SEVEN_LETTER_WORDS.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevWord = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = SEVEN_LETTER_WORDS[Math.floor(Math.random() * SEVEN_LETTER_WORDS.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = SEVEN_LETTER_WORDS[Math.floor(Math.random() * SEVEN_LETTER_WORDS.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`Find the word... ${target.word}`), 500);
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
            background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#8E44AD' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E91E63' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '1200px', justifyContent: 'center' }}>
                    <button onClick={prevWord} disabled={currentIndex === 0} style={{ background: currentIndex === 0 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === 0 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>⬅</button>

                    <motion.div
                        key={currentWord.word}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        onClick={playLearnSequence}
                        style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '1000px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #8E44AD', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {SEVEN_LETTER_WORDS.length}</div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[currentWord.p1, currentWord.p2, currentWord.p3, currentWord.p4, currentWord.p5, currentWord.p6, currentWord.p7].map((char, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#8E44AD', border: '3px dashed #8E44AD', padding: '10px 12px', borderRadius: '15px' }}>{char}</div>
                                    {i < 6 && <div style={{ fontSize: '1.5rem', color: '#95A5A6', marginLeft: '3px' }}>+</div>}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: '3rem', color: '#8E44AD', marginBottom: '10px' }}>⬇️</div>
                        <div style={{ fontSize: '4.5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>{currentWord.word}</div>
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>{currentWord.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6C3483', background: '#F3E5F5', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>"{currentWord.sentence}"</div>
                    </motion.div>

                    <button onClick={nextWord} disabled={currentIndex === SEVEN_LETTER_WORDS.length - 1} style={{ background: currentIndex === SEVEN_LETTER_WORDS.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === SEVEN_LETTER_WORDS.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#8E44AD' }}>Which one is "{quizTarget?.word}"?</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #E91E63', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #C2185B', cursor: 'pointer' }}>
                                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                                <span style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50' }}>{item.word}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SevenLetterWordsGame;
