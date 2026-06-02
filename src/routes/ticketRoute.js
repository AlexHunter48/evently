import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import {
  buyTicket,
  getMyTickets,
  getSingleTicket,
  cancelTicket,
} from '../controllers/ticketController.js';

const router = express.Router();

router.post('/buy', verifyToken, buyTicket);

router.get('/my-tickets', verifyToken, getMyTickets);

router.get('/:ticketId', verifyToken, getSingleTicket);

router.patch('/:ticketId/cancel', verifyToken, cancelTicket);

export default router;
