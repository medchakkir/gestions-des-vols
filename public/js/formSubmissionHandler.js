"use strict";

// Helper to perform API calls
async function apiRequest(url, method, body) {
  try {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unknown error occurred");
    }

    return result;
  } catch (error) {
    console.error("API Error: ", error);
    Swal.fire("Erreur", error.message, "error");
    throw error;
  }
}

// Search form handler
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const searchParams = Object.fromEntries(formData);

  try {
    const { data: flights } = await apiRequest(
      "/flight/search",
      "POST",
      searchParams
    );
    renderResults(flights);
  } catch (error) {
    console.error("Flight search error:", error);
    Swal.fire("Erreur", "La recherche de vol a échoué", "error");
  }
});

// Render search results
function renderResults(flights) {
  const isRoundTrip = flights.some((flight) => flight.itineraries.retour);
  const resultsTable = document.querySelector(".results-table");

  // Update table header dynamically
  resultsTable.innerHTML = `
    ${renderTableHead(isRoundTrip)}
    <tbody>
      ${flights.map(renderFlightHTML).join("")}
    </tbody>
  `;

  // Attach booking form handlers
  flights.forEach((flight) => attachBookingHandler(flight.id));
}

// Render table header
function renderTableHead(isRoundTrip) {
  return `
    <thead>
      <tr>
        <th rowspan="2">Prix</th>
        <th colspan="3">Aller</th>
        ${isRoundTrip ? '<th colspan="3">Retour</th>' : ""}
        <th rowspan="2">Action</th>
      </tr>
      <tr>
        <th>Départ</th>
        <th>Arrivée</th>
        <th>Durée</th>
        ${isRoundTrip ? "<th>Départ</th><th>Arrivée</th><th>Durée</th>" : ""}
      </tr>
    </thead>
  `;
}

function renderFlightHTML(flight) {
  const aller = flight.itineraries.aller;
  const retour = flight.itineraries.retour;

  return `
    <tr class="result-item">
      <td>${flight.price.total}€</td>
      <td>
        <p><strong>${aller.departureTime}</strong> ${aller.departureAirport}</p>
        <p><strong>${aller.departureDate}</strong></p>
      </td>
      <td>
        <p><strong>${aller.arrivalTime}</strong> ${aller.arrivalAirport}</p>
        <p><strong>${aller.arrivalDate}</strong></p>
      </td>
      <td>${aller.duration}</td>

      ${
        retour
          ? `
        <td>
          <p><strong>${retour.departureTime}</strong> ${retour.departureAirport}</p>
          <p><strong>${retour.departureDate}</strong></p>
        </td>
        <td>
          <p><strong>${retour.arrivalTime}</strong> ${retour.arrivalAirport}</p>
          <p><strong>${retour.arrivalDate}</strong></p>
        </td>
        <td>${retour.duration}</td>
        `
          : ""
      }
      <td>
        <form id="form-flight-${flight.id}">
          ${generateHiddenInputs(flight)}
          <button type="submit" class="btn-book">Réserver</button>
        </form>
      </td>
    </tr>
  `;
}

function generateHiddenInputs(flight) {
  const aller = flight.itineraries.aller;
  const retour = flight.itineraries.retour;

  return `
    <input type="hidden" name="price" value="${flight.price.total}" />
    <input type="hidden" name="departureAirport" value="${
      aller.departureAirport
    }" />
    <input type="hidden" name="departureDate" value="${aller.departureDate}" />
    <input type="hidden" name="departureTime" value="${aller.departureTime}" />
    <input type="hidden" name="arrivalAirport" value="${
      aller.arrivalAirport
    }" />
    <input type="hidden" name="arrivalDate" value="${aller.arrivalDate}" />
    <input type="hidden" name="arrivalTime" value="${aller.arrivalTime}" />
    <input type="hidden" name="duration" value="${aller.duration}" />
    ${
      retour
        ? `
      <input type="hidden" name="returnDepartureDate" value="${retour.departureDate}" />
      <input type="hidden" name="returnDepartureTime" value="${retour.departureTime}" />
      <input type="hidden" name="returnArrivalDate" value="${retour.arrivalDate}" />
      <input type="hidden" name="returnArrivalTime" value="${retour.arrivalTime}" />
      <input type="hidden" name="returnDuration" value="${retour.duration}" />
      `
        : ""
    }
  `;
}

function attachBookingHandler(flightId) {
  document
    .getElementById(`form-flight-${flightId}`)
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const bookingData = Object.fromEntries(formData);

      try {
        // Convert bookingData to query parameters
        const params = new URLSearchParams(bookingData).toString();

        // Redirect the user to the payment page
        window.location.href = `/pay?${params}`;
      } catch (error) {
        console.error("Error loading payment page: ", error);
        Swal.fire(
          "Erreur",
          "Une erreur est survenue lors de la réservation",
          "error"
        );
      }
    });
}
