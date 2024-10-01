const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function CreateTeamWithName(name) {
  const newTeam = await prisma.team.create({
    data: {
      name,
    },
  });
  return newTeam;
}

async function CreateDepartmentWithName(name) {
  const newDepartment = await prisma.department.create({
    data: {
      name,
    },
  });
  return newDepartment;
}

async function FetchAllTeams() {
  const teams = await prisma.team.findMany();
  return teams;
}
async function FetchAllDepartments() {
  const departments = await prisma.department.findMany();
  return departments;
}

async function FetchAllNonAdminUsers(page, pageSize, searchParam) {
  // Calculate skip value
  const skip = (page - 1) * pageSize;

  // Prepare the search filter
  const searchFilter = searchParam
    ? {
        OR: [
          { firstName: { contains: searchParam, mode: "insensitive" } }, // Search by name
          { lastName: { contains: searchParam, mode: "insensitive" } }, // Search by name
          { email: { contains: searchParam, mode: "insensitive" } }, // Search by email
          { team: { name: { contains: searchParam, mode: "insensitive" } } }, // Search by team name
          {
            department: {
              name: { contains: searchParam, mode: "insensitive" },
            },
          }, // Search by department name
        ],
      }
    : {}; // No filter if searchParam is not provided

  // Query for non-admin users with pagination and search filter
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        roles: {
          none: {
            role: {
              name: "Admin", // Exclude users with the Admin role
            },
          },
        },
        ...searchFilter, // Add the search filter to the where clause
      },
      include: {
        roles: true, // Include roles to verify the user's roles
      },
      skip: skip, // Skip records
      take: pageSize, // Limit the number of records
    }),
    prisma.user.count({
      where: {
        roles: {
          none: {
            role: {
              name: "Admin",
            },
          },
        },
        ...searchFilter, // Include the same search filter for counting
      },
    }),
  ]);
  // Total pages based on total users and pageSize
  const totalPages = Math.ceil(totalUsers / pageSize);

  const employeeData = {
    users,
    pagination: {
      page,
      pageSize,
      totalUsers,
      totalPages,
    },
  };

  return employeeData;
}

module.exports = {
  CreateTeamWithName,
  CreateDepartmentWithName,
  FetchAllTeams,
  FetchAllDepartments,
  FetchAllNonAdminUsers,
};
