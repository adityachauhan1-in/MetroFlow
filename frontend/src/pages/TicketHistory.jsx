import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getTicketHistory } from "../api/services";
import { QRCodeSVG } from "qrcode.react";
import { Ticket, ArrowRight } from "lucide-react";

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleString();
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-800",
    used: "bg-slate-100 text-slate-700",
    expire: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? 
        "bg-slate-100"}`}
    >
      {status}
    </span>
  );
}

export default function TicketHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState({ counts: 0, ticket: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    getTicketHistory()
      .then((res) => {
        if (!ignore) setData({ counts: res.counts ?? 0, ticket: res.ticket ?? [] });
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message ?? "Could not load history.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  return (
    <DashboardLayout title="My Tickets" backHref="/user" backLabel="Dashboard">
      <div className="space-y-6">
        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <Card>
            <CardContent>
              <p className="text-slate-500">Loading your tickets…</p>
            </CardContent>
          </Card>
        ) : data.ticket.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <Ticket className="h-12 w-12 text-slate-300" />
              <div className="text-center">
                <h3 className="font-semibold text-slate-700">No tickets yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Book a ticket from the dashboard to see it here.
                </p>
              </div>
              <Button onClick={() => navigate("/user")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {data.counts} ticket{data.counts !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.ticket.map((t) => (
                <Card key={t._id}>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium">{t.from}</span>
                        <ArrowRight size={16} />
                        <span className="font-medium">{t.to}</span>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span>₹{t.fare}</span>
                      <span>{t.journeyType}</span>
                      <span>Booked {formatDate(t.createdAt)}</span>
                    </div>
                    {t.status === "active" && t.qrCode && (
                      <div className="flex flex-col items-center gap-1 rounded border border-slate-200 bg-slate-50 p-3">
                        <QRCodeSVG value={t.qrCode} size={120} level="M" />
                        <p className="text-xs font-mono text-slate-500">{t.qrCode}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
