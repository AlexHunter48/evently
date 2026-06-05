const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  buyTicket,
  getMyTickets,
  getSingleTicket,
  cancelTicket,
} = require('../controllers/ticketController');


// POST /api/tickets/buy          → buy a ticket
router.post('/buy', protect, buyTicket);

// GET  /api/tickets/my-tickets   → get all my tickets
router.get('/my-tickets', protect, getMyTickets);

// GET  /api/tickets/:ticketId    → get one ticket by ticketId (only if it belongs to the user)
router.get('/:ticketId', protect, getSingleTicket);

// PATCH /api/tickets/:ticketId/cancel  → cancel a ticket
router.patch('/:ticketId/cancel', protect, cancelTicket);

module.exports = router;
