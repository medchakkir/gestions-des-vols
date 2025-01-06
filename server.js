// packages
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// local files
import db from "./src/config/db.js";
import flightRoutes from "./src/routes/flightRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { isAuthenticated } from "./src/middlewares/authMiddleware.js";
import { getFlightByUserId } from "./src/models/flightModal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

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
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevent access via JavaScript
      maxAge: 24 * 60 * 60 * 1000, // Session expiration set to 24 hours
    },
  })
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

function checkSessionUserStatus(req) {
  const userIsLoggedIn = !!req.session.user;
  return { userIsLoggedIn, user: req.session.user };
}

// Routes
app.get("/", (req, res) => {
  const { userIsLoggedIn, user } = checkSessionUserStatus(req);
  res.render("index", { user, userIsLoggedIn });
});
app.get("/about", (req, res) => {
  const { userIsLoggedIn, user } = checkSessionUserStatus(req);
  res.render("about", { userIsLoggedIn, user });
});
app.get("/contact", (req, res) => {
  const { userIsLoggedIn, user } = checkSessionUserStatus(req);
  res.render("contact", { userIsLoggedIn, user });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/verification", (req, res) => {
  res.render("verification");
});

// Protected routes
app.get("/dashboard", isAuthenticated, async (req, res) => {
  const user = req.session.user;
  const userFlights = await getFlightByUserId(user.id);
  res.render("dashboard", { user, userFlights });
});

app.get("/booking", isAuthenticated, (req, res) => {
  res.render("booking");
});

app.get("/pay", isAuthenticated, (req, res) => {
  console.log(req.query);

  const {
    price,
    departureAirport,
    departureDate,
    departureTime,
    arrivalAirport,
    arrivalDate,
    arrivalTime,
    duration,
    returnDepartureDate,
    returnDepartureTime,
    returnArrivalDate,
    returnArrivalTime,
    returnDuration,
  } = req.query;

  const isRoundTrip =
    returnDepartureDate &&
    returnDepartureTime &&
    returnArrivalDate &&
    returnArrivalTime &&
    returnDuration;

  // Validate common parameters
  if (
    !price ||
    !departureAirport ||
    !departureDate ||
    !departureTime ||
    !arrivalAirport ||
    !arrivalDate ||
    !arrivalTime ||
    !duration
  ) {
    return res
      .status(400)
      .json({ message: "Missing required parameters for a one-way flight" });
  }

  // For round-trip flights, ensure return parameters are also present
  if (
    isRoundTrip &&
    (!returnDepartureDate ||
      !returnDepartureTime ||
      !returnArrivalDate ||
      !returnArrivalTime ||
      !returnDuration)
  ) {
    return res
      .status(400)
      .json({ message: "Missing required parameters for a round-trip flight" });
  }

  // Prepare the response
  const flightData = {
    price,
    departureAirport,
    departureDate,
    departureTime,
    arrivalAirport,
    arrivalDate,
    arrivalTime,
    duration,
  };

  if (isRoundTrip) {
    flightData.returnDetails = {
      returnDepartureDate,
      returnDepartureTime,
      returnArrivalDate,
      returnArrivalTime,
      returnDuration,
    };
  }

  const paypalClientId = process.env.PAYPAL_CLIENT_ID;

  res.render("payment", { flight: flightData, isRoundTrip, paypalClientId });
});

// Routes d'authentification
app.use("/auth", authRoutes);

// Routes des utilisateurs
app.use("/users", userRoutes);

// Routes des vols
app.use("/flight", flightRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  const { userIsLoggedIn, user } = checkSessionUserStatus(req);
  res.render("404", { userIsLoggedIn, user });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}.`);
});
