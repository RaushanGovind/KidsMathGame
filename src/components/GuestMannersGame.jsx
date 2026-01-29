import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound as playAppSound } from '../utils/sounds';
import { speak } from '../utils/speech';

function GuestMannersGame({ onBack }) {
    const [gameData, setGameData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('learn');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizOptions, setQuizOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/content/guest_manners')
            .then(res => res.json())
            .then(data => {
                setGameData(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load guest manners content", err);
                setLoading(false);
            });
    }, []);

    const currentItem = gameData[currentIndex];

    useEffect(() => {
        if (mode === 'learn' && currentItem) {
            const timeout = setTimeout(() => {
                playLearnSequence();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, mode, gameData]);

    const playLearnSequence = () => {
        if (currentItem) {
            speak(`${currentItem.text}. ${currentItem.context}`);
        }
    };

    const nextItem = () => {
        if (currentIndex < gameData.length - 1) setCurrentIndex(c => c + 1);
    };

    const prevItem = () => {
        if (currentIndex > 0) setCurrentIndex(c => c - 1);
    };

    const startQuizRound = () => {
        if (!gameData || gameData.length === 0) return;
        const target = gameData[Math.floor(Math.random() * gameData.length)];
        setQuizTarget(target);
        setFeedback(null);
        const options = [target];
        while (options.length < 3) {
            const random = gameData[Math.floor(Math.random() * gameData.length)];
            if (!options.includes(random)) options.push(random);
        }
        setQuizOptions(options.sort(() => Math.random() - 0.5));
        setTimeout(() => speak(`When do we say... ${target.text}?`), 500);
    };

    useEffect(() => {
        if (mode === 'quiz' && !loading) startQuizRound();
    }, [mode, loading]);

    const handleQuizOptionClick = (item) => {
        if (item.text === quizTarget.text) {
            playAppSound('correct');
            setFeedback('correct');
            setScore(s => s + 1);
            speak(`Correct! ${item.text}`);
            setTimeout(startQuizRound, 2000);
        } else {
            playAppSound('wrong');
            setFeedback('incorrect');
            speak("Try again!");
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>Loading Manners...</div>;

    if (!gameData || gameData.length === 0) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No content found.</div>;

    return (
        <div className="game-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', padding: '20px', minHeight: '100vh',
            background: 'linear-gradient(135deg, #E8F8F5 0%, #A3E4D7 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '12px 24px', background: 'white', color: '#2C3E50', fontWeight: '900', fontSize: '1.1rem', borderRadius: '15px', border: '2px solid #ECF0F1', cursor: 'pointer' }}>⬅ MENU</button>
                color: '#2C3E50',
                background: '#FEF5E7',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 0 rgba(0,0,0,0.05)',
                fontWeight: '600'
                                }}
                            >
                {phrase}
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🔊</span>
            </motion.button>
                        ))}
        </div>
                </motion.div >

            </div >
        </div >
    );
}

export default GuestMannersGame;
