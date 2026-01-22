const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
        console.log(mongoose.connection.readyState);

    }catch(err){
        console.log(err);
        console.log(mongoose.connection.readyState);
    }
}



module.exports = connectDB;