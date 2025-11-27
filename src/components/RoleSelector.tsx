import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RoleSelector: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const selectRole = (role: 'student' | 'teacher') => {
        // Store role in localStorage
        localStorage.setItem('userRole', role);

        // Navigate to appropriate dashboard
        if (role === 'teacher') {
            navigate('/teacher/dashboard');
        } else {
            navigate('/student/dashboard');
        }
    };

    return (
        <div className="role-selector-overlay">
            <div className="role-selector-container">
                <h1 className="glow-text">Welcome to MinesMinis! 🎓</h1>
                <p className="role-subtitle">Choose your role to continue</p>

                <div className="role-cards">
                    <button
                        className="role-card premium-card"
                        onClick={() => selectRole('student')}
                    >
                        <div className="role-icon">🎓</div>
                        <h2>Student</h2>
                        <p>Learn, play, and grow!</p>
                    </button>

                    <button
                        className="role-card premium-card"
                        onClick={() => selectRole('teacher')}
                    >
                        <div className="role-icon">👨‍🏫</div>
                        <h2>Teacher</h2>
                        <p>Teach, track, and inspire!</p>
                    </button>
                </div>
            </div>

            <style>{`
        .role-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .role-selector-container {
          text-align: center;
          max-width: 600px;
          padding: 40px;
        }

        .role-subtitle {
          font-size: 1.2rem;
          color: white;
          margin-bottom: 40px;
        }

        .role-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .role-card {
          background: white;
          border: none;
          cursor: pointer;
          padding: 40px 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .role-card:hover {
          transform: translateY(-8px) scale(1.05);
        }

        .role-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .role-card h2 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .role-card p {
          color: #64748B;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .role-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default RoleSelector;
