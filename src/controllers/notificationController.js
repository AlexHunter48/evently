import nodemailer from "nodemailer";

// 1. The Core Email Engine Function
export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      jsonTransport: true, // Processes email locally to bypass network blocks
    });

    const mailOptions = {
      from: '"Evently Platform" <no-reply@evently.com>',
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(` [SIMULATION] Email processed successfully for ${to}!`);
    return info;
  } catch (error) {
    console.error(" Error processing email:", error);
    throw error;
  }
};

// 2. The Ticket Purchase Confirmation Function
export const sendTicketConfirmation = async (req, res) => {
  try {
    // Grab data sent from the request body
    const { email, name, eventTitle, price } = req.body;

    const subject = `🎟️ Ticket Confirmed: ${eventTitle}`;
    const messageText = `Hi ${name},\n\nThank you for your purchase! Your payment for ${eventTitle} was successful.\nAmount Paid: ₦${price}\n\nSee you at the event!\n- Evently Team`;

    // Send the email using our helper function above
    await sendEmail(email, subject, messageText);

    // Success Response
    res.status(200).json({
      success: true,
      message: `Purchase confirmation sent to ${name} successfully!`,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      success: false,
      message: "Failed to send purchase confirmation",
      error: error.message,
    });
  }
};

// 3. Function to handle Event Reminders
export const sendEventReminder = async (req, res) => {
  try {
    const { email, name, eventTitle, eventDate, eventTime } = req.body;

    const subject = `⏰ Reminder: ${eventTitle} is coming up!`;
    const messageText = `Hi ${name},\n\nThis is a quick reminder that "${eventTitle}" is happening soon!\n📅 Date: ${eventDate}\n🕒 Time: ${eventTime}\n\nDon't miss out!\n- Evently Team`;

    await sendEmail(email, subject, messageText);

    res
      .status(200)
      .json({
        success: true,
        message: `Reminder sent to ${name} successfully!`,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send reminder",
        error: error.message,
      });
  }
};

// 4. Function to handle Password Resets
export const sendPasswordReset = async (req, res) => {
  try {
    const { email, name, resetLink } = req.body;

    const subject = `🔒 Reset Your Evently Password`;
    const messageText = `Hi ${name},\n\nWe received a request to reset your password. Click the link below to set up a new one:\n🔗 ${resetLink}\n\nIf you didn't request this, you can safely ignore this email.\n- Evently Team`;

    await sendEmail(email, subject, messageText);

    res
      .status(200)
      .json({
        success: true,
        message: `Password reset link sent to ${name} successfully!`,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send reset email",
        error: error.message,
      });
  }
};


export const sendTicketConfirmationEmail = async (order, qrCodeUrl) => {
    try {
        const subject = `Your Evently Ticket is Ready!`
        const messageText = `Hi ${order.guestName},\n\nPayment confirmed!\n\nTicket Type: ${order.ticketType}\nQuantity: ${order.quantity}\nTotal Paid: ₦${order.totalPrice}\n\nYour QR Code: ${qrCodeUrl}\n\n- Evently Team`
        await sendEmail(order.guestEmail, subject, messageText)
    } catch (error) {
        console.error('Email failed:', error.message)
    }
}