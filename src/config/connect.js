import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    const connection = await mongoose.connect(uri);
    console.log("MongoDB connected ✅", connection.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
