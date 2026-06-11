import axios from 'axios';
import Order from '../models/orderModel.js';
import Event from '../models/eventModel.js';
import paystackService from '../config/paystackService.js';
import crypto from 'crypto';
import Ticket from '../models/ticketModel.js';

export const initializePayment = async (req, res) => {
    // Initialize a Paystack payment for a selected ticket tier and create an order record.
    // The order remains pending until the webhook confirms payment success.
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

        const totalPrice = selectedTicket.price * Number(quantity);

        // Create a Ticket document for this order. The ticket will be linked
        // to the order and later used for QR generation and check-in.
        const ticketDoc = await Ticket.create({
            userId: req.user ? req.user._id : null,
            eventId: event,
            ticketName: selectedTicket.ticketType,
            price: selectedTicket.price,
            totalNumber: selectedTicket.quantity || 0,
            soldCount: 0,
            ticketId: crypto.randomUUID(),
            status: 'active',
        });

        const ticketCode = crypto.randomUUID();

        
        const response = await paystackService.post('/transaction/initialize', {
            email: guestEmail,
            amount: totalPrice * 100,
        });
        
        const { authorization_url, reference } = response.data.data;

        const order = await Order.create({
            guestName,
            guestEmail,
            phoneNo,
            event,
            quantity: Number(quantity),
            ticketType: tickets,
            price: selectedTicket.price,
            totalPrice,
            reference,
            paymentStatus: "pending",
            ticketId: ticketDoc._id,
            ticketCode,
            user: req.user ? req.user._id : undefined,
        });

        // Link ticket -> order
        ticketDoc.order = order._id;
        await ticketDoc.save();

        // Store the selected ticket type in the order document so order data
        // remains consistent with the Order schema.

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
