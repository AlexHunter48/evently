import axios from 'axios';
import Order from '../models/orderModel.js';
import Event from '../models/eventModel.js';
import paystackService from '../config/paystackService.js';
import crypto from 'crypto';

export const initializePayment = async (req, res) => {
    try {
        const { event, guestName, guestEmail, phoneNo, tickets, quantity } = req.body;

       
        if (!guestName || !guestEmail || !phoneNo || !event || !tickets || !quantity) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const eventData = await Event.findById(event);
        if (!eventData) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        
        const selectedTicket = eventData.tickets.find(t => t.ticketType === tickets);

        if (!selectedTicket) {
            return res.status(400).json({
                success: false,
                message: "Selected ticket type not found for this event"
            });
        }

        const ticketId = selectedTicket._id;
        const ticketCode = crypto.randomUUID();
        const totalPrice = selectedTicket.price * Number(quantity);

        
        const response = await paystackService.transaction.initialize({
            email: guestEmail,
            amount: totalPrice * 100
        });
        
        const { authorization_url, reference } = response.data.data;

        const order = await Order.create({
            guestName,
            guestEmail,
            phoneNo,
            event,
            quantity: Number(quantity),
            selectedTicket: tickets,
            price: selectedTicket.price,
            totalPrice,
            reference,
            paymentStatus: "pending",
            ticketId,
            ticketCode
        });

        return res.status(200).json({
            success: true,
            message: "Payment initialized successfully",
            paymentLink: authorization_url,
            reference,
            order
        });

    } catch (error) {
        console.error("Payment initialization error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
