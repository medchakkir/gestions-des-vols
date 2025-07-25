// packages
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectPgSimple from "connect-pg-simple";

// local files
import db from "./src/config/db.js";
import flightRoutes from "./src/routes/flightRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { isAuthenticated } from "./src/middlewares/authMiddleware.js";
import { getFlightByUserId } from "./src/models/flightModal.js";
import { getUserById } from "./src/models/userModal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const PgSession = connectPgSimple(session);

// Test de connexion à PostgreSQL
db.connect()
  .then(() => console.log("Connecté à la base de données Neon PostgreSQL."))
  .catch((err) =>
    console.error("Erreur de connexion à la base de données:", err)
  );

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? "https://gestiondevol.onrender.com/" 
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
} else {
  app.use(express.static(path.join(process.cwd(), "public")));
}

// Session middleware configuration
app.set("trust proxy", 1); // Trust the first proxy for secure cookies

app.use(
  session({
    store: new PgSession({
      conObject: {
        connectionString: process.env.DB_STRING,
      },
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false, // Don't create sessions for unauthenticated users
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use((req, res, next) => {
  console.log("Session before request:", req.session);
  next();
});

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

function checkSessionUserStatus(req) {
  const userIsLoggedIn = !!req.session.userId;
  return userIsLoggedIn;
}

// API Routes (keep existing API functionality)
// Routes d'authentification
app.use("/auth", authRoutes);

// Routes des utilisateurs
app.use("/users", userRoutes);

// Routes des vols
app.use("/flight", flightRoutes);

// Add API endpoint for current user
app.get("/auth/me", isAuthenticated, async (req, res) => {
  try {
    const user = await getUserById(req.session.userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get user data" });
  }
});

// Legacy EJS routes (for backward compatibility in development)
if (process.env.NODE_ENV !== 'production') {
  app.get("/legacy", (req, res) => {
    const userIsLoggedIn = checkSessionUserStatus(req);
    res.render("index", { userIsLoggedIn });
  });
  app.get("/legacy/about", (req, res) => {
    const userIsLoggedIn = checkSessionUserStatus(req);
    res.render("about", { userIsLoggedIn });
  });
  app.get("/legacy/contact", (req, res) => {
    const userIsLoggedIn = checkSessionUserStatus(req);
    res.render("contact", { userIsLoggedIn });
  });
  app.get("/legacy/login", (req, res) => {
    res.render("login");
  });
  app.get("/legacy/register", (req, res) => {
    res.render("register");
  });
  app.get("/legacy/verification", (req, res) => {
    res.render("verification");
  });
  app.get("/legacy/forgot-password", (req, res) => {
    res.render("forgetPassword");
  });
  app.get("/legacy/reset-password", (req, res) => {
    res.render("resetPassword");
  });
  app.get("/legacy/dashboard", isAuthenticated, async (req, res) => {
    const user = await getUserById(req.session.userId);
    const userFlights = await getFlightByUserId(user.id);
    res.render("dashboard", { user, userFlights });
  });
  app.get("/legacy/booking", isAuthenticated, (req, res) => {
    res.render("booking");
  });
  app.get("/legacy/pay", isAuthenticated, (req, res) => {
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
}

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Gestion des erreurs 404 pour le développement
  app.use((req, res) => {
    const userIsLoggedIn = checkSessionUserStatus(req);
    res.render("404", { userIsLoggedIn });
  });
}

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}.`);
});
