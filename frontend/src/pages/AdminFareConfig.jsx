import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getFareConfig, setFareConfig } from "../api/services";
import { IndianRupee, Clock } from "lucide-react";

export default function AdminFareConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [baseFare, setBaseFare] = useState("");
  const [perKmFare, setPerKmFare] = useState("");
  const [peakMultiplier, setPeakMultiplier] = useState("");
  const [peakStartTime, setPeakStartTime] = useState("");
  const [peakEndTime, setPeakEndTime] = useState("");

  const fetchConfig = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getFareConfig();
      const c = res?.data;
      setConfig(c ?? null);
      if (c) {
        setBaseFare(String(c.baseFare ?? ""));
        setPerKmFare(String(c.perKmFare ?? ""));
        setPeakMultiplier(String(c.peakMultiplier ?? ""));
        setPeakStartTime(c.peakStartTime ?? "");
        setPeakEndTime(c.peakEndTime ?? "");
      } else {
        setBaseFare("90");
        setPerKmFare("20");
        setPeakMultiplier("1.2");
        setPeakStartTime("08:00");
        setPeakEndTime("10:00");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setConfig(null);
        setBaseFare("90");
        setPerKmFare("20");
        setPeakMultiplier("1.2");
        setPeakStartTime("08:00");
        setPeakEndTime("10:00");
      } else {
        setError(err.response?.data?.message ?? "Failed to load fare config.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const base = parseFloat(baseFare);
    const perKm = parseFloat(perKmFare);
    const peak = parseFloat(peakMultiplier);
    if (isNaN(base) || base < 0 || isNaN(perKm) || perKm < 0 || isNaN(peak) || peak < 1) {
      setError("Base fare and per km must be ≥ 0; peak multiplier must be ≥ 1.");
      return;
    }
    const timeRe = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRe.test(peakStartTime) || !timeRe.test(peakEndTime)) {
      setError("Peak times must be in HH:MM format (24-hour).");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await setFareConfig({
        baseFare: base,
        perKmFare: perKm,
        peakMultiplier: peak,
        peakStartTime: peakStartTime,
        peakEndTime: peakEndTime,
        isActive: true,
      });
      await fetchConfig();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to save fare config.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Fare configuration" backHref="/admin" backLabel="Admin">
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <IndianRupee className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">Fare settings</p>
              <p className="text-sm text-slate-500">Set base fare, per km rate, and peak hours</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="error" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <Card>
            <CardContent className="p-6">
              {config && (
                <p className="mb-4 text-sm text-slate-600">
                  Current active config was set on {config.createdAt ? new Date(config.createdAt).toLocaleString() : "—"}. Saving a new config will replace it.
                </p>
              )}
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Base fare (₹)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Per km fare (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={perKmFare}
                    onChange={(e) => setPerKmFare(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Peak multiplier (≥ 1)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={peakMultiplier}
                    onChange={(e) => setPeakMultiplier(e.target.value)}
                    placeholder="1.2"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={16} /> Peak times in 24-hour HH:MM (e.g. 08:00, 18:30)
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Peak start time</label>
                  <input
                    type="text"
                    value={peakStartTime}
                    onChange={(e) => setPeakStartTime(e.target.value)}
                    placeholder="08:00"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Peak end time</label>
                  <input
                    type="text"
                    value={peakEndTime}
                    onChange={(e) => setPeakEndTime(e.target.value)}
                    placeholder="10:00"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save fare configuration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
