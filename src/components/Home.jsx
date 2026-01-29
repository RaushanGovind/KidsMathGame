import { motion } from 'framer-motion';

function Home({ onNavigate }) {
    return (
        <div className="home-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', padding: '40px 20px', textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>

            {/* Title Section */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ marginBottom: '50px', position: 'relative' }}
            >
                <h1 style={{
                    fontSize: '6rem',
                    lineHeight: '1',
                    color: '#2C3E50',
                    fontWeight: '900',
                    margin: 0,
                    letterSpacing: '-2px',
                    textTransform: 'uppercase'
                }}>
                    MATH<br />HERO ⚡
                </h1>
                <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#3498DB', marginTop: '10px' }}>
                    Master Math While Having Fun!
                </p>
            </motion.div>

            {/* Mascot Area */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                style={{ marginBottom: '60px', position: 'relative' }}
            >
                <div style={{ fontSize: '10rem' }}>🦉</div>
            </motion.div>

            {/* Navigation Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                width: '100%',
                maxWidth: '600px'
            }}>
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
                    title="REASONING"
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
                    title="SETTINGS"
                    icon="⚙️"
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
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                background: 'white',
                border: 'none',
                borderRadius: '30px',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
                cursor: 'pointer'
            }}
        >
            <div style={{
                fontSize: '3rem',
                background: `${color}15`,
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#2C3E50' }}>{title}</span>
        </motion.button>
    )
}

export default Home;
