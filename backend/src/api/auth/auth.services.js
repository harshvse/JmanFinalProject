const { PrismaClient } = require("@prisma/client");
const { hashToken } = require("../../utils/hashToken");

const prisma = new PrismaClient();

async function addRefreshTokenToWhitelist({ jti, refreshToken, userId }) {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

async function findRefreshTokenById(id) {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

async function deleteRefreshToken(id) {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

async function revokeTokens(userId) {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}

module.exports = {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
};
