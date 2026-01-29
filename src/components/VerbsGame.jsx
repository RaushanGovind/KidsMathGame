import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const VERB_DATA = {
    movement: [
        { word: 'Walk', sentence: 'I WALK to the park.', icon: '🚶' },
        { word: 'Run', sentence: 'I RUN fast.', icon: '🏃' },
        { word: 'Jump', sentence: 'The frog can JUMP.', icon: '🐸' },
        { word: 'Hop', sentence: 'Bunnies HOP around.', icon: '🐇' },
        { word: 'Skip', sentence: 'We SKIP together.', icon: '👭' },
        { word: 'Climb', sentence: 'I CLIMB the stairs.', icon: '🧗' },
        { word: 'Crawl', sentence: 'Babies CRAWL on the floor.', icon: '👶' },
        { word: 'Slide', sentence: 'I go down the SLIDE.', icon: '🛝' },
        { word: 'Roll', sentence: 'The ball ROLLS away.', icon: '⚽' },
        { word: 'Swim', sentence: 'I SWIM in the pool.', icon: '🏊' },
        { word: 'Fly', sentence: 'Birds FLY in the sky.', icon: '🕊️' }
    ],
    hands: [
        { word: 'Hold', sentence: 'HOLD my hand.', icon: '🤝' },
        { word: 'Throw', sentence: 'She THROWS the ball.', icon: '🥎' },
        { word: 'Catch', sentence: 'Can you CATCH it?', icon: '🤲' },
        { word: 'Push', sentence: 'PUSH the door open.', icon: '🚪' },
        { word: 'Pull', sentence: 'PULL the rope.', icon: '🪢' },
        { word: 'Lift', sentence: 'He LIFTS the box.', icon: '📦' },
        { word: 'Drop', sentence: 'Don’t DROP the glass.', icon: '🥛' },
        { word: 'Open', sentence: 'Please OPEN the book.', icon: '📖' },
        { word: 'Close', sentence: 'CLOSE the window.', icon: '🪟' },
        { word: 'Cut', sentence: 'CUT the paper.', icon: '✂️' },
        { word: 'Draw', sentence: 'She DRAWS a picture.', icon: '🎨' }
    ],
    home: [
        { word: 'Sweep', sentence: 'I SWEEP the floor.', icon: '🧹' },
        { word: 'Mop', sentence: 'Dad MOPS the kitchen.', icon: '🪣' },
        { word: 'Wash', sentence: 'I WASH my hands.', icon: '🧼' },
        { word: 'Cook', sentence: 'Mom COOKS dinner.', icon: '🍳' },
        { word: 'Bake', sentence: 'We BAKE a cake.', icon: '🍰' },
        { word: 'Clean', sentence: 'Let’s CLEAN the room.', icon: '✨' },
        { word: 'Fold', sentence: 'I FOLD my clothes.', icon: '👕' },
        { word: 'Dust', sentence: 'Planning to DUST the shelf.', icon: '🪶' },
        { word: 'Water', sentence: 'I WATER the plants.', icon: '🌱' }
    ],
    learning: [
        { word: 'Learn', sentence: 'I LEARN new things.', icon: '💡' },
        { word: 'Study', sentence: 'I STUDY English.', icon: '📚' },
        { word: 'Practice', sentence: 'We PRACTICE math.', icon: '➕' },
        { word: 'Teach', sentence: 'She TEACHES the class.', icon: '👩‍🏫' },
        { word: 'Explain', sentence: 'The teacher EXPLAINS the lesson.', icon: '🗣️' },
        { word: 'Ask', sentence: 'I ASK a question.', icon: '❓' },
        { word: 'Answer', sentence: 'He ANSWERS correctly.', icon: '✅' },
        { word: 'Solve', sentence: 'I can SOLVE the puzzle.', icon: '🧩' }
    ],
    feelings: [
        { word: 'Smile', sentence: 'She SMILES at me.', icon: '😊' },
        { word: 'Laugh', sentence: 'We LAUGH together.', icon: '😂' },
        { word: 'Cry', sentence: 'The baby CRIES when hungry.', icon: '😭' },
        { word: 'Worry', sentence: 'Don’t WORRY be happy.', icon: '😟' },
        { word: 'Hope', sentence: 'I HOPE it rains.', icon: '🤞' },
        { word: 'Wish', sentence: 'Make a WISH.', icon: '🌠' },
        { word: 'Enjoy', sentence: 'We ENJOY the game.', icon: '🎉' }
    ],
    communication: [
        { word: 'Talk', sentence: 'We TALK everyday.', icon: '💬' },
        { word: 'Speak', sentence: 'I SPEAK English.', icon: '🗣️' },
        { word: 'Say', sentence: 'SAY hello!', icon: '👋' },
        { word: 'Tell', sentence: 'TELL me a story.', icon: '📖' },
        { word: 'Shout', sentence: 'Don’t SHOUT inside.', icon: '📢' },
        { word: 'Whisper', sentence: 'He WHISPERS softly.', icon: '🤫' },
        { word: 'Call', sentence: 'CALL your friend.', icon: '📞' }
    ]
};

const PRACTICE_QUIZ = [
    { text: "Birds ___ in the sky.", answer: "fly", options: ["fly", "swim", "crawl"] },
    { text: "I ___ my homework every day.", answer: "do", options: ["do", "eat", "jump"] },
    { text: "She ___ the ball to me.", answer: "throws", options: ["throws", "eats", "sleeps"] },
    { text: "We ___ our hands before eating.", answer: "wash", options: ["wash", "break", "run"] },
    { text: "The baby ___ when she is hungry.", answer: "cries", options: ["cries", "laughs", "dances"] },
    { text: "Please ___ the door.", answer: "open", options: ["open", "fly", "cook"] },
    { text: "Mom ___ dinner.", answer: "cooks", options: ["cooks", "jumps", "draws"] },
    { text: "I ___ English.", answer: "study", options: ["study", "throw", "dust"] },
    { text: "She ___ at me.", answer: "smiles", options: ["smiles", "runs", "climbs"] },
    { text: "He ___ softly.", answer: "whispers", options: ["whispers", "shouts", "falls"] }
];

function VerbsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [category, setCategory] = useState('movement');
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
        const correct = PRACTICE_QUIZ[quizIndex].answer;
        if (option === correct) {
            playAppSound('correct');
            setScore(s => s + 1);
            setFeedback('correct');
            speak(`Correct! ${PRACTICE_QUIZ[quizIndex].text.replace('___', option)}`);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak(`Try again. The answer is ${correct}.`);
        }

        setTimeout(() => {
            if (quizIndex < PRACTICE_QUIZ.length - 1) {
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

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', minHeight: '100vh',
            background: '#FDEDEC',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#E74C3C', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏃‍♂️</span> ACTION WORDS (VERBS)
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => { setMode('learn'); setCategory('movement'); }} style={{ padding: '12px 25px', background: mode === 'learn' ? '#E74C3C' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#F39C12' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { id: 'movement', label: 'Movement 🏃', color: '#E74C3C' },
                            { id: 'hands', label: 'Hands ✋', color: '#F39C12' },
                            { id: 'home', label: 'Home 🧹', color: '#16A085' },
                            { id: 'learning', label: 'Learning 🧠', color: '#8E44AD' },
                            { id: 'feelings', label: 'Feelings 😀', color: '#E91E63' },
                            { id: 'communication', label: 'Speaking 🗣️', color: '#3498DB' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCategory(tab.id)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: category === tab.id ? tab.color : 'white',
                                    color: category === tab.id ? 'white' : tab.color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%' }}>
                        {VERB_DATA[category].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => speak(`${item.word}. ${item.sentence}`)}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    border: '2px solid transparent'
                                }}
                            >
                                <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>{item.icon}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2C3E50', marginBottom: '5px' }}>{item.word}</div>
                                <div style={{ fontSize: '1rem', color: '#7F8C8D', fontStyle: 'italic' }}>"{item.sentence}"</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#E74C3C', marginBottom: '10px' }}>Question {quizIndex + 1} / {PRACTICE_QUIZ.length}</h2>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '40px', lineHeight: '1.4' }}>
                            {PRACTICE_QUIZ[quizIndex].text.replace('___', '______')}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {PRACTICE_QUIZ[quizIndex].options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuizAnswer(option)}
                                    disabled={feedback !== null}
                                    style={{
                                        padding: '20px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        borderRadius: '20px',
                                        border: 'none',
                                        background: feedback && option === PRACTICE_QUIZ[quizIndex].answer ? '#2ECC71' :
                                            feedback && option !== PRACTICE_QUIZ[quizIndex].answer && feedback === 'incorrect' ? '#E74C3C' : '#FADBD8',
                                        color: feedback ? 'white' : '#C0392B',
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
                    <h2 style={{ fontSize: '3rem', color: '#E74C3C', marginBottom: '20px' }}>Quiz Complete!</h2>
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {PRACTICE_QUIZ.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}
        </div>
    );
}

export default VerbsGame;
