import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Function to send OTP email
const sendOtpEmail = async (name, email, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailTemplate = `
    Hello ${name},
    Please use the one-time password (OTP) below to verify your account:

    Your OTP is: ${otpCode}
    This code is valid for the next 10 minutes. 
    
    If you did not request this, please ignore this email.

    Thanks,
    Your VoyageFinder team
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: mailTemplate,
  };

  await transporter.sendMail(mailOptions);
};

// Function to generate and send OTP
const generateAndSendOtp = async (name, email, req) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  await sendOtpEmail(name, email, otpCode);

  // Store new OTP and expiration time in session
  req.session.otpCode = otpCode;
  req.session.otpExpires = otpExpires;
};

export { sendOtpEmail, generateAndSendOtp };
