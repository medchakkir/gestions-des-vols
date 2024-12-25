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
import { registerFlight } from "../controllers/flightController.js";

const router = express.Router();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

router.post("/search-flights", async (req, res) => {
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

router.post("/book-flight", isAuthenticated, registerFlight);

router.get("/locations/:query", async (req, res) => {
  try {
    const { query } = req.params;

    if (!checkRequiredFields([query], res)) return;

    const amadeusResponse = await amadeus.referenceData.locations.get({
      subType: "AIRPORT",
      keyword: query,
      view: "LIGHT",
    });

    const locations = amadeusResponse.data.map((location) => ({
      iataCode: location.iataCode,
      cityName: location.address.cityName,
      countryName: location.address.countryName,
    }));

    res.status(200).json({ data: locations });
  } catch (error) {
    console.error(
      "Error fetching locations:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to fetch locations from Amadeus API." });
  }
});

export default router;
