import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DashboardLayout from "../components/layout/DashboardLayout";
import { scanTicket, getTicketStats } from "../api/services";
import { useNavigate } from "react-router-dom";
import { QrCode, CheckCircle2, XCircle, MessageSquare, MapPin, IndianRupee, Ticket, TrendingUp, Clock, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getTicketStats();
        if (!cancelled && res?.success && res?.data) setTicketStats(res.data);
      } catch {
        if (!cancelled) setTicketStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleScan = async (e) => {
    e?.preventDefault();
    setError("");
    setResult(null);
    const raw = ticketId.trim();
    if (!raw) {
      setError("Enter a ticket ID or QR code value (e.g. TICKET_ID:...)");
      return;
    }
    setLoading(true);
    try {
      const res = await scanTicket({ ticketId: raw });
      setResult({ ok: true, message: res.message, usedAt: res.usedAt });
      setTicketId("");
    } catch (err) {
      const msg = err.response?.data?.message ?? "Scan failed.";
      setResult({ ok: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setTicketId("");
  };

  const initial = user?.name ? String(user.name).trim().charAt(0).toUpperCase() : "A";

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <Card className="overflow-hidden border-none bg-linear-to-r from-sky-500 via-sky-400 to-emerald-400">
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold shadow-md backdrop-blur text-white">
                {initial}
              </div>
              <div>
                <p className="text-sm font-medium text-sky-50/90">Control center</p>
                <p className="text-xl font-semibold leading-tight text-white">
                  {user?.name || "MetroFlow admin"}
                </p>
                <p className="mt-1 text-sm text-sky-50/90">
                  Monitor tickets, scan at gates and manage metro configuration.
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"

                // className="w-full bg-white text-sky-700 hover:bg-sky-50 hover:border-sky-200 sm:w-auto"
                onClick={() => navigate("/admin/stations")}
              >
                Manage stations
              </Button>
              <Button
                variant="outline"
                // className="w-full border-white/70 bg-transparent text-white hover:bg-white/10 hover:border-white sm:w-auto"
                onClick={() => navigate("/admin/fare-config")}
              >
                Fare settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          <div className="space-y-6">
            {statsLoading ? (
              <Card>
                <CardContent className="py-8 text-center text-slate-500">
                  Loading ticket stats…
                </CardContent>
              </Card>
            ) : (
              ticketStats && (
                <Card>
                  <CardContent>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Ticket size={22} /> Ticket overview
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex flex-col rounded-xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Total tickets
                          </span>
                          <Ticket className="h-4 w-4 text-slate-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                          {ticketStats.totalTickets ?? 0}
                        </p>
                      </div>

                      <div className="flex flex-col rounded-xl bg-emerald-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                            Active
                          </span>
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-800">
                          {ticketStats.activeTickets ?? 0}
                        </p>
                      </div>

                      <div className="flex flex-col rounded-xl bg-blue-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-blue-700">
                            Used
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-blue-800">
                          {ticketStats.usedTickets ?? 0}
                        </p>
                      </div>

                      <div className="flex flex-col rounded-xl bg-amber-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
                            Expired
                          </span>
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="text-2xl font-bold text-amber-800">
                          {ticketStats.expiredTickets ?? 0}
                        </p>
                      </div>

                      <div className="flex flex-col rounded-xl bg-violet-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-violet-700">
                            Today
                          </span>
                          <Calendar className="h-4 w-4 text-violet-600" />
                        </div>
                        <p className="text-2xl font-bold text-violet-800">
                          {ticketStats.todayTickets ?? 0}
                        </p>
                      </div>

                      <div className="flex flex-col rounded-xl bg-emerald-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                            Total revenue
                          </span>
                          <IndianRupee className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-800">
                          {typeof ticketStats.totalRevenue === "number"
                            ? `₹${ticketStats.totalRevenue.toLocaleString()}`
                            : "₹0"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Admin tools</h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/feedback")}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:border-sky-200 hover:bg-sky-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                        <MessageSquare className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Feedback</p>
                        <p className="text-xs text-slate-500">
                          Review and respond to user feedback.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-sky-600">Open</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/stations")}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:border-sky-200 hover:bg-sky-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Stations</p>
                        <p className="text-xs text-slate-500">
                          Configure metro stations and distances.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-sky-600">Manage</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/fare-config")}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:border-sky-200 hover:bg-sky-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Fare configuration</p>
                        <p className="text-xs text-slate-500">
                          Set base fare, per km rate and peak hours.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-sky-600">Edit</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <QrCode size={22} /> Scan ticket at gate
                </h2>
                <p className="mb-4 text-sm text-slate-600">
                  Enter the ticket ID or paste the QR code value (e.g.{" "}
                  <code className="rounded bg-slate-100 px-1 font-mono text-xs">TICKET_ID:...</code>
                  ). In production, this would use a QR scanner.
                </p>
                <form onSubmit={handleScan} className="space-y-4">
                  <div>
                    <label
                      htmlFor="ticket-id"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Ticket ID / QR value
                    </label>
                    <input
                      id="ticket-id"
                      type="text"
                      value={ticketId}
                      onChange={(e) => {
                        setTicketId(e.target.value);
                        setError("");
                        setResult(null);
                      }}
                      placeholder="TICKET_ID:674a1b2c3d4e5f..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {error && (
                    <Alert variant="error" onDismiss={() => setError("")} className="mb-2">
                      {error}
                    </Alert>
                  )}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Scanning…" : "Scan"}
                    </Button>
                    <Button type="button" variant="outline" onClick={reset}>
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card
                className={
                  result.ok
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-red-200 bg-red-50/60"
                }
              >
                <CardContent className="flex items-start gap-4">
                  {result.ok ? (
                    <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="h-8 w-8 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className={`font-medium ${result.ok ? "text-emerald-800" : "text-red-800"}`}>
                      {result.message}
                    </p>
                    {result.ok && result.usedAt && (
                      <p className="mt-1 text-sm text-emerald-700">
                        Used at {new Date(result.usedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
