const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },

    // Reference to the user who bought this ticket
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Reference to the event this ticket is for
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    // Ticket status
    status: {
      type: String,
      enum: ['active', 'used', 'cancelled'],
      default: 'active',
    },

    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },

    // QR code will be added by Zomzom (Module 5) after ticket is created
    qrCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
