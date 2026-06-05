const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

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

    qrCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
