// flightUtils.js
function formatDate(timestamp) {
  return new Date(timestamp).toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatTime(timestamp) {
  return new Date(timestamp)
    .toTimeString()
    .split(" ")[0]
    .split(":")
    .slice(0, 2)
    .join(":"); // HH:MM
}

function formatDuration(duration) {
  return duration.replace("PT", "").replace("H", "h ").replace("M", "m"); // Format duration
}

export { formatDate, formatTime, formatDuration };
