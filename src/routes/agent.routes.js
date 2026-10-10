const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controller");
const {
  JWTAuthMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

// Manager - Get all agents
router.get(
  "/",
  JWTAuthMiddleware,
  authorizeRoles("MANAGER"),
  agentController.getAllAgents,
);

module.exports = router;
