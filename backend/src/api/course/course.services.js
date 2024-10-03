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

const FetchCourseContent = async (courseId) => {
  // Fetch course content from the database using Prisma
  const courseContents = await prisma.courseContent.findMany({
    where: {
      courseId: parseInt(courseId), // Ensure courseId is an integer
    },
    orderBy: {
      orderInCourse: "asc", // Order the content by its sequence in the course
    },
  });
  return courseContents;
};

const MarkEngagementAsComplete = async (contentId, userId) => {
  // Check if engagement record already exists
  const existingEngagement = await prisma.engagement.findUnique({
    where: {
      userId_courseContentId: {
        userId: userId,
        courseContentId: contentId,
      },
    },
  });

  if (existingEngagement) {
    // Update the existing engagement record
    const updatedEngagement = await prisma.engagement.update({
      where: {
        id: existingEngagement.id,
      },
      data: {
        completed: true,
        lastAccessed: new Date(), // Optionally update last accessed time
      },
    });
    return updatedEngagement;
  } else {
    // Create a new engagement record
    const newEngagement = await prisma.engagement.create({
      data: {
        userId: userId,
        courseContentId: contentId,
        completed: true,
        lastAccessed: new Date(),
        createdAt: new Date(),
        totalTimeSpent: 0, // Initialize to 0 or whatever makes sense
      },
    });
    return newEngagement;
  }
};

const MarkTimeSpentOnEngagement = async (contentId, userId, timeSpent) => {
  // Find the engagement record
  let engagement = await prisma.engagement.findUnique({
    where: {
      userId_courseContentId: {
        userId: userId,
        courseContentId: contentId,
      },
    },
  });

  if (engagement) {
    // If engagement exists, set total time spent to the current time spent
    engagement = await prisma.engagement.update({
      where: {
        id: engagement.id,
      },
      data: {
        totalTimeSpent: timeSpent, // Set to the current time spent instead of accumulating
        lastAccessed: new Date(), // Optionally update last accessed time
      },
    });

    return engagement;
  } else {
    // If no engagement found, create a new one
    engagement = await prisma.engagement.create({
      data: {
        userId: userId,
        courseContentId: contentId,
        totalTimeSpent: timeSpent, // Initialize with the current time spent
        completed: false, // You can set this based on your requirements
        lastAccessed: new Date(), // Set the current date as last accessed
      },
    });

    return engagement;
  }
};

// Function to check if engagement is completed
const CheckEngagementCompletion = async (userId, contentId) => {
  const engagement = await prisma.engagement.findUnique({
    where: {
      userId_courseContentId: {
        courseContentId: parseInt(contentId), // Ensure contentId is passed properly
        userId: parseInt(userId), // Ensure userId is correctly typed as Int
      },
    },
    select: {
      completed: true,
    },
  });
  return engagement;
};
module.exports = {
  CreateNewCourse,
  AddNewContentToCourse,
  AssignCourseToUser,
  FetchUserCourses,
  RemoveUserCourse,
  FetchCourseContent,
  MarkEngagementAsComplete,
  MarkTimeSpentOnEngagement,
  CheckEngagementCompletion,
};
