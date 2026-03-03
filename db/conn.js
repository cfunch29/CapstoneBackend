import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionStr = process.env.MONGO_URI || "";

async function connectDB(){
    try {
        await mongoose.connect(connectionStr);
        // confirm database is connected in terminal
        console.log("MongoDB Connection...");
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;