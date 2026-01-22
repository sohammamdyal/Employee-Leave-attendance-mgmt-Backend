const Leave = require("../models/Leave");

const applyLeave = async (req, res) => {
  try {
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    } = req.body;

    
    if (!employeeId || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    if (totalDays <= 0) {
      return res.status(400).json({
        message: "Total days must be greater than 0",
      });
    }

    const leave = await Leave.create({
      employee:employeeId,   
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getEmployeeLeaves = async (req, res) => {
    try {
      const { id } = req.params;
  
      const leaves = await Leave.find({ employee: id })
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        leaves,
      });
    } catch (error) {
      console.error("Fetch Leaves Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

 const updateLeave = async (req, res) => {
    try {
      const { id } = req.params;
      const { leaveType, startDate, endDate, totalDays, reason } = req.body;
  
      const leave = await Leave.findById(id);
  
      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }
  
      if (leave.status !== "Pending") {
        return res
          .status(400)
          .json({ message: "Only pending leave can be edited" });
      }
  
      leave.leaveType = leaveType;
      leave.startDate = startDate;
      leave.endDate = endDate;
      leave.totalDays = totalDays;
      leave.reason = reason;
  
      await leave.save();
  
      res.status(200).json({
        success: true,
        message: "Leave updated successfully",
        leave,
      });
    } catch (error) {
      console.error("Update Leave Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

 const deleteLeave = async (req, res) => {
    try {
      const { id } = req.params;
  
      const leave = await Leave.findById(id);
  
      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }
  
      if (leave.status !== "Pending") {
        return res
          .status(400)
          .json({ message: "Only pending leave can be deleted" });
      }
  
      await Leave.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: "Leave deleted successfully",
      });
    } catch (error) {
      console.error("Delete Leave Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  


module.exports = { applyLeave, getEmployeeLeaves, updateLeave, deleteLeave };
