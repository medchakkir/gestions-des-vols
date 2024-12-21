"use strict";

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const entries = Object.fromEntries(formData);
  console.log("Form data: ", entries);

  try {
    const response = await fetch("/api/search-flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entries),
    });

    const result = await response.json();
    console.log("API Response:", result.data);

    if (response.ok) {
      updateResults(result.data); // Display results
    } else {
      Swal.fire("Erreur", result.error, "error");
    }
  } catch (error) {
    console.error("Error: ", error);
    Swal.fire(
      "Erreur",
      "Échec de la récupération des vols. Veuillez réessayer plus tard.",
      "error"
    );
  }
});

function updateResults(flights) {
  const resultsTable = document.querySelector(".results-table tbody");
  resultsTable.innerHTML = flights.map(renderFlightHTML).join("");

  flights.forEach((flight) => {
    document
      .getElementById("form-flight-" + flight.id)
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const entries = Object.fromEntries(formData);
        console.log("Form data: ", entries);

        try {
          const response = await fetch("/api/book-flight", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(entries),
          });

          const result = await response.json();
          console.log("API Response:", result.data);

          if (response.ok) {
            Swal.fire("Succès", result.data, "success");
          } else {
            Swal.fire("Erreur", result.error, "error");
          }
        } catch (error) {
          console.error("Error: ", error);
          Swal.fire(
            "Erreur",
            "Échec de la réservation du vol. Veuillez réessayer plus tard.",
            "error"
          );
        }
      });
  });
}

function renderFlightHTML(flight) {
  return `
        <tr class="result-item">
          <td>${flight.id}</td>
          <td>${flight.price.total}€</td>
          <td>
            <p><strong>${flight.itineraries.aller.departureTime}</strong> ${flight.itineraries.aller.departureAirport}</p>
          </td>
          <td>
            <p><strong>${flight.itineraries.aller.arrivalTime}</strong> ${flight.itineraries.aller.arrivalAirport}</p>
          </td>
          <td>${flight.itineraries.aller.duration}</td>
          <td>
            <p><strong>${flight.itineraries.retour.departureTime}</strong> ${flight.itineraries.retour.departureAirport}</p>
          </td>
          <td>
            <p><strong>${flight.itineraries.retour.arrivalTime}</strong> ${flight.itineraries.retour.arrivalAirport}</p>
          </td>
          <td>${flight.itineraries.retour.duration}</td>
          <td>
            <form id="form-flight-${flight.id}">
              <!-- Hidden Inputs -->
              <input type="hidden" name="flight_id" value="${flight.id}" />
              <input type="hidden" name="price" value="${flight.price.total}" />
              <input type="hidden" name="departureDate" value="${flight.itineraries.aller.departureDate}" />
              <input type="hidden" name="departureTime" value="${flight.itineraries.aller.departureTime}" />
              <input type="hidden" name="arrivalTime" value="${flight.itineraries.aller.arrivalTime}" />
              <input type="hidden" name="departureAirport" value="${flight.itineraries.aller.departureAirport}" />
              <input type="hidden" name="arrivalAirport" value="${flight.itineraries.aller.arrivalAirport}" />
              <input type="hidden" name="duration" value="${flight.itineraries.aller.duration}" />
              <input type="hidden" name="returnDepartureDate" value="${flight.itineraries.retour.departureDate}" />
              <input type="hidden" name="returnDepartureTime" value="${flight.itineraries.retour.departureTime}" />
              <input type="hidden" name="returnArrivalTime" value="${flight.itineraries.retour.arrivalTime}" />
              <input type="hidden" name="returnDuration" value="${flight.itineraries.retour.duration}" />
              
              <button type="submit" class="btn-book">Réserver</button>
              </form>
          </td>
        </tr>
    </div>
  `;
}
