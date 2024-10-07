import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchWrapper } from "../helpers";
import styles from "./styles/DiscussionPanel.module.css";
import QuestionDetail from "./QuestionDetail";

const DiscussionPanel = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [courseId]);

  const fetchQuestions = async () => {
    try {
      const data = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/v1/api/discussion/${courseId}/questions`
      );
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAskQuestion = async () => {
    try {
      const question = await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/discussion/${courseId}/create`,
        { questionText: newQuestion }
      );
      if (question) {
        setNewQuestion("");
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  const handleSelectQuestion = async (question) => {
    try {
      const questionWithAnswers = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/v1/api/discussion/questions/${
          question.id
        }`
      );
      console.log(questionWithAnswers);
      setSelectedQuestion(questionWithAnswers);
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Course Discussions</h2>
      {selectedQuestion ? (
        <QuestionDetail
          question={selectedQuestion}
          onBack={() => setSelectedQuestion(null)}
        />
      ) : (
        <>
          <div className={styles.card}>
            <h3 className={styles.cardHeader}>Ask a Question</h3>
            <div className={styles.cardContent}>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
                className={styles.textarea}
              />
            </div>
            <div className={styles.cardFooter}>
              <button onClick={handleAskQuestion} className={styles.button}>
                Ask Question
              </button>
            </div>
          </div>
          {questions.map((question) => (
            <div
              key={question.id}
              className={`${styles.card} ${styles.clickable}`}
              onClick={() => handleSelectQuestion(question)}
            >
              <h3 className={styles.cardHeader}>{question.questionText}</h3>
              <div className={styles.cardFooter}>
                <span className={styles.answerCount}>
                  Click to view answers
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DiscussionPanel;
