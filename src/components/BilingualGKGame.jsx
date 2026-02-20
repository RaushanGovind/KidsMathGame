import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Home, Star, BookOpen, Sun, Heart, Cloud, Users, School, Utensils, CheckCircle, Globe, Palette, Home as HomeIcon, Compass, Map, Volume2 } from 'lucide-react';
import { speak } from '../utils/speech';

const BilingualGKGame = ({ onBack, subject = 'gk' }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeQuestions, setActiveQuestions] = useState([]);

    const THEMES = {
        // Core Topics
        occupations: { color: "#96CEB4", shadow: "#82B29B", icon: "👨‍⚕️" },
        birds: { color: "#4ECDC4", shadow: "#42B2AB", icon: "🐦" },
        time: { color: "#54A0FF", shadow: "#488CE0", icon: "⏰" },
        human_body: { color: "#FF9F43", shadow: "#E08C3A", icon: "💪" },
        weather: { color: "#00D2D3", shadow: "#00B2B3", icon: "🌦️" },
        community_helpers: { color: "#54A0FF", shadow: "#488CE0", icon: "👨‍🚒" },
        school_life: { color: "#5F27CD", shadow: "#5122B0", icon: "🏫" },
        food_nutrition: { color: "#FF6B6B", shadow: "#E05252", icon: "🍎" },
        traffic_rules: { color: "#EE5253", shadow: "#D24748", icon: "🚦" },
        solar_system: { color: "#2E86DE", shadow: "#2773C2", icon: "🪐" },
        good_habits: { color: "#16A085", shadow: "#0E6655", icon: "🦷" },
        earth: { color: "#10AC84", shadow: "#0E9272", icon: "🌍" },
        colors_shapes: { color: "#FECA57", shadow: "#E0B24C", icon: "🎨" },
        home_family: { color: "#FF9FF3", shadow: "#E08CE0", icon: "🏠" },
        animals: { color: "#FF6B6B", shadow: "#E05252", icon: "🐾" },
        transport: { color: "#42A5F5", shadow: "#1E88E5", icon: "🚗" },
        landforms: { color: "#66BB6A", shadow: "#43A047", icon: "🏔️" },
        water_animals: { color: "#74B9FF", shadow: "#639EDF", icon: "🐙" },

        // Additional Batch Topics
        buildings: { color: "#607D8B", shadow: "#455A64", icon: "🏢" },
        good_manners: { color: "#EC407A", shadow: "#D81B60", icon: "🤝" },
        water_animals_facts: { color: "#4FC3F7", shadow: "#039BE5", icon: "🐳" },
        insects: { color: "#8BC34A", shadow: "#689F38", icon: "🐞" },
        flowers: { color: "#FD79A8", shadow: "#E06A92", icon: "🌸" },
        spices: { color: "#E17055", shadow: "#C2604A", icon: "🌶️" },
        directions_info: { color: "#636E72", shadow: "#565F62", icon: "🧭" },
        family_members: { color: "#EF5350", shadow: "#C62828", icon: "👨‍👩‍👧‍👦" },
        festivals: { color: "#F9CA24", shadow: "#DDAF1F", icon: "🎆" },
        school_objects: { color: "#FFCA28", shadow: "#FF8F00", icon: "🎒" },
        bathroom_items: { color: "#26C6DA", shadow: "#0097A7", icon: "🛁" },
        clothes: { color: "#EB4D4B", shadow: "#CC4240", icon: "👕" },
        classroom: { color: "#4834D4", shadow: "#3D2DAF", icon: "🏫" },
        my_home: { color: "#686DE0", shadow: "#5B5EC2", icon: "🏡" },
        kitchen: { color: "#F0932B", shadow: "#D38125", icon: "🍳" },
        wild_animals: { color: "#FFAB00", shadow: "#FF6F00", icon: "🦁" },
        opposites: { color: "#BADC58", shadow: "#A6C24F", icon: "↔️" },
        vegetables: { color: "#2ECC71", shadow: "#27AE60", icon: "🥦" },

        // Sets
        set_1: { color: "#E74C3C", shadow: "#C0392B", icon: "📚" },
        set_2: { color: "#3498DB", shadow: "#2980B9", icon: "📖" },
        set_3: { color: "#2ECC71", shadow: "#27AE60", icon: "📔" },

        // Physics
        physics_basics: { color: "#F1C40F", shadow: "#D4AC0D", icon: "⚛️" },
        electricity: { color: "#F1C40F", shadow: "#D4AC0D", icon: "⚡" },
        energy: { color: "#3498DB", shadow: "#2980B9", icon: "🔋" },
        magnets: { color: "#E74C3C", shadow: "#C0392B", icon: "🧲" },
        sound: { color: "#9B59B6", shadow: "#8E44AD", icon: "🔊" },
        heat: { color: "#E67E22", shadow: "#D35400", icon: "🔥" },
        gravity: { color: "#34495E", shadow: "#2C3E50", icon: "🌎" },
        simple_machines: { color: "#95A5A6", shadow: "#7F8C8D", icon: "⚙️" },
        light: { color: "#F1C40F", shadow: "#D4AC0D", icon: "💡" },
        forces_motion: { color: "#5D6D7E", shadow: "#4A5A6A", icon: "➡️" },

        // Chemistry
        chemistry_basics: { color: "#9B59B6", shadow: "#8E44AD", icon: "🧪" },
        atoms: { color: "#3498DB", shadow: "#2980B9", icon: "⚛️" },
        elements: { color: "#16A085", shadow: "#0E6655", icon: "💎" },
        acids_bases: { color: "#E74C3C", shadow: "#C0392B", icon: "🥽" },
        states_of_matter: { color: "#3498DB", shadow: "#2980B9", icon: "🧊" },
        water_cycle: { color: "#4FC3F7", shadow: "#039BE5", icon: "☁️" },
        chemical_changes: { color: "#FF7F50", shadow: "#E06A3A", icon: "🔥" },

        // Biology
        biology_basics: { color: "#27AE60", shadow: "#219150", icon: "🔬" },
        plants_parts: { color: "#2ECC71", shadow: "#27AE60", icon: "🌿" },
        plants_need: { color: "#27AE60", shadow: "#219150", icon: "☀️" },
        human_body_organs: { color: "#E74C3C", shadow: "#C0392B", icon: "❤️" },
        living_nonliving: { color: "#27AE60", shadow: "#219150", icon: "🦁" },
        fruits: { color: "#FF6347", shadow: "#E0523A", icon: "🍓" },

        default: { color: "#636E72", shadow: "#2D3436", icon: "📚" }
    };

    const PHYSICS_TOPICS = ['physics_basics', 'electricity', 'energy', 'magnets', 'sound', 'heat', 'gravity', 'solar_system', 'simple_machines', 'light', 'forces_motion', 'weather', 'air_wind'];
    const CHEMISTRY_TOPICS = ['chemistry_basics', 'atoms', 'elements', 'acids_bases', 'states_of_matter', 'chemical_changes', 'water_cycle', 'spices'];
    const BIOLOGY_TOPICS = ['biology_basics', 'human_body', 'human_body_organs', 'plants_parts', 'plants_need', 'animals', 'birds', 'insects', 'wild_animals', 'water_animals', 'fruits', 'vegetables', 'flowers', 'food_nutrition', 'living_nonliving'];

    const getCategoryTitle = (key) => {
        const titles = {
            occupations: "Occupations (व्यवसाय)",
            birds: "Birds (पक्षी)",
            time: "Time (समय)",
            human_body: "Human Body (मानव शरीर)",
            weather: "Weather (मौसम)",
            community_helpers: "Community Helpers (मददगार)",
            school_life: "School Life (स्कूली जीवन)",
            food_nutrition: "Food & Nutrition (भोजन और पोषण)",
            traffic_rules: "Traffic Rules (यातायात के नियम)",
            solar_system: "Solar System (सौर मंडल)",
            good_habits: "Good Habits (अच्छी आदतें)",
            earth: "Our Earth (हमारी पृथ्वी)",
            colors_shapes: "Colors & Shapes (रंग और आकार)",
            home_family: "Home & Family (घर और परिवार)",
            animals: "Animals (जानवर)",
            transport: "Transport (यातायात)",
            landforms: "Landforms (भूमि)",
            water_animals: "Water Animals (जलचर)",
            buildings: "Buildings (इमारतें)",
            good_manners: "Good Manners (अच्छे संस्कार)",
            water_animals_facts: "Water Animal Facts (जलीय जीव तथ्य)",
            insects: "Insects (कीड़े)",
            flowers: "Flowers (फूल)",
            spices: "Spices (मसाले)",
            directions_info: "Directions (दिशाएं)",
            family_members: "Family Members (परिवार के सदस्य)",
            festivals: "Festivals (त्योहार)",
            school_objects: "School Objects (स्कूल की वस्तुएं)",
            bathroom_items: "Bathroom Items (स्नानघर की वस्तुएं)",
            clothes: "Clothes (कपड़े)",
            classroom: "Classroom (कक्षा)",
            my_home: "My Home (मेरा घर)",
            kitchen: "Kitchen (रसोई)",
            wild_animals: "Wild Animals (जंगली जानवर)",
            opposites: "Opposites (विलोम शब्द)",
            vegetables: "Vegetables (सब्जियाँ)",
            human_body_organs: "Body Organs (शरीर के अंग)",
            plants_parts: "Parts of Plants (पौधों के भाग)",
            plants_need: "What Plants Need (पौधों की ज़रूरतें)",
            acids_bases: "Acids & Bases (अम्ल और क्षार)",
            physics_basics: "Physics Basics (भौतिकी की बुनियादी बातें)",
            chemistry_basics: "Chemistry Basics (रसायन विज्ञान बेसिक)",
            biology_basics: "Biology Basics (जीव विज्ञान बेसिक)",
            simple_machines: "Simple Machines (सरल मशीनें)",
            light: "Light & Shadows (प्रकाश और छाया)",
            set_1: "General Knowledge - 1",
            set_2: "General Knowledge - 2",
            set_3: "General Knowledge - 3"
        };
        return titles[key] || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await fetch(`${API_URL}/api/content/bilingual_gk`);
                const result = await response.json();

                // Merge sets and topics, ensuring no duplicates
                const merged = {
                    ...(result.sets || {}),
                    ...(result.topics || {})
                };

                let filtered = {};
                if (subject === 'physics') {
                    PHYSICS_TOPICS.forEach(topic => {
                        if (merged[topic]) filtered[topic] = merged[topic];
                    });
                } else if (subject === 'chemistry') {
                    CHEMISTRY_TOPICS.forEach(topic => {
                        if (merged[topic]) filtered[topic] = merged[topic];
                    });
                } else if (subject === 'biology') {
                    BIOLOGY_TOPICS.forEach(topic => {
                        if (merged[topic]) filtered[topic] = merged[topic];
                    });
                } else {
                    // GK: Everything else
                    Object.keys(merged).forEach(topic => {
                        if (!PHYSICS_TOPICS.includes(topic) &&
                            !CHEMISTRY_TOPICS.includes(topic) &&
                            !BIOLOGY_TOPICS.includes(topic)) {
                            filtered[topic] = merged[topic];
                        }
                    });
                }

                setData(filtered);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);
    const getTheme = (key) => THEMES[key] || THEMES.default;

    const handleCategorySelect = (questions, categoryName) => {
        setActiveQuestions(questions);
        setActiveCategory(categoryName);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
        // Welcome speak
        speak(`Let's learn about ${categoryName.replace(/_/g, ' ')}`, 'en-IN');
    };

    const handleNext = () => {
        if (currentQuestionIndex < activeQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowAnswer(false);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setShowAnswer(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F6F7' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50' }}>Loading Fun Facts... ⏳</div>
            </div>
        );
    }

    if (!data) return <div style={{ padding: '50px', textAlign: 'center', color: '#E74C3C' }}>Failed to load content.</div>;

    const activeTheme = activeCategory ? getTheme(activeCategory) : null;

    const getQuestionImage = () => {
        if (!activeQuestions[currentQuestionIndex]) return null;
        const q = activeQuestions[currentQuestionIndex];
        const category = activeCategory;
        const answer = String(q.en_a || q.answer || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

        // Strategy: Search in multiple folders since sets mix topics
        const foldersToSearch = [category];
        if (category.startsWith('set_') || category.includes('general')) {
            foldersToSearch.push('wild_animals', 'animals', 'birds', 'time', 'fruits', 'vegetables', 'solar_system', 'traffic_rules');
        }

        return (
            <div style={{ height: '100%', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {foldersToSearch.map((folder, idx) => (
                    <img
                        key={`${folder}-${answer}`}
                        src={`/images/${folder}/${answer}.png`}
                        alt=""
                        style={{
                            position: 'absolute',
                            maxHeight: '100%',
                            maxWidth: '100%',
                            borderRadius: '20px',
                            objectFit: 'contain',
                            display: 'none',
                            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                        }}
                        onLoad={(e) => {
                            // If this one loads, hide others and show this
                            const allImgs = e.target.parentElement.querySelectorAll('img');
                            allImgs.forEach(img => img.style.display = 'none');
                            e.target.style.display = 'block';
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#ecf0f1', padding: '20px 0' }}>

            {/* Main Container */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 20px' }}>

                {/* Header */}
                <div
                    className="mobile-header-stack"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                        position: 'relative',
                        justifyContent: 'space-between'
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="back-btn"
                        onClick={activeCategory ? () => setActiveCategory(null) : onBack}
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
                        <ChevronLeft size={18} /> {activeCategory ? 'Topics' : 'Menu'}
                    </motion.button>

                    <div
                        className="title-container"
                        style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {activeCategory && (
                            <h1 style={{
                                margin: 0,
                                fontSize: '1.4rem',
                                color: '#334155',
                                fontWeight: '800',
                            }}>
                                {getCategoryTitle(activeCategory)}
                            </h1>
                        )}
                        {!activeCategory && (
                            <h1 style={{
                                margin: 0,
                                fontSize: '1.2rem',
                                color: '#334155',
                                fontWeight: '800',
                            }}>
                                GENERAL KNOWLEDGE
                            </h1>
                        )}
                    </div>
                </div>

                {/* Placeholder for symmetry */}
                <div style={{ width: '100px' }} className="mobile-hide"></div>
            </div>

            <AnimatePresence mode="wait">
                {!activeCategory ? (
                    /* Topics Grid View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mobile-grid-1"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '20px'
                        }}
                    >
                        {Object.entries(data).map(([key, questions], index) => {
                            const theme = getTheme(key);
                            return (
                                <motion.button
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleCategorySelect(questions, key)}
                                    style={{
                                        background: theme.color,
                                        border: 'none',
                                        borderRadius: '30px',
                                        padding: '30px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: `0 10px 0 ${theme.shadow}`,
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

                                    <span style={{ fontSize: '4.5rem', marginBottom: '15px' }}>
                                        {theme.icon}
                                    </span>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <span style={{
                                            fontSize: '1.4rem',
                                            fontWeight: '900',
                                            color: 'white',
                                            lineHeight: '1.2',
                                            textShadow: '0 2px 0 rgba(0,0,0,0.1)'
                                        }}>
                                            {getCategoryTitle(key)}
                                        </span>
                                        <span style={{
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            color: 'rgba(255,255,255,0.8)',
                                            marginTop: '5px'
                                        }}>
                                            {questions.length} Questions
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* Game Layout */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            alignItems: 'center'
                        }}
                    >
                        {/* Progress Container */}
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 10px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Progress</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: activeTheme.color }}>
                                    {Math.round(((currentQuestionIndex + 1) / activeQuestions.length) * 100)}%
                                </span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                                    style={{
                                        height: '100%',
                                        background: activeTheme.color,
                                        boxShadow: `0 0 10px ${activeTheme.color}40`,
                                        borderRadius: '10px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div
                            className="mobile-padding-md"
                            style={{
                                background: 'white',
                                borderRadius: '40px',
                                padding: '30px',
                                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                                width: '100%',
                                textAlign: 'center',
                                position: 'relative',
                                border: '4px solid white'
                            }}
                        >
                            <div style={{ marginBottom: '30px', position: 'relative' }}>
                                {/* Image Logic for All Categories */}
                                <div style={{ marginBottom: '20px', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {getQuestionImage()}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <h2
                                        className="mobile-text-lg"
                                        style={{ fontSize: '1.8rem', color: '#2C3E50', fontWeight: '900', margin: 0, lineHeight: 1.3 }}
                                    >
                                        {activeQuestions[currentQuestionIndex].en_q}
                                    </h2>
                                    <button
                                        onClick={() => speak(activeQuestions[currentQuestionIndex].en_q, 'en-IN')}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTheme.color }}
                                    >
                                        <Volume2 size={24} />
                                    </button>
                                </div>
                                <div
                                    className="mobile-text-md"
                                    style={{
                                        fontSize: '1.4rem',
                                        color: '#7F8C8D',
                                        fontWeight: 'bold',
                                        marginTop: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    {activeQuestions[currentQuestionIndex].hi_q}
                                    <button
                                        onClick={() => speak(activeQuestions[currentQuestionIndex].hi_q, 'hi-IN')}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7F8C8D' }}
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {showAnswer ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="mobile-padding-sm"
                                        style={{
                                            background: '#F0F3F4',
                                            padding: '30px',
                                            borderRadius: '25px',
                                            border: `3px solid ${activeTheme.color}`,
                                            boxShadow: `0 8px 0 ${activeTheme.color}20` // slight transparency
                                        }}
                                    >
                                        <div
                                            className="mobile-grid-1 mobile-gap-sm"
                                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}
                                        >
                                            <div className="mobile-full-width">
                                                <div style={{ fontSize: '0.9rem', color: '#7F8C8D', fontWeight: 'bold', textTransform: 'uppercase' }}>Answer</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                    <div
                                                        className="mobile-text-lg"
                                                        style={{ fontSize: '2rem', color: activeTheme.color, fontWeight: '900' }}
                                                    >
                                                        {activeQuestions[currentQuestionIndex].en_a}
                                                    </div>
                                                    <button
                                                        onClick={() => speak(activeQuestions[currentQuestionIndex].en_a, 'en-IN')}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTheme.color }}
                                                    >
                                                        <Volume2 size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="mobile-no-border-left mobile-full-width"
                                                style={{ borderLeft: '2px solid #BDC3C7', paddingLeft: '20px' }}
                                            >
                                                <div style={{ fontSize: '0.9rem', color: '#7F8C8D', fontWeight: 'bold', textTransform: 'uppercase' }}>उत्तर</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                    <div
                                                        className="mobile-text-lg"
                                                        style={{ fontSize: '2rem', color: activeTheme.color, fontWeight: 'bold' }}
                                                    >
                                                        {activeQuestions[currentQuestionIndex].hi_a}
                                                    </div>
                                                    <button
                                                        onClick={() => speak(activeQuestions[currentQuestionIndex].hi_a, 'hi-IN')}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTheme.color }}
                                                    >
                                                        <Volume2 size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAnswer(true)}
                                        style={{
                                            padding: '20px 50px',
                                            background: activeTheme.color,
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            fontWeight: '900',
                                            border: 'none',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            boxShadow: `0 8px 0 ${activeTheme.shadow}`
                                        }}
                                    >
                                        REVEAL ANSWER 👀
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                width: '100%',
                                alignItems: 'center',
                                marginTop: '10px'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '500px' }}>
                                <motion.button
                                    whileHover={{ x: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handlePrev}
                                    disabled={currentQuestionIndex === 0}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        background: currentQuestionIndex === 0 ? '#F1F5F9' : 'white',
                                        color: currentQuestionIndex === 0 ? '#CBD5E1' : '#475569',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '20px',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: currentQuestionIndex === 0 ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <ChevronLeft size={20} /> Prev
                                </motion.button>

                                <motion.button
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    disabled={currentQuestionIndex === activeQuestions.length - 1}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        background: currentQuestionIndex === activeQuestions.length - 1 ? '#F1F5F9' : activeTheme.color,
                                        color: currentQuestionIndex === activeQuestions.length - 1 ? '#CBD5E1' : 'white',
                                        border: 'none',
                                        borderRadius: '20px',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        cursor: currentQuestionIndex === activeQuestions.length - 1 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: currentQuestionIndex === activeQuestions.length - 1 ? 'none' : `0 10px 15px -3px ${activeTheme.color}40`
                                    }}
                                >
                                    Next <ChevronRight size={20} />
                                </motion.button>
                            </div>

                            <div style={{
                                background: '#F1F5F9',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '900',
                                color: '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ color: activeTheme.color }}>{currentQuestionIndex + 1}</span>
                                <span style={{ opacity: 0.3 }}>/</span>
                                <span>{activeQuestions.length}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
};

export default BilingualGKGame;
