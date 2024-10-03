const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // Helper function to generate random data
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Create Admin and User roles
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  const userRole = await prisma.role.findUnique({ where: { name: "User" } });

  // Create 100 teams
  const teams = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.team.create({ data: { name: faker.company.name() } })
    )
  );

  // Create 100 departments
  const departments = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.department.create({ data: { name: faker.commerce.department() } })
    )
  );

  // Create 100 users (2 admins, 98 regular users)
  const users = await Promise.all(
    Array.from({ length: 100 }, async (_, index) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: faker.internet.email({ firstName, lastName }),
          password: await bcrypt.hash(faker.internet.password(), 10),
          teamId: randomItem(teams).id,
          departmentId: randomItem(departments).id,
        },
      });

      // Assign role
      await prisma.userRoles.create({
        data: {
          userId: user.id,
          roleId: index < 2 ? adminRole.id : userRole.id,
        },
      });

      return user;
    })
  );

  // Create 100 courses
  const courseCategories = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "DevOps",
    "Cloud Computing",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "IoT",
    "Game Development",
  ];
  const courses = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.course.create({
        data: {
          title: `${faker.hacker.ingverb()} ${faker.hacker.noun()} with ${faker.hacker.abbreviation()}`,
          description: faker.lorem.paragraph(),
          category: randomItem(courseCategories),
        },
      })
    )
  );

  // Create 100 course contents
  const courseContents = await Promise.all(
    Array.from({ length: 100 }, (_, index) =>
      prisma.courseContent.create({
        data: {
          courseId: randomItem(courses).id,
          title: `${faker.hacker.verb()} ${faker.hacker.noun()}`,
          content: faker.lorem.paragraphs(3),
          orderInCourse: index + 1,
        },
      })
    )
  );

  // Create 100 quizzes
  await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.quiz.create({
        data: {
          contentId: randomItem(courseContents).id,
          question: `${faker.hacker.phrase()}?`,
          correctAnswer: faker.hacker.phrase(),
        },
      })
    )
  );

  // Create 100 discussions
  const discussions = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.discussion.create({
        data: {
          courseId: randomItem(courses).id,
          createdBy: randomItem(users).id,
        },
      })
    )
  );

  // Create 100 discussion questions
  const discussionQuestions = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.discussionQuestion.create({
        data: {
          discussionId: randomItem(discussions).id,
          userId: randomItem(users).id,
          questionText: `${faker.hacker.phrase()}?`,
        },
      })
    )
  );

  // Create 100 discussion answers
  await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.discussionAnswer.create({
        data: {
          questionId: randomItem(discussionQuestions).id,
          userId: randomItem(users).id,
          answerText: faker.lorem.paragraph(),
        },
      })
    )
  );

  // Create 100 quiz results
  await Promise.all(
    Array.from({ length: 100 }, async () =>
      prisma.quizResult.create({
        data: {
          quizId: randomItem(await prisma.quiz.findMany()).id,
          userId: randomItem(users).id,
          selectedAnswer: faker.lorem.sentence(),
          isCorrect: faker.datatype.boolean(),
        },
      })
    )
  );

  // Create 100 engagements
  await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.engagement.create({
        data: {
          userId: randomItem(users).id,
          courseContentId: randomItem(courseContents).id,
          totalTimeSpent: faker.number.int({ min: 60, max: 3600 }),
          lastAccessed: faker.date.past(),
        },
      })
    )
  );

  // Create 100 feedbacks
  await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.feedback.create({
        data: {
          courseId: randomItem(courses).id,
          userId: randomItem(users).id,
          feedbackText: faker.lorem.paragraph(),
          rating: faker.number.int({ min: 1, max: 5 }),
        },
      })
    )
  );

  // Create 100 refresh tokens
  await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.refreshToken.create({
        data: {
          hashedToken: faker.string.uuid(),
          userId: randomItem(users).id,
          revoked: faker.datatype.boolean(),
        },
      })
    )
  );

  console.log("Extended seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
