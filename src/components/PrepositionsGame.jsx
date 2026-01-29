import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const PREPOSITION_DATA = {
    basics: {
        title: "Basic Positions",
        description: "Where is it?",
        color: '#8E44AD',
        items: [
            { word: "In", sentence: "The cat is **in** the box.", icon: "📦" },
            { word: "On", sentence: "The apple is **on** the table.", icon: "🍎" },
            { word: "Under", sentence: "The dog is **under** the chair.", icon: "🐕" },
            { word: "Over", sentence: "The bird flies **over** the tree.", icon: "🐦" },
            { word: "Behind", sentence: "The sun is **behind** the cloud.", icon: "☁️" },
            { word: "In Front Of", sentence: "The boy is **in front of** the door.", icon: "🚪" }
        ]
    },
    action_sentences: {
        title: "Action Sentences",
        description: "Noun + Verb + Adverb + Preposition",
        color: '#E67E22',
        sentences: [
            { noun: "The dog", verb: "runs", adverb: "quickly", prep: "**in**", object: "the park.", icon: "🏞️" },
            { noun: "She", verb: "sits", adverb: "quietly", prep: "**on**", object: "the chair.", icon: "🪑" },
            { noun: "The bird", verb: "sings", adverb: "loudly", prep: "**on**", object: "the branch.", icon: "🌳" },
            { noun: "He", verb: "walks", adverb: "slowly", prep: "**to**", object: "school.", icon: "🎒" }
        ]
    }
};

const QUIZ_DATA = [
    { question: 'The cat is ___ the box. (Inside)', answer: 'in', options: ['in', 'on', 'under'] },
    { question: 'The bird flies ___ the tree. (Above)', answer: 'over', options: ['over', 'in', 'behind'] },
    { question: 'The apple is ___ the table. (Top)', answer: 'on', options: ['on', 'in', 'under'] },
    { question: 'The dog sleeps ___ the bed. (Below)', answer: 'under', options: ['under', 'on', 'over'] },
    { question: 'Who is standing ___ the door?', answer: 'behind', options: ['behind', 'in', 'on'] }
];

function PrepositionsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'sentences' | 'quiz'
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

    const renderStyledText = (text, color = '#8E44AD') => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={index} style={{ color: color, fontWeight: '900', background: '#F4ECF7', padding: '0 4px', borderRadius: '4px' }}>{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#F5EEF8', // Light Purple
            padding: '20px'
        }}>

            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#8E44AD', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📍</span> PREPOSITIONS
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => setMode('learn')} style={{ padding: '12px 25px', background: mode === 'learn' ? '#8E44AD' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('sentences')} style={{ padding: '12px 25px', background: mode === 'sentences' ? '#E67E22' : 'white', color: mode === 'sentences' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Sentences 🏗️</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#2ECC71' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: '#8E44AD', fontSize: '2rem', margin: 0 }}>{PREPOSITION_DATA.basics.title}</h2>
                        <p style={{ color: '#7F8C8D', fontSize: '1.2rem' }}>{PREPOSITION_DATA.basics.description}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
                        {PREPOSITION_DATA.basics.items.map((item, idx) => (
                            <div key={idx}
                                onClick={() => speak(item.sentence)}
                                style={{
                                    background: 'white', padding: '25px', borderRadius: '20px',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                    textAlign: 'center', cursor: 'pointer',
                                    borderBottom: `6px solid #8E44AD`
                                }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{item.icon}</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8E44AD', marginBottom: '10px' }}>{item.word}</div>
                                <div style={{ fontSize: '1.2rem', color: '#2C3E50' }}>{renderStyledText(item.sentence)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'sentences' && (
                <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: '#E67E22', fontSize: '2rem', margin: 0 }}>{PREPOSITION_DATA.action_sentences.title}</h2>
                        <p style={{ color: '#7F8C8D', fontSize: '1.2rem' }}>{PREPOSITION_DATA.action_sentences.description}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
                        {PREPOSITION_DATA.action_sentences.sentences.map((s, idx) => (
                            <div key={idx}
                                onClick={() => speak(`${s.noun} ${s.verb} ${s.adverb} ${s.prep} ${s.object}`)}
                                style={{
                                    background: 'white', padding: '25px', borderRadius: '25px',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px',
                                    cursor: 'pointer'
                                }}>
                                <div style={{ fontSize: '3rem' }}>{s.icon}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '1.3rem', fontWeight: 'bold', color: '#34495E' }}>
                                    <span style={{ color: '#3498DB' }}>{s.noun}</span>
                                    <span style={{ color: '#E74C3C' }}>{s.verb}</span>
                                    <span style={{ color: '#16A085' }}>{s.adverb}</span>
                                    <span>{renderStyledText(s.prep, '#E67E22')}</span>
                                    <span style={{ color: '#2C3E50' }}>{s.object}</span>
                                </div>
                                <div style={{ marginLeft: 'auto', opacity: 0.3, fontSize: '1.5rem' }}>🔊</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', padding: '20px', background: '#FEF5E7', borderRadius: '15px', color: '#D35400' }}>
                        <strong>💡 Tip:</strong> Notice the order! Noun ➝ Verb ➝ Adverb ➝ Preposition.
                    </div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#8E44AD', marginBottom: '10px' }}>Question {quizIndex + 1} / {QUIZ_DATA.length}</h2>

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
                                            feedback && option !== QUIZ_DATA[quizIndex].answer && feedback === 'wrong' ? '#E74C3C' : '#F4ECF7',
                                        color: feedback ? 'white' : '#8E44AD',
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
                    <h2 style={{ fontSize: '3rem', color: '#8E44AD', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {QUIZ_DATA.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}

        </div>
    );
}

export default PrepositionsGame;
