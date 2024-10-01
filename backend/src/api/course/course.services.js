const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CreateNewCourse = async (title, description, category) => {
  const newCourse = await prisma.course.create({
    data: {
      title,
      description,
      category,
    },
  });
  return newCourse;
};

const AddNewContentToCourse = async (
  courseId,
  title,
  content,
  orderInCourse
) => {
  try {
    const courseContent = await prisma.courseContent.create({
      data: {
        title,
        content,
        orderInCourse,
        course: { connect: { id: Number(courseId) } }, // Associate with course
      },
    });
    return courseContent;
  } catch (error) {
    console.log(error + " error");
  }
};

const AssignCourseToUser = async (userId, courseId) => {
  const courseUser = await prisma.courseUser.create({
    data: {
      user: { connect: { id: userId } },
      course: { connect: { id: Number(courseId) } },
    },
  });
  return courseUser;
};
module.exports = {
  CreateNewCourse,
  AddNewContentToCourse,
  AssignCourseToUser,
};
