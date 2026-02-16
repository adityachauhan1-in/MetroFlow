/** All backend Url are here
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

export async function getStations() {
  const { data } = await api.get("/calculate/stations");
  return data;
}

// ----- Admin scan (qrScanRoute) -----
export async function scanTicket(body) {
  const { data } = await api.post("/admin/scan", body);
  return data;
}

// ----- Feedback -----
export async function submitFeedback(body) {
  const { data } = await api.post("/user/feedback", body);
  return data;
}

export async function getFeedback() {
  const { data } = await api.get("/admin/feedback");
  return data;
}

export async function reviewFeedback(id, body) {
  const { data } = await api.patch(`/admin/feedback/${id}/review`, body);
  return data;
}

// ----- Admin: Stations -----
export async function getAdminStations() {
  const { data } = await api.get("/admin/stations");
  return data;
}

export async function createStation(body) {
  const { data } = await api.post("/admin/stations", body);
  return data;
}

export async function updateStation(id, body) {
  const { data } = await api.put(`/admin/stations/${id}`, body);
  return data;
}

// ----- Admin: Fare config -----
export async function getFareConfig() {
  const { data } = await api.get("/admin/fare-config");
  return data;
}

export async function setFareConfig(body) {
  const { data } = await api.post("/admin/fare-config", body);
  return data;
}

// for ticket stats
export async function getTicketStats() {
  const {data} = await api.get("/admin/dashboard/tickets")
  return data
} 
