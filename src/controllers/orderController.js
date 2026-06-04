import axios from 'axios';
import Order from '../models/orderModel.js';
import Event from '../models/eventModel.js';
import paystackService from '../config/paystackService.js';

export const initializePayment = async (req, res)=>{
    try {
        const { event, name, email, phoneNo, tickets, quantity } = req.body;

        if (!name || !email || !phoneNo || !event || !tickets || !quantity) {
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

        const selectedTicket = eventData.tickets.find(t => t.type === tickets);

        if (!selectedTicket){
            return res.status(400).json({
                success: false,
                message: "Selected ticket type not found for this event"
            })
        }

        const totalPrice = selectedTicket.price * quantity;

        //Sending request to Paystack
        const response = await paystackService.transaction.initialize({
            email,
            amount: totalPrice * 100
        },
    {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    
    const { authorization_url, reference } = response.data.data;

    const order = await Order.create({
        name,
        email,
        phoneNo,
        event,
        quantity,
        selectedTicket: tickets,
        price: selectedTicket.price,
        totalPrice,
        reference,
        paymentStatus: "pending"
    });

    res.status(200).json({
        success: true,
        message: "Payment initialized successfully",
        paymentLink: authorization_url,
        reference
    });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};