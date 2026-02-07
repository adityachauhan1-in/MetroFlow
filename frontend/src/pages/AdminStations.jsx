import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAdminStations, createStation, updateStation } from "../api/services";
import { MapPin, Plus, Pencil } from "lucide-react";

export default function AdminStations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addDistance, setAddDistance] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDistance, setEditDistance] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchStations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminStations();
      setList(res?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load stations.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAdd = async (e) => {
    e?.preventDefault();
    if (!addName.trim() || addDistance === "" || Number(addDistance) < 0) {
      setError("Name and distance (≥ 0) are required.");
      return;
    }
    setAddLoading(true);
    setError("");
    try {
      await createStation({ name: addName.trim(), distance: Number(addDistance) });
      setAddName("");
      setAddDistance("");
      setShowAdd(false);
      await fetchStations();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to add station.");
    } finally {
      setAddLoading(false);
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditName(s.name);
    setEditDistance(String(s.distance));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDistance("");
  };

  const handleUpdate = async (e) => {
    e?.preventDefault();
    if (!editingId) return;
    const dist = parseFloat(editDistance);
    if (isNaN(dist) || dist < 0) {
      setError("Distance must be a number ≥ 0.");
      return;
    }
    setSaveLoading(true);
    setError("");
    try {
      await updateStation(editingId, { name: editName.trim(), distance: dist });
      cancelEdit();
      await fetchStations();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to update station.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <DashboardLayout title="Stations" backHref="/admin" backLabel="Admin">
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">Manage stations</p>
              <p className="text-sm text-slate-500">Add or edit stations and distances</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="error" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Stations</h2>
              <Button
                variant="outline"
                onClick={() => { setShowAdd(!showAdd); setError(""); }}
              >
                <Plus size={18} /> Add station
              </Button>
            </div>

            {showAdd && (
              <form onSubmit={handleAdd} className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="Station name"
                    className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={addDistance}
                    onChange={(e) => setAddDistance(e.target.value)}
                    placeholder="0"
                    className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" disabled={addLoading}>{addLoading ? "Adding…" : "Add"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowAdd(false); setAddName(""); setAddDistance(""); }}>Cancel</Button>
              </form>
            )}

            {loading ? (
              <p className="text-slate-500">Loading stations…</p>
            ) : list.length === 0 ? (
              <p className="text-slate-500">No stations. Add one above.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {list.map((s) => (
                  <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                    {editingId === s._id ? (
                      <form onSubmit={handleUpdate} className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-48 rounded border border-slate-300 px-2 py-1.5 text-sm"
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={editDistance}
                          onChange={(e) => setEditDistance(e.target.value)}
                          className="w-20 rounded border border-slate-300 px-2 py-1.5 text-sm"
                        />
                        <span className="text-sm text-slate-500">km</span>
                        <Button type="submit" disabled={saveLoading}>{saveLoading ? "Saving…" : "Save"}</Button>
                        <Button type="button" variant="outline" onClick={cancelEdit} disabled={saveLoading}>Cancel</Button>
                      </form>
                    ) : (
                      <>
                        <span className="font-medium text-slate-800">{s.name}</span>
                        <span className="text-sm text-slate-600">{s.distance} km</span>
                        <Button variant="outline" onClick={() => startEdit(s)}>
                          <Pencil size={16} /> Edit
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
