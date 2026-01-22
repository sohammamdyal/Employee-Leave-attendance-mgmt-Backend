const Leave = require("./../models/Leave");
const Attendance = require("./../models/Attendance");

const TOTAL_LEAVES = 20;

const getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.params.id;

  
    const approvedLeaves = await Leave.find({
      employee: employeeId,
      status: "Approved",
    });

    const usedLeaves = approvedLeaves.reduce(
      (sum, leave) => sum + leave.totalDays,
      0
    );

    const remainingLeaves = TOTAL_LEAVES - usedLeaves;

    
    const leaveHistory = await Leave.find({ employee: employeeId }).sort({
      createdAt: -1,
    });

    const attendanceRecords = await Attendance.find({
      employee: employeeId,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalLeaves: TOTAL_LEAVES,
        usedLeaves,
        remainingLeaves: TOTAL_LEAVES - usedLeaves,
        leaveHistory,
        attendanceRecords,
      }, 
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {getEmployeeDashboard};