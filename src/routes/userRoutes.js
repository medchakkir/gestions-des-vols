import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import trimRequest from "../middlewares/trimMiddleware.js";

const router = express.Router();
dotenv.config();

router.post("/contact", trimRequest, async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Received Data:", { name, email, message });

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Nodemailer Transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Us Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Message envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'envoi du message" });
  }
});

export default router;
