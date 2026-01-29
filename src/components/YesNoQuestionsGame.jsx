import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const QUESTION_DATA = {
    is_am_are: {
        title: "Is / Am / Are",
        description: "Helping words for NOW.",
        color: '#3498DB',
        content: [
            { stmt: "She is happy.", quest: "Is she happy?", ans: "Yes, she is. / No, she isn’t." },
            { stmt: "They are playing.", quest: "Are they playing?", ans: "Yes, they are." },
            { stmt: "I am late.", quest: "Am I late?", ans: "No, you aren’t." }
        ]
    },
    do_does: {
        title: "Do / Does",
        description: "For habits and facts.",
        color: '#2ECC71',
        content: [
            { stmt: "You like milk.", quest: "Do you like milk?", ans: "Yes, I do." },
            { stmt: "She plays football.", quest: "Does she play football?", ans: "No, she doesn’t." },
            { stmt: "They go to school.", quest: "Do they go to school?", ans: "Yes, they do." }
        ]
    },
    did: {
        title: "Did (Past)",
        description: "For things that happened BEFORE.",
        color: '#E67E22',
        content: [
            { stmt: "You finished homework.", quest: "Did you finish homework?", ans: "Yes, I did." },
            { stmt: "He went to school.", quest: "Did he go to school?", ans: "No, he didn’t." }
        ]
    },
    can: {
        title: "Can (Ability)",
        description: "Ask if someone helps or does something.",
        color: '#9B59B6',
        content: [
            { stmt: "She can swim.", quest: "Can she swim?", ans: "Yes, she can." },
            { stmt: "You can help me.", quest: "Can you help me?", ans: "Yes, I can." }
        ]
    },
    will: {
        title: "Will (Future)",
        description: "Ask about TOMORROW or LATER.",
        color: '#E74C3C',
        content: [
            { stmt: "You will come.", quest: "Will you come?", ans: "Yes, I will." },
            { stmt: "They will play.", quest: "Will they play?", ans: "No, they won’t." }
        ]
    }
};

const DIALOGUES = [
    {
        speaker: "Mother",
        text: "Are you ready?",
        replySpeaker: "Child",
        replyText: "Yes, I am."
    },
    {
        speaker: "Teacher",
        text: "Did you do your homework?",
        replySpeaker: "Student",
        replyText: "Yes, I did."
    },
    {
        speaker: "Friend",
        text: "Can you play today?",
        replySpeaker: "Child",
        replyText: "No, I can’t."
    }
];

const QUIZ_DATA = [
    { question: 'She is your sister.', answer: 'Is she your sister?', options: ['Is she your sister?', 'Does she your sister?', 'Can she your sister?'] },
    { question: 'They like mangoes.', answer: 'Do they like mangoes?', options: ['Are they like mangoes?', 'Do they like mangoes?', 'Did they like mangoes?'] },
    { question: 'He can run fast.', answer: 'Can he run fast?', options: ['Is he run fast?', 'Does he run fast?', 'Can he run fast?'] },
    { question: 'You finished your work.', answer: 'Did you finish your work?', options: ['Do you finish your work?', 'Did you finish your work?', 'Will you finish your work?'] },
    { question: 'We will go tomorrow.', answer: 'Will we go tomorrow?', options: ['Will we go tomorrow?', 'Do we go tomorrow?', 'Are we go tomorrow?'] }
];

function YesNoQuestionsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'dialogue' | 'quiz'
    const [category, setCategory] = useState('is_am_are');
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
            speak(`Correct! ${option}`);
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

    const currentData = QUESTION_DATA[category];

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#EAF2F8', // Light Blue-ish
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#3498DB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>❓</span> YES / NO QUESTIONS
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#3498DB' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('dialogue')} style={{ padding: '12px 25px', background: mode === 'dialogue' ? '#F39C12' : 'white', color: mode === 'dialogue' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Dialogues 🗣️</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#2ECC71' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                        {Object.keys(QUESTION_DATA).map(key => (
                            <button
                                key={key}
                                onClick={() => setCategory(key)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: category === key ? QUESTION_DATA[key].color : 'white',
                                    color: category === key ? 'white' : QUESTION_DATA[key].color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {QUESTION_DATA[key].title}
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

                        <div style={{ background: 'white', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr', background: '#F8F9F9', borderBottom: '2px solid #ECF0F1' }}>
                                <div style={{ padding: '20px', fontWeight: '900', color: '#7F8C8D', textAlign: 'center' }}>Statement</div>
                                <div style={{ padding: '20px', fontWeight: '900', color: currentData.color, textAlign: 'center' }}>Question ❓</div>
                                <div style={{ padding: '20px', fontWeight: '900', color: '#27AE60', textAlign: 'center' }}>Answer Reference</div>
                            </div>

                            {currentData.content.map((item, idx) => (
                                <div key={idx}
                                    onClick={() => speak(`${item.quest} ${item.ans}`)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr',
                                        borderBottom: '1px solid #ECF0F1', cursor: 'pointer',
                                        background: idx % 2 === 0 ? 'white' : '#FAFAFA'
                                    }}>
                                    <div style={{ padding: '20px', fontSize: '1.2rem', color: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.stmt}</div>
                                    <div style={{ padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: currentData.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quest}</div>
                                    <div style={{ padding: '20px', fontSize: '1.1rem', color: '#27AE60', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{item.ans}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {mode === 'dialogue' && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                    {DIALOGUES.map((d, idx) => (
                        <div key={idx} onClick={() => speak(d.text + " " + d.replyText)} style={{ background: 'white', width: '100%', padding: '30px', borderRadius: '25px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ fontWeight: 'bold', color: '#3498DB', width: '80px' }}>{d.speaker}:</div>
                                <div style={{ fontSize: '1.3rem', color: '#2C3E50', fontWeight: 'bold' }}>{d.text}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: '#E67E22', width: '80px' }}>{d.replySpeaker}:</div>
                                <div style={{ fontSize: '1.3rem', color: '#2C3E50' }}>{d.replyText}</div>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '1.5rem', opacity: 0.2 }}>🔊</div>
                        </div>
                    ))}
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#8E44AD', marginBottom: '10px' }}>Change to Question {quizIndex + 1} / {QUIZ_DATA.length}</h2>

                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50', marginBottom: '40px', background: '#F4ECF7', padding: '20px', borderRadius: '15px' }}>
                            {QUIZ_DATA[quizIndex].question}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                            {QUIZ_DATA[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '20px',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        borderRadius: '15px',
                                        border: '2px solid #ECF0F1',
                                        background: feedback && option === QUIZ_DATA[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== QUIZ_DATA[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : 'white',
                                        color: feedback && (option === QUIZ_DATA[quizIndex].answer || option !== QUIZ_DATA[quizIndex].answer && feedback === 'wrong') ? 'white' : '#2C3E50',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    🤔 {option}
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

export default YesNoQuestionsGame;
