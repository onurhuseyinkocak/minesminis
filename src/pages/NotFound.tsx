import { useNavigate } from 'react-router-dom';
import { Rocket, Home } from 'lucide-react';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Nunito', sans-serif",
                background: '#FFF8F2',
                padding: '2rem',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    marginBottom: '0.5rem',
                    animation: 'float 3s ease-in-out infinite',
                }}
            >
                <Rocket size={96} color="#FF6B35" strokeWidth={1.5} />
            </div>

            <h1
                style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 800,
                    color: '#1a1a2e',
                    margin: '0.5rem 0',
                }}
            >
                4&nbsp;
                <span style={{ color: '#FF6B35' }}>0</span>
                &nbsp;4
            </h1>

            <p
                style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                    color: '#64748B',
                    maxWidth: '420px',
                    marginBottom: '2rem',
                    fontWeight: 600,
                }}
            >
                Oops! This page got lost in space!
            </p>

            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 2rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    fontFamily: "'Nunito', sans-serif",
                    color: '#fff',
                    background: '#FF6B35',
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255,107,53,0.35)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
            >
                <Home size={20} />
                Ana Sayfaya Dön
            </button>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
            `}</style>
        </div>
    );
}

export default NotFound;
