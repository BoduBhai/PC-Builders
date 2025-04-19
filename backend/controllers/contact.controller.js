import nodemailer from "nodemailer";

/**
 * Send contact form message to admin's email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and message",
            });
        }

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: `"PC Builders Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: subject || `Contact Form Message from ${name}`,
            html: `
        <h3>New Contact Message from PC Builders Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
            text: `New Contact Message\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);

        return res.status(200).json({
            success: true,
            message:
                "Your message has been sent successfully. We will get back to you soon!",
        });
    } catch (error) {
        console.error("Error sending contact email:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later.",
            error: error.message,
        });
    }
};

export { sendContactMessage };
