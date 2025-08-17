import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use host, port, secure for custom SMTP
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })
    // Email options
  const mailOptions = {
    from: `"Support" <${process.env.SMTP_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

   // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
};
