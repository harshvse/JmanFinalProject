const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createQuiz = async (courseId, title, questions) => {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        title,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            options: {
              create: q.options.map((o) => ({
                option: o.option,
                isCorrect: o.isCorrect,
              })),
            },
          })),
        },
      },
    });
    return quiz;
  } catch (error) {
    console.log(error);
  }
};

const CheckExistingQuiz = async (courseId) => {
  try {
    // Check if a quiz exists for the given courseId
    const quiz = await prisma.quiz.findFirst({
      where: { courseId: parseInt(courseId) },
    });

    // Send the response based on whether the quiz exists
    if (quiz) {
      return { exists: true };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.log(error);
  }
};

const getQuizzesForCourse = async (courseId) => {
  return await prisma.quiz.findMany({
    where: { courseId: parseInt(courseId) },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
};

const submitQuiz = async (quizId, userId, answers) => {
  try {
    const existingResult = await prisma.quizResult.findFirst({
      where: {
        userId: userId,
        quizId: quizId,
      },
    });

    if (existingResult) {
      console.log("Result Already Exists. How did you get here??");
      return existingResult;
    }

    // Fetch the quiz with questions and options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });

    if (!quiz) {
      return { error: "Quiz not found" }; // Change to JSON response format
    }

    let score = 0;

    // Convert answers from object to array
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOptionId]) => ({
        question_id: parseInt(questionId, 10), // Convert to integer
        selected_option_id: selectedOptionId,
      })
    );

    // Calculate score based on provided answers
    formattedAnswers.forEach((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.question_id);
      if (question) {
        const selectedOption = question.options.find(
          (o) => o.id === answer.selected_option_id
        );

        // Check if the selected option is correct
        if (selectedOption) {
          if (selectedOption.isCorrect) {
            score++;
          }
        }
      }
    });

    // Save the quiz result
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: userId,
        quizId: quizId,
        score: score,
      },
    });

    return quizResult;
  } catch (error) {
    console.log(error);
  }
};

const hasUserTakenQuiz = async (quizId, userId) => {
  return await prisma.quizResult.findFirst({
    where: {
      quizId: parseInt(quizId),
      userId: parseInt(userId),
    },
  });
};

const getUserResultForCourse = async (courseId, userId) => {
  return await prisma.quizResult.findFirst({
    where: {
      quiz: {
        courseId: parseInt(courseId),
      },
      userId: parseInt(userId),
    },
  });
};

module.exports = {
  createQuiz,
  getQuizzesForCourse,
  submitQuiz,
  hasUserTakenQuiz,
  getUserResultForCourse,
  CheckExistingQuiz,
};
