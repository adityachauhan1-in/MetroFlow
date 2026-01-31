import { useState } from "react";
import React from "react";

import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import DashboardLayout from "../components/layout/DashboardLayout";
import { STATIONS } from "../constants/stations";
import { calculateFare, bookTicket } from "../api/services";
import { QRCodeSVG } from "qrcode.react";

const JOURNEY_TYPES = [
  { value: "single", label: "Single" },
  { value: "return", label: "Return" },
];

export default function BookTicket() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyType, setJourneyType] = useState("single");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);

  const clearError = () => setError("");

  const handleCalculateFare = async (e) => {
    e?.preventDefault();
    setError("");
    setPreview(null);
    if (!from || !to) {
      setError("Select From and To stations.");
      return;
    }
    if (from === to) {
      setError("From and To cannot be the same.");
      return;
    }
    setLoading(true);
    try {
      const res = await calculateFare({ from, to });
      let fare = res.fare ?? 0;
      if (journeyType === "return") fare *= 2;
      setPreview({ distance: res.distance, fare, journeyType });
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not calculate fare.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e?.preventDefault();
    setError("");
    setBooked(null);
    if (!from || !to) {
      setError("Select From and To stations.");
      return;
    }
    if (from === to) {
      setError("From and To cannot be the same.");
      return;
    }
    setLoading(true);
    try {
      const res = await bookTicket({ from, to, journeyType });
      setBooked(res.ticket);
    } catch (err) {
      setError(err.response?.data?.message ?? "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Book Ticket" backHref="/user" backLabel="Dashboard">
      <div className="space-y-6">
        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
            <button
              type="button"
              onClick={clearError}
              className="ml-2 font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {!booked ? (
          <>
            <Card>
              <CardContent>
                <h2 className="mb-4 text-lg font-semibold">Journey details</h2>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      From
                    </label>
                    <select
                      value={from}
                      onChange={(e) => { setFrom(e.target.value); clearError(); }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select station</option>
                      {STATIONS.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      To
                    </label>
                    <select
                      value={to}
                      onChange={(e) => { setTo(e.target.value); clearError(); }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select station</option>
                      {STATIONS.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Journey type
                    </label>
                    <div className="flex gap-4">
                      {JOURNEY_TYPES.map((t) => (
                        <label key={t.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="journeyType"
                            value={t.value}
                            checked={journeyType === t.value}
                            onChange={() => setJourneyType(t.value)}
                            className="text-blue-600"
                          />
                          <span className="text-slate-700">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 sm:col-span-2">
                    <Button
                      variant="outline"
                      onClick={handleCalculateFare}
                      disabled={loading}
                    >
                      {loading ? "Calculating…" : "Preview fare"}
                    </Button>
                    <Button onClick={handleBook} disabled={loading}>
                      {loading ? "Booking…" : "Book ticket"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {preview && (
              <Card>
                <CardContent>
                  <h3 className="mb-2 font-semibold">Fare preview</h3>
                  <p className="text-slate-600">
                    Distance: {preview.distance} km • Type: {preview.journeyType} •
                    Fare: ₹{preview.fare}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Final fare may vary; see booking confirmation.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-green-800">
                Ticket booked successfully
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">From</p>
                  <p className="font-medium">{booked.from}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">To</p>
                  <p className="font-medium">{booked.to}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Fare</p>
                  <p className="font-medium">₹{booked.fare}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Status</p>
                  <p className="font-medium capitalize">{booked.status}</p>
                </div>
              </div>
              {booked.qrCode && (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-700">Show at gate</p>
                  <QRCodeSVG value={booked.qrCode} size={160} level="M" />
                  <p className="text-xs text-slate-500 font-mono">{booked.qrCode}</p>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setBooked(null);
                  setFrom("");
                  setTo("");
                  setJourneyType("single");
                  setPreview(null);
                }}
              >
                Book another
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
