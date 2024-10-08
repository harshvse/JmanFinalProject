const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Service to fetch engagement data for a course
const getEngagementData = async (courseId) => {
  try {
    const engagementData = await prisma.engagement.findMany({
      where: {
        courseContent: {
          courseId: parseInt(courseId), // Assuming courseId is in the related courseContent table
        },
      },
      include: {
        user: true,
        courseContent: true,
      },
    });
    return engagementData;
  } catch (error) {
    throw new Error("Error fetching engagement data: " + error.message);
  }
};

// Service to fetch quiz scores for a course
const getQuizScores = async (courseId) => {
  try {
    const quizScores = await prisma.quizResult.findMany({
      where: {
        quiz: {
          courseId: parseInt(courseId), // Filter by courseId within the related quiz
        },
      },
      include: {
        user: true,
        quiz: true,
      },
    });

    return quizScores;
  } catch (error) {
    console.error("Error fetching quiz scores:", error);
    throw error;
  }
};

// Service to fetch time spent data for a course
const getTimeSpent = async (courseId) => {
  try {
    // Aggregate to get the sum of totalTimeSpent for the given courseId
    const timeSpentData = await prisma.engagement.aggregate({
      _sum: {
        totalTimeSpent: true,
      },
      where: {
        courseContent: {
          courseId: parseInt(courseId),
        },
      },
    });

    return timeSpentData;
  } catch (error) {
    console.log("Error fetching time spent data: " + error.message);
    throw error; // Propagate the error for handling in the controller
  }
};

// Service to fetch discussions for a course
const getDiscussions = async (courseId) => {
  try {
    const discussionData = await prisma.discussion.findMany({
      where: {
        courseId: parseInt(courseId),
      },
      include: {
        questions: {
          include: {
            user: true,
            answers: true,
          },
        },
      },
    });
    return discussionData;
  } catch (error) {
    throw new Error("Error fetching discussion data: " + error.message);
  }
};

module.exports = {
  getEngagementData,
  getQuizScores,
  getTimeSpent,
  getDiscussions,
};
