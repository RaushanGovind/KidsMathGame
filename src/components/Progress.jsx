import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

function Progress({ onNavigate, onBack }) {
    const { userData } = useGame();

    // Use real data from context
    const stats = {
        stars: userData.stars,
        level: userData.currentLevel,
        badges: userData.badges.length
    };

    const badges = [
        { id: 1, name: 'Math Star', icon: '⭐', unlocked: userData.badges.includes(1) },
        { id: 2, name: 'Fast Thinker', icon: '🧠', unlocked: userData.badges.includes(2) },
        { id: 3, name: 'Time Champ', icon: '⏱️', unlocked: userData.badges.includes(3) },
        { id: 4, name: 'Level Master', icon: '🏆', unlocked: userData.badges.includes(4) },
        { id: 5, name: 'Rocket Brain', icon: '🚀', unlocked: userData.badges.includes(5) },
        { id: 6, name: 'Happy Learner', icon: '🌈', unlocked: userData.badges.includes(6) }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            background: 'linear-gradient(135deg, #f6f8fb 0%, #e9eff5 100%)'
        }}>
            {/* Top Navigation */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'flex-start', marginBottom: '30px', zIndex: 10 }}>
                <button onClick={onBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 0 #bdc3c7',
                    border: '2px solid #ecf0f1',
                    cursor: 'pointer'
                }}>
                    ⬅ MENU
                </button>
            </div>

            <motion.div
                layout
                className="glass-panel"
                style={{
                    padding: '50px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderRadius: '40px',
                    width: '100%',
                    maxWidth: '800px'
                }}
            >
                {/* Title */}
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    color: '#2C3E50',
                    marginBottom: '40px',
                    textAlign: 'center',
                    letterSpacing: '-1px'
                }}>
                    My Progress 🏆
                </h1>

                {/* Stats Bubbles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '25px', width: '100%', marginBottom: '50px' }}>
                    <StatBubble icon="⭐" value={stats.stars} label="Total Stars" color="#F1C40F" />
                    <StatBubble icon="🎯" value={`${stats.level}`} label="Current Level" color="#3498DB" />
                    <StatBubble icon="🏅" value={stats.badges} label="Badges Won" color="#E74C3C" />
                </div>

                {/* Star Jar & Achievement Section */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '40px',
                    width: '100%',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {/* Star Jar */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            background: '#f8f9fa',
                            border: '4px solid #3498DB',
                            borderRadius: '30px',
                            padding: '30px',
                            width: '280px',
                            textAlign: 'center',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#7F8C8D', textTransform: 'uppercase', marginBottom: '15px' }}>
                            Star Jar
                        </div>
                        <div style={{ fontSize: '7rem', marginBottom: '10px' }}>🏺</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#F1C40F' }}>
                            {stats.stars}
                        </div>
                    </motion.div>

                    {/* Badge Section */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#2C3E50', marginBottom: '25px' }}>
                            My Badges
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '15px'
                        }}>
                            {badges.map(badge => (
                                <BadgeCard key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mascot Corner */}
                <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '40px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        zIndex: 10
                    }}
                >
                    <div style={{ fontSize: '6rem' }}>🦉</div>
                    <div style={{
                        background: '#2C3E50',
                        color: 'white',
                        padding: '15px 25px',
                        borderRadius: '25px',
                        borderBottomLeftRadius: '0',
                        marginBottom: '40px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        fontSize: '1.2rem',
                        fontWeight: '900'
                    }}>
                        "You're a Math Hero!"
                    </div>
                </motion.div>

            </motion.div>

            {/* Bottom Action Buttons */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
                <ActionButton
                    title="PLAY MORE"
                    icon="🎮"
                    color="#27AE60"
                    onClick={() => onNavigate('menu')}
                />
                <ActionButton
                    title="LEVEL MAP"
                    icon="🗺️"
                    color="#8E44AD"
                    onClick={() => onNavigate('levelmap')}
                />
            </div>
        </div>
    );
}

function StatBubble({ icon, value, label, color }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
                background: color,
                borderRadius: '20px',
                padding: '15px 25px',
                boxShadow: `0 6px 0 ${color}99, 0 8px 15px rgba(0,0,0,0.1)`,
                border: '3px solid white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                minWidth: '100px'
            }}
        >
            <div style={{ fontSize: '2rem' }}>{icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50' }}>{value}</div>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>{label}</div>
        </motion.div>
    );
}

function BadgeCard({ badge }) {
    return (
        <motion.div
            whileHover={badge.unlocked ? { scale: 1.1, rotate: 5 } : {}}
            whileTap={badge.unlocked ? { scale: 0.95 } : {}}
            style={{
                background: badge.unlocked
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : '#d1d5db',
                borderRadius: '20px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: '3px solid white',
                boxShadow: badge.unlocked
                    ? '0 5px 0 #DAA520, 0 8px 15px rgba(255,215,0,0.3)'
                    : '0 3px 0 #999',
                cursor: badge.unlocked ? 'pointer' : 'default',
                position: 'relative',
                minHeight: '100px'
            }}
        >
            <div style={{ fontSize: '2.5rem', filter: badge.unlocked ? 'none' : 'grayscale(1)' }}>
                {badge.unlocked ? badge.icon : '🔒'}
            </div>
            <div style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: badge.unlocked ? '#2C3E50' : '#888',
                textAlign: 'center'
            }}>
                {badge.name}
            </div>
            {badge.unlocked && (
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '1rem' }}
                >✨</motion.div>
            )}
        </motion.div>
    );
}

function ActionButton({ title, icon, color, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, translateY: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                background: color,
                border: '4px solid white',
                borderRadius: '25px',
                padding: '12px 30px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.2rem',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 6px 0 rgba(0,0,0,0.1)',
                cursor: 'pointer'
            }}
        >
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            {title}
        </motion.button>
    );
}

export default Progress;
