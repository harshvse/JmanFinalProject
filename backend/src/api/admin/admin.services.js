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
  console.log(teams);
  return teams;
}
async function FetchAllDepartments() {
  const departments = await prisma.department.findMany();
  return departments;
}

module.exports = {
  CreateTeamWithName,
  CreateDepartmentWithName,
  FetchAllTeams,
  FetchAllDepartments,
};
