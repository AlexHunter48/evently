const Ticket = require('../models/ticketModels');
const Event = require('../models/eventModels');
const generateTicketId = require('../utils/generateTicketId');

// ─────────────────────────────────────────────────────────────
// @desc    Buy a ticket for an event
// @route   POST /api/tickets/buy
// @access  Private (logged-in users only)
// ─────────────────────────────────────────────────────────────
const buyTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // 1. Check eventId was provided
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // 2. Check if user already has an active ticket for this event
    const existingTicket = await Ticket.findOne({
      userId,
      eventId,
      status: 'active',
    });

    if (existingTicket) {
      return res.status(400).json({
        message: 'You already have a ticket for this event',
        ticket: existingTicket,
      });
    }

    // 3. Atomically find event AND decrement seat at the same time
    //    This prevents overselling when multiple users buy simultaneously
   const event = await Event.findOneAndUpdate(
  { 
    _id: eventId, 
    $expr: { $lt: ["$ticketsSold", "$capacity"] }  // ticketsSold < capacity
  },
  { $inc: { ticketsSold: 1 } },  // increase tickets sold by 1
  { new: true }
);

    // 4. If no event returned, it means sold out or event doesn't exist
    if (!event) {
      // Check if event exists at all
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(400).json({ message: 'Sorry, this event is sold out' });
    }

    // 5. Create the ticket
    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      userId,
      eventId,
      status: 'active',
      amountPaid: event.ticketPrice,
      purchasedAt: new Date(),
    });

    if (event.ticketsSold >= event.capacity) {
  await Event.findByIdAndUpdate(eventId, { status: 'Sold Out' });
}
    // 6. Populate event and user details for the response
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('eventId', 'title date time location ticketPrice capacity ticketsSold status')
      .populate('userId', 'name email');

    res.status(201).json({
      message: 'Ticket purchased successfully',
      ticket: populatedTicket,
      seatsRemaining: event.capacity - event.ticketsSold,
    });
  } catch (error) {
    console.error('buyTicket error:', error.message);
    res.status(500).json({ message: 'Server error while buying ticket' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all tickets for the logged-in user
// @route   GET /api/tickets/my-tickets
// @access  Private
// ─────────────────────────────────────────────────────────────
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('eventId', 'title date time location ticketPrice capacity ticketsSold status')
      .sort({ purchasedAt: -1 }); // newest first

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

// ─────────────────────────────────────────────────────────────
// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:ticketId
// @access  Private (only the ticket owner)
// ─────────────────────────────────────────────────────────────
const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('eventId', 'title date time location ticketPrice capacity ticketsSold status')
      .populate('userId', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Make sure the ticket belongs to the user requesting it
    if (ticket.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error('getSingleTicket error:', error.message);
    res.status(500).json({ message: 'Server error while fetching ticket' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Cancel a ticket
// @route   PATCH /api/tickets/:ticketId/cancel
// @access  Private (only the ticket owner)
// ─────────────────────────────────────────────────────────────
const cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check ownership
    if (ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this ticket' });
    }

    // Check if already used or cancelled
    if (ticket.status !== 'active') {
      return res.status(400).json({
        message: `Cannot cancel a ticket that is already ${ticket.status}`,
      });
    }

    // Cancel the ticket and restore the seat
    ticket.status = 'cancelled';
    await ticket.save();

    // Give the seat back to the event
    await Event.findByIdAndUpdate(ticket.eventId, {
      $inc: { ticketsSold: -1 },
    });

    res.status(200).json({
      message: 'Ticket cancelled successfully',
      ticket,
    });
  } catch (error) {
    console.error('cancelTicket error:', error.message);
    res.status(500).json({ message: 'Server error while cancelling ticket' });
  }
};

module.exports = {
  buyTicket,
  getMyTickets,
  getSingleTicket,
  cancelTicket,
};
