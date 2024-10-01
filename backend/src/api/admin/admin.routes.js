const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const {
  CreateTeamWithName,
  CreateDepartmentWithName,
  FetchAllTeams,
  FetchAllDepartments,
  FetchAllNonAdminUsers,
} = require("./admin.services");
const router = express.Router();

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

router.get(
  "/teams",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const teams = await FetchAllTeams();
      res.status(200).json(teams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  }
);

router.get(
  "/departments",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const departments = await FetchAllDepartments();
      res.status(200).json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  }
);

// GET route to fetch all non-admin users
router.get(
  "/fetchEmployees",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const search = req.query.search;
      const nonAdminUsers = await FetchAllNonAdminUsers(page, pageSize, search);
      res.status(200).json(nonAdminUsers);
    } catch (error) {
      console.error("Error fetching non-admin users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
module.exports = router;
