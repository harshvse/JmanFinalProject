const express = require("express");
const router = express.Router();
const quizService = require("./quiz.services");
const { isAuthenticated, requireRole } = require("../../middlewares");

router.post(
  "/create",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { courseId, title, questions } = req.body;
    try {
      const quiz = await quizService.createQuiz(courseId, title, questions);
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/:courseId/quizzes", isAuthenticated, async (req, res) => {
  const { courseId } = req.params;
  try {
    const quizzes = await quizService.getQuizzesForCourse(courseId);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:quizId/attempt", isAuthenticated, async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const { userId } = req.payload;
  try {
    const result = await quizService.submitQuiz(
      parseInt(quizId),
      parseInt(userId),
      answers
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:quizId/attempted", isAuthenticated, async (req, res) => {
  const { quizId } = req.params;
  const { userId } = req.payload;
  try {
    const result = await quizService.hasUserTakenQuiz(quizId, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:courseId/results", isAuthenticated, async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.payload;
  try {
    const results = await quizService.getUserResultForCourse(courseId, userId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
