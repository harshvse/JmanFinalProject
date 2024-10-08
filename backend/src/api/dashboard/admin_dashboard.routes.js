const express = require("express");
const router = express.Router();
const trainingService = require("./admin_dashboard.services");

// Route to get engagement data
router.get("/engagement/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const engagementData = await trainingService.getEngagementData(courseId);
    res.status(200).json(engagementData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch engagement data", error });
  }
});

// Route to get quiz scores
router.get("/scores/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const quizScores = await trainingService.getQuizScores(courseId);
    res.status(200).json(quizScores);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz scores", error });
  }
});

// Route to get time spent data
router.get("/timespent/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const timeSpentData = await trainingService.getTimeSpent(courseId);
    res.status(200).json(timeSpentData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch time spent data", error });
  }
});

// Route to get discussion data
router.get("/discussions/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const discussionData = await trainingService.getDiscussions(courseId);
    res.status(200).json(discussionData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discussion data", error });
  }
});

module.exports = router;
