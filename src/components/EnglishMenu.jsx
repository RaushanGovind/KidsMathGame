import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// Menu Configuration
const MENU_STRUCTURE = {
    root: [
        { id: 'alphabet', title: 'Alphabet', icon: '🅰️', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'folder_words', title: 'Words', icon: '📝', color: '#3498DB', shadow: '#2980B9', type: 'folder', target: 'words' },
        { id: 'folder_sentences', title: 'Sentences', icon: '🗣️', color: '#16A085', shadow: '#117A65', type: 'folder', target: 'sentences' },
        { id: 'folder_conversations', title: 'Conversations', icon: '🗨️', color: '#9B59B6', shadow: '#8E44AD', type: 'folder', target: 'conversations' },
        { id: 'folder_topics', title: 'Topic Words', icon: '📚', color: '#E67E22', shadow: '#D35400', type: 'folder', target: 'topics' },
        { id: 'spelling', title: 'Spelling Bee', icon: '🐝', color: '#F1C40F', shadow: '#D4AC0D', type: 'game' },
        { id: 'wordscramble', title: 'Word Scramble', icon: '🔠', color: '#E67E22', shadow: '#D35400', type: 'game' },
        { id: 'english-stories', title: 'Stories 📖', color: '#3498DB', shadow: '#2980B9', icon: '📚', type: 'game' }
    ],
    words: [
        { id: 'twoletter', title: '2 Letter Words', icon: '✌️', color: '#1ABC9C', shadow: '#16A085', type: 'game' },
        { id: 'threeletter', title: '3 Letter Words', icon: '👌', color: '#9B59B6', shadow: '#8E44AD', type: 'game' },
        { id: 'fourletter', title: '4 Letter Words', icon: '🍀', color: '#3498DB', shadow: '#2980B9', type: 'game' },
        { id: 'fiveletter', title: '5 Letter Words', icon: '🖐️', color: '#F39C12', shadow: '#D35400', type: 'game' },
        { id: 'sixletter', title: '6 Letter Words', icon: '🍌', color: '#E91E63', shadow: '#C2185B', type: 'game' },
        { id: 'sevenletter', title: '7 Letter Words', icon: '🌈', color: '#8E44AD', shadow: '#71368A', type: 'game' },
    ],
    sentences: [
        { id: 'sentences', title: 'Make a Sentence', icon: '📝', color: '#16A085', shadow: '#117A65', type: 'game' },
        { id: 'sentencebuilder', title: 'Jumbled Sentences', icon: '🏗️', color: '#F39C12', shadow: '#D35400', type: 'game' },
        { id: 'threewordsentences', title: '3 Word Sentences', icon: '💬', color: '#27AE60', shadow: '#1E8449', type: 'game' },
        { id: 'fourwordsentences', title: '4 Word Sentences', icon: '🗨️', color: '#2980B9', shadow: '#1F618D', type: 'game' },
        { id: 'actionsentences', title: 'Action Sentences', icon: '🏃', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'homeactions', title: 'Home Actions', icon: '🏠', color: '#D35400', shadow: '#A04000', type: 'game' },
        // Future sentence games go here
    ],
    conversations: [
        { id: 'conv_school', title: 'In School', icon: '🏫', color: '#3498DB', shadow: '#2980B9', type: 'game' },
        { id: 'conv_mom', title: 'With Mother', icon: '👩‍👦', color: '#E91E63', shadow: '#C2185B', type: 'game' },
        { id: 'conv_sister', title: 'With Sister', icon: '👧', color: '#9B59B6', shadow: '#8E44AD', type: 'game' },
        { id: 'conv_friend', title: 'With Friend', icon: '👫', color: '#F39C12', shadow: '#D35400', type: 'game' },
    ],
    topics: [
        { id: 'basicactions', title: 'Basic Actions', icon: '🏃', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'physicalactions', title: 'Physical Actions', icon: '🤸', color: '#2980B9', shadow: '#1F618D', type: 'game' },
        { id: 'schoolactions', title: 'School Actions', icon: '🏫', color: '#8E44AD', shadow: '#71368A', type: 'game' },
        { id: 'homeappliances', title: 'Home Appliances', icon: '🔌', color: '#7F8C8D', shadow: '#626567', type: 'game' },
        { id: 'commandsactions', title: 'Commands & Controls', icon: '🛑', color: '#27AE60', shadow: '#1E8449', type: 'game' },
        { id: 'feelingthinking', title: 'Feelings & Thinking', icon: '❤️', color: '#E91E63', shadow: '#C2185B', type: 'game' },
        { id: 'encouragement', title: 'Encouragement', icon: '🌟', color: '#F1C40F', shadow: '#D4AC0D', type: 'game' },
        { id: 'politephrases', title: 'Polite Phrases', icon: '🤝', color: '#16A085', shadow: '#117A65', type: 'game' },
        { id: 'guestmanners', title: 'Guest Manners', icon: '🏡', color: '#D35400', shadow: '#A04000', type: 'game' },
        { id: 'morningroutine', title: 'Morning Routine', icon: '🌅', color: '#F39C12', shadow: '#D35400', type: 'game' },
        { id: 'prepositions', title: 'Prepositions', icon: '📍', color: '#8E44AD', shadow: '#71368A', type: 'game' },
        { id: 'verbs', title: 'Verbs (Action Words)', icon: '🏃‍♂️', color: '#E74C3C', shadow: '#C0392B', type: 'game' },
        { id: 'nouns', title: 'Nouns (Naming Words)', icon: '📛', color: '#3498DB', shadow: '#2980B9', type: 'game' },
        { id: 'singularplural', title: 'One & Many', icon: '🐈', color: '#9B59B6', shadow: '#8E44AD', type: 'game' },
        { id: 'pronouns', title: 'Pronouns', icon: '👉', color: '#F1C40F', shadow: '#D4AC0D', type: 'game' },
        { id: 'adverbs', title: 'Adverbs (Describing Words)', icon: '🏃💨', color: '#16A085', shadow: '#138D75', type: 'game' },
        { id: 'adjectives', title: 'Adjectives (Describing Nouns)', icon: '🎨', color: '#E91E63', shadow: '#C2185B', type: 'game' },
        { id: 'yesnoquestions', title: 'Yes/No Questions', icon: '❓', color: '#3498DB', shadow: '#2980B9', type: 'game' },
        // Future topics (Animals, Fruits, etc.) go here
    ]
};

function EnglishMenu({ onSelectMode, onBack }) {
    const [currentView, setCurrentView] = useState('root');

    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            setCurrentView(item.target);
        } else {
            onSelectMode(item.id);
        }
    };

    const handleBack = () => {
        if (currentView === 'root') {
            onBack();
        } else {
            setCurrentView('root');
        }
    };

    const getTitle = () => {
        if (currentView === 'words') return 'WORD GAMES 📝';
        if (currentView === 'sentences') return 'SENTENCES 🗣️';
        if (currentView === 'conversations') return 'CHATS 💭';
        if (currentView === 'topics') return 'TOPICS 📚';
        return 'MAIN MENU';
    };

    return (
        <div className="mobile-padding-md" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

            {/* Header */}
            <div
                className="mobile-header-stack"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    position: 'relative',
                    justifyContent: 'space-between'
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="back-btn"
                    onClick={handleBack}
                    style={{
                        padding: '10px 20px',
                        background: 'white',
                        color: '#475569',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    <ChevronLeft size={18} /> {currentView === 'root' ? 'Menu' : 'Back'}
                </motion.button>

                <div
                    className="title-container"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        left: 0
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            color: '#94A3B8',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            marginBottom: '2px'
                        }}>
                            English Zone
                        </span>
                        <h1
                            className="mobile-text-lg"
                            style={{
                                margin: 0,
                                fontSize: '1.8rem',
                                color: '#1E293B',
                                fontWeight: '900',
                                lineHeight: 1
                            }}
                        >
                            {getTitle()}
                        </h1>
                    </div>
                </div>

                <div style={{ width: '100px' }} className="mobile-hide"></div>
            </div>

            {/* Grid */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="mobile-grid-1"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px'
                    }}
                >
                    {MENU_STRUCTURE[currentView].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: item.color,
                                border: 'none',
                                borderRadius: '30px',
                                padding: '30px',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 10px 0 ${item.shadow}`,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '220px',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Shine Effect */}
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                                transform: 'rotate(45deg)',
                                pointerEvents: 'none'
                            }} />

                            <span style={{
                                fontSize: '5rem',
                                marginBottom: '15px',
                                filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.1))'
                            }}>
                                {item.icon}
                            </span>

                            <span style={{
                                fontSize: '1.8rem',
                                fontWeight: '900',
                                color: 'white',
                                lineHeight: '1.2',
                                textShadow: '0 2px 0 rgba(0,0,0,0.1)'
                            }}>
                                {item.title}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default EnglishMenu;
