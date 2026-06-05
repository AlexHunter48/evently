import QRCode from "qrcode";
import Ticket from "../models/ticketModel.js";
import Order from "../models/orderModel.js";

export const generateTicketQR = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: "Ticket ID is required" });
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to access this ticket" });
    }

    const verificationPayload = JSON.stringify({
      id: ticket.ticketId,
      code: ticket._id
    });

    const qrImageString = await QRCode.toDataURL(verificationPayload);

    return res.status(200).json({
      success: true,
      message: "QR Code generated successfully",
      qrCodeUrl: qrImageString,
      ticketDetails: {
        name: ticket.ticketName,
        status: ticket.status
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyTicketQR = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: "Ticket ID reference is required" });
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket record not found." });
    }

    if (ticket.status === "cancelled") {
      return res.status(400).json({ success: false, message: "This ticket has been cancelled." });
    }

    if (ticket.status === "used") {
      return res.status(400).json({ success: false, message: "This ticket has already been used!" });
    }

    ticket.status = "used";
    await ticket.save();

    const orderDetails = await Order.findOne({ ticketId: ticket._id });

    return res.status(200).json({
      success: true,
      message: "Ticket Verified successfully!",
      attendee: orderDetails ? orderDetails.guestName : "Guest Attendee",
      ticketType: ticket.ticketName
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};