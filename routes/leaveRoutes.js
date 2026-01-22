const express = require('express');
const {applyLeave, getEmployeeLeaves, updateLeave, deleteLeave} = require("./../controllers/leaveController")

const router = express.Router();

router.post("/apply", applyLeave);
router.get("/employee/:id", getEmployeeLeaves);
router.put("/update/:id", updateLeave);
router.delete("/delete/:id", deleteLeave);

module.exports = router;