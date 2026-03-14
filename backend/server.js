import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Production-ready CORS configuration
app.use(cors({
  origin: [
    'http://localhost:8081', 
    'http://localhost:5173', 
    'https://mars-consulting.pages.dev',
    'https://mars-consulting-navigator.vercel.app' // Your live frontend
  ] 
}));

app.use(express.json());

app.post('/api/send', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // 2. Internal Notification (Sent to you)
    // Uses your verified root domain marsconsulting.in
    await resend.emails.send({
      from: 'Mars Website <info@marsconsulting.in>', 
      to: 'info@marsconsulting.in',
      subject: `New Lead: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
        </div>`
    });

    // 3. Customer Auto-Response (Sent to the lead)
    await resend.emails.send({
      from: 'Mars Consulting <info@marsconsulting.in>', 
      to: email,
      reply_to: 'info@marsconsulting.in', // Directs replies to your main inbox
      subject: 'We have received your inquiry - Mars Consulting',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h3>Hi ${name},</h3>
          <p>Thank you for reaching out to <strong>Mars Consulting</strong>.</p>
          <p>We have received your message regarding your inquiry and our team will get back to you within 24-48 business hours.</p>
          <br />
          <p>Best Regards,</p>
          <p><strong>Mars Consulting Team</strong></p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">This is an automated response to confirm we've received your data.</p>
        </div>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend Error:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));