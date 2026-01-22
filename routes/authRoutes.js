const express = require("express");
const {
  employeeRegister,
  employeeLogin,
  employeeProfile,
} = require("./../controllers/authController");
const authMiddleware = require("./../middlewares/authMiddleware");
const upload= require("./../middlewares/upload");

const router = express.Router();

router.post("/register", upload.single("image"), employeeRegister);
router.post("/login", employeeLogin);
router.get("/profile", authMiddleware, employeeProfile);

module.exports = router;
