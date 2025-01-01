import axios from "axios";
import express from "express";
import Amadeus from "amadeus";
import {
  formatDate,
  formatTime,
  formatDuration,
} from "../utils/flightUtils.js";
import { checkRequiredFields } from "../utils/validationUtils.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { bookFlight, createFlight } from "../models/flightModal.js";

const router = express.Router();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

router.post("/search", async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      flightOptions,
      travelClass,
      adults,
    } = req.body;

    checkRequiredFields(
      [originLocationCode, destinationLocationCode, departureDate],
      res
    );

    const params = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      travelClass,
      adults,
    };

    if (flightOptions === "round-trip") {
      if (!returnDate) {
        return res.status(400).json({
          error: "Return date is required for round-trip search.",
        });
      }
      params.returnDate = returnDate;
    }

    const amadeusResponse = await amadeus.shopping.flightOffersSearch.get(
      params
    );

    const flights = amadeusResponse.data.map((flight) => {
      const departureSegment = flight.itineraries[0].segments[0];
      const arrivalSegment = flight.itineraries[0].segments.slice(-1)[0];

      const returnSegments = flight.itineraries[1]?.segments || [];
      const returnDepartureSegment = returnSegments[0] || null;
      const returnArrivalSegment = returnSegments.slice(-1)[0] || null;

      return {
        id: flight.id,
        price: { total: flight.price.total, currency: flight.price.currency },
        itineraries: {
          aller: {
            departureDate: formatDate(departureSegment.departure.at),
            departureTime: formatTime(departureSegment.departure.at),
            departureAirport: departureSegment.departure.iataCode,
            arrivalDate: formatDate(arrivalSegment.arrival.at),
            arrivalTime: formatTime(arrivalSegment.arrival.at),
            arrivalAirport: arrivalSegment.arrival.iataCode,
            duration: formatDuration(flight.itineraries[0].duration),
          },
          retour: returnDepartureSegment
            ? {
                departureDate: formatDate(returnDepartureSegment.departure.at),
                departureTime: formatTime(returnDepartureSegment.departure.at),
                departureAirport: returnDepartureSegment.departure.iataCode,
                arrivalDate: formatDate(returnArrivalSegment.arrival.at),
                arrivalTime: formatTime(returnArrivalSegment.arrival.at),
                arrivalAirport: returnArrivalSegment.arrival.iataCode,
                duration: formatDuration(flight.itineraries[1].duration),
              }
            : null,
        },
      };
    });

    res.status(200).json({ data: flights });
  } catch (error) {
    console.error(
      "Error fetching flights:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch flight offers." });
  }
});

router.post("/book", isAuthenticated, async (req, res) => {
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
  } = req.body;

  if (
    !checkRequiredFields(
      [
        price,
        departureAirport,
        departureDate,
        departureTime,
        arrivalAirport,
        arrivalDate,
        arrivalTime,
        duration,
      ],
      res
    )
  )
    return;

  try {
    const flight = await createFlight({
      price,
      departureAirport,
      departureDate,
      departureTime,
      arrivalAirport,
      arrivalDate,
      arrivalTime,
      duration,
      returnDepartureDate: returnDepartureDate || null,
      returnDepartureTime: returnDepartureTime || null,
      returnArrivalDate: returnArrivalDate || null,
      returnArrivalTime: returnArrivalTime || null,
      returnDuration: returnDuration || null,
    });

    await bookFlight(req.session.user.id, flight.id);

    res.status(201).json({
      message: "Vol réservé avec succès.",
      redirect: "/dashboard",
    });
  } catch (error) {
    console.error("Error booking flight:", error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la réservation du vol. Veuillez réessayer plus tard.",
    });
  }
});

router.post("/pay", isAuthenticated, async (req, res) => {
  const { flightId, paymentMethod } = req.body;

  if (!flightId || !paymentMethod) {
    return res
      .status(400)
      .json({ error: "Flight ID and payment method required" });
  }

  try {
    const response = await axios.post(
      `${process.env.PAYMENT_API_URL}/pay`,
      { flightId, paymentMethod },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error processing payment:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to process payment." });
  }
});

export default router;
