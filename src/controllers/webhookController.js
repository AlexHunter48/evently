//listen for paysteack to call our backend, then validates, then finds the refrence in the database that has already been initialized, then updates the status to success and sends a response back to paystack

import Order from '../models/orderModel.js'
import { verifyTransaction } from '../services/paystackServices.js'
import Event from '../models/eventModel.js'

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
                     
                     const eventData = await Event.findById(order.event)
                     if (eventData.availableTickets >= order.quantity) {
                        eventData.availableTickets -= order.quantity
                        await eventData.save()
                     }
                    
                }
             
            }
        } catch (error) {
            console.error('Error occurred while handling webhook:', error)
            res.status(200).json({ message: 'Webhook received' })
    
        }
    }
// ✅ Add return to final response too
return res.status(200).json({ message: 'Webhook received' })
    
}

export {handleWebhook}
