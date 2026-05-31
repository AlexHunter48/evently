//listen for paysteack to call our backend, then validates, then finds the refrence in the database that has already been initialized, then updates the status to success and sends a response back to paystack

import Order from '../models/orderModel.js'
import { verifyTransaction } from '../services/paystackServices.js'

const handleWebhook = async (req, res) => {
    const { event, data } = req.body

    if (event === 'charge.success'){
        const reference = data.reference
        try {
            const transaction = await verifyTransaction(reference)
            if (transaction.data.status === 'success') {
                const order = await Order.findOne({ reference })
                if (order) {
                    order.paymentStatus = 'completed';
                    order.paidAt = new Date();
                     await order.save();     
                    
                }
                res.status(200).json({ message: 'Webhook handled successfully' })
             
            }
        } catch (error) {
            console.error('Error occurred while handling webhook:', error)
        }
    }

    res.status(200).json({ message: 'Webhook received' })
}

export {handleWebhook}
