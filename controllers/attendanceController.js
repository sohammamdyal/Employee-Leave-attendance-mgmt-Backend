const Attendance = require("./../models/Attendance")

const markAttendance = async(req,res) => {
    try{
        const {employeeId,status,date} = req.body;

        if(!employeeId || !status || !date) {
            return res.status(400).json({
                success :true,
                message:"All fields are required",
            });
        }

        const today = new Date().toISOString().slice(0, 10);
        if(date > today){
            return res.status(400).json({
                success :true,
                message: "Attendance cannot be marked for future dates",
            });
        }

        const attendance = new Attendance({
            employee:employeeId,
            date,
            status,
        });

        await attendance.save();
        res.status(201).json({
            success :true,
            message : "Attendance Mark Successfully",
        });
    }catch(error){
        if(error.code === 11000){
            return res.status(400).json({
                success : true,
                message: "Attendance already marked for today",
            });
        }

        res.status(500).json({
            success :true,
            message : "Server Error",
        })
    }
};

const getAttendanceByEmployee = async (req, res) => {
    try {
      const records = await Attendance.find({
        employee: req.params.id,
      }).populate("employee", "fullName role email")
      .sort({ date: -1 });
  
      res.status(200).json({
        success: true,
        records,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };

  module.exports = {markAttendance, getAttendanceByEmployee}