const express = require("express");

const auth = require("./auth/auth.routes");
const users = require("./users/users.routes");
const admin = require("./admin/admin.routes");
const course = require("./course/course.routes");
const quiz = require("./quiz/quiz.routes");
const discussion = require("./discussion/discussion.routes");
const feedback = require("./feedback/feedback.routes");
const userDashboard = require("./dashboard/user_dashboard.routes");
const adminDashboard = require("./dashboard/admin_dashboard.routes");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/admin", admin);
router.use("/course", course);
router.use("/quiz", quiz);
router.use("/discussion", discussion);
router.use("/feedback", feedback);
router.use("/user-dashboard", userDashboard);
router.use("/admin-dashboard", adminDashboard);
module.exports = router;
