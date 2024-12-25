import { bookFlight, createFlight } from "../models/flightModal.js";
import { checkRequiredFields } from "../utils/validationUtils.js";

const registerFlight = async (req, res) => {
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
      returnDepartureDate,
      returnDepartureTime,
      returnArrivalDate,
      returnArrivalTime,
      returnDuration,
    });

    await bookFlight(req.session.user.id, flight.id);

    res
      .status(201)
      .json({ message: "Flight booked successfully.", redirect: "/dashboard" });
  } catch (error) {
    console.error("Error booking flight:", error.message || error);
    res.status(500).json({
      error:
        "An error occurred while booking the flight. Please try again later.",
    });
  }
};

export { registerFlight };
