const express = require("express");

const auth = require("./auth/auth.routes");
const users = require("./users/users.routes");
const admin = require("./admin/admin.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/admin", admin);

module.exports = router;
