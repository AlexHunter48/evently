import express from 'express';
import { buyTicket, getMyTickets, getSingleTicket } from '../controllers/ticketController.js';
const router = express.Router();

router.post('/buy', buyTicket);
router.get('/my-tickets', getMyTickets);
router.get('/:ticketCode', getSingleTicket);
//router.patch('/:ticketCode/cancel', cancelTicket);

export default router;