import express from 'express';
// Step 1: Add the two new functions to your import statement
import { 
    sendEmail, 
    sendTicketConfirmation, 
    sendEventReminder, 
    sendPasswordReset 
} from '../controllers/notificationController.js';

const router = express.Router();

// Route 1: Your original working test route
router.post('/test', async (req, res) => {
    try {
        await sendEmail(
            'testuser@example.com', 
            'Hello from Evently!', 
            'Your notification module is officially working!'
        );
        res.status(200).json({ success: true, message: "Test email sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
    }
});

// Route 2: Ticket Purchase Confirmation
router.post('/ticket-confirmation', sendTicketConfirmation);

// Route 3: Event Reminders
router.post('/event-reminder', sendEventReminder);

// Route 4: Password Resets
router.post('/password-reset', sendPasswordReset);

export default router;