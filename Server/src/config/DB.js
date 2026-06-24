import mongoose from "mongoose";
import dns from "dns";
import logger from "../utils/logger.js";

const connectDB = async () => {
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error(error, "MongoDB connection failed");
        process.exit(1);
    }
}

export default connectDB;