const User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// EMPLOYEE REGISTER
const employeeRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const empExists = await User.findOne({ email });
    if (empExists) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role:"employee",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        id: employee._id,
        role: "employee",
       
      },
    });
  } catch (err) {
    console.log("Error",err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// EMPLOYEE LOGIN
const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ success: true, token, user:{_id : employee._id, fullName: employee.fullName,email: employee.email,
        role: employee.role,
     image: employee.image} });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// EMPLOYEE PROFILE
const employeeProfile = async (req, res) => {
  try {
    const employee = await User.findById(req.user.id).select("-password");

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  employeeRegister,
  employeeLogin,
  employeeProfile,
};
