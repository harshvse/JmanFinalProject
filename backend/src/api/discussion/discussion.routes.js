const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  GetAllQuestions,
  CreateNewQuestion,
  GetQuestion,
  CreateAnswer,
} = require("./discussion.services");
const router = express.Router();

// Get all questions for a course
router.get("/:courseId/questions", async (req, res) => {
  const { courseId } = req.params;
  try {
    const questions = await GetAllQuestions(courseId);
    res.status(201).json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// Create a new question
router.post("/:courseId/create", isAuthenticated, async (req, res) => {
  const { courseId } = req.params;
  const { questionText } = req.body;
  const { userId } = req.payload;

  try {
    const question = await CreateNewQuestion(courseId, questionText, userId);
    res.status(201).json({ question });
  } catch (error) {
    res.status(500).json({ error: "Error creating question" });
  }
});

// Get a specific question with its answers
router.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    const question = await GetQuestion(questionId);
    res.status(201).json({ question });
  } catch (error) {
    res.status(500).json({ error: "Error fetching question" });
  }
});

// Add an answer to a question
router.post("/:questionId/createAnswer", isAuthenticated, async (req, res) => {
  const { questionId } = req.params;
  const { answerText } = req.body;
  const { userId } = req.payload; // Assuming you have authentication middleware

  try {
    const answer = await CreateAnswer(questionId, answerText, userId);
    res.status(201).json({ answer });
  } catch (error) {
    res.status(500).json({ error: "Error creating answer" });
  }
});

module.exports = router;
