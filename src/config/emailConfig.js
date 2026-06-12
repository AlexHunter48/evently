import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (userEmail, username) => {
  const mailOptions = {
    from: `"Evently Team" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Welcome to Evently! 🎟️",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">

    <h2 style="color: #6C63FF; text-align: center; margin-bottom: 20px;">
        Welcome to Evently, ${username}! 🎉
    </h2>

    <p style="font-size: 16px; color: #444;">
        Thank you for joining Evently. Your account has been successfully created, and you're now ready to discover and experience amazing events.
    </p>

    <p style="font-size: 16px; color: #444;">
        With Evently, you can:
    </p>

    <ul style="color: #444; line-height: 1.8;">
        <li>🎟 Discover upcoming events</li>
        <li>💳 Purchase tickets securely</li>
        <li>🔳 Receive QR code tickets for easy check-in</li>
        <li>📢 Stay updated with event notifications</li>
    </ul>

    <div style="text-align: center; margin: 35px 0;">
        <a
            href="https://evently-tailwind-css-and-react.vercel.app/"
            style="
                background-color: #6C63FF;
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                display: inline-block;
            "
        >
            Explore Events
        </a>
    </div>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

    <p style="font-size: 14px; color: #666;">
        Need help? Visit the <strong>Contact Us</strong> section on our website or simply reply to this email.
    </p>

    <p style="font-size: 14px; color: #666; margin-top: 25px;">
        Cheers,<br />
        <strong>The Evently Team</strong>
    </p>

</div>
`,
  };

  return transporter.sendMail(mailOptions);
};
