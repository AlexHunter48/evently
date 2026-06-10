import express from "express";
import { generateTicketQR, verifyTicketQR, checkinTicketQR } from "../controllers/qrController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generateTicketQR);
router.post("/verify", verifyToken, verifyTicketQR);
router.post("/checkin", verifyToken, checkinTicketQR);

export default router;