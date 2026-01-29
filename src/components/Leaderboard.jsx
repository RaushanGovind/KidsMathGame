import { useState, useEffect } from 'react';

function Leaderboard({ onBack }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => {
                setScores(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px' }}>

            {/* Top Navigation */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button onClick={onBack} style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#2C3E50',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 0 #bdc3c7',
                    border: '2px solid #ecf0f1'
                }}>
                    ⬅ MENU
                </button>
            </div>

            <div className="glass-panel" style={{
                padding: '40px',
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '40px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    color: '#2C3E50',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    🏆 Champions
                </h1>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div className="float-anim" style={{ fontSize: '4rem' }}>⏳</div>
                        <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#95A5A6' }}>Loading Heroes...</p>
                    </div>
                ) : scores.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#95A5A6' }}>No scores yet.<br />Be the first star! ⭐</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                        {scores.map((s, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px 30px',
                                background: i === 0 ? '#F1C40F' : i === 1 ? '#BDC3C7' : i === 2 ? '#E67E22' : 'white',
                                color: i < 3 ? 'white' : '#2C3E50',
                                borderRadius: '25px',
                                fontSize: '1.8rem',
                                fontWeight: '900',
                                boxShadow: i < 3 ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 0 #eee',
                                border: i < 3 ? 'none' : '2px solid #f1f2f6'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ opacity: 0.6 }}>#{i + 1}</span>
                                    {s.username}
                                </span>
                                <span>{s.score} <span style={{ fontSize: '1rem', opacity: 0.8 }}>PTS</span></span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Decorative Mascot */}
                <div style={{ position: 'absolute', top: '-60px', right: '-40px', fontSize: '8rem', transform: 'rotate(15deg)' }}>🏅</div>
            </div>
        </div>
    );
}

export default Leaderboard;
