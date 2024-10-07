const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  getTotalCourses,
  getTotalTimeSpent,
  getCoursesCompleted,
  getQuizzesAttempted,
  getAverageQuizScore,
  getFeedbackSubmitted,
} = require("./user_dashboard.services");

const router = express.Router();

// Get total courses enrolled by the user
router.get("/totalCourses", isAuthenticated, async (req, res) => {
  const { userId } = req.payload;

  try {
    const totalCourses = await getTotalCourses(userId);
    res.status(200).json({ totalCourses });
  } catch (error) {
    res.status(500).json({ error: "Error fetching total courses" });
  }
});

// Get total time spent by the user
router.get("/totalTimeSpent", isAuthenticated, async (req, res) => {
  const { userId } = req.payload;

  try {
    const totalTimeSpent = await getTotalTimeSpent(userId);
    res.status(200).json({ totalTimeSpent });
  } catch (error) {
    res.status(500).json({ error: "Error fetching total time spent" });
  }
});

// Get total courses completed by the user
router.get("/coursesCompleted", isAuthenticated, async (req, res) => {
  const { userId } = req.payload;

  try {
    const coursesCompleted = await getCoursesCompleted(userId);
    res.status(200).json({ coursesCompleted });
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses completed" });
  }
});

// Get total quizzes attempted by the user
router.get("/quizzesAttempted", isAuthenticated, async (req, res) => {
  const { userId } = req.payload;

  try {
    const quizzesAttempted = await getQuizzesAttempted(userId);
    res.status(200).json({ quizzesAttempted });
  } catch (error) {
    res.status(500).json({ error: "Error fetching quizzes attempted" });
  }
});

// Get average quiz score for the user
router.get("/averageQuizScore", isAuthenticated, async (req, res) => {
  const { userId } = req.payload;

  try {
    const averageQuizScore = await getAverageQuizScore(userId);
    res.status(200).json({ averageQuizScore });
  } catch (error) {
    res.status(500).json({ error: "Error fetching average quiz score" });
  }
});

// Get total feedback submitted by the user
router.get("/feedbackSubmitted", isAuthenticated, async (req, res) => {
  const { userId } = req.payload;

  try {
    const feedbackSubmitted = await getFeedbackSubmitted(userId);
    res.status(200).json({ feedbackSubmitted });
  } catch (error) {
    res.status(500).json({ error: "Error fetching feedback submitted" });
  }
});

module.exports = router;
