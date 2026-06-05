
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This logs your URI to the terminal so we can make sure Node is actually reading it
    console.log("Attempting to connect with URI:", process.env.MONGO_URI); 
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host} 🎉`);
  } catch (error) {
    console.error("❌ DATABASE CONNECTION ERROR:");
    console.error(error.message); // This will print the exact reason for the failure!
    process.exit(1); 
  }
};

export default connectDB;
