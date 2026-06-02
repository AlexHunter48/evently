import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  buyTicket,
  getMyTickets,
  getSingleTicket,
  cancelTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/buy", protect, buyTicket);
router.get("/my-tickets", protect, getMyTickets);
router.get("/:ticketId", protect, getSingleTicket);
router.patch("/:ticketId/cancel", protect, cancelTicket);

export default router;