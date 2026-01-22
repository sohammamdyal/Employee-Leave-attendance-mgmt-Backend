const express = require("express");
const router = express.Router();
const { getEmployeeDashboard } = require("./../controllers/dashboardController");

router.get("/employee/:id", getEmployeeDashboard);

module.exports = router;
