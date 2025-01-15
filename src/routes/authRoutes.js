import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import trimRequest from "../middlewares/trimMiddleware.js";
import {
  createUser,
  getUserByEmail,
  updateUserPassword,
} from "../models/userModal.js";
import { generateAndSendOtp, sendResetEmail } from "../utils/emailUtils.js";

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

    req.session.userId = user.id;

    res.status(200).json({
      message: "Votre compte a été créé et vérifié avec succès.",
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
    req.session.userId = user.id;

    res
      .status(200)
      .json({ message: "Utilisateur connecté avec succès", redirect: "/" });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.post("/forgot-password", trimRequest, async (req, res) => {
  const { email } = req.body;

  // Validate input fields
  if (!email) {
    return res.status(400).json({ error: "L'adresse email est requise." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Generate and send token
  try {
    await sendResetEmail(user.email, user.name, req);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email :", err);
    return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }

  res.status(200).json({
    message:
      "Email de réinitialisation de mot de passe envoyé. Veuillez vérifier votre email.",
  });
});

router.post("/reset-password", trimRequest, async (req, res) => {
  const { newPassword, token } = req.body;
  const { resetPasswordEmail, resetPasswordToken, resetPasswordExpires } =
    req.session;

  try {
    // Validate input fields
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token et nouveau mot de passe sont requis" });
    }

    // Check if the token is valid
    if (Date.now() > resetPasswordExpires) {
      return res
        .status(400)
        .json({ error: "Le lien de réinitialisation a expiré." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(resetPasswordEmail, hashedPassword);

    // Clear session data related to password reset
    delete req.session.resetPasswordEmail;
    delete req.session.resetPasswordToken;
    delete req.session.resetPasswordExpires;

    // Respond with success
    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
      redirect: "/",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    return res.status(500).json({ error: "Erreur interne du serveur." });
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
