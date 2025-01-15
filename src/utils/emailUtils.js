import nodemailer from "nodemailer";
import ejs from "ejs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Function to generate and send OTP email
const generateAndSendOtp = async (name, email, req) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 15 minutes

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Path to email template
  const templatePath = path.join(
    process.cwd(),
    "/src/views/otpVerificationTemplate.ejs"
  );

  const mailTemplate = await ejs.renderFile(templatePath, { name, otpCode });

  const mailOptions = {
    from: `TravelFinder <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code for Account Verification",
    html: mailTemplate,
  };

  await transporter.sendMail(mailOptions);

  // Store new OTP and expiration time in session
  req.session.otpCode = otpCode;
  req.session.otpExpires = otpExpires;
};

const sendResetEmail = async (email, name, req) => {
  try {
    // Generate a unique reset token using UUID
    const resetToken = uuidv4();
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // Token expires in 1 hour

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Path to email template
    const templatePath = path.join(
      process.cwd(),
      "/src/views/resetPasswordTemplate.ejs"
    );

    // Generate the reset URL
    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Render the email template with user data
    const mailTemplate = await ejs.renderFile(templatePath, { name, resetURL });

    const mailOptions = {
      from: `TravelFinder <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Demande de réinitialisation de mot de passe",
      html: mailTemplate,
    };

    await transporter.sendMail(mailOptions);

    // Store the email, token and expiration time in the session
    req.session.resetPasswordEmail = email;
    req.session.resetPasswordToken = resetToken;
    req.session.resetPasswordExpires = resetTokenExpires;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de réinitialisation :",
      error
    );
    throw new Error("Impossible d'envoyer l'email de réinitialisation.");
  }
};

export { generateAndSendOtp, sendResetEmail };
