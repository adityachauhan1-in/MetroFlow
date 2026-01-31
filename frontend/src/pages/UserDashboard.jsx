import { useNavigate } from "react-router-dom";
import { Card ,CardContent} from "../components/ui/Card";
import Button from "../components/ui/Button";
import DashboardLayout from "../components/layout/DashboardLayout";
import { User, Ticket, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function UserDashboard() {
  const navigate = useNavigate();
 const {user} = useAuth();
  return (
    <DashboardLayout title="Metrio">
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <User className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">Hello , User</p>
              <p className="text-sm text-slate-500">Book tickets and view your history</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Ticket className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="mb-2 text-lg font-semibold">Book Ticket</h2>
              <p className="mb-4 text-sm text-slate-500">
                Book a new ticket for your journey. Choose stations and journey type.
              </p>
              <Button onClick={() => navigate("/user/book")}>Book Now</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <History className="h-5 w-5 text-slate-600" />
              </div>
              <h2 className="mb-2 text-lg font-semibold">My Tickets</h2>
              <p className="mb-4 text-sm text-slate-500">
                View your ticket booking history and active tickets.
              </p>
              <Button variant="outline" onClick={() => navigate("/user/history")}>
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
