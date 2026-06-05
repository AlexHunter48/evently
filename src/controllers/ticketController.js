import Order from "../models/orderModel.js";
import Event from "../models/eventModel.js";



const buyTicket = async (req, res) => {
  try {
    const { eventId, guestName, guestEmail, ticketType, quantity } = req.body;
    
    if (!eventId || !guestName || !guestEmail || !ticketType || !quantity) {
      return res.status(400).json({ message: 'eventId, guestName, guestEmail, ticketType and quantity are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status === 'Sold Out') return res.status(400).json({ message: 'Sorry, this event is sold out' });

 
    const selectedTier = event.tickets.find(t => t.ticketType === ticketType);
    if (!selectedTier) {
      return res.status(400).json({ message: `Ticket tier '${ticketType}' not found for this event` });
    }

    
    if (selectedTier.sold >= selectedTier.quantity) {
      return res.status(400).json({ message: `The ${ticketType} tier is completely sold out!` });
    }

    const totalPrice = selectedTier.price * Number(quantity);

  
    const order = await Order.create({
      event: eventId,
      guestName,
      guestEmail,
      quantity: Number(quantity),
      selectedTicket: ticketType,
      price: selectedTier.price,
      totalPrice,
      paymentStatus: "pending"
    });

   
    selectedTier.sold += Number(quantity);
    await event.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('event', 'title date time location capacity status');

    return res.status(201).json({ 
      success: true,
      message: 'Ticket checkout initiated successfully', 
      order: populatedOrder 
    });

  } catch (error) {
    console.error('buyTicket error:', error.message);
    return res.status(500).json({ message: 'Server error while buying ticket' });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    
    const orders = await Order.find({ guestEmail: email })
      .populate('event', 'title date time location capacity status')
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      count: orders.length, 
      orders 
    });
  } catch (error) {
    console.error('getMyTickets error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching tickets' });
  }
};

const getSingleTicket = async (req, res) => {
  try {
   
    const order = await Order.findOne({ ticketCode: req.params.ticketCode })
      .populate('event', 'title date time location capacity status');
      
    if (!order) return res.status(404).json({ message: 'Ticket not found' });
    
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('getSingleTicket error:', error.message);
    return res.status(500).json({ message: 'Server error while fetching ticket' });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const order = await Order.findOne({ ticketCode: req.params.ticketCode });
    if (!order) return res.status(404).json({ message: 'Ticket not found' });

    
    order.paymentStatus = "cancelled";
    await order.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Ticket cancelled successfully', 
      order 
    });
  } catch (error) {
    console.error('cancelTicket error:', error.message);
    return res.status(500).json({ message: 'Server error while cancelling ticket' });
  }
};

export { buyTicket, getMyTickets, getSingleTicket, cancelTicket };

export { buyTicket, getMyTickets, getSingleTicket, cancelTicket };
