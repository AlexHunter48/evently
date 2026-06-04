import Order from "../models/orderModel.js";
import Event from "../models/eventModel.js";
import generateTicketId from '../utils/generateTicketId.js';
import mongoose from 'mongoose';

const buyTicket = async (req, res) => {
  try {
    const { eventId, guestName, guestEmail, quantity } = req.body;
    if (!eventId || !guestName || !guestEmail || !quantity) {
      return res.status(400).json({ message: 'eventId, guestName, guestEmail and quantity are required' });
    }
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status === 'Sold Out') return res.status(400).json({ message: 'Sorry, this event is sold out' });
    const pricePerTicket = event.tickets[0]?.price || 0;
    const totalPrice = pricePerTicket * quantity;
    const ticketCode = generateTicketId();
    const order = await Order.create({
      eventId,
      ticketId: new mongoose.Types.ObjectId(),
      guestName,
      guestEmail,
      quantity,
      totalPrice,
      ticketCode,
    });
    const populatedOrder = await Order.findById(order._id)
      .populate('eventId', 'title date time location capacity status tickets');
    res.status(201).json({ message: 'Ticket purchased successfully', order: populatedOrder });
  } catch (error) {
    console.error('buyTicket error:', error.message);
    res.status(500).json({ message: 'Server error while buying ticket' });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const orders = await Order.find({ guestEmail: email })
      .populate('eventId', 'title date time location capacity status')
      .sort({ createdAt: -1 });
    if (orders.length === 0) return res.status(200).json({ message: 'No tickets found for this email', orders: [] });
    res.status(200).json({ message: 'Tickets fetched successfully', count: orders.length, orders });
  } catch (error) {
    console.error('getMyTickets error:', error.message);
    res.status(500).json({ message: 'Server error while fetching tickets' });
  }
};

const getSingleTicket = async (req, res) => {
  try {
    const order = await Order.findOne({ ticketCode: req.params.ticketCode })
      .populate('eventId', 'title date time location capacity status');
    if (!order) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json({ order });
  } catch (error) {
    console.error('getSingleTicket error:', error.message);
    res.status(500).json({ message: 'Server error while fetching ticket' });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const order = await Order.findOne({ ticketCode: req.params.ticketCode });
    if (!order) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json({ message: 'Ticket cancelled successfully', order });
  } catch (error) {
    console.error('cancelTicket error:', error.message);
    res.status(500).json({ message: 'Server error while cancelling ticket' });
  }
};

export { buyTicket, getMyTickets, getSingleTicket, cancelTicket };