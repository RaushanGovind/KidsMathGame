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
        <div style={{ width: '100%', padding: '16px' }}>

            {/* Compact Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    style={{
                        padding: '8px 14px', background: 'white', color: '#475569',
                        fontWeight: 900, fontSize: '0.8rem', borderRadius: '12px',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0',
                        cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                >
                    ⬅ {currentView === 'root' ? 'Home' : 'Back'}
                </motion.button>
                <div>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '2px', textTransform: 'uppercase' }}>English Zone</p>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#1E293B', fontWeight: 900, lineHeight: 1 }}>{getTitle()}</h1>
                </div>
            </div>

            {/* Compact 3-column grid */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px'
                    }}
                >
                    {MENU_STRUCTURE[currentView].map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ scale: 1.06, y: -3 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: `linear-gradient(135deg, ${item.color}, ${item.shadow})`,
                                border: 'none',
                                borderRadius: '16px',
                                padding: '14px 6px 10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                boxShadow: `0 5px 12px -2px ${item.color}66`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {item.type === 'folder' && (
                                <span style={{ position: 'absolute', top: 6, right: 8, fontSize: '0.6rem', background: 'rgba(255,255,255,0.3)', borderRadius: '6px', padding: '1px 5px', color: 'white', fontWeight: 900 }}>▶</span>
                            )}
                            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.icon}</span>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 900,
                                color: 'rgba(255,255,255,0.95)',
                                letterSpacing: '0.5px', textTransform: 'uppercase',
                                textAlign: 'center', lineHeight: 1.2, fontFamily: 'inherit'
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

