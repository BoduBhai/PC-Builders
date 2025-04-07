import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(`Error connecting to MONGODB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};
