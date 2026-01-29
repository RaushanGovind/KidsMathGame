import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const FIVE_LETTER_WORDS = [
    { word: 'APPLE', p1: 'A', p2: 'P', p3: 'P', p4: 'L', p5: 'E', icon: '🍎', sentence: 'Eat an apple.' },
    { word: 'BEACH', p1: 'B', p2: 'E', p3: 'A', p4: 'C', p5: 'H', icon: '🏖️', sentence: 'Sand at the beach.' },
    { word: 'BREAD', p1: 'B', p2: 'R', p3: 'E', p4: 'A', p5: 'D', icon: '🍞', sentence: 'Bake the bread.' },
    { word: 'BRUSH', p1: 'B', p2: 'R', p3: 'U', p4: 'S', p5: 'H', icon: '🖌️', sentence: 'Paint with a brush.' },
    { word: 'CANDY', p1: 'C', p2: 'A', p3: 'N', p4: 'D', p5: 'Y', icon: '🍬', sentence: 'Sweet stick candy.' },
    { word: 'CHAIR', p1: 'C', p2: 'H', p3: 'A', p4: 'I', p5: 'R', icon: '🪑', sentence: 'Sit on the chair.' },
    { word: 'CLOCK', p1: 'C', p2: 'L', p3: 'O', p4: 'C', p5: 'K', icon: '⏰', sentence: 'Tick tock clock.' },
    { word: 'CLOUD', p1: 'C', p2: 'L', p3: 'O', p4: 'U', p5: 'D', icon: '☁️', sentence: 'White fluffy cloud.' },
    { word: 'DANCE', p1: 'D', p2: 'A', p3: 'N', p4: 'C', p5: 'E', icon: '💃', sentence: 'Let us dance.' },
    { word: 'DRESS', p1: 'D', p2: 'R', p3: 'E', p4: 'S', p5: 'S', icon: '👗', sentence: 'Wear a nice dress.' },
    { word: 'DRINK', p1: 'D', p2: 'R', p3: 'I', p4: 'N', p5: 'K', icon: '🥤', sentence: 'Drink some water.' },
    { word: 'EARTH', p1: 'E', p2: 'A', p3: 'R', p4: 'T', p5: 'H', icon: '🌍', sentence: 'We live on Earth.' },
    { word: 'FRUIT', p1: 'F', p2: 'R', p3: 'U', p4: 'I', p5: 'T', icon: '🍇', sentence: 'Healthy yummy fruit.' },
    { word: 'GHOST', p1: 'G', p2: 'H', p3: 'O', p4: 'S', p5: 'T', icon: '👻', sentence: 'Spooky little ghost.' },
    { word: 'GRAPE', p1: 'G', p2: 'R', p3: 'A', p4: 'P', p5: 'E', icon: '🍇', sentence: 'Purple juicy grape.' },
    { word: 'GRASS', p1: 'G', p2: 'R', p3: 'A', p4: 'S', p5: 'S', icon: '🌱', sentence: 'Green soft grass.' },
    { word: 'HEART', p1: 'H', p2: 'E', p3: 'A', p4: 'R', p5: 'T', icon: '❤️', sentence: 'Love in my heart.' },
    { word: 'HORSE', p1: 'H', p2: 'O', p3: 'R', p4: 'S', p5: 'E', icon: '🐴', sentence: 'Ride a horse.' },
    { word: 'HOUSE', p1: 'H', p2: 'O', p3: 'U', p4: 'S', p5: 'E', icon: '🏠', sentence: 'My comfortable house.' },
    { word: 'JUICE', p1: 'J', p2: 'U', p3: 'I', p4: 'C', p5: 'E', icon: '🧃', sentence: 'Fresh orange juice.' },
    { word: 'LEMON', p1: 'L', p2: 'E', p3: 'M', p4: 'O', p5: 'N', icon: '🍋', sentence: 'Sour yellow lemon.' },
    { word: 'MOUSE', p1: 'M', p2: 'O', p3: 'U', p4: 'S', p5: 'E', icon: '🐭', sentence: 'Quiet little mouse.' },
    { word: 'MUSIC', p1: 'M', p2: 'U', p3: 'S', p4: 'I', p5: 'C', icon: '🎵', sentence: 'Listen to music.' },
    { word: 'NIGHT', p1: 'N', p2: 'I', p3: 'G', p4: 'H', p5: 'T', icon: '🌃', sentence: 'Sleep at night.' },
    { word: 'OCEAN', p1: 'O', p2: 'C', p3: 'E', p4: 'A', p5: 'N', icon: '🌊', sentence: 'Deep blue ocean.' },
    { word: 'PANDA', p1: 'P', p2: 'A', p3: 'N', p4: 'D', p5: 'A', icon: '🐼', sentence: 'Cute black panda.' },
    { word: 'PAPER', p1: 'P', p2: 'A', p3: 'P', p4: 'E', p5: 'R', icon: '📄', sentence: 'Write on paper.' },
    { word: 'PARTY', p1: 'P', p2: 'A', p3: 'R', p4: 'T', p5: 'Y', icon: '🎉', sentence: 'Birthday party fun.' },
    { word: 'PIZZA', p1: 'P', p2: 'I', p3: 'Z', p4: 'Z', p5: 'A', icon: '🍕', sentence: 'Cheese pepperoni pizza.' },
    { word: 'PLANE', p1: 'P', p2: 'L', p3: 'A', p4: 'N', p5: 'E', icon: '✈️', sentence: 'Fly in a plane.' },
    { word: 'PLANT', p1: 'P', p2: 'L', p3: 'A', p4: 'N', p5: 'T', icon: '🪴', sentence: 'Water the plant.' },
    { word: 'QUEEN', p1: 'Q', p2: 'U', p3: 'E', p4: 'E', p5: 'N', icon: '👑', sentence: 'The royal queen.' },
    { word: 'RADIO', p1: 'R', p2: 'A', p3: 'D', p4: 'I', p5: 'O', icon: '📻', sentence: 'Turn on the radio.' },
    { word: 'ROBOT', p1: 'R', p2: 'O', p3: 'B', p4: 'O', p5: 'T', icon: '🤖', sentence: 'Beep boop robot.' },
    { word: 'SHARK', p1: 'S', p2: 'H', p3: 'A', p4: 'R', p5: 'K', icon: '🦈', sentence: 'Big scary shark.' },
    { word: 'SHEEP', p1: 'S', p2: 'H', p3: 'E', p4: 'E', p5: 'P', icon: '🐑', sentence: 'Soft wool sheep.' },
    { word: 'SHOES', p1: 'S', p2: 'H', p3: 'O', p4: 'E', p5: 'S', icon: '👟', sentence: 'New running shoes.' },
    { word: 'SMILE', p1: 'S', p2: 'M', p3: 'I', p4: 'L', p5: 'E', icon: '😄', sentence: 'Big happy smile.' },
    { word: 'SNAKE', p1: 'S', p2: 'N', p3: 'A', p4: 'K', p5: 'E', icon: '🐍', sentence: 'Hissing green snake.' },
    { word: 'SPOON', p1: 'S', p2: 'P', p3: 'O', p4: 'O', p5: 'N', icon: '🥄', sentence: 'Eat with a spoon.' },
    { word: 'TIGER', p1: 'T', p2: 'I', p3: 'G', p4: 'E', p5: 'R', icon: '🐯', sentence: 'Striped orange tiger.' },
    { word: 'TOAST', p1: 'T', p2: 'O', p3: 'A', p4: 'S', p5: 'T', icon: '🍞', sentence: 'Butter on toast.' },
    { word: 'TRAIN', p1: 'T', p2: 'R', p3: 'A', p4: 'I', p5: 'N', icon: '🚂', sentence: 'Choo choo train.' },
    { word: 'TRUCK', p1: 'T', p2: 'R', p3: 'U', p4: 'C', p5: 'K', icon: '🚚', sentence: 'Big heavy truck.' },
    { word: 'WATCH', p1: 'W', p2: 'A', p3: 'T', p4: 'C', p5: 'H', icon: '⌚', sentence: 'Look at my watch.' },
    { word: 'WATER', p1: 'W', p2: 'A', p3: 'T', p4: 'E', p5: 'R', icon: '💧', sentence: 'Drink cool water.' },
    { word: 'WHALE', p1: 'W', p2: 'H', p3: 'A', p4: 'L', p5: 'E', icon: '🐋', sentence: 'Huge blue whale.' },
    { word: 'ZEBRA', p1: 'Z', p2: 'E', p3: 'B', p4: 'R', p5: 'A', icon: '🦓', sentence: 'Striped black zebra.' }
];

function FiveLetterWordsGame({ onBack }) {
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

    const currentWord = FIVE_LETTER_WORDS[currentIndex];

    useEffect(() => {
        if (mode === 'learn') {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode]);

    const playLearnSequence = () => {
        speak(`${currentWord.p1}... ${currentWord.p2}... ${currentWord.p3}... ${currentWord.p4}... ${currentWord.p5}...... ${currentWord.word}. ${currentWord.sentence}`);
    };

    const nextWord = () => {
        if (currentIndex < FIVE_LETTER_WORDS.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevWord = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        const target = FIVE_LETTER_WORDS[Math.floor(Math.random() * FIVE_LETTER_WORDS.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = FIVE_LETTER_WORDS[Math.floor(Math.random() * FIVE_LETTER_WORDS.length)];
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
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '10px 20px', background: mode === 'learn' ? '#F39C12' : 'white', color: mode === 'learn' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LEARN</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '10px 20px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#2C3E50', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>QUIZ</button>
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
                            boxShadow: '0 20px 0 rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: '6px solid #F39C12', position: 'relative', cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', color: '#95A5A6', fontWeight: 'bold' }}>{currentIndex + 1} / {FIVE_LETTER_WORDS.length}</div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[currentWord.p1, currentWord.p2, currentWord.p3, currentWord.p4, currentWord.p5].map((char, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E67E22', border: '3px dashed #E67E22', padding: '10px 12px', borderRadius: '15px' }}>{char}</div>
                                    {i < 4 && <div style={{ fontSize: '1.5rem', color: '#95A5A6', marginLeft: '4px' }}>+</div>}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: '3rem', color: '#F39C12', marginBottom: '10px' }}>⬇️</div>
                        <div style={{ fontSize: '5rem', fontWeight: '1000', color: '#2C3E50', lineHeight: 1, marginBottom: '20px' }}>{currentWord.word}</div>
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>{currentWord.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#D35400', background: '#FFF3E0', padding: '15px 30px', borderRadius: '20px', textAlign: 'center' }}>"{currentWord.sentence}"</div>
                    </motion.div>

                    <button onClick={nextWord} disabled={currentIndex === FIVE_LETTER_WORDS.length - 1} style={{ background: currentIndex === FIVE_LETTER_WORDS.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', cursor: currentIndex === FIVE_LETTER_WORDS.length - 1 ? 'default' : 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>➡</button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => speak(quizTarget.word)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '80px', height: '80px', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 4px 0 #ddd', marginBottom: '30px' }}>🔊</button>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#F39C12' }}>Which one is "{quizTarget?.word}"?</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {quizOptions.map((item, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizOptionClick(item)} style={{ background: 'white', border: '4px solid #D35400', borderRadius: '20px', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 0 #A04000', cursor: 'pointer' }}>
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

export default FiveLetterWordsGame;
