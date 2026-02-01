import { motion } from 'framer-motion';

function Home({ onNavigate }) {
    return (
        <div className="home-container mobile-padding-md" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px 20px', textAlign: 'center', minHeight: '100vh',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
        }}>

            {/* Title Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ marginBottom: '50px', position: 'relative' }}
            >
                <h1
                    className="mobile-text-lg"
                    style={{
                        fontSize: '5rem',
                        lineHeight: '0.9',
                        color: '#1E293B',
                        fontWeight: '900',
                        margin: 0,
                        letterSpacing: '-2px',
                        textTransform: 'uppercase'
                    }}
                >
                    KIDS<br /><span style={{ color: '#3498DB' }}>HERO</span> ⚡
                </h1>
                <p
                    className="mobile-text-md"
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        color: '#64748B',
                        marginTop: '15px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                >
                    The Smart Way to Learn & Play
                </p>
            </motion.div>

            {/* Mascot Area */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ marginBottom: '50px', position: 'relative' }}
            >
                <div style={{ fontSize: 'min(8rem, 18vw)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}>🦉</div>
            </motion.div>

            {/* Navigation Grid */}
            <div
                className="mobile-grid-1"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '800px',
                    padding: '10px'
                }}
            >
                <HomeButton
                    title="MATH"
                    icon="🔢"
                    color="#3498DB"
                    onClick={() => onNavigate('menu')}
                />
                <HomeButton
                    title="ENGLISH"
                    icon="📚"
                    color="#E74C3C"
                    onClick={() => onNavigate('english-menu')}
                />
                <HomeButton
                    title="LOGIC"
                    icon="🧠"
                    color="#8E44AD"
                    onClick={() => onNavigate('reasoning-menu')}
                />
                <HomeButton
                    title="HINDI"
                    icon="🇮🇳"
                    color="#F39C12"
                    onClick={() => onNavigate('hindi-menu')}
                />
                <HomeButton
                    title="GK"
                    icon="🌍"
                    color="#16A085"
                    onClick={() => onNavigate('bilingual_gk')}
                />
                <HomeButton
                    title="PHYSICS"
                    icon="⚡"
                    color="#F1C40F"
                    onClick={() => onNavigate('physics')}
                />
                <HomeButton
                    title="CHEMISTRY"
                    icon="🧪"
                    color="#9B59B6"
                    onClick={() => onNavigate('chemistry')}
                />
                <HomeButton
                    title="BIOLOGY"
                    icon="🌿"
                    color="#27AE60"
                    onClick={() => onNavigate('biology')}
                />
                <HomeButton
                    title="GAMES"
                    icon="🎮"
                    color="#95A5A6"
                    onClick={() => onNavigate('settings')}
                />
            </div>
        </div>
    );
}

function HomeButton({ title, icon, color, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                background: 'white',
                border: '1px solid #F1F5F9',
                borderRadius: '24px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                cursor: 'pointer'
            }}
        >
            <div style={{
                fontSize: '2.5rem',
                background: `${color}10`,
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '1rem', fontWeight: '900', color: '#334155', letterSpacing: '0.5px' }}>{title}</span>
        </motion.button>
    )
}

export default Home;
