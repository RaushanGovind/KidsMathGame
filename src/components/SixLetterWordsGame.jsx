import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const SIX_LETTER_WORDS = [
    { word: 'ANIMAL', p1: 'A', p2: 'N', p3: 'I', p4: 'M', p5: 'A', p6: 'L', icon: '🐘', sentence: 'The elephant is a big animal.' },
    { word: 'BANANA', p1: 'B', p2: 'A', p3: 'N', p4: 'A', p5: 'N', p6: 'A', icon: '🍌', sentence: 'Yellow sweet banana.' },
    { word: 'BOTTLE', p1: 'B', p2: 'O', p3: 'T', p4: 'T', p5: 'L', p6: 'E', icon: '🍾', sentence: 'Water in a bottle.' },
    { word: 'BRIDGE', p1: 'B', p2: 'R', p3: 'I', p4: 'D', p5: 'G', p6: 'E', icon: '🌉', sentence: 'Cross the bridge.' },
    { word: 'BUTTON', p1: 'B', p2: 'U', p3: 'T', p4: 'T', p5: 'O', p6: 'N', icon: '🔘', sentence: 'Push the button.' },
    { word: 'CAMERA', p1: 'C', p2: 'A', p3: 'M', p4: 'E', p5: 'R', p6: 'A', icon: '📷', sentence: 'Smile for the camera.' },
    { word: 'CARROT', p1: 'C', p2: 'A', p3: 'R', p4: 'R', p5: 'O', p6: 'T', icon: '🥕', sentence: 'Crunchy orange carrot.' },
    { word: 'CASTLE', p1: 'C', p2: 'A', p3: 'S', p4: 'T', p5: 'L', p6: 'E', icon: '🏰', sentence: 'A big stone castle.' },
    { word: 'CHEESE', p1: 'C', p2: 'H', p3: 'E', p4: 'E', p5: 'S', p6: 'E', icon: '🧀', sentence: 'I like cheese.' },
    { word: 'CIRCLE', p1: 'C', p2: 'I', p3: 'R', p4: 'C', p5: 'L', p6: 'E', icon: '🔴', sentence: 'Round like a circle.' },
    { word: 'COOKIE', p1: 'C', p2: 'O', p3: 'O', p4: 'K', p5: 'I', p6: 'E', icon: '🍪', sentence: 'Yummy chocolate cookie.' },
    { word: 'DOCTOR', p1: 'D', p2: 'O', p3: 'C', p4: 'T', p5: 'O', p6: 'R', icon: '👨‍⚕️', sentence: 'The doctor helps us.' },
    { word: 'DONKEY', p1: 'D', p2: 'O', p3: 'N', p4: 'K', p5: 'E', p6: 'Y', icon: '🫏', sentence: 'The donkey says hee-haw.' },
    { word: 'DRAGON', p1: 'D', p2: 'R', p3: 'A', p4: 'G', p5: 'O', p6: 'N', icon: '🐉', sentence: 'Fire breathing dragon.' },
    { word: 'FAMILY', p1: 'F', p2: 'A', p3: 'M', p4: 'I', p5: 'L', p6: 'Y', icon: '👨‍👩‍👧‍👦', sentence: 'I love my family.' },
    { word: 'FINGER', p1: 'F', p2: 'I', p3: 'N', p4: 'G', p5: 'E', p6: 'R', icon: '☝️', sentence: 'Point with your finger.' },
    { word: 'FLOWER', p1: 'F', p2: 'L', p3: 'O', p4: 'W', p5: 'E', p6: 'R', icon: '🌸', sentence: 'Beautiful pink flower.' },
    { word: 'FOREST', p1: 'F', p2: 'O', p3: 'R', p4: 'E', p5: 'S', p6: 'T', icon: '🌲', sentence: 'Trees in the forest.' },
    { word: 'FRIEND', p1: 'F', p2: 'R', p3: 'I', p4: 'E', p5: 'N', p6: 'D', icon: '🤝', sentence: 'Playing with a friend.' },
    { word: 'GARDEN', p1: 'G', p2: 'A', p3: 'R', p4: 'D', p5: 'E', p6: 'N', icon: '🏡', sentence: 'Flowers in the garden.' },
    { word: 'GIRAFFE', p1: 'G', p2: 'I', p3: 'R', p4: 'A', p5: 'F', p6: 'F', icon: '🦒', sentence: 'Tall neck giraffe.' },  // Wait, giraffe is 7 letters. Let's keep it but fix array access/logic if assumed 6
    { word: 'GUITAR', p1: 'G', p2: 'U', p3: 'I', p4: 'T', p5: 'A', p6: 'R', icon: '🎸', sentence: 'Play the guitar.' },
    { word: 'JUNGLE', p1: 'J', p2: 'U', p3: 'N', p4: 'G', p5: 'L', p6: 'E', icon: '🌴', sentence: 'Wild jungle animals.' },
    { word: 'KITTEN', p1: 'K', p2: 'I', p3: 'T', p4: 'T', p5: 'E', p6: 'N', icon: '🐱', sentence: 'Cute baby kitten.' },
    { word: 'LADDER', p1: 'L', p2: 'A', p3: 'D', p4: 'D', p5: 'E', p6: 'R', icon: '🪜', sentence: 'Climb the ladder.' },
    { word: 'LAPTOP', p1: 'L', p2: 'A', p3: 'P', p4: 'T', p5: 'O', p6: 'P', icon: '💻', sentence: 'Work on the laptop.' },
    { word: 'MARKER', p1: 'M', p2: 'A', p3: 'R', p4: 'K', p5: 'E', p6: 'R', icon: '🖍️', sentence: 'Color with a marker.' },
    { word: 'MONKEY', p1: 'M', p2: 'O', p3: 'N', p4: 'K', p5: 'E', p6: 'Y', icon: '🐒', sentence: 'Monkey likes bananas.' },
    { word: 'NUMBER', p1: 'N', p2: 'U', p3: 'M', p4: 'B', p5: 'E', p6: 'R', icon: '🔢', sentence: 'Count the numbers.' },
    { word: 'ORANGE', p1: 'O', p2: 'R', p3: 'A', p4: 'N', p5: 'G', p6: 'E', icon: '🍊', sentence: 'Juicy orange.' },
    { word: 'PENCIL', p1: 'P', p2: 'E', p3: 'N', p4: 'C', p5: 'I', p6: 'L', icon: '✏️', sentence: 'Write with a pencil.' },
    { word: 'PEPPER', p1: 'P', p2: 'E', p3: 'P', p4: 'P', p5: 'E', p6: 'R', icon: '🌶️', sentence: 'Spicy red pepper.' },
    { word: 'PILLOW', p1: 'P', p2: 'I', p3: 'L', p4: 'L', p5: 'O', p6: 'W', icon: '🛌', sentence: 'Soft fluffy pillow.' },
    { word: 'PLANET', p1: 'P', p2: 'L', p3: 'A', p4: 'N', p5: 'E', p6: 'T', icon: '🪐', sentence: 'Earth is a planet.' },
    { word: 'POCKET', p1: 'P', p2: 'O', p3: 'C', p4: 'K', p5: 'E', p6: 'T', icon: '👖', sentence: 'Put it in your pocket.' },
    { word: 'POTATO', p1: 'P', p2: 'O', p3: 'T', p4: 'A', p5: 'T', p6: 'O', icon: '🥔', sentence: 'Baked potato.' },
    { word: 'PURPLE', p1: 'P', p2: 'U', p3: 'R', p4: 'P', p5: 'L', p6: 'E', icon: '🟣', sentence: 'Color purple.' },
    { word: 'RABBIT', p1: 'R', p2: 'A', p3: 'B', p4: 'B', p5: 'I', p6: 'T', icon: '🐰', sentence: 'Hop little rabbit.' },
    { word: 'ROCKET', p1: 'R', p2: 'O', p3: 'C', p4: 'K', p5: 'E', p6: 'T', icon: '🚀', sentence: 'Rocket to the moon.' },
    { word: 'SCHOOL', p1: 'S', p2: 'C', p3: 'H', p4: 'O', p5: 'O', p6: 'L', icon: '🏫', sentence: 'Learn at school.' },
    { word: 'SHORTS', p1: 'S', p2: 'H', p3: 'O', p4: 'R', p5: 'T', p6: 'S', icon: '🩳', sentence: 'Wear your shorts.' },
    { word: 'SISTER', p1: 'S', p2: 'I', p3: 'S', p4: 'T', p5: 'E', p6: 'R', icon: '👧', sentence: 'Play with sister.' },
    { word: 'SOCCER', p1: 'S', p2: 'O', p3: 'C', p4: 'C', p5: 'E', p6: 'R', icon: '⚽', sentence: 'Play soccer.' },
    { word: 'SPIDER', p1: 'S', p2: 'P', p3: 'I', p4: 'D', p5: 'E', p6: 'R', icon: '🕷️', sentence: 'Eight-legged spider.' },
    { word: 'SUMMER', p1: 'S', p2: 'U', p3: 'M', p4: 'M', p5: 'E', p6: 'R', icon: '☀️', sentence: 'Hot summer day.' },
    { word: 'TOMATO', p1: 'T', p2: 'O', p3: 'M', p4: 'A', p5: 'T', p6: 'O', icon: '🍅', sentence: 'Red ripe tomato.' },
    { word: 'TURTLE', p1: 'T', p2: 'U', p3: 'R', p4: 'T', p5: 'L', p6: 'E', icon: '🐢', sentence: 'Slow green turtle.' },
    { word: 'WINDOW', p1: 'W', p2: 'I', p3: 'N', p4: 'D', p5: 'O', p6: 'W', icon: '🪟', sentence: 'Look out the window.' },
    { word: 'WINTER', p1: 'W', p2: 'I', p3: 'N', p4: 'T', p5: 'E', p6: 'R', icon: '🌨️', sentence: 'Cold snowy winter.' },
    { word: 'YELLOW', p1: 'Y', p2: 'E', p3: 'L', p4: 'L', p5: 'O', p6: 'W', icon: '🟡', sentence: 'Bright yellow sun.' }
].filter(w => w.word.length === 6); // Ensure strictly 6 letters

function SixLetterWordsGame({ onBack }) {
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

    const currentWord = SIX_LETTER_WORDS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentWord.p1}... ${currentWord.p2}... ${currentWord.p3}... ${currentWord.p4}... ${currentWord.p5}... ${currentWord.p6}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < SIX_LETTER_WORDS.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevWord = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = SIX_LETTER_WORDS[Math.floor(Math.random() * SIX_LETTER_WORDS.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = SIX_LETTER_WORDS[Math.floor(Math.random() * SIX_LETTER_WORDS.length)];
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
            background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#E91E63' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#8E44AD' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
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
                            border: '6px solid #E91E63', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {SIX_LETTER_WORDS.length}</div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[currentWord.p1, currentWord.p2, currentWord.p3, currentWord.p4, currentWord.p5, currentWord.p6].map((char, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E91E63', border: '3px dashed #E91E63', padding: '10px 12px', borderRadius: '15px' }}>{char}</div>
                                    {i < 5 && <div style={{ fontSize: '1.5rem', color: '#95A5A6', marginLeft: '4px' }}>+</div>}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: '3rem', color: '#E91E63', marginBottom: '10px' }}>⬇️</div>
                        <div style={{ fontSize: '5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>{currentWord.word}</div>
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>{currentWord.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#C2185B', background: '#FCE4EC', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>"{currentWord.sentence}"</div>
                    </motion.div>

                    <button onClick={nextWord} disabled={currentIndex === SIX_LETTER_WORDS.length - 1} style={{ background: currentIndex === SIX_LETTER_WORDS.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === SIX_LETTER_WORDS.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E91E63' }}>Which one is "{quizTarget?.word}"?</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #8E44AD', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #71368A', cursor: 'pointer' }}>
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

export default SixLetterWordsGame;
