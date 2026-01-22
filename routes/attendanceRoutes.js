const express = require("express");
const {
  markAttendance,
  getAttendanceByEmployee,
} = require("./../controllers/attendanceController");

const router = express.Router();

router.post("/mark", markAttendance);
router.get("/employee/:id", getAttendanceByEmployee);

module.exports = router;
