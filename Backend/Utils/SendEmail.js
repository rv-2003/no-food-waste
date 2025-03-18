const nodemailer = require("nodemailer");
require("dotenv").config();
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: `"Food Donation App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Food Donation App",
      html: `
        <p>Hello,</p>
        <p>Thank you for registering! Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}" style="color: blue; text-decoration: none;">Verify Email</a></p>
        <p>If you did not sign up, please ignore this email.</p>
      `,
    };
  
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  };
  module.exports = { sendVerificationEmail };

