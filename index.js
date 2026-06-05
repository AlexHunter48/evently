import express from "express"

import cors from "cors"

import authRoute from "./src/routes/authRoute.js"

import UserRouthe from "./src/routes/userRoute.js"

import connectDB from "./src/config/db.js"

import dotenv from "dotenv"

dotenv.config()


const PORT=process.env.PORT || 3000

const app = express();

connectDB()

app.use(express.json())

app.use(cors())

app.use("/api/auth", authRoute)

app.use("/api/user", UserRouthe)




app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`)
})