import { useEffect, useState } from 'react';
import './HighScoreScreen.css';

function HighScoreScreen({ onBackToStart, currentTime }) {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem('geoQuizHighScores') || '[]');
    setHighScores(scores);
  }, [currentTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  };

  const getModeDisplay = (mode) => {
    const modes = {
      'country-to-flag': 'COUNTRY→FLAG',
      'flag-to-country': 'FLAG→COUNTRY',
      'country-to-capital': 'COUNTRY→CAPITAL',
      'capital-to-country': 'CAPITAL→COUNTRY'
    };
    return modes[mode] || mode;
  };

  return (
    <div className="highscore-screen arcade-screen">
      <h1 className="arcade-title">HIGH SCORES</h1>

      <div className="scores-table">
        <div className="scores-header">
          <span className="rank-col">RANK</span>
          <span className="name-col">NAME</span>
          <span className="time-col">TIME</span>
          <span className="mode-col">MODE</span>
        </div>

        {highScores.length === 0 ? (
          <div className="no-scores">
            NO SCORES YET
          </div>
        ) : (
          highScores.map((score, idx) => (
            <div
              key={idx}
              className={`score-row ${currentTime && Math.abs(score.time - currentTime) < 0.1 ? 'highlighted' : ''}`}
            >
              <span className="rank-col">{idx + 1}</span>
              <span className="name-col">{score.name}</span>
              <span className="time-col">{formatTime(score.time)}</span>
              <span className="mode-col">{getModeDisplay(score.mode)}</span>
            </div>
          ))
        )}
      </div>

      <button
        className="arcade-button"
        onClick={onBackToStart}
      >
        BACK TO START
      </button>
    </div>
  );
}

export default HighScoreScreen;
