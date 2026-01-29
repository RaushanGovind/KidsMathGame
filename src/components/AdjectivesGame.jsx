import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const ADJECTIVE_DATA = {
    sizes: {
        title: "Size (Big or Small)",
        description: "Describing how big something is.",
        color: '#E74C3C',
        items: [
            { word: "Big", sentence: "The elephant is **big**.", icon: "🐘" },
            { word: "Small", sentence: "The ant is **small**.", icon: "🐜" },
            { word: "Tall", sentence: "The giraffe is **tall**.", icon: "🦒" },
            { word: "Short", sentence: "The shrub is **short**.", icon: "🌳" },
            { word: "Long", sentence: "The snake is **long**.", icon: "🐍" }
        ]
    },
    colors: {
        title: "Colors",
        description: "Describing the color of things.",
        color: '#F39C12',
        items: [
            { word: "Red", sentence: "A **red** apple.", icon: "🍎" },
            { word: "Blue", sentence: "The **blue** sky.", icon: "☁️" },
            { word: "Green", sentence: "The **green** grass.", icon: "🌱" },
            { word: "Yellow", sentence: "The **yellow** sun.", icon: "☀️" },
            { word: "Black", sentence: "A **black** cat.", icon: "🐈‍⬛" }
        ]
    },
    feelings: {
        title: "Feelings",
        description: "Describing how someone feels.",
        color: '#9B59B6',
        items: [
            { word: "Happy", sentence: "The girl is **happy**.", icon: "😊" },
            { word: "Sad", sentence: "The boy is **sad**.", icon: "😢" },
            { word: "Angry", sentence: "The bird is **angry**.", icon: "😠" },
            { word: "Tired", sentence: "I am **tired**.", icon: "😴" },
            { word: "Excited", sentence: "He is **excited**!", icon: "🤩" }
        ]
    },
    quality: {
        title: "Touch & Quality",
        description: "Describing how things feel or look.",
        color: '#3498DB',
        items: [
            { word: "Soft", sentence: "The bunny is **soft**.", icon: "🐇" },
            { word: "Hard", sentence: "The rock is **hard**.", icon: "🪨" },
            { word: "Hot", sentence: "The tea is **hot**.", icon: "☕" },
            { word: "Cold", sentence: "The ice cream is **cold**.", icon: "🍦" },
            { word: "Fast", sentence: "The car is **fast**.", icon: "🏎️" }, // Adjective for noun usage
            { word: "Slow", sentence: "The snail is **slow**.", icon: "🐌" }
        ]
    }
};

const QUIZ_DATA = [
    { question: 'The elephant is ___.', answer: 'big', options: ['big', 'small', 'blue'] },
    { question: 'The sun is ___.', answer: 'yellow', options: ['green', 'yellow', 'sad'] },
    { question: 'Ice cream is ___.', answer: 'cold', options: ['hot', 'cold', 'angry'] },
    { question: 'The rock is ___.', answer: 'hard', options: ['soft', 'hard', 'happy'] },
    { question: 'The bunny feels ___.', answer: 'soft', options: ['soft', 'loud', 'red'] },
    { question: 'The giraffe is ___.', answer: 'tall', options: ['short', 'tall', 'slow'] }
];

function AdjectivesGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [category, setCategory] = useState('sizes');
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/\*\*/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const handleQuizAnswer = (option) => {
        const correct = QUIZ_DATA[quizIndex].answer;
        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak(`Correct! ${QUIZ_DATA[quizIndex].question.replace('___', option)}`);
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak(`Try again.`);
        }

        setTimeout(() => {
            if (quizIndex < QUIZ_DATA.length - 1) {
                setQuizIndex(c => c + 1);
                setFeedback(null);
            } else {
                setShowResult(true);
            }
        }, 2000);
    };

    const resetQuiz = () => {
        setQuizIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
        setMode('learn');
    };

    const currentData = ADJECTIVE_DATA[category];

    const renderStyledText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={index} style={{ color: '#E91E63', fontWeight: '900', background: '#FCE4EC', padding: '0 4px', borderRadius: '4px' }}>{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#F8F9F9',
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E91E63', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🎨</span> ADJECTIVES
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#E91E63' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#8E44AD' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                        {Object.keys(ADJECTIVE_DATA).map(key => (
                            <button
                                key={key}
                                onClick={() => setCategory(key)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: category === key ? ADJECTIVE_DATA[key].color : 'white',
                                    color: category === key ? 'white' : ADJECTIVE_DATA[key].color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {ADJECTIVE_DATA[key].title}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: currentData.color, fontSize: '2rem', margin: 0 }}>{currentData.title}</h2>
                            <p style={{ color: '#7F8C8D', fontSize: '1.2rem' }}>{currentData.description}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {currentData.items.map((item, idx) => (
                                <div key={idx}
                                    onClick={() => speak(item.sentence)}
                                    style={{
                                        background: 'white', padding: '20px', borderRadius: '20px',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                        textAlign: 'center', cursor: 'pointer',
                                        borderBottom: `5px solid ${currentData.color}`
                                    }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.icon}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: currentData.color, marginBottom: '5px' }}>{item.word}</div>
                                    <div style={{ fontSize: '1.1rem', color: '#34495E' }}>{renderStyledText(item.sentence)}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#E91E63', marginBottom: '10px' }}>Question {quizIndex + 1} / {QUIZ_DATA.length}</h2>

                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '40px', lineHeight: '1.4' }}>
                            {QUIZ_DATA[quizIndex].question}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            {QUIZ_DATA[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '15px',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        borderRadius: '15px',
                                        border: 'none',
                                        background: feedback && option === QUIZ_DATA[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== QUIZ_DATA[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#FCE4EC',
                                        color: feedback ? 'white' : '#E91E63',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showResult && (
                <div style={{ width: '100%', maxWidth: '600px', background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ fontSize: '3rem', color: '#E91E63', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {QUIZ_DATA.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default AdjectivesGame;
