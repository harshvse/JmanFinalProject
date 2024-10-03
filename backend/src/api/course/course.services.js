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

const FetchUserCourses = async (
  userId,
  page = 1,
  pageSize = 10,
  search = ""
) => {
  try {
    const skip = (page - 1) * pageSize;

    const courses = await prisma.course.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
        title: {
          contains: search, // Add search filtering by course title
          mode: "insensitive", // Case-insensitive search
        },
      },
      skip: skip, // Skip the first 'skip' courses
      take: pageSize, // Return 'pageSize' number of courses
    });

    const totalCourses = await prisma.course.count({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return { courses, totalCourses };
  } catch (error) {
    console.log("Error in Fetch: " + error);
  }
};

const RemoveUserCourse = async (userId, courseId) => {
  await prisma.courseUser.delete({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: courseId,
      },
    },
  });
};
module.exports = {
  CreateNewCourse,
  AddNewContentToCourse,
  AssignCourseToUser,
  FetchUserCourses,
  RemoveUserCourse,
};
