 const express = require("express");
 const dotenv = require("dotenv");
 const cors = require("cors");
 const connectDB = require("./config/db");

 dotenv.config();
 connectDB();

 const app = express();

 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 app.use("/uploads", express.static("uploads"));


 app.use("/api/employee", require("./routes/authRoutes"));
 app.use("/api/admin", require("./routes/adminRoutes"));
 app.use("/api/leave", require("./routes/leaveRoutes"));
 app.use("/api/attendance", require("./routes/attendanceRoutes"));
 app.use("/api/dashboard", require("./routes/dashboardRoute"));
//  app.use("/api/admin", require("./routes/adminHandleRoutes"));



 const PORT =5000;
 const HOST ="localhost";

 app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
 });