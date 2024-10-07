const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Submit feedback for a course
async function SubmitFeedback(courseId, userId, feedbackText, rating) {
  try {
    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findFirst({
      where: { courseId, userId },
    });

    if (existingFeedback) {
      // If feedback already exists, update it
      const feedback = await prisma.feedback.update({
        where: { id: existingFeedback.id },
        data: { feedbackText, rating },
      });
      return feedback;
    }

    // Otherwise, create new feedback
    const feedback = await prisma.feedback.create({
      data: { courseId, userId, feedbackText, rating },
    });
    return feedback;
  } catch (error) {
    console.log(error);
  }
}

// Get user feedback for a course
async function GetUserFeedback(courseId, userId) {
  try {
    const feedback = await prisma.feedback.findFirst({
      where: { courseId, userId },
    });
    return feedback;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  SubmitFeedback,
  GetUserFeedback,
};
