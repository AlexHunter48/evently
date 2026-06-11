import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/adminMiddleware.js";
import {
  getAdminUsers,
  getAdminEvents,
  getAdminTickets,
  getAdminOrders,
  getAdminAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAdminUsers);
router.get("/events", verifyToken, verifyAdmin, getAdminEvents);
router.get("/tickets", verifyToken, verifyAdmin, getAdminTickets);
router.get("/orders", verifyToken, verifyAdmin, getAdminOrders);
router.get("/analytics", verifyToken, verifyAdmin, getAdminAnalytics);
router.get("/me", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin verified successfully",
    data: req.user,
  });
});
export default router;
