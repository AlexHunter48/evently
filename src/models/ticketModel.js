import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

<<<<<<< HEAD
    ticketName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    totalNumber: {
      type: Number,
      required: true,
    },

    soldCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

const Ticket = mongoose.model("Ticket", ticketSchema);

=======
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

>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16
export default Ticket;
