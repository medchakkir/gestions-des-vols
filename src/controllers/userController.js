import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../models/userModal.js";
import { name } from "ejs";

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
    res.status(201).json({
      message: "User registered successfully!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
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

export { registerUser, loginUser };
