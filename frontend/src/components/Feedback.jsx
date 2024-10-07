import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../helpers";
import { useParams } from "react-router-dom";
import styles from "./styles/Feedback.module.css";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material";

const Feedback = () => {
  const { courseId } = useParams();
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [existingFeedback, setExistingFeedback] = useState(null);

  useEffect(() => {
    async function fetchFeedback() {
      // Fetch existing feedback
      const feedbackData = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/v1/api/feedback/${courseId}`
      );
      if (feedbackData.feedback) {
        setExistingFeedback(feedbackData.feedback);
        setFeedbackText(feedbackData.feedback.feedbackText);
        setRating(feedbackData.feedback.rating);
      }
    }
    fetchFeedback();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const feedbackData = { feedbackText, rating };
      const data = await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/feedback/${courseId}/submit`,
        feedbackData
      );
      setExistingFeedback(data.feedback);
    } catch (error) {
      console.log("Error submitting feedback", error);
    }
  };

  const StyledRating = styled(Rating)({
    "& .MuiRating-icon": {
      color: "var(--dark)",
    },
  });

  return (
    <div className={styles.container}>
      <h2>Course Feedback</h2>
      {existingFeedback ? (
        <div className={styles.feedbackContainer}>
          <p>Your Feedback:</p>
          <p>{existingFeedback.feedbackText}</p>
          <StyledRating
            name="customized-color"
            value={existingFeedback.rating}
            precision={0.5}
            readOnly
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
          <div className={styles.feedbackInput}>
            <label>Feedback:</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          <div className={styles.ratingContainer}>
            <label>Rating:</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              max={5}
              min={1}
            />
          </div>
          <button type="submit">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default Feedback;
