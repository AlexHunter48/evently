import express from 'express';
import { initializePayment } from '../controllers/orderController.js';

const router= express.Router();

router.post('/initialize', initializePayment);

export default router;