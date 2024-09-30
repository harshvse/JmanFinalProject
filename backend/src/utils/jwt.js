const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      roles: user.roles ? user.roles.map((userRole) => userRole.role.name) : [],
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

function generateRefreshToken(user, jti) {
  return jwt.sign(
    {
      userId: user.id,
      roles: user.roles ? user.roles.map((userRole) => userRole.role.name) : [],
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "4h",
    }
  );
}

function generateTokens(user, jti) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
