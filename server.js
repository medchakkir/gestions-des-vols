// packages
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// local files
import db from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import isLoggedIn from "./src/middlewares/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Test de connexion à PostgreSQL
db.connect()
  .then(() => console.log("Connecté à la base de données PostgreSQL."))
  .catch((err) =>
    console.error("Erreur de connexion à la base de données:", err)
  );

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

function checkSessionUserStatus(req) {
  let userIsLoggedIn = false;
  if (req.session.user) {
    userIsLoggedIn = true;
  }
  console.log(`User login status for ${req.path}: ${userIsLoggedIn}`);
  return userIsLoggedIn;
}

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    userIsLoggedIn: checkSessionUserStatus(req),
  });
});
app.get("/about", (req, res) => {
  res.render("about", { userIsLoggedIn: checkSessionUserStatus(req) });
});
app.get("/contact", (req, res) => {
  res.render("contact", { userIsLoggedIn: checkSessionUserStatus(req) });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Protected route example
app.get("/dashboard", isLoggedIn, (req, res) => {
  // console.log(req.session.user);
  res.render("dashboard", { user: req.session.user });
});

// Routes des utilisateurs
app.use("/users", userRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.render("404", { userIsLoggedIn: checkSessionUserStatus(req) });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Démarrage du serveur
app.listen(port, () => console.log(`Serveur en écoute sur le port ${port}.`));
