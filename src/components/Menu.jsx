import { motion } from 'framer-motion';

const menuItems = [
    { id: 'addition', title: 'Addition', icon: '➕', color: '#87CEEB', shadow: '#5F9EA0' },
    { id: 'subtraction', title: 'Subtract', icon: '➖', color: '#FFB6C1', shadow: '#DB7093' },
    { id: 'multiplication', title: 'Multiply', icon: '✖️', color: '#98FB98', shadow: '#3CB371' },
    { id: 'division', title: 'Division', icon: '➗', color: '#FFD700', shadow: '#DAA520' },
    { id: 'time', title: 'Time', icon: '⏰', color: '#C8A2C8', shadow: '#800080' },
    { id: 'fractions', title: 'Fractions', icon: '🍰', color: '#FFA07A', shadow: '#FF4500' },
    { id: 'tables', title: 'Table Practice', icon: '🔢', color: '#6A5ACD', shadow: '#483D8B' },
    { id: 'mentalmath', title: 'Mental Math', icon: '⚡', color: '#F1C40F', shadow: '#D4AC0D' },
    { id: 'lcm', title: 'LCM & HCF', icon: '🧮', color: '#8E44AD', shadow: '#71368A' },
    { id: 'unitary', title: 'Unitary Method', icon: '💰', color: '#16A085', shadow: '#138D75' },
    { id: 'timearithmetic', title: 'Time Math', icon: '⏱️', color: '#9B59B6', shadow: '#7D3C98' },
    { id: 'decimals', title: 'Decimals', icon: '🔢', color: '#1ABC9C', shadow: '#16A085' },
    { id: 'leaderboard', title: 'Leaderboard', icon: '🏆', color: '#F1C40F', shadow: '#D4AC0D' },
    { id: 'levelmap', title: 'Adventure Map', icon: '🗺️', color: '#E67E22', shadow: '#D35400' },
];

function Menu({ onSelectMode, onBack }) {
    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

            {/* Header: Back & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
                <button onClick={onBack} style={{
                    padding: '15px 30px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.2rem',
                    borderRadius: '20px',
                    boxShadow: '0 4px 0 #bdc3c7',
                    border: '3px solid #f1f2f6',
                    cursor: 'pointer'
                }}>
                    ⬅ HOME
                </button>
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    padding: '20px 40px',
                    borderRadius: '30px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                    flex: 1,
                    textAlign: 'center',
                    border: '3px solid white'
                }}>
                    <h1 style={{ color: '#2C3E50', fontSize: '3rem', fontWeight: '900', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Math Modes
                    </h1>
                </div>
            </div>

            {/* Game Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '25px'
            }}>
                {menuItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectMode(item.id)}
                        style={{
                            height: '240px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: '30px',
                            background: 'white',
                            borderRadius: '40px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                            border: '4px solid white',
                            position: 'relative'
                        }}
                    >
                        <span style={{
                            fontSize: '4.5rem', marginBottom: '15px'
                        }}>
                            {item.icon}
                        </span>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '900',
                            color: '#2C3E50',
                            margin: 0,
                            textAlign: 'center'
                        }}>
                            {item.title}
                        </h2>
                        <div style={{
                            marginTop: '15px',
                            height: '6px',
                            width: '40px',
                            background: item.color,
                            borderRadius: '3px'
                        }} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Menu;
