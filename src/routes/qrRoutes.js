import express from "express";
import { generateTicketQR, verifyTicketQR } from "../controllers/qrController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generateTicketQR);
router.patch("/verify", verifyToken, verifyTicketQR);

export default router;