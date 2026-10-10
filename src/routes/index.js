const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const shipmentRoutes = require("./shipment.routes");
const agentRoutes = require("./agent.routes");

router.use("/auth", authRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/agents", agentRoutes);

module.exports = router;
