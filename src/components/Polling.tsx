import React, { useState, useEffect } from 'react';

interface PollOption {
    id: string;
    text: string;
    votes: number;
}

const Polling: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [question, setQuestion] = useState('What is the capital of Turkey?');
    const [options, setOptions] = useState<PollOption[]>([
        { id: 'A', text: 'Istanbul', votes: 0 },
        { id: 'B', text: 'Ankara', votes: 0 },
        { id: 'C', text: 'Izmir', votes: 0 },
        { id: 'D', text: 'Antalya', votes: 0 },
    ]);

    // Simulate real-time updates
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setOptions(prev => prev.map(opt => ({
                    ...opt,
                    votes: opt.votes + (Math.random() > 0.7 ? 1 : 0)
                })));
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="polling-container">
            <div className="poll-header">
                <h3>📊 Live Poll</h3>
                <button
                    className={`poll-toggle ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? 'Stop Poll' : 'Start Poll'}
                </button>
            </div>

            <div className="poll-question">
                {question}
            </div>

            <div className="poll-options">
                {options.map(option => (
                    <div key={option.id} className="poll-option">
                        <div className="option-info">
                            <span className="option-label">{option.id}. {option.text}</span>
                            <span className="vote-count">{option.votes} votes</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${totalVotes ? (option.votes / totalVotes) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        .polling-container {
          background: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          max-width: 400px;
          margin: 20px auto;
        }

        .poll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .poll-toggle {
          padding: 5px 15px;
          border-radius: 20px;
          border: none;
          background: #10B981;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }

        .poll-toggle.active {
          background: #EF4444;
        }

        .poll-question {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .poll-option {
          margin-bottom: 15px;
        }

        .option-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        .progress-bar-bg {
          height: 10px;
          background: #F3F4F6;
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--primary-cyan);
          transition: width 0.5s ease;
        }
      `}</style>
        </div>
    );
};

export default Polling;
