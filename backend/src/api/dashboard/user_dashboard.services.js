const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTotalCourses = async (userId) => {
  return await prisma.courseUser.count({
    where: { userId: userId },
  });
};

const getTotalTimeSpent = async (userId) => {
  const totalTime = await prisma.engagement.aggregate({
    where: { userId: userId },
    _sum: { totalTimeSpent: true },
  });
  return totalTime._sum.totalTimeSpent || 0;
};

const getCoursesCompleted = async (userId) => {
  return await prisma.engagement.count({
    where: { userId: userId, completed: true },
  });
};

const getQuizzesAttempted = async (userId) => {
  return await prisma.quizResult.count({
    where: { userId: userId },
  });
};

const getAverageQuizScore = async (userId) => {
  const quizResults = await prisma.quizResult.findMany({
    where: { userId },
  });

  if (quizResults.length === 0) return 0;

  const totalScore = quizResults.reduce(
    (total, result) => total + result.score,
    0
  );
  const averageScore = totalScore / quizResults.length;

  // Get the total number of questions attempted to calculate percentage
  const totalQuestions = await prisma.quizQuestion.count({
    where: {
      quiz: {
        results: {
          some: {
            userId,
          },
        },
      },
    },
  });

  const percentageScore = totalQuestions
    ? (averageScore / totalQuestions) * 100
    : 0;

  return percentageScore; // Returning the average score as a percentage
};

const getFeedbackSubmitted = async (userId) => {
  return await prisma.feedback.count({
    where: { userId: userId },
  });
};

module.exports = {
  getTotalCourses,
  getTotalTimeSpent,
  getCoursesCompleted,
  getQuizzesAttempted,
  getAverageQuizScore,
  getFeedbackSubmitted,
};
