const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require( "../models/User.js");
const Leave = require("./../models/Leave.js");
const Attendance = require("./../models/Attendance.js");

// ADMIN REGISTER
const adminRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        role: "admin",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ success: true, token, admin:{_id : admin._id, fullName: admin.fullName,email: admin.email,
        role: admin.role,
     image: admin.image} });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ADMIN PROFILE
const adminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllEmployees = async (req, res) => {
    try {
      const employees = await User.find({ role: "employee" })
        .select("fullName email role image createdAt")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        employees,
      });
    } catch (error) {
      console.error("Get Employees Error:", error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };

const getAllLeaves = async (req, res) => {
    try {
      const leaves = await Leave.find()
        .populate("employee", "fullName email role")
        .sort({ createdAt: -1 });
  
      res.json({ success: true, leaves });
    } catch (err) {
      console.log("Admin leaves error", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
const updateLeaveStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      await Leave.findByIdAndUpdate(req.params.id, { status });
  
      res.json({ success: true, message: "Leave status updated" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // ATTENDANCE  
  const getAttendance = async (req, res) => {
    try {
      const { employeeId, date } = req.query;
  
      let filter = {};
  
      if (employeeId) {
        filter.employee = employeeId;
      }
  
      if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
  
        filter.date = { $gte: start, $lte: end };
      }
  
      const attendance = await Attendance.find(filter)
        .populate("employee", "fullName email")
        .sort({ date: -1 });
  
      res.status(200).json({
        success: true,
        attendance,
      });
    } catch (err) {
      console.error("Attendance Filter Error:", err);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };

  const getAdminDashboard = async (req, res) => {
    try {
      // Employees
      const totalEmployees = await User.countDocuments({ role: "employee" });
  
      // Leaves
      const leaves = await Leave.find()
        .populate("employee", "fullName email")
        .sort({ createdAt: -1 });
  
      const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
  
    
      const today = new Date().toISOString().slice(0, 10);
  
      const attendance = await Attendance.find({
        date: {
          $gte: new Date(today),
          $lte: new Date(today + "T23:59:59")
        }
      }).populate("employee", "fullName");
  
      const present = attendance.filter(a => a.status === "Present").length;
      const absent = attendance.filter(a => a.status === "Absent").length;
  
      res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          present,
          absent,
          pendingLeaves,
          leaves,
          attendance
        }
      });
  
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

module.exports = { adminRegister, adminLogin, adminProfile, getAllEmployees,updateLeaveStatus,getAllLeaves ,
   getAttendance, getAdminDashboard  };
