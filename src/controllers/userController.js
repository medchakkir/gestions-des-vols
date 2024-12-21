import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserVerificationStatus,
} from "../models/userModal.js";
import dotenv from "dotenv";
import { generateAndSendOtp } from "../utils/otpUtils.js";
dotenv.config();

const sendOtp = async (req, res) => {
  const { otp } = req.body;
  const { otpCode, otpExpires, user } = req.session;

  if (!otp) {
    return res.status(400).json({ error: "OTP is required." });
  }

  if (Date.now() > otpExpires) {
    await resendOtp(req, res);
    return res.status(400).json({
      error: "OTP has expired. A new OTP has been sent to your email.",
    });
  }

  if (Number(otp) !== otpCode) {
    // Convert OTP to number before comparing
    return res.status(400).json({ error: "Invalid OTP." });
  }

  // OTP is valid, clear it from session
  delete req.session.otpCode;
  delete req.session.otpExpires;
  try {
    const users = await getUserById(user.id);
    if (!users) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update user's verified status
    await updateUserVerificationStatus(user.id, true);

    res
      .status(200)
      .json({ message: "OTP verified successfully!", redirect: "/" });
  } catch (error) {
    console.error("Error finding user:", error.message || error);
    res.status(500).json({ error: error.message || error });
  }
};

// Function to resend OTP
const resendOtp = async (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(400).json({ error: "User session not found." });
  }

  await generateAndSendOtp(user.name, user.email, req);

  res.status(200).json({ message: "A new OTP has been sent to your email." });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      hashedPassword,
    });

    // Generate and send OTP
    try {
      await generateAndSendOtp(name, email, req);
    } catch (error) {
      console.error("Error sending OTP email:", error.message || error);
      return res
        .status(500)
        .json({ error: "Failed to send OTP. Please try again." });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };

    console.log("User registered:", user);
    res.status(201).json({
      message: "User registered successfully!",
      redirect: "/verification",
    });
  } catch (error) {
    console.error("Error registering user:", error.message || error);
    res.status(500).json({ error: error.message || error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Fetch user from database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Set user ID in session
    req.session.user = { id: user.id, name: user.name, email: user.email };
    res
      .status(200)
      .json({ message: "User logged in successfully!", redirect: "/" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export { registerUser, loginUser, sendOtp, resendOtp };
