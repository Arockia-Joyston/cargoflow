# CargoFlow API

**A Shipment Management and Tracking REST API built with Node.js, Express, Prisma, and PostgreSQL.**

## Overview

CargoFlow is a backend application designed to manage shipment operations through role-based access control. It enables customers to create and track shipments, managers to assign shipments to agents, and agents to update delivery statuses throughout the shipment lifecycle.

## Key Features

- **Authentication & Authorization** — Secure user authentication using JWT and password hashing with bcrypt.
- **Role-Based Access Control** — Separate permissions for Customers, Managers, and Agents.
- **Shipment Management** — Create, retrieve, assign, and manage shipments.
- **Shipment Tracking** — Unique tracking IDs and shipment status history.
- **Agent Assignment** — Assign shipments to eligible delivery agents.
- **Status Validation** — Enforce valid shipment status transitions.
- **Database Transactions** — Keep shipment status updates and tracking history consistent.

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt

## User Roles

| Role | Responsibilities |
|---|---|
| Customer | Register, log in, create shipments, view personal shipments, and track deliveries |
| Manager | View shipments and agents, and assign shipments to agents |
| Agent | View assigned shipments and update shipment statuses |

## Shipment Lifecycle

`CREATED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED`

Shipments may also be cancelled where the configured status transition rules permit it.

## API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a customer account |
| POST | `/auth/login` | Authenticate and receive a JWT |

### Customer

| Method | Endpoint | Description |
|---|---|---|
| POST | `/shipments` | Create a shipment |
| GET | `/shipments/my` | Retrieve the customer's shipments |
| GET | `/shipments/:trackingId` | Track a shipment and view its history |

### Manager

| Method | Endpoint | Description |
|---|---|---|
| GET | `/shipments` | Retrieve all shipments |
| GET | `/agents` | Retrieve delivery agents and their assigned shipment counts |
| PATCH | `/shipments/:id/assign` | Assign a shipment to an agent |

### Agent

| Method | Endpoint | Description |
|---|---|---|
| GET | `/shipments/assigned` | Retrieve shipments assigned to the authenticated agent |
| PATCH | `/shipments/:id/status` | Update a shipment's status |

Protected endpoints require a valid JWT in the request header:

`Authorization: Bearer <your_token>`

## Project Structure

```text
cargoflow-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.js
│   ├── constants/
│   │   └── shipment.constants.js
│   ├── controllers/
│   │   ├── agent.controller.js
│   │   ├── auth.controller.js
│   │   └── shipment.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── agent.routes.js
│   │   ├── auth.routes.js
│   │   ├── index.js
│   │   └── shipment.routes.js
│   └── utils/
│       └── prisma.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database
- A database connection string

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arockia-Joyston/cargoflow.git
   cd cargoflow-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_secure_jwt_secret"
   PORT=3000
   ```

4. Generate the Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Apply database migrations if migration files are available:

   ```bash
   npx prisma migrate deploy
   ```

6. Start the application using the appropriate script defined in `package.json`.

   ```bash
   npm start
   ```

The API should be available at `http://localhost:3000`, provided the configured port is `3000`.

## Security Considerations

- Passwords are hashed before storage.
- Protected routes require JWT authentication.
- Role-based middleware restricts access to authorized users.
- Environment variables are used for sensitive configuration.

**Production note:** Public registration should not allow users to assign themselves privileged roles such as Manager or Agent.

## Future Improvements

- Automated API testing
- Improved agent workload balancing
- Pagination and filtering for shipment listings
- API documentation with Swagger/OpenAPI
- Deployment with production-grade logging and monitoring

## Project Goal

CargoFlow demonstrates backend development concepts including REST API design, authentication, authorization, relational database modeling, shipment lifecycle management, and transaction-safe data updates.

---

**Built with Node.js, Express, Prisma, and PostgreSQL.**
