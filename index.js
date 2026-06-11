import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoute from "./src/routes/authRoute.js";
import UserRouthe from "./src/routes/userRoute.js";
import eventRoute from "./src/routes/eventRoute.js";
import ticketRoute from "./src/routes/ticketRoute.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import orderRoute from "./src/routes/orderRoute.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";
import votingRoutes from "./src/routes/votingRoutes.js";
import adminRoute from "./src/routes/adminRoute.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/webhook", webhookRoutes);
app.use("/api/auth", authRoute);
app.use("/api/user", UserRouthe);
app.use("/api/events", eventRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/order", orderRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/admin", adminRoute);

app.get("/test", (req, res) => res.json({ message: "working" }));

app.listen(PORT, () => {
  console.log(` Server running cleanly on port ${PORT}`);
});
