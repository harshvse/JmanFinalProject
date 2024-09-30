const express = require("express");
const { isAuthenticated, isMod, requireRole } = require("../../middlewares");
const { findUserById } = require("./users.services");

const router = express.Router();

router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/admin", isAuthenticated, requireRole("Admin"), (req, res) => {
  res.send("Welcome, admin!");
});

module.exports = router;
