window.addEventListener("DOMContentLoaded", () => {
  // Variables

  const departureDateInput = document.getElementById("departureDateInput");
  const returnDateInput = document.getElementById("returnDateInput");
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  // Ensure the departure date cannot be earlier than today
  departureDateInput.setAttribute("min", todayISO);

  // Departure Date Input Event Listener
  departureDateInput.addEventListener("change", (e) => {
    // If the return date is set
    if (returnDateInput.value !== "") {
      const departureDate = new Date(departureDateInput.value);
      const returnDateValue = new Date(returnDateInput.value);

      // Clear return date if it is earlier than departure date
      if (returnDateValue < departureDate) {
        returnDateInput.value = "";
      }
    }

    // Set the minimum valid return date to one day after the departure date
    const departureDate = new Date(departureDateInput.value);
    const minReturnDate = new Date(departureDate);
    minReturnDate.setDate(departureDate.getDate() + 1);
    returnDateInput.setAttribute(
      "min",
      minReturnDate.toISOString().split("T")[0]
    );
  });

  // ------------------------------------------------------------------------------------------------------ //

  // variables
  const searchBar = document.getElementById("searchBar");
  const oneWayFlight = document.getElementById("oneWay");
  const roundTripFlight = document.getElementById("roundTrip");
  const returnDateContainer = document.getElementById("returnDateContainer");

  // Function to update flight details based on trip type
  function updateFlightDetails(isRoundTrip) {
    searchBar.style.width = "fit-content";
    returnDateContainer.style.display = isRoundTrip ? "flex" : "none";
    returnDateInput.required = isRoundTrip;
    if (!isRoundTrip) {
      returnDateInput.value = "";
    }
  }

  // One Way Flight Event Handler
  oneWayFlight.addEventListener("click", () => {
    updateFlightDetails(false);
  });

  // Round Trip Flight Event Handler
  roundTripFlight.addEventListener("click", () => {
    updateFlightDetails(true);
  });
});