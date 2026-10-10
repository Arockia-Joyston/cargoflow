const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

// Register Api
const register = async (req, res) => {
  // Data from Frontend
  const data = req.body;

  // DB Logic
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      return res.status(409).json({ message: "User Already exist" });
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role,
        },
      });

      const { password, ...userData } = user;

      res
        .status(201)
        .json({ message: "User data Created Successfully", data: userData });
    }
  } catch (error) {
    console.log("internal server error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Login Api
const login = async (req, res) => {
  try {
    // Data from Front-end
    const data = req.body;

    // DB Logic
    const isUserExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        isUserExist.password,
      );

      if (isPasswordMatch) {
        var token = jwt.sign(
          { userId: isUserExist.id, role: isUserExist.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        res.status(200).json({ message: "Login Successful", token: token });
      } else {
        res.status(401).json({ message: "Incorrect Password" });
      }
    } else {
      res.status(401).json({ message: "Register to continue" });
    }
  } catch (error) {
    console.log("Internal Server Error", error);
    res
      .status(500)
      .json({ Message: "Internal server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
