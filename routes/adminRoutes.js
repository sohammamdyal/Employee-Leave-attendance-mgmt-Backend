const express = require("express");
const {
  adminRegister,
  adminLogin,
  adminProfile,
   getAllEmployees,
    getAllLeaves,
    updateLeaveStatus,
    getAttendance,
    getAdminDashboard
} = require("../controllers/adminAuthController");
const authMiddleware = require("./../middlewares/authMiddleware");
const upload = require("./../middlewares/upload")
const router = express.Router();

router.post("/Adminregister", upload.single("image"), adminRegister);
router.post("/Adminlogin", adminLogin);
router.get("/Adminprofile", authMiddleware, adminProfile);
router.get("/employees", getAllEmployees);
router.get("/leaves", getAllLeaves);
router.put("/leave/:id", updateLeaveStatus);
router.get("/attendance", getAttendance);
router.get("/dashboard", getAdminDashboard);

module.exports = router;
