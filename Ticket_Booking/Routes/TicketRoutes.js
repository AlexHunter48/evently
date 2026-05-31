const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  buyTicket,
  getMyTickets,
  getSingleTicket,
  cancelTicket,
} = require('../controllers/ticketController');

// All routes below require the user to be logged in (protect middleware)

// POST /api/tickets/buy          → buy a ticket
router.post('/buy', protect, buyTicket);

// GET  /api/tickets/my-tickets   → get all my tickets
router.get('/my-tickets', protect, getMyTickets);

// GET  /api/tickets/:ticketId    → get one ticket by ticketId e.g. TKT-2026-A3F9KZ
router.get('/:ticketId', protect, getSingleTicket);

// PATCH /api/tickets/:ticketId/cancel  → cancel a ticket
router.patch('/:ticketId/cancel', protect, cancelTicket);

module.exports = router;
