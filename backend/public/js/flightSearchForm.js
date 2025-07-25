window.addEventListener("DOMContentLoaded", () => {
  const departureDateInput = document.getElementById("departureDateInput");
  const returnDateInput = document.getElementById("returnDateInput");
  const todayISO = new Date().toISOString().split("T")[0];

  departureDateInput.setAttribute("min", todayISO);

  departureDateInput.addEventListener("change", () => {
    if (returnDateInput.value) {
      const departureDate = new Date(departureDateInput.value);
      const returnDateValue = new Date(returnDateInput.value);

      if (returnDateValue < departureDate) {
        returnDateInput.value = "";
      }
    }

    const minReturnDate = new Date(departureDateInput.value);
    minReturnDate.setDate(minReturnDate.getDate() + 1);
    returnDateInput.setAttribute(
      "min",
      minReturnDate.toISOString().split("T")[0]
    );
  });

  // -------------------------------------------------------------------------------------------- //

  // variables
  const searchBar = document.getElementById("searchBar");
  const oneWayFlight = document.getElementById("oneWay");
  const roundTripFlight = document.getElementById("roundTrip");
  const returnDateContainer = document.getElementById("returnDateContainer");

  function updateFlightDetails(isRoundTrip) {
    searchBar.style.width = "fit-content";
    returnDateContainer.style.display = isRoundTrip ? "flex" : "none";
    returnDateInput.required = isRoundTrip;
    if (!isRoundTrip) {
      returnDateInput.value = "";
    }
  }

  oneWayFlight.addEventListener("click", () => updateFlightDetails(false));
  roundTripFlight.addEventListener("click", () => updateFlightDetails(true));
});
