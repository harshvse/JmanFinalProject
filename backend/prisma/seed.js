const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const USERS_TO_CREATE = 200;
const TEAMS_TO_CREATE = 10;
const DEPARTMENTS_TO_CREATE = 5;
const COURSES_TO_CREATE = 20;
const DISCUSSIONS_PER_COURSE = 3;
const QUESTIONS_PER_DISCUSSION = 5;
const ANSWERS_PER_QUESTION = 3;
const QUIZ_PER_COURSE = 2;
const QUESTIONS_PER_QUIZ = 10;
const OPTIONS_PER_QUESTION = 4;

const CS_COURSE_TITLES = [
  "Introduction to Programming",
  "Data Structures and Algorithms",
  "Web Development Fundamentals",
  "Database Management Systems",
  "Computer Networks",
  "Operating Systems",
  "Software Engineering",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity Basics",
  "Cloud Computing",
  "Mobile App Development",
  "Computer Graphics",
  "Distributed Systems",
  "Big Data Analytics",
  "Internet of Things",
  "Blockchain Technology",
  "Quantum Computing",
  "Natural Language Processing",
  "Computer Vision",
];

const CS_TOPICS = [
  "Variables and Data Types",
  "Control Structures",
  "Functions and Methods",
  "Object-Oriented Programming",
  "Arrays and Lists",
  "Sorting Algorithms",
  "Graph Algorithms",
  "HTML and CSS",
  "JavaScript Basics",
  "SQL Queries",
  "Network Protocols",
  "Process Management",
  "Memory Management",
  "Software Development Life Cycle",
  "Design Patterns",
  "Neural Networks",
  "Supervised Learning",
  "Unsupervised Learning",
  "Encryption Techniques",
  "Authentication Methods",
];

function getRandomCSContent() {
  return (
    faker.lorem.paragraphs(3) +
    "\n\n" +
    "Example:\n```\n" +
    faker.lorem.lines(5) +
    "\n```\n\n" +
    "Key points:\n" +
    faker.lorem.sentences(3)
  );
}

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.refreshToken.deleteMany(),
    prisma.userRoles.deleteMany(),
    prisma.role.deleteMany(),
    prisma.quizResult.deleteMany(),
    prisma.quizOption.deleteMany(),
    prisma.quizQuestion.deleteMany(),
    prisma.quiz.deleteMany(),
    prisma.discussionAnswer.deleteMany(),
    prisma.discussionQuestion.deleteMany(),
    prisma.discussion.deleteMany(),
    prisma.feedback.deleteMany(),
    prisma.engagement.deleteMany(),
    prisma.courseUser.deleteMany(),
    prisma.courseContent.deleteMany(),
    prisma.course.deleteMany(),
    prisma.user.deleteMany(),
    prisma.team.deleteMany(),
    prisma.department.deleteMany(),
  ]);

  // Create roles
  const roles = await Promise.all([
    prisma.role.create({ data: { name: "Admin" } }),
    prisma.role.create({ data: { name: "User" } }),
  ]);

  // Create teams
  const teams = await Promise.all(
    Array.from({ length: TEAMS_TO_CREATE }, () =>
      prisma.team.create({ data: { name: faker.company.name() + " Tech" } })
    )
  );

  // Create departments
  const departments = await Promise.all(
    Array.from({ length: DEPARTMENTS_TO_CREATE }, () =>
      prisma.department.create({
        data: {
          name: faker.helpers.arrayElement([
            "Software Development",
            "Data Science",
            "Information Security",
            "Network Engineering",
            "Quality Assurance",
          ]),
        },
      })
    )
  );

  // Create users
  const users = await Promise.all(
    Array.from({ length: USERS_TO_CREATE }, () =>
      prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          teamId: faker.helpers.arrayElement(teams).id,
          departmentId: faker.helpers.arrayElement(departments).id,
          roles: {
            create: {
              roleId: faker.helpers.arrayElement(roles).id,
            },
          },
          refreshTokens: {
            create: {
              hashedToken: faker.string.alphanumeric(64),
            },
          },
        },
      })
    )
  );

  // Create courses
  const courses = await Promise.all(
    CS_COURSE_TITLES.slice(0, COURSES_TO_CREATE).map((title) =>
      prisma.course.create({
        data: {
          title,
          description: faker.lorem.paragraph(),
          category: faker.helpers.arrayElement([
            "Programming",
            "Theory",
            "Applications",
          ]),
          content: {
            create: Array.from({ length: 5 }, (_, index) => ({
              title: faker.helpers.arrayElement(CS_TOPICS),
              content: getRandomCSContent(),
              orderInCourse: index + 1,
            })),
          },
        },
      })
    )
  );

  // Assign users to courses
  await Promise.all(
    users.flatMap((user) =>
      faker.helpers.arrayElements(courses, { min: 1, max: 5 }).map((course) =>
        prisma.courseUser.create({
          data: {
            userId: user.id,
            courseId: course.id,
          },
        })
      )
    )
  );

  // Create discussions, questions, and answers
  for (const course of courses) {
    for (let i = 0; i < DISCUSSIONS_PER_COURSE; i++) {
      const discussion = await prisma.discussion.create({
        data: {
          courseId: course.id,
          createdBy: faker.helpers.arrayElement(users).id,
        },
      });

      for (let j = 0; j < QUESTIONS_PER_DISCUSSION; j++) {
        const question = await prisma.discussionQuestion.create({
          data: {
            discussionId: discussion.id,
            userId: faker.helpers.arrayElement(users).id,
            questionText: faker.lorem.sentence() + "?",
          },
        });

        await Promise.all(
          Array.from({ length: ANSWERS_PER_QUESTION }, () =>
            prisma.discussionAnswer.create({
              data: {
                questionId: question.id,
                userId: faker.helpers.arrayElement(users).id,
                answerText: faker.lorem.paragraph(),
              },
            })
          )
        );
      }
    }
  }

  // Create quizzes, questions, and options
  for (const course of courses) {
    for (let i = 0; i < QUIZ_PER_COURSE; i++) {
      const quiz = await prisma.quiz.create({
        data: {
          courseId: course.id,
          title: `Quiz ${i + 1}: ${faker.helpers.arrayElement(CS_TOPICS)}`,
        },
      });

      for (let j = 0; j < QUESTIONS_PER_QUIZ; j++) {
        const question = await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            question: faker.lorem.sentence() + "?",
          },
        });

        await Promise.all(
          Array.from({ length: OPTIONS_PER_QUESTION }, (_, index) =>
            prisma.quizOption.create({
              data: {
                questionId: question.id,
                option: faker.lorem.sentence(),
                isCorrect: index === 0, // First option is correct
              },
            })
          )
        );
      }
    }
  }

  // Create engagements
  const courseContents = await prisma.courseContent.findMany();
  await Promise.all(
    users.flatMap((user) =>
      faker.helpers
        .arrayElements(courseContents, { min: 1, max: 10 })
        .map((content) =>
          prisma.engagement.create({
            data: {
              userId: user.id,
              courseContentId: content.id,
              totalTimeSpent: faker.number.int({ min: 0, max: 3600 }),
              completed: faker.datatype.boolean(),
              lastAccessed: faker.date.past(),
            },
          })
        )
    )
  );

  // Create feedbacks
  await Promise.all(
    users.flatMap((user) =>
      faker.helpers.arrayElements(courses, { min: 1, max: 3 }).map((course) =>
        prisma.feedback.create({
          data: {
            courseId: course.id,
            userId: user.id,
            feedbackText: faker.lorem.paragraph(),
            rating: faker.number.int({ min: 1, max: 5 }),
          },
        })
      )
    )
  );

  // Create quiz results
  const quizzes = await prisma.quiz.findMany();
  await Promise.all(
    users.flatMap((user) =>
      faker.helpers.arrayElements(quizzes, { min: 1, max: 5 }).map((quiz) =>
        prisma.quizResult.create({
          data: {
            userId: user.id,
            quizId: quiz.id,
            score: faker.number.int({ min: 0, max: 100 }),
          },
        })
      )
    )
  );

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
