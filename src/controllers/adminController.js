import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Ticket from "../models/ticketModel.js";
import Order from "../models/orderModel.js";

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizerId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("eventId", "title location date")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("event", "title location date")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.find({ paymentStatus: "completed" });
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    res.status(200).json({
      success: true,
      message: "Admin analytics fetched successfully",
      data: {
        totalUsers,
        totalEvents,
        totalTickets,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
