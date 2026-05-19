const express = require("express");

const authRoutes = require("../../modules/auth/auth.routes");
const userRoutes = require("../../modules/users/user.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Tawi-Tawi API v1 is running.",
    version: "v1",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;