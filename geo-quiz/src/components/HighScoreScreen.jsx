import { useEffect, useState } from 'react';
import './HighScoreScreen.css';

function HighScoreScreen({ onBackToStart, mode, currentTime, currentScore }) {
  const [highScores, setHighScores] = useState([]);
  const isTriviaMode = mode === 'space-trivia';
  const isMusicMode = mode === 'music-intervals';
  const isScoreBased = isTriviaMode || isMusicMode;

  useEffect(() => {
    const storageKey = mode ? `geoQuizHighScores_${mode}` : 'geoQuizHighScores';
    const scores = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setHighScores(scores);
  }, [mode, currentTime, currentScore]);

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
      'capital-to-country': 'CAPITAL→COUNTRY',
      'space-trivia': 'SPACE TRIVIA',
      'music-intervals': 'MUSIC INTERVALS'
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
          <span className="time-col">{isScoreBased ? 'SCORE' : 'TIME'}</span>
          {!mode && <span className="mode-col">MODE</span>}
        </div>

        {highScores.length === 0 ? (
          <div className="no-scores">
            NO SCORES YET
          </div>
        ) : (
          highScores.map((score, idx) => {
            const isHighlighted = isScoreBased
              ? (currentScore && score.score === currentScore)
              : (currentTime && Math.abs(score.time - currentTime) < 0.1);

            return (
              <div
                key={idx}
                className={`score-row ${isHighlighted ? 'highlighted' : ''}`}
              >
                <span className="rank-col">{idx + 1}</span>
                <span className="name-col">{score.name}</span>
                <span className="time-col">
                  {score.score !== undefined ? score.score : formatTime(score.time)}
                </span>
                {!mode && <span className="mode-col">{getModeDisplay(score.mode)}</span>}
              </div>
            );
          })
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
