const prisma = require("../prisma"); // Assuming prisma is initialized

// Get quizzes for a specific course content
const getQuizzesByContentId = async (contentId) => {
  return await prisma.quiz.findMany({
    where: { contentId: parseInt(contentId) },
    select: {
      id: true,
      question: true,
    },
  });
};

// Submit an answer for a quiz
const submitQuizAnswer = async (userId, quizId, selectedAnswer) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      correctAnswer: true,
    },
  });

  const isCorrect = quiz.correctAnswer === selectedAnswer;

  // Save the result
  return await prisma.quizResult.create({
    data: {
      quizId,
      userId,
      selectedAnswer,
      isCorrect,
    },
  });
};

// Get quiz results for a user
const getQuizResultsByUserId = async (userId) => {
  return await prisma.quizResult.findMany({
    where: { userId: parseInt(userId) },
    include: {
      quiz: true,
    },
  });
};

module.exports = {
  getQuizzesByContentId,
  submitQuizAnswer,
  getQuizResultsByUserId,
};
