const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const { SubmitFeedback, GetUserFeedback } = require("./feedback.services");
const router = express.Router();

// Submit feedback for a course
router.post("/:courseId/submit", isAuthenticated, async (req, res) => {
  const { courseId } = req.params;
  const { feedbackText, rating } = req.body;
  const { userId } = req.payload;

  try {
    const feedback = await SubmitFeedback(
      parseInt(courseId),
      parseInt(userId),
      feedbackText,
      parseInt(rating)
    );
    res.status(201).json({ feedback });
  } catch (error) {
    res.status(500).json({ error: "Error submitting feedback" });
  }
});

// Get existing feedback for a course by the user
router.get("/:courseId", isAuthenticated, async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.payload;

  try {
    const feedback = await GetUserFeedback(parseInt(courseId), userId);
    if (feedback) {
      res.status(200).json({ feedback });
    } else {
      res.status(204).json({ message: "No feedback found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching feedback" });
  }
});

module.exports = router;
