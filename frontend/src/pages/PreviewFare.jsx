import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DashboardLayout from "../components/layout/DashboardLayout";
import { calculateFare, getStations } from "../api/services";
import { IndianRupee } from "lucide-react";

const JOURNEY_TYPES = [
  { value: "single", label: "Single" },
  { value: "return", label: "Return" },
];

export default function PreviewFare() {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyType, setJourneyType] = useState("single");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getStations()
      .then((res) => setStations(res?.data ?? []))
      .catch(() => setStations([]));
  }, []);

  const handlePreview = async (e) => {
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
      const res = await calculateFare({ from, to, journeyType });
      const details = res?.data ?? res;
      const total = Number(details.total) ?? 0;
      setPreview({
        from: details.from,
        to: details.to,
        distance: details.distance,
        baseFare: details.baseFare,
        perKmFare: details.perKmFare,
        subtotal: details.subtotal,
        total: details.total,
        fare: total,
        journeyType: details.journeyType ?? journeyType,
        isPeakTime: details.isPeakTime,
      });
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not calculate fare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Preview Fare" backHref="/user" backLabel="Dashboard">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Check fare</h2>
            <p className="mb-4 text-sm text-slate-500">
              Select route and journey type to see the fare breakdown. Book from the Book Ticket page.
            </p>

            {error && (
              <Alert variant="error" onDismiss={() => setError("")} className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handlePreview} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">From</label>
                <select
                  value={from}
                  onChange={(e) => { setFrom(e.target.value); setError(""); setPreview(null); }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select station</option>
                  {stations.map((s) => (
                    <option key={s.name ?? s._id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">To</label>
                <select
                  value={to}
                  onChange={(e) => { setTo(e.target.value); setError(""); setPreview(null); }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select station</option>
                  {stations.map((s) => (
                    <option key={s.name ?? s._id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Journey type</label>
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
              <div className="sm:col-span-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Calculating…" : "Preview fare"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {preview && (
          <Card>
            <CardContent>
              <h3 className="mb-2 font-semibold">Fare preview</h3>
              <div className="space-y-1 text-slate-600">
                <p><span className="font-medium">Route:</span> {preview.from} → {preview.to}</p>
                <p><span className="font-medium">Distance:</span> {preview.distance} km</p>
                <p><span className="font-medium">Journey type:</span> {preview.journeyType}</p>
                {preview.baseFare != null && <p><span className="font-medium">Base fare:</span> ₹{preview.baseFare}</p>}
                {preview.perKmFare != null && <p><span className="font-medium">Per km:</span> ₹{preview.perKmFare}</p>}
                {preview.isPeakTime && <p className="text-amber-700">Peak time applied</p>}
                <p className="pt-2 font-semibold text-slate-800">Total: ₹{preview.fare}</p>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Final fare may vary; see booking confirmation when you book.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
