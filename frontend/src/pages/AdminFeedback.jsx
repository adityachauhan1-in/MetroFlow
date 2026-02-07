import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getFeedback, reviewFeedback } from "../api/services";
import { MessageSquare, User, Mail, Calendar, Send } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "reviewed", label: "Reviewed" },
  { value: "resolved", label: "Resolved" },
];

export default function AdminFeedback() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editReply, setEditReply] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getFeedback();
      setList(res?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load feedback.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditStatus(item.status ?? "open");
    setEditReply(item.adminReply ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
    setEditReply("");
  };

  const saveReview = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await reviewFeedback(editingId, {
        status: editStatus,
        adminReply: editReply.trim() || undefined,
      });
      await fetchFeedback();
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to update feedback.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Feedback" backHref="/admin" backLabel="Admin">
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">Review feedback</p>
              <p className="text-sm text-slate-500">View and respond to user feedback</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="error" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <p className="text-center text-slate-500">Loading feedback…</p>
        ) : list.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              No feedback yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {list.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    {item.user && (
                      <>
                        <span className="flex items-center gap-1">
                          <User size={14} /> {item.user.name ?? "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={14} /> {item.user.email ?? "—"}
                        </span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.category === "complaint"
                          ? "bg-red-100 text-red-800"
                          : item.category === "suggestion"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "reviewed"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.status ?? "open"}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-800">{item.message}</p>
                  {item.adminReply && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">Admin reply</p>
                      <p className="mt-1 text-sm text-slate-700">{item.adminReply}</p>
                    </div>
                  )}

                  {editingId === item._id ? (
                    <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Admin reply</label>
                        <textarea
                          value={editReply}
                          onChange={(e) => setEditReply(e.target.value)}
                          placeholder="Optional reply to the user"
                          rows={3}
                          maxLength={500}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">{editReply.length}/500</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveReview} disabled={saving}>
                          <Send size={16} /> {saving ? "Saving…" : "Save"}
                        </Button>
                        <Button variant="outline" onClick={cancelEdit} disabled={saving}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => startEdit(item)}
                    >
                      Review / Reply
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
