import express from "express";
import {
  getAdminUsers,
  getAdminEvents,
  getAdminTickets,
  getAdminOrders,
  getAdminAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAdminUsers);
router.get("/events", getAdminEvents);
router.get("/tickets", getAdminTickets);
router.get("/orders", getAdminOrders);
router.get("/analytics", getAdminAnalytics);

export default router;