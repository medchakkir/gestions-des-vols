import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import trimRequest from "../middlewares/trimMiddleware.js";
import { createUser, getUserByEmail } from "../models/userModal.js";
import { generateAndSendOtp } from "../utils/otpUtils.js";

const router = express.Router();
dotenv.config();

router.post("/register", trimRequest, async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    return res.status.json({ error: "Tous les champs sont requis" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }

  const hash = await bcrypt.hash(password, 10);

  // Generate and send OTP
  try {
    await generateAndSendOtp(name, email, req);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'OTP :", err);
    return res.status(500).json({ error: "Erreur lors de l'envoi de l'OTP" });
  }

  // Store user data in session for later creation
  req.session.tempUser = { name, email, hash };

  res.status(200).json({
    message: "OTP envoyé avec succès. Veuillez vérifier votre email.",
    redirect: "/verification",
  });
});

router.post("/verify_otp", trimRequest, async (req, res) => {
  const { otp } = req.body;
  const { otpCode, otpExpires, tempUser } = req.session || {};

  // Validate input
  if (!otp || !/^\d{6}$/.test(otp)) {
    return res
      .status(400)
      .json({ error: "OTP invalide. Il doit contenir 6 chiffres." });
  }

  // Validate session data
  if (!otpCode || !otpExpires || !tempUser) {
    return res
      .status(400)
      .json({ error: "Session invalide ou expirée. Veuillez réessayer." });
  }

  // Check if OTP is expired
  if (Date.now() > otpExpires) {
    try {
      // Resend OTP in the background
      await generateAndSendOtp(tempUser.name, tempUser.email, req);
      res.status(400).json({
        error: "OTP expiré. Un nouveau OTP a été envoyé à votre email.",
      });
    } catch (err) {
      console.error("Erreur lors de la réémission de l'OTP :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'envoi d'un nouveau OTP." });
    }
  }

  // Validate OTP match
  if (Number(otp) !== otpCode) {
    return res.status(400).json({ error: "OTP invalide." });
  }

  // OTP is valid, create the user
  try {
    const user = await createUser(tempUser);

    // Clear session data
    delete req.session.tempUser;
    delete req.session.otpCode;
    delete req.session.otpExpires;

    req.session.user = { id: user.id, name: user.name, email: user.email };

    res.status(200).json({
      message: "OTP vérifié avec succès. Utilisateur créé.",
      redirect: "/",
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res
      .status(500)
      .json({ error: "Erreur interne lors de la création de l'utilisateur." });
  }
});

router.post("/login", trimRequest, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }

  try {
    // Fetch user from database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Set user ID in session
    req.session.user = { id: user.id, name: user.name, email: user.email };
    res
      .status(200)
      .json({ message: "Utilisateur connecté avec succès", redirect: "/" });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err.message || err);
      return res.status(500).json({ error: "Échec lors de la déconnexion." });
    }
    // Clear session cookie properly
    res.clearCookie("connect.sid", { httpOnly: true, secure: true });
    res.status(200).json({ message: "Déconnecté avec succès", redirect: "/" });
  });
});

export default router;
