import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const GameContext = createContext();

const defaultSettings = {
    sound: true,
    music: true,
    theme: 'sky',
    mascot: 'owl',
    notifications: true,
    screenTime: 30,
    englishFont: 'Fredoka',
    hindiFont: 'Hind',
    voiceGender: 'female'
};

export function GameProvider({ children }) {
    const [userData, setUserData] = useState(() => {
        // Shared Initial State
        const getInitialState = (settings = defaultSettings) => ({
            stars: 0,
            currentLevel: 1,
            unlockedLevels: [1],
            totalPlayTime: 0,
            badges: [],
            settings: settings,
            gameStats: {
                addition: { correct: 0, total: 0 },
                subtraction: { correct: 0, total: 0 },
                multiplication: { correct: 0, total: 0 },
                division: { correct: 0, total: 0 },
                time: { correct: 0, total: 0 },
                fractions: { correct: 0, total: 0 }
            }
        });

        // Load from localStorage
        const saved = localStorage.getItem('fastMathFunData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.settings) {
                    // Handle migration from old fontFamily if exists
                    if (parsed.settings.fontFamily) {
                        parsed.settings.englishFont = parsed.settings.fontFamily;
                        delete parsed.settings.fontFamily;
                    }
                    // Merge default settings to ensure new features are present
                    parsed.settings = { ...defaultSettings, ...parsed.settings };
                    return parsed;
                }
            } catch (e) {
                console.error('Failed to parse saved data', e);
            }
        }
        return getInitialState();
    });

    // Save to localStorage whenever userData changes (debounced for performance)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('fastMathFunData', JSON.stringify(userData));
        }, 1000); // 1s debounce
        return () => clearTimeout(timeoutId);
    }, [userData]);

    const addStars = (count) => {
        setUserData(prev => ({
            ...prev,
            stars: prev.stars + count
        }));
    };

    const unlockLevel = (level) => {
        setUserData(prev => {
            if (prev.unlockedLevels.includes(level)) return prev;
            return {
                ...prev,
                unlockedLevels: [...prev.unlockedLevels, level],
                currentLevel: Math.max(prev.currentLevel, level)
            };
        });
    };

    const updateGameStats = (game, correct) => {
        setUserData(prev => ({
            ...prev,
            gameStats: {
                ...prev.gameStats,
                [game]: {
                    correct: prev.gameStats[game].correct + (correct ? 1 : 0),
                    total: prev.gameStats[game].total + 1
                }
            }
        }));
    };

    const unlockBadge = (badgeId) => {
        setUserData(prev => {
            if (prev.badges.includes(badgeId)) return prev;
            return {
                ...prev,
                badges: [...prev.badges, badgeId]
            };
        });
    };

    const updateSettings = (newSettings) => {
        setUserData(prev => ({
            ...prev,
            settings: { ...prev.settings, ...newSettings }
        }));
    };

    const addPlayTime = (minutes) => {
        setUserData(prev => ({
            ...prev,
            totalPlayTime: prev.totalPlayTime + minutes
        }));
    };

    const resetProgress = () => {
        const confirmed = window.confirm('Are you sure you want to reset ALL progress? This cannot be undone!');
        if (confirmed) {
            const freshData = {
                stars: 0,
                currentLevel: 1,
                unlockedLevels: [1],
                totalPlayTime: 0,
                badges: [],
                settings: userData.settings, // Keep settings
                gameStats: {
                    addition: { correct: 0, total: 0 },
                    subtraction: { correct: 0, total: 0 },
                    multiplication: { correct: 0, total: 0 },
                    division: { correct: 0, total: 0 },
                    time: { correct: 0, total: 0 },
                    fractions: { correct: 0, total: 0 }
                }
            };
            setUserData(freshData);
            localStorage.setItem('fastMathFunData', JSON.stringify(freshData));
        }
    };

    const value = useMemo(() => ({
        userData,
        addStars,
        unlockLevel,
        updateGameStats,
        unlockBadge,
        updateSettings,
        addPlayTime,
        resetProgress
    }), [userData]);

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
}
