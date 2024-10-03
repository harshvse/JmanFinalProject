const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const {
  CreateNewCourse,
  AddNewContentToCourse,
  AssignCourseToUser,
  FetchUserCourses,
  RemoveUserCourse,
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
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;
      const search = req.query.search || "";

      const [courses, totalCourses] = await prisma.$transaction([
        prisma.course.findMany({
          where: {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
          skip,
          take: pageSize,
        }),
        prisma.course.count({
          where: {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCourses / pageSize);

      res.status(200).json({
        courses,
        currentPage: page,
        totalPages,
        totalCourses,
      });
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
router.delete("/user/course/remove", async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    await RemoveUserCourse(userId, courseId);
    res.status(200).json({ message: "Course removed from user successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove course from user" });
  }
});

module.exports = router;
