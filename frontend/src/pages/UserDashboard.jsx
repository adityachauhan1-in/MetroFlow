import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Ticket, History, MessageSquare, IndianRupee } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const initial = user?.name ? String(user.name).trim().charAt(0).toUpperCase() : "U";

  return (
    <DashboardLayout title="MetroFlow">
      <div className="space-y-6">
        <Card className="overflow-hidden border-none bg-linear-to-r from-sky-500 via-sky-400 to-emerald-400">
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold shadow-md backdrop-blur text-white">
                {initial}
              </div>
              <div>
                <p className="text-sm font-medium text-sky-50/90">Welcome back</p>
                <p className="text-xl font-semibold leading-tight text-white">
                  {user?.name || "MetroFlow user"}
                </p>
                <p className="mt-1 text-sm text-sky-50/90 ">
                  Book tickets, track your journeys and check fares in one place.
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 ">
              <Button
                variant="outline"
                onClick={() => navigate("/user/book")}
                // className="w-full bg-white text-sky-700 hover:bg-sky-50 hover:border-sky-200 sm:w-auto"
                className="text-sky-700 hover:bg-sky-50 hover:border-sky-200 sm:w-auto"
              >
                Book a ticket
              </Button>
              <Button
                variant="outline"
                // className="w-full  bg-transparent text-white hover:bg-white/10 hover:border-white sm:w-auto"
                onClick={() => navigate("/user/history")}
              >
                View my tickets
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <Card>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                  <Ticket className="h-5 w-5 text-sky-600" />
                </div>
                <h2 className="mb-1 text-lg font-semibold text-slate-900">Quick actions</h2>
                <p className="mb-4 text-sm text-slate-500">
                  Start a new trip or open your recent tickets and history.
                </p>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => navigate("/user/book")}>Book a new ticket</Button>
                  <Button variant="outline" onClick={() => navigate("/user/history")}>
                    View booking history
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                  Tips
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  <li>• Preview the fare before you book to avoid surprises.</li>
                  <li>• Keep active tickets handy for faster gate scanning.</li>
                  <li>• Share feedback to help improve your daily commute.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-1 text-lg font-semibold text-slate-900">Journey shortcuts</h2>
              <p className="mb-4 text-sm text-slate-500">
                Quickly access helpful tools before and after your ride.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                    <IndianRupee className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Preview fare</p>
                    <p className="text-xs text-slate-500">
                      Check the fare for your route and journey type before booking.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="whitespace-nowrap px-3 py-1 text-xs"
                    onClick={() => navigate("/user/preview-fare")}
                  >
                    Open
                  </Button>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Give feedback</p>
                    <p className="text-xs text-slate-500">
                      Report an issue or suggest improvements for the metro experience.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="whitespace-nowrap px-3 py-1 text-xs"
                    onClick={() => navigate("/user/feedback")}
                  >
                    Write
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
