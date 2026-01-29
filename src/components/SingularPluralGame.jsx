import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const RULES = [
    {
        id: 's',
        title: 'Add -S',
        description: 'Just add "s" to most words.',
        examples: [
            { singular: 'Cat', plural: 'Cats', icon: '🐱' },
            { singular: 'Book', plural: 'Books', icon: '📚' },
            { singular: 'Pen', plural: 'Pens', icon: '🖊️' },
            { singular: 'Boy', plural: 'Boys', icon: '👦' }
        ],
        sentence: 'I have one book. I have two books.',
        color: '#3498DB'
    },
    {
        id: 'es',
        title: 'Add -ES',
        description: 'For words ending in s, sh, ch, x, o.',
        examples: [
            { singular: 'Bus', plural: 'Buses', icon: '🚌' },
            { singular: 'Box', plural: 'Boxes', icon: '📦' },
            { singular: 'Dish', plural: 'Dishes', icon: '🍽️' },
            { singular: 'Watch', plural: 'Watches', icon: '⌚' },
            { singular: 'Mango', plural: 'Mangoes', icon: '🥭' }
        ],
        sentence: 'The bus is big. Many buses are on the road.',
        color: '#E74C3C'
    },
    {
        id: 'ies',
        title: 'Y → IES',
        description: 'If a consonant is before Y, change Y to IES.',
        examples: [
            { singular: 'Baby', plural: 'Babies', icon: '👶' },
            { singular: 'City', plural: 'Cities', icon: '🏙️' },
            { singular: 'Story', plural: 'Stories', icon: '📖' },
            { singular: 'Fly', plural: 'Flies', icon: '🪰' }
        ],
        note: 'But if a vowel comes before Y, just add S (Boy → Boys)',
        sentence: 'The baby is crying. The babies are crying.',
        color: '#9B59B6'
    },
    {
        id: 'ves',
        title: 'F / FE → VES',
        description: 'Change F or FE to VES.',
        examples: [
            { singular: 'Leaf', plural: 'Leaves', icon: '🍂' },
            { singular: 'Wolf', plural: 'Wolves', icon: '🐺' },
            { singular: 'Knife', plural: 'Knives', icon: '🔪' },
            { singular: 'Life', plural: 'Lives', icon: '❤️' }
        ],
        color: '#27AE60'
    },
    {
        id: 'irregular',
        title: 'Irregular',
        description: 'These words change completely!',
        examples: [
            { singular: 'Man', plural: 'Men', icon: '👨' },
            { singular: 'Woman', plural: 'Women', icon: '👩' },
            { singular: 'Child', plural: 'Children', icon: '🧒' },
            { singular: 'Foot', plural: 'Feet', icon: '🦶' },
            { singular: 'Tooth', plural: 'Teeth', icon: '🦷' },
            { singular: 'Mouse', plural: 'Mice', icon: '🐁' }
        ],
        color: '#F39C12'
    },
    {
        id: 'same',
        title: 'No Change',
        description: 'These stay the same.',
        examples: [
            { singular: 'Sheep', plural: 'Sheep', icon: '🐑' },
            { singular: 'Deer', plural: 'Deer', icon: '🦌' },
            { singular: 'Fish', plural: 'Fish', icon: '🐟' }
        ],
        color: '#16A085'
    }
];

const QUIZ_DATA = [
    { question: 'cat', answer: 'cats', options: ['cat', 'cates', 'cats'] },
    { question: 'baby', answer: 'babies', options: ['babys', 'babies', 'babyies'] },
    { question: 'box', answer: 'boxes', options: ['boxs', 'boxies', 'boxes'] },
    { question: 'leaf', answer: 'leaves', options: ['leafs', 'leaves', 'leafes'] },
    { question: 'child', answer: 'children', options: ['childs', 'children', 'childies'] },
    { question: 'bus', answer: 'buses', options: ['buss', 'buses', 'busez'] },
    { question: 'man', answer: 'men', options: ['mans', 'men', 'mens'] },
    { question: 'sheep', answer: 'sheep', options: ['sheeps', 'sheep', 'sheepes'] }
];

function SingularPluralGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
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
            speak('Correct!');
        } else {
            playAppSound('wrong');
            setFeedback('wrong');
            speak(`Oops, the plural of ${QUIZ_DATA[quizIndex].question} is ${correct}`);
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

    const currentRule = RULES[currentRuleIndex];

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FDF2E9', // Soft background
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🐈🐈‍⬛</span> SINGULAR & PLURAL
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#3498DB' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Unknown Rules 📜</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice Quiz 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Rules Tabs */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '15px', marginBottom: '10px' }}>
                        {RULES.map((rule, idx) => (
                            <button
                                key={rule.id}
                                onClick={() => setCurrentRuleIndex(idx)}
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    border: 'none',
                                    background: currentRuleIndex === idx ? rule.color : 'white',
                                    color: currentRuleIndex === idx ? 'white' : '#7F8C8D',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {rule.title}
                            </button>
                        ))}
                    </div>

                    {/* Rule Content */}
                    <motion.div
                        key={currentRule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: 'white',
                            borderRadius: '30px',
                            padding: '40px',
                            width: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <h2 style={{ color: currentRule.color, fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>{currentRule.title}</h2>
                        <p style={{ fontSize: '1.5rem', color: '#7F8C8D', marginBottom: '30px', textAlign: 'center' }}>{currentRule.description}</p>

                        {/* Examples Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', marginBottom: '30px' }}>
                            {currentRule.examples.map((item, idx) => (
                                <div key={idx}
                                    onClick={() => speak(`One ${item.singular}, many ${item.plural}`)}
                                    style={{
                                        background: '#F8F9F9',
                                        borderRadius: '20px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        border: `2px solid ${currentRule.color}`,
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.icon}</div>
                                    <div style={{ fontSize: '1.2rem', color: '#7F8C8D' }}>One <strong>{item.singular}</strong></div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50' }}>Many <span style={{ color: currentRule.color }}>{item.plural}</span></div>
                                </div>
                            ))}
                        </div>

                        {currentRule.sentence && (
                            <div style={{ background: '#FDEDEC', padding: '20px', borderRadius: '15px', color: '#C0392B', fontStyle: 'italic', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>🗣️</span> "{currentRule.sentence}"
                                <button onClick={() => speak(currentRule.sentence)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>🔊</button>
                            </div>
                        )}

                        {currentRule.note && (
                            <div style={{ marginTop: '20px', fontSize: '1rem', color: '#7F8C8D' }}>NOTE: {currentRule.note}</div>
                        )}
                    </motion.div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#3498DB', marginBottom: '10px' }}>Question {quizIndex + 1} / {QUIZ_DATA.length}</h2>
                        <h3 style={{ fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '40px' }}>What is the plural of "{QUIZ_DATA[quizIndex].question}"?</h3>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            {QUIZ_DATA[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '20px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        borderRadius: '20px',
                                        border: 'none',
                                        background: feedback && option === QUIZ_DATA[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== QUIZ_DATA[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#D6EAF8',
                                        color: feedback ? 'white' : '#2980B9',
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
                    <h2 style={{ fontSize: '3rem', color: '#3498DB', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {QUIZ_DATA.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default SingularPluralGame;
