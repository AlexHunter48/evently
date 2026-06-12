import { sendTicketConfirmationEmail } from '../controllers/notificationController.js'
import Order from '../models/orderModel.js'
import Event from '../models/eventModel.js'
import { verifyTransaction } from '../services/paystackServices.js'
import { generateQRForTicket } from '../controllers/qrController.js'

const handleWebhook = async (req, res) => {
    const { event, data } = req.body

    if (event === 'charge.success') {
        const reference = data.reference
        try {
            const transaction = await verifyTransaction(reference)

            if (transaction.data.status === 'success') {
                const order = await Order.findOne({ reference })

                if (order) {
                    if (order.paymentStatus === 'completed') {
                        return res.status(200).json({ message: 'Webhook already processed' })
                    }

                    order.paymentStatus = 'completed'
                    order.paidAt = new Date()
                    await order.save()

                    if (order.ticketId) {
    const qrCodeUrl = await generateQRForTicket(order.ticketId)
    await sendTicketConfirmationEmail(order, qrCodeUrl)
}

                    // Update ticket availability
                    const eventData = await Event.findById(order.event)
                    if (eventData) {
                        const selectedTicket = eventData.tickets.find(
                            ticket => ticket.ticketType === order.ticketType
                        )
                        if (selectedTicket && selectedTicket.available >= order.quantity) {
                            selectedTicket.available -= order.quantity
                            selectedTicket.sold += order.quantity
                            await eventData.save()
                        }
                    }
                    

                } else {
                    console.warn(`Webhook Warn: Order with reference ${reference} not found`)
                }
            }
        } catch (error) {
            console.error('Error occurred while handling webhook:', error.message)
            return res.status(200).json({ message: 'Webhook received with error handling' })
        }
    }

    return res.status(200).json({ message: 'Webhook received' })
}

export { handleWebhook }