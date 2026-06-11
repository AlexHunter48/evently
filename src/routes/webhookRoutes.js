// creates URl endpoint that paystack will send the webhook to. Paystack Calls it

import express from 'express'
import { handleWebhook } from '../controllers/webhookController.js'
import verifyWebhook from '../middleware/paystackWebhookMiddleware.js'

const router = express.Router()

router.post('/paystack', express.raw({ type: 'application/json' }), verifyWebhook, handleWebhook)

export default router