import Order from "../models/orderModel.js";
import { verifyTransaction } from "../services/paystackServices.js";
import { generateQRForTicket } from "../controllers/qrController.js";

const handleWebhook = async (req, res) => {
  const { event, data } = req.body;

  if (event === "charge.success") {
    const reference = data.reference;

    try {
      const transaction = await verifyTransaction(reference);

      if (transaction.data.status === "success") {
        // Paystack sends the payment reference back on success,
        // so look up the order by the stored payment reference.
        const order = await Order.findOne({ reference });

        if (order) {
          if (order.paymentStatus === "completed") {
            return res
              .status(200)
              .json({
                message: "Webhook already processed (duplicate skipped)",
              });
          }

          order.paymentStatus = "completed";
          order.paidAt = new Date();
          await order.save();

          await generateQRForTicket(order.ticketId);
        } else {
          console.warn(
            `Webhook Warn: Order with ticketCode ${reference} not found in database.`,
          );
        }
      }
    } catch (error) {
      console.error("Error occurred while handling webhook:", error.message);

      return res
        .status(200)
        .json({ message: "Webhook received with error handling" });
    }
  }

  return res.status(200).json({ message: "Webhook received" });
};

export { handleWebhook };
