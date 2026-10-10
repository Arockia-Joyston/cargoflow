const crypto = require("crypto");
const prisma = require("../utils/prisma");
const { ALLOWED_STATUS_TRANSITIONS } = require("../constants/shipment.constants");

// Customer - Create Shipment
const createShipment = async (req, res) => {
  try {
    // Data from Front-end
    const data = req.body;

    const trackingId = `CF-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    // DB logic
    const shipmentData = await prisma.shipment.create({
      data: {
        trackingId: trackingId,
        receiverName: data.receiverName,
        pickupLocation: data.pickupLocation,
        deliveryLocation: data.deliveryLocation,
        createdById: req.user.userId,
      },
    });

    // Data to frontend
    res
      .status(201)
      .json({ message: "Request Placed Successufully", data: shipmentData });
  } catch (error) {
    console.log("Internal Server Error", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Customer - See their own Shipments
const getMyShipments = async (req, res) => {
  try {
    // Data from Front-end

    // DB Logic
    const userShipments = await prisma.shipment.findMany({
      where: {
        createdById: req.user.userId,
      },
    });

    // Data to front-end
    res.status(200).json({
      message: "User shipments retrieved successfully",
      Shipments: userShipments,
    });
  } catch (error) {
    console.log("Internal server error", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Agent - View assigned shipments
const getAssignedShipments = async (req, res) => {
  try {
    // Data from Front-end

    // DB logic
    const shipment = await prisma.shipment.findMany({
      where: {
        agentId: req.user.userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Data to front-end
    return res
      .status(200)
      .json({ message: "Assigned Shipments", data: shipment });
  } catch (error) {
    console.log("Internal server error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Customer - Track shipment
const trackShipment = async (req, res) => {
  try {
    // Data from Front-end
    const { trackingId } = req.params;

    // DB Logic
    const trackingData = await prisma.shipment.findUnique({
      where: {
        trackingId: trackingId,
      },
      include: {
        trackingHistory: true,
      },
    });

    // Data to Front-end
    if (!trackingData) {
      return res.status(404).json({
        message: "Shipment Not Found",
      });
    }

    return res.status(200).json({
      message: "Shipment data retrieved successfully",
      data: trackingData,
    });
  } catch (error) {
    console.log("Internal server error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Manager - Get all shipments
const getAllShipments = async (req, res) => {
  try {
    // Data from Front-end

    // DB logic
    const shipments = await prisma.shipment.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Data to Front-end
    return res.status(200).json({
      message: "Shipments retrieved successfully",
      data: shipments,
    });
  } catch (error) {
    console.log("Internal server error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Manager - Assign Agent
const assignAgent = async (req, res) => {
  try {
    // Data from Front-end
    const { id } = req.params;
    const { agentId } = req.body;

    // DB logic
    const shipmentData = await prisma.shipment.findUnique({
      where: {
        id: id,
      },
    });

    if (!shipmentData) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const agent = await prisma.user.findUnique({
      where: {
        id: agentId,
      },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (agent.role !== "AGENT") {
      return res
        .status(400)
        .json({ message: "User is not a Delivery Agent" });
    }

    const data = await prisma.shipment.update({
      where: {
        id: id,
      },
      data: {
        agentId: agentId,
      },
    });

    // Data to front-end
    return res
      .status(200)
      .json({ message: "Agent assigned successfully", data: data });
  } catch (error) {
    console.log("Internal server error", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Agent - Update Shipment Status
const updateShipmentStatus = async (req, res) => {
  try {
    // Data from front-end
    const { id } = req.params;
    const { status, location } = req.body;

    // DB logic
    const shipment = await prisma.shipment.findUnique({
      where: {
        id: id,
      },
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (shipment.agentId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "shipment not assigned to you" });
    }

    if (!ALLOWED_STATUS_TRANSITIONS[shipment.status].includes(status)) {
      return res.status(400).json({
        message: `Can't change status from ${shipment.status} to ${status}`,
      });
    }

    const result = await prisma.$transaction([
      prisma.shipment.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      }),

      prisma.shipmentTracking.create({
        data: {
          shipmentId: id,
          status: status,
          location: location,
        },
      }),
    ]);

    // Data to front-end
    return res.status(200).json({
      message: "Shipment status updated successfully",
      shipment: result[0],
      tracking: result[1],
    });
  } catch (error) {
    console.log("Internal Server error", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

module.exports = {
  createShipment,
  getMyShipments,
  getAssignedShipments,
  trackShipment,
  getAllShipments,
  assignAgent,
  updateShipmentStatus,
};
