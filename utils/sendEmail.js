const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Create reusable transporter object using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Support"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", options.email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
