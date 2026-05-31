import axios from 'axios';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Event from '../models/eventModel.js';

export const initializePayment = async (req, res)=>{
    try {
        const { event, name, email, phoneNo, quantity } = req.body;

        if (!name || !email || !phoneNo || !event || !quantity) {
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

        const totalPrice = eventData.ticketPrice * quantity;

       

        //Sending request to Paystack
        const response = await axios.post('https://api.paystack.co/transaction/initialize',{
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
        price:eventData.ticketPrice,
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