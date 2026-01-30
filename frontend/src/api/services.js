/**
 * Frontend API helpers aligned with backend routes.
 * Base URL and auth via axios instance (api) in axios.js.
 */
import api from "./axios";

// ----- Ticket (ticketRoute) -----
export async function bookTicket(body) {
  const { data } = await api.post("/ticket/book", body);
  return data;
}

export async function getTicketHistory() {
  const { data } = await api.get("/ticket/history");
  return data;
}

// ----- Fare (fareRoute) -----
export async function calculateFare(body) {
  const { data } = await api.post("/calculate/fare", body);
  return data;
}

// ----- Admin scan (qrScanRoute) -----
export async function scanTicket(body) {
  const { data } = await api.post("/admin/scan", body);
  return data;
}
