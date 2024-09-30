const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const { getUsersWithOrderCount, fetchOrderData } = require("./admin.services");
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

router.get(
  "/orders/:userId",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    const { userId } = req.params;
    try {
      const formattedOrders = await fetchOrderData(userId);
      res.json({ orders: formattedOrders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
module.exports = router;
