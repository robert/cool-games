import { useState, useRef, useEffect } from 'react';
import './HighScoreEntry.css';

function HighScoreEntry({ time, mode, onSubmit }) {
  const [name, setName] = useState(['', '', '']);
  const [currentChar, setCurrentChar] = useState(0);
  const inputRefs = useRef([]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  };

  useEffect(() => {
    if (inputRefs.current[currentChar]) {
      inputRefs.current[currentChar].focus();
    }
  }, [currentChar]);

  const handleCharChange = (index, value) => {
    const newName = [...name];
    newName[index] = value.toUpperCase().slice(0, 1);
    setName(newName);

    if (value && index < 2) {
      setCurrentChar(index + 1);
    }
  };

  const handleSubmit = () => {
    const playerName = name.join('');
    if (playerName.length === 3) {
      // Get existing high scores
      const existingScores = JSON.parse(localStorage.getItem('geoQuizHighScores') || '[]');

      // Add new score
      const newScore = {
        name: playerName,
        time: time,
        mode: mode,
        date: new Date().toISOString()
      };

      existingScores.push(newScore);

      // Sort by time (ascending) and keep top 10
      existingScores.sort((a, b) => a.time - b.time);
      const topScores = existingScores.slice(0, 10);

      localStorage.setItem('geoQuizHighScores', JSON.stringify(topScores));

      onSubmit();
    }
  };

  return (
    <div className="highscore-entry-screen arcade-screen">
      <h1 className="arcade-title">NEW HIGH SCORE!</h1>

      <div className="score-display">
        <div className="score-label">YOUR TIME</div>
        <div className="score-time">{formatTime(time)}</div>
      </div>

      <div className="name-entry">
        <div className="name-label">ENTER YOUR INITIALS</div>
        <div className="name-inputs">
          {[0, 1, 2].map((idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength="1"
              value={name[idx]}
              onChange={(e) => handleCharChange(idx, e.target.value)}
              onFocus={() => setCurrentChar(idx)}
              className={`name-char ${currentChar === idx ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <button
        className="arcade-button"
        onClick={handleSubmit}
        disabled={name.join('').length !== 3}
      >
        SUBMIT SCORE
      </button>
    </div>
  );
}

export default HighScoreEntry;
