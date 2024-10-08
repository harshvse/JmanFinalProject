const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const {
  CreateNewCourse,
  AddNewContentToCourse,
  AssignCourseToUser,
  FetchUserCourses,
  RemoveUserCourse,
  FetchCourseContent,
  MarkEngagementAsComplete,
  MarkTimeSpentOnEngagement,
  CheckEngagementCompletion,
  FetchAllCourses,
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
  "/create-content",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { courseId, title, content, orderInCourse } = req.body;

    try {
      const courseContent = await AddNewContentToCourse(
        parseInt(courseId),
        title,
        content,
        parseInt(orderInCourse)
      );
      res.status(201).json(courseContent);
    } catch (error) {
      res.status(500).json({ error: "Error adding course content" });
    }
  }
);

// Assign a course to a user
router.post(
  "/assign",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { courseId } = req.body;
    const { userId } = req.body; // The user ID to assign the course to

    try {
      const courseUser = await AssignCourseToUser(userId, courseId);
      res.status(201).json({ message: "course assigned" });
    } catch (error) {
      res.status(500).json({ error: "Error assigning course to user" });
    }
  }
);

// API to fetch all courses
router.get(
  "/courses",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || "";
    try {
      const courses = await FetchAllCourses(page, pageSize, skip, search);
      res.status(201).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  }
);

// API to fetch courses for a specific user
router.get("/user/all", isAuthenticated, async (req, res) => {
  const userId = req.payload.userId;
  const { page = 1, pageSize = 10, search = "" } = req.query; // Get page, pageSize, and search from query params

  try {
    const { courses, totalCourses } = await FetchUserCourses(
      userId,
      parseInt(page),
      parseInt(pageSize),
      search
    );
    res.status(200).json({
      courses,
      totalPages: Math.ceil(totalCourses / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses for the user" });
  }
});

// API to remove a course from a user (using body instead of params)
router.delete(
  "/remove",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { userId, courseId } = req.body;

    try {
      await RemoveUserCourse(userId, courseId);
      res
        .status(200)
        .json({ message: "Course removed from user successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove course from user" });
    }
  }
);

router.get("/:courseId/contents", isAuthenticated, async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseContents = await FetchCourseContent(courseId);
    if (!courseContents) {
      return res.status(404).json({ message: "Course content not found" });
    }
    return res.status(200).json(courseContents);
  } catch (error) {
    console.error("Error fetching course content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Mark course content as complete
router.post("/contents/complete", isAuthenticated, async (req, res) => {
  const { contentId } = req.body;
  const userId = req.payload.userId;

  try {
    const engagement = await MarkEngagementAsComplete(contentId, userId);
    return res.status(201).json({ engagement });
  } catch (error) {
    console.error("Error processing engagement:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Define the endpoint to check engagement completion
router.get("/contents/complete/", isAuthenticated, async (req, res) => {
  const { contentId } = req.query; // Get userId and contentId from query parameters
  const { userId } = req.payload;
  try {
    const isCompleted = await CheckEngagementCompletion(userId, contentId); // Call the service function
    return res.status(200).json({ completed: isCompleted });
  } catch (error) {
    console.error("Error checking engagement completion:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update total time spent for engagement
router.post("/updatedTime", isAuthenticated, async (req, res) => {
  const { contentId, timeSpent } = req.body;
  const userId = req.payload.userId;

  try {
    const engagement = await MarkTimeSpentOnEngagement(
      contentId,
      userId,
      timeSpent
    );
  } catch (error) {
    console.error("Error updating total time spent:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
