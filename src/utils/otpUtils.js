import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

// Function to generate and send OTP email
const generateAndSendOtp = async (name, email, req) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Path to email template
  const templatePath = path.join(__dirname, "../views/template.ejs");

  const mailTemplate = await ejs.renderFile(templatePath, { name, otpCode });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code for Account Verification",
    html: mailTemplate,
  };

  await transporter.sendMail(mailOptions);

  // Store new OTP and expiration time in session
  req.session.otpCode = otpCode;
  req.session.otpExpires = otpExpires;
};

export { generateAndSendOtp };
