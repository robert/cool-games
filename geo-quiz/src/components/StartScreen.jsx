import './StartScreen.css';

function StartScreen({ onStartGame, onViewHighScores }) {
  return (
    <div className="start-screen arcade-screen">
      <h1 className="arcade-title">GEO QUIZ</h1>
      <div className="arcade-subtitle">MASTERS</div>

      <div className="menu">
        <h2 className="menu-title">SELECT GAME MODE</h2>

        <button
          className="arcade-button"
          onClick={() => onStartGame('country-to-flag')}
        >
          COUNTRY → FLAG
        </button>

        <button
          className="arcade-button"
          onClick={() => onStartGame('flag-to-country')}
        >
          FLAG → COUNTRY
        </button>

        <button
          className="arcade-button"
          onClick={() => onStartGame('country-to-capital')}
        >
          COUNTRY → CAPITAL
        </button>

        <button
          className="arcade-button"
          onClick={() => onStartGame('capital-to-country')}
        >
          CAPITAL → COUNTRY
        </button>

        <button
          className="arcade-button secondary"
          onClick={onViewHighScores}
        >
          VIEW HIGH SCORES
        </button>
      </div>

      <div className="arcade-footer">
        INSERT COIN TO CONTINUE
      </div>
    </div>
  );
}

export default StartScreen;
