import React, { useEffect, useState } from 'react';

const TriviaGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Fetch trivia questions from your API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const limitedQuestions = data.results.slice(0, 10); // Limit to 10 questions
          setQuestions(limitedQuestions);
        } else {
          console.error("No questions available from API.");
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setGameOver(true);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer;
      handleAnswer(isCorrect);
    }
  };

  // If questions haven't loaded yet
  if (!questions || questions.length === 0) {
    return <p className="text-center text-xl mt-10">Loading questions...</p>;
  }

  // If the game is over
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
        <p className="text-2xl mb-4">Your final score: {score} out of {questions.length}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </div>
    );
  }

  const current = questions[currentQuestion]; // Current question

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Score in the top right corner */}
      <div className="absolute top-4 right-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">
        Score: {score}
      </div>

      {/* Trivia question */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-6">{decodeURIComponent(current.question)}</h2>

        {/* Answer options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {current.incorrect_answers.map((answer, idx) => (
            <button
              key={idx}
              className={`py-2 px-4 border rounded-lg text-lg font-medium
                ${selectedAnswer === answer ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
              `}
              onClick={() => setSelectedAnswer(answer)}
            >
              {decodeURIComponent(answer)}
            </button>
          ))}
          <button
            className={`py-2 px-4 border rounded-lg text-lg font-medium
              ${selectedAnswer === current.correct_answer ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
            `}
            onClick={() => setSelectedAnswer(current.correct_answer)}
          >
            {decodeURIComponent(current.correct_answer)}
          </button>
        </div>

        {/* Submit Answer Button */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default TriviaGame;
