import express from "express"

import cors from "cors"

import authRoute from "./src/routes/authRoute.js"

import UserRouthe from "./src/routes/userRoute.js"

import connectDB from "./src/config/db.js"

import orderRoute from "./src/routes/orderRoute.js"

import eventRoute from "./src/routes/eventRoute.js"

import dotenv from "dotenv"

dotenv.config()


const PORT=process.env.PORT || 3000

const app = express();

connectDB();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoute);

app.use("/api/user", UserRouthe)

app.use("/api/order", orderRoute);

app.use("/api/event", eventRoute);


app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`)
});