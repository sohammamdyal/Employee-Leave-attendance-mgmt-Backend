const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    image:{
      type:String,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "employee",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
