import mongoose  from "mongoose"; 

import dotenv from "dotenv";

dotenv.config()

 async function connectDB() {

 try {

  await mongoose.connect(process.env.MONGO_DB_URL)
 
  console.log("Connected to database")

 }
 
 catch (err) {

 console.log("Error Connecting to database:",err)

 }


};



export default connectDB;