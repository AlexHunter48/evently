// creates URl endpoint that paystack will send the webhook to. Paystack Calls it

import express from 'express'
import {handleWebhook} from '../controllers/webhookController.js'
import {verifyWebhook} from ',,/middleware/paystackMiddleware.js'

const router = express.Router()

router.post('/paystack', verifyWebhook, handleWebhook)

export default router