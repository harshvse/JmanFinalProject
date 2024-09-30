const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } }, // Include roles
  });
}

async function createUserByEmailAndPassword({
  email,
  password,
  firstName,
  lastName,
}) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
}

async function assignRoleToUser(userId, roleName) {
  const role = await prisma.role.findUnique({
    where: {
      name: roleName,
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  return prisma.userRoles.create({
    data: {
      userId: userId,
      roleId: role.id,
    },
  });
}

module.exports = {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById,
  assignRoleToUser,
};
