const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Register Api
router.post("/register", authController.register);

// Login Api
router.post("/login", authController.login);

module.exports = router;
