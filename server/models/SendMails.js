const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // your Gmail
        pass: process.env.EMAIL_PASS,     // app password (not your Gmail password!)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent to', to);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");


module.exports = sendEmail;
