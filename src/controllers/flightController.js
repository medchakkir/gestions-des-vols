import { createFlight } from "../models/flightModal.js";
import { checkRequiredFields } from "../utils/validationUtils.js";

const registerFlight = async (req, res) => {
  const {
    flight_id,
    price,
    departureDate,
    departureTime,
    arrivalTime,
    departureAirport,
    arrivalAirport,
    duration,
    returnDepartureDate,
    returnDepartureTime,
    returnArrivalTime,
    returnDuration,
  } = req.body;

  if (
    !checkRequiredFields(
      [
        flight_id,
        price,
        departureDate,
        departureTime,
        arrivalTime,
        departureAirport,
        arrivalAirport,
        duration,
        returnDepartureDate,
        returnDepartureTime,
        returnArrivalTime,
        returnDuration,
      ],
      res
    )
  )
    return;
  try {
    // Save booking to the database
    const flight = await createFlight({
      flight_id,
      user_id: req.session.user.id,
      price,
      departureDate,
      departureTime,
      arrivalTime,
      departureAirport,
      arrivalAirport,
      duration,
      returnDepartureDate,
      returnDepartureTime,
      returnArrivalTime,
      returnDuration,
    });

    console.log("Flight booked:", flight);
    res.status(201).json({ message: "Flight booked successfully." });
  } catch (error) {
    console.error("Error booking flight:", error.message || error);
    res.status(500).json({ error: error.message || error });
  }
};

export { registerFlight };
