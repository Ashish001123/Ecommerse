import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Fail DB operations immediately when not connected, instead of buffering.
    mongoose.set("bufferCommands", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Keep the API process alive so health checks and error responses still work.
  }
};

export default connectDB;
