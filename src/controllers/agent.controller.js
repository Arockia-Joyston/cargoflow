const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



// Manager - Get all agents
exports.getAllAgents = async (req, res) => {
    try {
      const agents = await prisma.user.findMany({
        where: {
          role: "AGENT",
        },
        select: {
          id: true,
          name: true,
          email: true,
          _count: {
            select: {
              assignedShipments: true,
            },
          },
        },
        orderBy: {
          assignedShipments: {
            _count: "asc",
          },
        },
      });

      return res.status(200).json({
        message: "Agents retrieved successfully",
        data: agents,
      });
    } catch (error) {
      console.log("Internal server error:", error);

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
