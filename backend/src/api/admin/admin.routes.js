const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const {
  getUsersWithOrderCount,
  fetchOrderData,
  CreateTeamWithName,
  CreateDepartmentWithName,
  FetchAllTeams,
  FetchAllDepartments,
} = require("./admin.services");
const router = express.Router();

router.get(
  "/users",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    try {
      const data = await getUsersWithOrderCount(
        Number(page),
        Number(limit),
        search
      );
      res.json(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/createTeam",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Team name is required" });
    }

    try {
      const newTeam = await CreateTeamWithName(name);
      res.status(201).json(newTeam);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create team" });
    }
  }
);

router.post(
  "/createDepartment",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Team name is required" });
    }

    try {
      const newDepartment = await CreateDepartmentWithName(name);
      res.status(201).json(newDepartment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create team" });
    }
  }
);

router.get("/teams", async (req, res) => {
  try {
    const teams = await FetchAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.get("/departments", async (req, res) => {
  try {
    const departments = await FetchAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});
module.exports = router;
