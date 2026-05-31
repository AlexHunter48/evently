const Ticket = require('../models/ticketModels');
const Event = require('../models/eventModels');
const generateTicketId = require('../utils/generateTicketId');


const buyTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;


    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }


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


   const event = await Event.findOneAndUpdate(
  { 
    _id: eventId, 
    $expr: { $lt: ["$ticketsSold", "$capacity"] }
  },
  { $inc: { ticketsSold: 1 } },
  { new: true }
);


    if (!event) {
      
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(400).json({ message: 'Sorry, this event is sold out' });
    }

    
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


const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('eventId', 'title date time location ticketPrice capacity ticketsSold status')
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
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('eventId', 'title date time location ticketPrice capacity ticketsSold status')

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check ownership using userId directly
    if (ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

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


    if (ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this ticket' });
    }

    
    if (ticket.status !== 'active') {
      return res.status(400).json({
        message: `Cannot cancel a ticket that is already ${ticket.status}`,
      });
    }

    
    ticket.status = 'cancelled';
    await ticket.save();

    
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
