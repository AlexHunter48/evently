import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },

  ticketName: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    default: 0
  },

  totalNumber: {
    type: Number,
    required: true
  },

  soldCount: {
    type: Number,
    required: true,
    default: 0
  },

  ticketId: {
    type: String,
    unique: true,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "cancelled", "used"],
    default: "active"
  },

  amountPaid: {
    type: Number,
    default: 0
  },

  purchasedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
