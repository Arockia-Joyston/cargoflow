-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'MANAGER', 'AGENT');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "deliveryLocation" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'CREATED',
    "createdById" TEXT NOT NULL,
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentTracking" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingId_key" ON "Shipment"("trackingId");

-- CreateIndex
CREATE INDEX "Shipment_createdById_idx" ON "Shipment"("createdById");

-- CreateIndex
CREATE INDEX "Shipment_agentId_idx" ON "Shipment"("agentId");

-- CreateIndex
CREATE INDEX "ShipmentTracking_shipmentId_idx" ON "ShipmentTracking"("shipmentId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentTracking" ADD CONSTRAINT "ShipmentTracking_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
