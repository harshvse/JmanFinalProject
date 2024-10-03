const express = require("express");
const router = express.Router();
const {
  getQuizzesByContentId,
  submitQuizAnswer,
  getQuizResultsByUserId,
} = require("./course.services");

// Get all quizzes for a specific content
router.get("/:contentId", async (req, res) => {
  const { contentId } = req.params;
  const quizzes = await getQuizzesByContentId(contentId);
  res.json(quizzes);
});

// Submit an answer for a quiz
router.post("/:quizId/submit", async (req, res) => {
  const { quizId } = req.params;
  const { userId, selectedAnswer } = req.body;
  const result = await submitQuizAnswer(userId, quizId, selectedAnswer);
  res.json(result);
});

// Get quiz results for a user
router.get("/results/:userId", async (req, res) => {
  const { userId } = req.params;
  const results = await getQuizResultsByUserId(userId);
  res.json(results);
});

module.exports = router;
