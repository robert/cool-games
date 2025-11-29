import { useState, useEffect, useCallback } from 'react';
import './GameScreen.css';
import spaceTriviaData from '../spaceTriviaData.json';

function GameScreen({ mode, countries, onGameEnd }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionPool, setQuestionPool] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const TOTAL_QUESTIONS = 20;
  const isTriviaMode = mode === 'space-trivia';

  // Generate random question pool at start
  useEffect(() => {
    if (mode === 'space-trivia') {
      const shuffled = [...spaceTriviaData].sort(() => Math.random() - 0.5);
      setQuestionPool(shuffled.slice(0, TOTAL_QUESTIONS));
    } else {
      const shuffled = [...countries].sort(() => Math.random() - 0.5);
      setQuestionPool(shuffled.slice(0, TOTAL_QUESTIONS));
    }
  }, [countries, mode]);

  // Timer (only for non-trivia modes)
  useEffect(() => {
    if (isTriviaMode) return;

    const timer = setInterval(() => {
      setTime(t => t + 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [isTriviaMode]);

  // Generate question
  const generateQuestion = useCallback(() => {
    if (questionPool.length === 0 || currentQuestion >= TOTAL_QUESTIONS) return;

    if (mode === 'space-trivia') {
      const triviaQ = questionPool[currentQuestion];
      setQuestion(triviaQ.question);
      setOptions(triviaQ.options.map((opt, idx) => ({
        value: idx,
        display: opt,
        label: opt
      })));
      setCorrectAnswer(triviaQ.correct);
      setExplanation(triviaQ.explanation || 'No additional information available.');
      return;
    }

    const targetCountry = questionPool[currentQuestion];
    const wrongOptions = countries
      .filter(c => c.cca2 !== targetCountry.cca2)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const allOptions = [targetCountry, ...wrongOptions].sort(() => Math.random() - 0.5);

    switch(mode) {
      case 'country-to-flag':
        setQuestion(targetCountry.name.common);
        setOptions(allOptions.map(c => ({
          value: c.cca2,
          display: <img src={c.flags.png} alt="flag" className="flag-option" />,
          label: c.name.common
        })));
        setCorrectAnswer(targetCountry.cca2);
        break;

      case 'flag-to-country':
        setQuestion(<img src={targetCountry.flags.png} alt="flag" className="flag-question" />);
        setOptions(allOptions.map(c => ({
          value: c.cca2,
          display: c.name.common,
          label: c.name.common
        })));
        setCorrectAnswer(targetCountry.cca2);
        break;

      case 'country-to-capital':
        setQuestion(targetCountry.name.common);
        setOptions(allOptions.map(c => ({
          value: c.cca2,
          display: c.capital[0],
          label: c.capital[0]
        })));
        setCorrectAnswer(targetCountry.cca2);
        break;

      case 'capital-to-country':
        setQuestion(targetCountry.capital[0]);
        setOptions(allOptions.map(c => ({
          value: c.cca2,
          display: c.name.common,
          label: c.name.common
        })));
        setCorrectAnswer(targetCountry.cca2);
        break;

      default:
        break;
    }
  }, [mode, countries, questionPool, currentQuestion]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = useCallback((answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      setFeedback('CORRECT!');
      setScore(s => s + 1);
    } else {
      setFeedback('WRONG!');
      if (!isTriviaMode) {
        setTime(t => t + 10); // Add 10 second penalty (not in trivia mode)
      }
    }

    // Show explanation overlay for trivia mode
    if (isTriviaMode) {
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        setFeedback(null);
        setSelectedAnswer(null);
        if (currentQuestion + 1 >= TOTAL_QUESTIONS) {
          onGameEnd(time, score + (isCorrect ? 1 : 0));
        } else {
          setCurrentQuestion(q => q + 1);
        }
      }, 4000); // Longer delay for reading explanation
    } else {
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        if (currentQuestion + 1 >= TOTAL_QUESTIONS) {
          onGameEnd(time, score);
        } else {
          setCurrentQuestion(q => q + 1);
        }
      }, 1000); // Show correct answer for 1 second
    }
  }, [correctAnswer, currentQuestion, onGameEnd, time, score, isTriviaMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (feedback !== null) return; // Don't accept input during feedback

      const key = e.key;
      const num = parseInt(key);

      if (num >= 1 && num <= 5 && options[num - 1]) {
        handleAnswer(options[num - 1].value);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [options, feedback, handleAnswer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  };

  return (
    <div className="game-screen arcade-screen">
      <div className="game-header">
        <div className="game-stat">
          <span className="stat-label">QUESTION</span>
          <span className="stat-value">{currentQuestion + 1}/{TOTAL_QUESTIONS}</span>
        </div>
        {!isTriviaMode && (
          <div className="game-stat">
            <span className="stat-label">TIME</span>
            <span className="stat-value timer">{formatTime(time)}</span>
          </div>
        )}
        <div className="game-stat">
          <span className="stat-label">SCORE</span>
          <span className="stat-value">{score}/{TOTAL_QUESTIONS}</span>
        </div>
      </div>

      <div className="question-container">
        {feedback ? (
          <div className={`feedback ${feedback === 'CORRECT!' ? 'correct' : 'wrong'}`}>
            {feedback}
          </div>
        ) : (
          <>
            <div className="question-label">IDENTIFY:</div>
            <div className="question">
              {question}
            </div>
          </>
        )}
      </div>

      <div className="options-container">
        {options.map((option, idx) => {
          const isCorrectAnswer = option.value === correctAnswer;
          const isSelected = option.value === selectedAnswer;
          const showCorrect = feedback && !isSelected && isCorrectAnswer;
          const showWrong = feedback && isSelected && !isCorrectAnswer;

          return (
            <button
              key={idx}
              className={`option-button arcade-button ${showCorrect ? 'correct-answer' : ''} ${showWrong ? 'wrong-answer' : ''}`}
              onClick={() => handleAnswer(option.value)}
              disabled={feedback !== null}
            >
              <span className="option-number">{idx + 1}</span>
              <span className="option-content">{option.display}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="explanation-overlay">
          <div className="explanation-content">
            <h3 className="explanation-title">{feedback}</h3>
            <div className="explanation-answer">
              Correct Answer: {options[correctAnswer]?.label}
            </div>
            <div className="explanation-text">
              {explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameScreen;
