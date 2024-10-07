import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWrapper } from "../helpers";
import styles from "./styles/Quiz.module.css";

const QuizComponent = () => {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [answers, setAnswers] = useState({}); // To track user's answers
  const [loading, setLoading] = useState(true);

  const formatDate = (today) => {
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedDate = dd + "/" + mm + "/" + yyyy;
    return formattedDate;
  };

  // Check if user has attempted any quizzes before fetching quizzes
  useEffect(() => {
    const checkQuizzesAttempted = async () => {
      try {
        // Fetch all quizzes for the course first
        const quizzesResponse = await fetchWrapper.get(
          `${import.meta.env.VITE_API_URL}/v1/api/quiz/${courseId}/quizzes`
        );

        // Check if each quiz has been attempted
        const attemptedPromises = quizzesResponse.map(async (quiz) => {
          const response = await fetchWrapper.get(
            `${import.meta.env.VITE_API_URL}/v1/api/quiz/${quiz.id}/attempted`
          );
          if (response) {
            // If attempted, fetch results
            const resultResponse = await fetchWrapper.get(
              `${import.meta.env.VITE_API_URL}/v1/api/quiz/${courseId}/results`
            );
            setQuizResults((prevResults) => ({
              ...prevResults,
              [quiz.id]: resultResponse,
            }));
            return { ...quiz, attempted: true };
          }
          return { ...quiz, attempted: false };
        });

        const quizzesWithAttemptedStatus = await Promise.all(attemptedPromises);
        setQuizzes(quizzesWithAttemptedStatus);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    checkQuizzesAttempted();
  }, [courseId]);

  // Handle quiz attempt submission
  const handleQuizAttempt = async (quizId) => {
    try {
      await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/quiz/${quizId}/attempt`,
        {
          quizId,
          answers,
        }
      );
      setAnswers({}); // Reset answers after submission
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleAnswerChange = (questionId, selectedOptionId) => {
    setAnswers((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: selectedOptionId,
      };
      console.log("Updated Answers:", newAnswers); // Log updated answers
      return newAnswers;
    });
  };

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  return (
    <div className={styles.quizContainer}>
      {quizzes.map((quiz) => (
        <div key={quiz.id}>
          <h2 className={styles.quizTitle}>{quiz.title}</h2>
          {quiz.attempted ? (
            <div>
              <h3>Your Results:</h3>
              <p>Score: {quizResults[quiz.id]?.score}</p>
              <p>
                Attempted On:{" "}
                {formatDate(new Date(quizResults[quiz.id]?.completedAt))}
              </p>
            </div>
          ) : (
            <div>
              <h3 className={styles.quizSubTitle}>
                Prove your mastery with this quiz
              </h3>
              {quiz.questions.map((question) => (
                <div key={question.id} className={styles.quizQuestionContainer}>
                  <p>{question.question}</p>
                  {question.options.map((option) => (
                    <div key={option.id} className={styles.inputs}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        className={styles.radioButtons}
                        value={option.id}
                        onChange={() =>
                          handleAnswerChange(question.id, option.id)
                        }
                      />
                      <label>{option.option}</label>
                    </div>
                  ))}
                </div>
              ))}
              <button
                className={styles.submitButton}
                onClick={() => handleQuizAttempt(quiz.id)}
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizComponent;
