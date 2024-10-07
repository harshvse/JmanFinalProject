import { useState } from "react";
import { fetchWrapper } from "../helpers";
import styles from "./styles/QuestionDetail.module.css";

const QuestionDetail = ({ question, onBack }) => {
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState(question.question.answers || []);

  const handleAnswerQuestion = async () => {
    try {
      const answer = await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/discussion/${
          question.question.id
        }/createAnswer`,
        { answerText: newAnswer }
      );
      if (answer) {
        const newAnswerData = answer.answer;
        setAnswers([...answers, newAnswerData]);
        setNewAnswer("");
      }
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  return (
    <div>
      <button onClick={onBack} className={styles.button}>
        Back to Questions
      </button>
      <div className={styles.card}>
        <h3 className={styles.cardHeader}>{question.questionText}</h3>
        <div className={styles.cardContent}>
          {answers.map((answer) => (
            <div key={answer.id} className={styles.answer}>
              <p>{answer.answerText}</p>
              <span className={styles.answerMeta}>
                Answered by {answer.user.firstName} {answer.user.lastName}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.cardFooter}>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className={styles.textarea}
          />
          <button onClick={handleAnswerQuestion} className={styles.button}>
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
