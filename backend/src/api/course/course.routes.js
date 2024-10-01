const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const {
  CreateNewCourse,
  AddNewContentToCourse,
  AssignCourseToUser,
} = require("./course.services");

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { title, description, category } = req.body;
    try {
      const newCourse = await CreateNewCourse(title, description, category);
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(500).json({ error: "Error creating course" });
    }
  }
);

router.post(
  "/:courseId/create",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { courseId } = req.params;
    const { title, content, orderInCourse } = req.body;

    try {
      const courseContent = await AddNewContentToCourse(
        courseId,
        title,
        content,
        orderInCourse
      );
      res.status(201).json(courseContent);
    } catch (error) {
      res.status(500).json({ error: "Error adding course content" });
    }
  }
);
// Assign a course to a user
router.post("/:courseId/assign", async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.body; // The user ID to assign the course to

  try {
    const courseUser = AssignCourseToUser(userId, courseId);
    res.status(201).json(courseUser);
  } catch (error) {
    res.status(500).json({ error: "Error assigning course to user" });
  }
});

module.exports = router;
