// middleware.js
const jwt = require("jsonwebtoken");
const { findUserById } = require("./api/users/users.services");

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401);
    throw new Error("🚫 Un-Authorized No Auth Token 🚫");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
  } catch (err) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      throw new Error(err.name);
    }
    throw new Error("🚫 Un-Authorized 🚫");
  }

  return next();
}

function requireRole(role) {
  return async (req, res, next) => {
    try {
      const { payload } = req;

      if (!payload || !payload.userId) {
        res.status(401);
        throw new Error("🚫 Un-Authorized 🚫");
      }
      const user = await findUserById(payload.userId);
      if (!user) {
        res.status(401);
        throw new Error("🚫 Un-Authorized 🚫");
      }

      const userRoles = user.roles.map((userRole) => userRole.role.name);
      if (!userRoles.includes(role)) {
        res.status(403);
        throw new Error("🚫 Forbidden 🚫");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  notFound,
  errorHandler,
  isAuthenticated,
  requireRole,
};
