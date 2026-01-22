 const express = require("express");
 const dotenv = require("dotenv");
 const cors = require("cors");
 const connectDB = require("./config/db");
const path = require("path");
const fileURLToPath = require("url").fileURLToPath;

 dotenv.config();
 connectDB();

 const app = express();

 
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
 
 // MUST be BEFORE routes
 
 
 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 app.use("/uploads", express.static(path.join(__dirname, "uploads")));

 app.get("/", (req, res) => {
   res.send("API is running");
 });

 app.use("/api/employee", require("./routes/authRoutes"));
 app.use("/api/admin", require("./routes/adminRoutes"));
 app.use("/api/leave", require("./routes/leaveRoutes"));
 app.use("/api/attendance", require("./routes/attendanceRoutes"));
 app.use("/api/dashboard", require("./routes/dashboardRoute"));
//  app.use("/api/admin", require("./routes/adminHandleRoutes"));



 const PORT =5000;


 app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
 });