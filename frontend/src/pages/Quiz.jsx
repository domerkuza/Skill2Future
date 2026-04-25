import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Learning.css';
import { Clock } from 'lucide-react';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    // In our seeder, we created a quiz with module_id. Let's assume the ID passed is quiz ID.
    // If it's module_id, the backend might need a different route or we fetch by module.
    // For now, let's call the API (assuming ID is quiz ID)
    axios.get(`/api/quiz/${id}`)
      .then(response => {
        setQuiz(response.data);
        if (response.data.temps_limite) {
          setTimeLeft(response.data.temps_limite * 60);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du quiz:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !loading) {
      handleSubmit();
    }
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (choiceId) => {
    const questionId = quiz.questions[currentQuestionIndex].id;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // We assume a user_id = 1 for demonstration if not provided by AuthContext
    const payload = {
      user_id: 1,
      reponses: selectedAnswers
    };

    axios.post(`/api/quiz/${id}/soumettre`, payload)
      .then(response => {
        // Redirect to results page
        navigate(`/apprentissage/resultats/${response.data.attempt_id}`);
      })
      .catch(error => {
        console.error('Erreur lors de la soumission du quiz:', error);
        alert("Une erreur s'est produite lors de la soumission.");
      });
  };

  if (loading) return <div className="learning-container">Chargement du quiz...</div>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0) return <div className="learning-container">Quiz indisponible.</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedChoiceId = selectedAnswers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="learning-container">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Quiz - {quiz.titre}</h2>
          <div className="timer">
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="quiz-card">
          <div className="quiz-progress">
            <div className="progress-bar-container" style={{ margin: 0, flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="quiz-progress-text">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </div>
          </div>

          <div className="question-text">
            {currentQuestion.enonce}
          </div>

          <div className="options-list">
            {currentQuestion.choices.map((choice, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedChoiceId === choice.id;

              return (
                <button
                  key={choice.id}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(choice.id)}
                >
                  <span className="option-letter">{letters[index]}</span>
                  <span className="option-text">{choice.label}</span>
                </button>
              );
            })}
          </div>

          <div className="quiz-actions">
            <button
              className="btn-secondary"
              onClick={handlePrev}
              style={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
            >
              &larr; Précédent
            </button>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!selectedChoiceId}
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Soumettre' : 'Suivant \u2192'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
