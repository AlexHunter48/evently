import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const orderSchema = new mongoose.Schema({
    event: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Event",
       required: true
    },
   
    guestName: {
        type: String,
        required: true,
        trim: true
    },
    guestEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    reference: {
        type: String,
        default: () => `REF-${uuidv4().split('-')[0].toUpperCase()}`,
        unique: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    ticketCode: {
        type: String,
        unique: true
    },
   
    ticketType: {
        type: String,
        enum: ['Standard', 'Premium', 'VVIP'],
        required: true
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;