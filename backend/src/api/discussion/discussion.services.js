const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function GetAllQuestions(courseId) {
  try {
    const questions = await prisma.discussionQuestion.findMany({
      where: { discussion: { courseId: parseInt(courseId) } },
      include: {
        user: { select: { firstName: true, lastName: true } },
        _count: { select: { answers: true } },
      },
    });
    return questions;
  } catch (error) {
    console.log(error);
  }
}

async function CreateNewQuestion(courseId, questionText, userId) {
  try {
    // First, try to find an existing discussion for the course
    let discussion = await prisma.discussion.findFirst({
      where: { courseId: parseInt(courseId) },
    });

    // If no discussion exists, create a new one
    if (!discussion) {
      discussion = await prisma.discussion.create({
        data: {
          courseId: parseInt(courseId),
          createdBy: userId,
        },
      });
    }

    // Now create the question and associate it with the discussion
    const question = await prisma.discussionQuestion.create({
      data: {
        questionText,
        user: {
          connect: { id: userId },
        },
        discussion: {
          connect: { id: discussion.id },
        },
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
        discussion: true,
      },
    });
    console.log(question);
    return question;
  } catch (error) {
    console.log(error);
  }
}

async function GetQuestion(questionId) {
  try {
    const question = await prisma.discussionQuestion.findUnique({
      where: { id: parseInt(questionId) },
      include: {
        user: { select: { firstName: true, lastName: true } },
        answers: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    return question;
  } catch (error) {
    console.log(error);
  }
}

async function CreateAnswer(questionId, answerText, userId) {
  try {
    const answer = await prisma.discussionAnswer.create({
      data: {
        questionId: parseInt(questionId),
        userId,
        answerText,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });
    return answer;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  GetAllQuestions,
  CreateNewQuestion,
  GetQuestion,
  CreateAnswer,
};
