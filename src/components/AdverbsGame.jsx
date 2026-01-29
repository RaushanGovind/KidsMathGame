import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const ADVERB_DATA = {
    manner: {
        title: "How? (Manner)",
        description: "Tells us HOW something happens.",
        color: '#E67E22', // Orange
        items: [
            { word: "Slowly", sentence: "The turtle walks **slowly**.", icon: "🐢" },
            { word: "Quickly", sentence: "The rabbit runs **quickly**.", icon: "🐇" },
            { word: "Neatly", sentence: "She writes **neatly**.", icon: "✍️" },
            { word: "Loudly", sentence: "The lion roars **loudly**.", icon: "🦁" },
            { word: "Softly", sentence: "Speak **softly**.", icon: "🤫" },
            { word: "Happy", sentence: "He plays **happily**.", icon: "😊" }
        ]
    },
    time: {
        title: "When? (Time)",
        description: "Tells us WHEN something happens.",
        color: '#2ECC71', // Green
        items: [
            { word: "Today", sentence: "We play **today**.", icon: "📅" },
            { word: "Soon", sentence: "See you **soon**.", icon: "👋" },
            { word: "Yesterday", sentence: "It rained **yesterday**.", icon: "🌧️" },
            { word: "Now", sentence: "Do it **now**.", icon: "⏱️" },
            { word: "Early", sentence: "Wake up **early**.", icon: "🌅" },
            { word: "Late", sentence: "Don't be **late**.", icon: "🏃" }
        ]
    },
    place: {
        title: "Where? (Place)",
        description: "Tells us WHERE something is.",
        color: '#3498DB', // Blue
        items: [
            { word: "Here", sentence: "Come **here**.", icon: "👇" },
            { word: "There", sentence: "Go **there**.", icon: "👉" },
            { word: "Inside", sentence: "Stay **inside**.", icon: "🏠" },
            { word: "Outside", sentence: "Play **outside**.", icon: "🌳" },
            { word: "Up", sentence: "Look **up**.", icon: "👆" },
            { word: "Down", sentence: "Sit **down**.", icon: "🪑" }
        ]
    },
    frequency: {
        title: "How Often? (Frequency)",
        description: "Tells us HOW OFTEN we do things.",
        color: '#9B59B6', // Purple
        items: [
            { word: "Always", sentence: "I **always** brush my teeth.", icon: "🪥" },
            { word: "Never", sentence: "I **never** tell lies.", icon: "❌" },
            { word: "Daily", sentence: "I read **daily**.", icon: "📖" },
            { word: "Sometimes", sentence: "**Sometimes** I eat ice cream.", icon: "🍦" }
        ]
    }
};

const DIALOGUES = [
    {
        id: 1,
        title: "At School",
        icon: "🏫",
        lines: [
            { speaker: "Teacher", text: "Riya, you read the poem **beautifully**." },
            { speaker: "Riya", text: "Thank you, ma’am. I practiced **carefully**." },
            { speaker: "Teacher", text: "Good students always work **hard**." },
            { speaker: "Riya", text: "I will try again **tomorrow**." }
        ]
    },
    {
        id: 2,
        title: "At Home",
        icon: "🏠",
        lines: [
            { speaker: "Mother", text: "Rahul, you cleaned your room **nicely**." },
            { speaker: "Rahul", text: "Yes, Mom. I worked **quickly**." },
            { speaker: "Mother", text: "The house looks **very** neat now." },
            { speaker: "Rahul", text: "I will help you **again** later." }
        ]
    },
    {
        id: 3,
        title: "Playing Outside",
        icon: "⚽",
        lines: [
            { speaker: "Aman", text: "The boys are running **fast**." },
            { speaker: "Riya", text: "Yes, they play football **every day**." },
            { speaker: "Aman", text: "Rahul kicked the ball **strongly**." },
            { speaker: "Riya", text: "It went **far** across the field!" }
        ]
    },
    {
        id: 4,
        title: "At Dinner",
        icon: "🍽️",
        lines: [
            { speaker: "Father", text: "The food smells **really** good." },
            { speaker: "Mother", text: "I cooked the rice **slowly**." },
            { speaker: "Child", text: "I am eating **happily**." },
            { speaker: "Father", text: "Everyone is sitting **together**." }
        ]
    },
    {
        id: 5,
        title: "Talking About a Pet",
        icon: "🐶",
        lines: [
            { speaker: "Neha", text: "Your dog runs **very** fast." },
            { speaker: "Ravi", text: "Yes, Bruno plays **outside** daily." },
            { speaker: "Neha", text: "He barks **loudly** sometimes." },
            { speaker: "Ravi", text: "But he listens **carefully** to me." }
        ]
    },
    {
        id: 6,
        title: "Morning for School",
        icon: "🎒",
        lines: [
            { speaker: "Mother", text: "Meena, you woke up **early** today." },
            { speaker: "Meena", text: "Yes, I got ready **quickly**." },
            { speaker: "Mother", text: "Your bus arrives **soon**." },
            { speaker: "Meena", text: "I packed my bag **carefully**." }
        ]
    }
];

const QUIZ_DATA = [
    { question: 'The turtle walks ___.', answer: 'slowly', options: ['slowly', 'quickly', 'loudly'] },
    { question: 'Did you finish your work ___?', answer: 'today', options: ['today', 'outside', 'neatly'] },
    { question: 'Keep your shoes ___.', answer: 'outside', options: ['outside', 'yesterday', 'slowly'] },
    { question: 'I ___ tell lies.', answer: 'never', options: ['never', 'outside', 'fast'] },
    { question: 'The lion roars ___.', answer: 'loudly', options: ['loudly', 'neatly', 'kindly'] },
    { question: 'Come ___!', answer: 'here', options: ['here', 'happy', 'slow'] }
];

function AdverbsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'dialogue' | 'quiz'
    const [category, setCategory] = useState('manner');
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [selectedDialogueId, setSelectedDialogueId] = useState(null);

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

    const currentData = ADVERB_DATA[category];

    const renderStyledText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={index} style={{ color: '#E67E22', fontWeight: '900', background: '#FEF5E7', padding: '0 4px', borderRadius: '4px' }}>{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#E8F6F3', // Light Teal/Mint bg
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#16A085', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏃💨</span> ADVERBS
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#16A085' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('dialogue')} style={{ padding: '12px 25px', background: mode === 'dialogue' ? '#F39C12' : 'white', color: mode === 'dialogue' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Dialogues 🗣️</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#8E44AD' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                        {Object.keys(ADVERB_DATA).map(key => (
                            <button
                                key={key}
                                onClick={() => setCategory(key)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: category === key ? ADVERB_DATA[key].color : 'white',
                                    color: category === key ? 'white' : ADVERB_DATA[key].color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {ADVERB_DATA[key].title}
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

            {mode === 'dialogue' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!selectedDialogueId ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
                                {DIALOGUES.map(d => (
                                    <motion.button
                                        key={d.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDialogueId(d.id)}
                                        style={{
                                            background: 'white', border: 'none', padding: '30px', borderRadius: '20px',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left',
                                            display: 'flex', alignItems: 'center', gap: '20px'
                                        }}
                                    >
                                        <span style={{ fontSize: '3rem' }}>{d.icon}</span>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#2C3E50' }}>{d.title}</h3>
                                            <span style={{ color: '#F39C12', fontWeight: 'bold' }}>Read & Listen ➜</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div style={{ marginTop: '40px', background: 'white', padding: '20px 40px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <h3 style={{ color: '#16A085' }}>🎭 Fun Activity: Read & Act!</h3>
                                <p style={{ color: '#7F8C8D', fontSize: '1.1rem' }}>Try reading lines <b>slowly</b>, then <b>quickly</b>. Or say them <b>loudly</b> then <b>softly</b>!</p>
                            </div>
                        </>
                    ) : (
                        <div style={{ width: '100%', maxWidth: '800px' }}>
                            <button onClick={() => setSelectedDialogueId(null)} style={{ marginBottom: '20px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'white', color: '#F39C12', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>⬅ Back to Dialogues</button>

                            {(() => {
                                const activeDialogue = DIALOGUES.find(d => d.id === selectedDialogueId);
                                return (
                                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                                        <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                            <span style={{ fontSize: '2.5rem' }}>{activeDialogue.icon}</span>
                                            {activeDialogue.title}
                                        </h2>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                            {activeDialogue.lines.map((line, idx) => (
                                                <div key={idx} onClick={() => speak(line.text)} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: 'pointer' }}>
                                                    <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold', color: '#7F8C8D', paddingTop: '10px' }}>{line.speaker}:</div>
                                                    <div style={{
                                                        background: idx % 2 === 0 ? '#FEF5E7' : '#E8F8F5',
                                                        padding: '15px 25px', borderRadius: '20px',
                                                        borderBottomLeftRadius: idx % 2 === 0 ? '0' : '20px',
                                                        borderBottomRightRadius: idx % 2 !== 0 ? '0' : '20px',
                                                        flex: 1, position: 'relative'
                                                    }}>
                                                        <div style={{ fontSize: '1.2rem', color: '#2C3E50', lineHeight: '1.6' }}>{renderStyledText(line.text)}</div>
                                                        <div style={{ position: 'absolute', right: '15px', bottom: '10px', opacity: 0.3 }}>🔊</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#16A085', marginBottom: '10px' }}>Question {quizIndex + 1} / {QUIZ_DATA.length}</h2>

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
                                            feedback && option !== QUIZ_DATA[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#E8F6F3',
                                        color: feedback ? 'white' : '#16A085',
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
                    <h2 style={{ fontSize: '3rem', color: '#16A085', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {QUIZ_DATA.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default AdverbsGame;
