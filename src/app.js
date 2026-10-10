const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

// Global Middlewares
app.use(express.json());
app.use(cors());

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "CargoFlow API is running" });
});

// API Routes
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});

module.exports = app;
