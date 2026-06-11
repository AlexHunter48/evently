import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(" DATABASE CONNECTION ERROR:");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
