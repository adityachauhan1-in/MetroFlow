import React from "react";

import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import DashboardLayout from "../components/layout/DashboardLayout";
import { scanTicket } from "../api/services";
import { QrCode, User, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <User className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">Admin</p>
              <p className="text-sm text-slate-500">Scan tickets at the gate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <QrCode size={22} /> Scan Ticket
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Enter the ticket ID or paste the QR code value (e.g.{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">TICKET_ID:...</code>
              ). In production, this would use a QR scanner.
            </p>
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label htmlFor="ticket-id" className="mb-1 block text-sm font-medium text-slate-700">
                  Ticket ID / QR value
                </label>
                <input
                  id="ticket-id"
                  type="text"
                  value={ticketId}
                  onChange={(e) => { setTicketId(e.target.value); setError(""); setResult(null); }}
                  placeholder="TICKET_ID:674a1b2c3d4e5f..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
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
          <Card className={result.ok ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}>
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
    </DashboardLayout>
  );
}
