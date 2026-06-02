import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import generateTicketId from '../utils/generateTicketId.js';

const buyTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const existingTicket = await Ticket.findOne({ userId, eventId, status: 'active' });
    if (existingTicket) {
      return res.status(400).json({
        message: 'You already have a ticket for this event',
        ticket: existingTicket,
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'Sold Out') {
      return res.status(400).json({ message: 'Sorry, this event is sold out' });
    }

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      userId,
      eventId,
      ticketName: event.title,
      totalNumber: event.capacity,
      price: event.tickets[0]?.price || 0,
      status: 'active',
      amountPaid: event.tickets[0]?.price || 0,
      purchasedAt: new Date(),
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('eventId', 'title date time location capacity status tickets')
      .populate('userId', 'username email');

    res.status(201).json({
      message: 'Ticket purchased successfully',
      ticket: populatedTicket,
    });
  } catch (error) {
    console.error('buyTicket error:', error.message);
    res.status(500).json({ message: 'Server error while buying ticket' });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .populate('eventId', 'title date time location capacity status')
      .sort({ purchasedAt: -1 });

    if (tickets.length === 0) {
      return res.status(200).json({ message: 'You have no tickets yet', tickets: [] });
    }

    res.status(200).json({
      message: 'Tickets fetched successfully',
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('getMyTickets error:', error.message);
    res.status(500).json({ message: 'Server error while fetching tickets' });
  }
};

const getSingleTicket = async (req, res) => {
  try {
    const rawTicket = await Ticket.findOne({ ticketId: req.params.ticketId });

    if (!rawTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (rawTicket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('eventId', 'title date time location capacity status')
      .populate('userId', 'username email');

    res.status(200).json({ ticket });
  } catch (error) {
    console.error('getSingleTicket error:', error.message);
    res.status(500).json({ message: 'Server error while fetching ticket' });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this ticket' });
    }

    if (ticket.status !== 'active') {
      return res.status(400).json({
        message: `Cannot cancel a ticket that is already ${ticket.status}`,
      });
    }

    ticket.status = 'cancelled';
    await ticket.save();

    res.status(200).json({
      message: 'Ticket cancelled successfully',
      ticket,
    });
  } catch (error) {
    console.error('cancelTicket error:', error.message);
    res.status(500).json({ message: 'Server error while cancelling ticket' });
  }
};

export { buyTicket, getMyTickets, getSingleTicket, cancelTicket };
