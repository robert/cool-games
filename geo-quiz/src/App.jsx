import { useState, useEffect } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import HighScoreEntry from './components/HighScoreEntry';
import HighScoreScreen from './components/HighScoreScreen';
import countriesData from './countriesData.json';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, highScoreEntry, viewHighScores
  const [gameMode, setGameMode] = useState(null);
  const [finalTime, setFinalTime] = useState(0);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Filter countries to only include those with capitals and valid flags
    const validCountries = countriesData.filter(
      country => country.capital && country.capital.length > 0 && country.flags.png
    );
    setCountries(validCountries);
  }, []);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setGameState('playing');
  };

  const handleGameEnd = (time) => {
    setFinalTime(time);
    setGameState('highScoreEntry');
  };

  const handleHighScoreSubmit = () => {
    setGameState('viewHighScores');
  };

  const handleBackToStart = () => {
    setGameState('start');
    setGameMode(null);
  };

  const handleViewHighScores = () => {
    setGameState('viewHighScores');
  };

  return (
    <div className="App">
      {gameState === 'start' && (
        <StartScreen
          onStartGame={handleStartGame}
          onViewHighScores={handleViewHighScores}
        />
      )}
      {gameState === 'playing' && (
        <GameScreen
          mode={gameMode}
          countries={countries}
          onGameEnd={handleGameEnd}
        />
      )}
      {gameState === 'highScoreEntry' && (
        <HighScoreEntry
          time={finalTime}
          mode={gameMode}
          onSubmit={handleHighScoreSubmit}
        />
      )}
      {gameState === 'viewHighScores' && (
        <HighScoreScreen
          onBackToStart={handleBackToStart}
          currentTime={gameState === 'viewHighScores' && finalTime > 0 ? finalTime : null}
        />
      )}
    </div>
  );
}

export default App;
