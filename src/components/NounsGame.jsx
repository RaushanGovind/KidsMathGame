import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';

const NOUN_DATA = {
    people: [
        { word: 'Boy', sentence: 'The BOY is playing.', icon: '👦' },
        { word: 'Girl', sentence: 'The GIRL is happy.', icon: '👧' },
        { word: 'Teacher', sentence: 'The TEACHER is kind.', icon: '👩‍🏫' },
        { word: 'Doctor', sentence: 'The DOCTOR helps us.', icon: '👨‍⚕️' },
        { word: 'Mother', sentence: 'My MOTHER loves me.', icon: '👩' },
        { word: 'Father', sentence: 'My FATHER works hard.', icon: '👨' },
        { word: 'Friend', sentence: 'My FRIEND is funny.', icon: '🧒' },
        { word: 'Baby', sentence: 'The BABY is crying.', icon: '👶' }
    ],
    places: [
        { word: 'School', sentence: 'I go to SCHOOL.', icon: '🏫' },
        { word: 'Home', sentence: 'I stay at HOME.', icon: '🏡' },
        { word: 'Park', sentence: 'We play in the PARK.', icon: '🌳' },
        { word: 'Hospital', sentence: 'Doctors work in the HOSPITAL.', icon: '🏥' },
        { word: 'Market', sentence: 'We buy food at the MARKET.', icon: '🏪' },
        { word: 'City', sentence: 'We live in the CITY.', icon: '🏙️' },
        { word: 'Village', sentence: 'My grandma lives in the VILLAGE.', icon: '🚜' },
        { word: 'Garden', sentence: 'Flowers grow in the GARDEN.', icon: '🌻' }
    ],
    animals: [
        { word: 'Dog', sentence: 'The DOG barks.', icon: '🐕' },
        { word: 'Cat', sentence: 'The CAT meows.', icon: '🐈' },
        { word: 'Cow', sentence: 'The COW gives milk.', icon: '🐄' },
        { word: 'Lion', sentence: 'The LION roars.', icon: '🦁' },
        { word: 'Tiger', sentence: 'The TIGER is strong.', icon: '🐅' },
        { word: 'Bird', sentence: 'The BIRD flies.', icon: '🐦' },
        { word: 'Fish', sentence: 'The FISH swims.', icon: '🐟' },
        { word: 'Horse', sentence: 'The HORSE runs fast.', icon: '🐎' }
    ],
    things: [
        { word: 'Book', sentence: 'This is my BOOK.', icon: '📖' },
        { word: 'Pen', sentence: 'I write with a PEN.', icon: '🖊️' },
        { word: 'Bag', sentence: 'My BAG is blue.', icon: '🎒' },
        { word: 'Chair', sentence: 'Sit on the CHAIR.', icon: '🪑' },
        { word: 'Table', sentence: 'Put it on the TABLE.', icon: '🧱' },
        { word: 'Ball', sentence: 'Kick the BALL.', icon: '⚽' },
        { word: 'Toy', sentence: 'I love my TOY.', icon: '🧸' },
        { word: 'Car', sentence: 'The CAR is fast.', icon: '🚗' }
    ],
    special: [
        { word: 'Riya', sentence: 'My name is RIYA.', icon: '👧' },
        { word: 'Amit', sentence: 'AMIT is my friend.', icon: '👦' },
        { word: 'India', sentence: 'I live in INDIA.', icon: '🇮🇳' },
        { word: 'Delhi', sentence: 'DELHI is a big city.', icon: '🏙️' },
        { word: 'Monday', sentence: 'Today is MONDAY.', icon: '📅' },
        { word: 'January', sentence: 'My birthday is in JANUARY.', icon: '🎂' }
    ]
};

const PRACTICE_QUIZ = [
    { text: "The cat is on the chair.", answer: "cat", options: ["is", "cat", "on"] },
    { text: "Rohan goes to school.", answer: "school", options: ["goes", "to", "school"] },
    { text: "My mother is cooking food.", answer: "mother", options: ["mother", "cooking", "is"] },
    { text: "We saw a tiger in the zoo.", answer: "tiger", options: ["saw", "tiger", "in"] },
    { text: "The teacher is kind.", answer: "teacher", options: ["is", "kind", "teacher"] },
    { text: "I live in India.", answer: "India", options: ["live", "in", "India"] },
    { text: "The dog is barking.", answer: "dog", options: ["dog", "is", "barking"] },
    { text: "This is my book.", answer: "book", options: ["is", "my", "book"] }
];

function NounsGame({ onBack }) {
    const [mode, setMode] = useState('learn'); // 'learn' | 'quiz'
    const [category, setCategory] = useState('people');
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
            speak(`Correct! ${option} is a noun.`);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak(`Try again. ${option} is not the noun.`);
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
            background: '#EBF5FB',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#3498DB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📛</span> NOUNS (NAMING WORDS)
                </div>
            </div>

            {/* Mode Selection */}
            {!showResult && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button onClick={() => { setMode('learn'); setCategory('people'); }} style={{ padding: '12px 25px', background: mode === 'learn' ? '#3498DB' : 'white', color: mode === 'learn' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Learn 📖</button>
                    <button onClick={() => setMode('quiz')} style={{ padding: '12px 25px', background: mode === 'quiz' ? '#E67E22' : 'white', color: mode === 'quiz' ? 'white' : '#7F8C8D', borderRadius: '25px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Practice 🎯</button>
                </div>
            )}

            {mode === 'learn' && (
                <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { id: 'people', label: 'People 👨‍👩‍👧‍👦', color: '#3498DB' },
                            { id: 'places', label: 'Places 🏠', color: '#27AE60' },
                            { id: 'animals', label: 'Animals 🐶', color: '#E67E22' },
                            { id: 'things', label: 'Things 🎒', color: '#9B59B6' },
                            { id: 'special', label: 'Special Names 🌟', color: '#F1C40F' }
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
                        {NOUN_DATA[category].map((item, idx) => (
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
                                    border: category === 'special' ? '2px solid #F1C40F' : '2px solid transparent'
                                }}
                            >
                                <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>{item.icon}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: category === 'special' ? '#F39C12' : '#2C3E50', marginBottom: '5px' }}>{item.word}</div>
                                <div style={{ fontSize: '1rem', color: '#7F8C8D', fontStyle: 'italic' }}>"{item.sentence}"</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'quiz' && !showResult && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#3498DB', marginBottom: '10px' }}>Question {quizIndex + 1} / {PRACTICE_QUIZ.length}</h2>
                        <h3 style={{ fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '20px' }}>Find the Noun:</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '40px', lineHeight: '1.4' }}>
                            {PRACTICE_QUIZ[quizIndex].text}
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
                                            feedback && option !== PRACTICE_QUIZ[quizIndex].answer && feedback === 'incorrect' ? '#E74C3C' : '#D6EAF8',
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
                    <p style={{ fontSize: '2rem', color: '#2C3E50', marginBottom: '40px' }}>You scored {score} out of {PRACTICE_QUIZ.length}!</p>
                    <button onClick={resetQuiz} style={{ padding: '15px 40px', borderRadius: '50px', background: '#F39C12', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 5px 0 #D35400' }}>Play Again 🔄</button>
                </div>
            )}
        </div>
    );
}

export default NounsGame;
