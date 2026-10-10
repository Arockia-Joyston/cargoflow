const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipment.controller");
const {
  JWTAuthMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

// Customer - Create shipment
router.post(
  "/",
  JWTAuthMiddleware,
  authorizeRoles("CUSTOMER"),
  shipmentController.createShipment,
);

// Customer - See their own shipments (Must be before /:trackingId)
router.get(
  "/my",
  JWTAuthMiddleware,
  authorizeRoles("CUSTOMER"),
  shipmentController.getMyShipments,
);

// Agent - View assigned shipments (Must be before /:trackingId)
router.get(
  "/assigned",
  JWTAuthMiddleware,
  authorizeRoles("AGENT"),
  shipmentController.getAssignedShipments,
);

// Customer - Track shipment by tracking ID
router.get(
  "/:trackingId",
  JWTAuthMiddleware,
  authorizeRoles("CUSTOMER"),
  shipmentController.trackShipment,
);

// Manager - Get all shipments
router.get(
  "/",
  JWTAuthMiddleware,
  authorizeRoles("MANAGER"),
  shipmentController.getAllShipments,
);

// Manager - Assign agent to shipment
router.patch(
  "/:id/assign",
  JWTAuthMiddleware,
  authorizeRoles("MANAGER"),
  shipmentController.assignAgent,
);

// Agent - Update shipment status
router.patch(
  "/:id/status",
  JWTAuthMiddleware,
  authorizeRoles("AGENT"),
  shipmentController.updateShipmentStatus,
);

module.exports = router;
