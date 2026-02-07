import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import DashboardLayout from "../components/layout/DashboardLayout";
import { submitFeedback } from "../api/services";
import { MessageSquare } from "lucide-react";

const CATEGORIES = [
  { value: "technical", label: "Technical" },
  { value: "service", label: "Service" },
  { value: "suggestion", label: "Suggestion" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

export default function UserFeedback() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess(false);
    if (!message.trim()) {
      setError("Please enter your message.");
      return;
    }
    if (message.trim().length < 5) {
      setError("Message must be at least 5 characters.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({ message: message.trim(), category });
      setSuccess(true);
      setMessage("");
      setCategory("");
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Feedback" backHref="/user" backLabel="Dashboard">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Send feedback</h2>
            <p className="mb-4 text-sm text-slate-500">
              Share your experience, report issues, or suggest improvements. We review all feedback.
            </p>

            {error && (
              <Alert variant="error" onDismiss={() => setError("")} className="mb-4">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mb-4">
                Feedback submitted successfully. Thank you!
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setError(""); }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError(""); }}
                  placeholder="Describe your feedback (min 5 characters)"
                  rows={4}
                  maxLength={1000}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">{message.length}/1000</p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting…" : "Submit feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
