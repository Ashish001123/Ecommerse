import mongoose from "mongoose";

export const requireDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({ message: "Database unavailable. Please try again shortly." });
  }
  next();
};

