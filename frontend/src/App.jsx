import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/ui/LoadingScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import BookTicket from "./pages/BookTicket";
import TicketHistory from "./pages/TicketHistory";
import UserFeedback from "./pages/UserFeedback";
import PreviewFare from "./pages/PreviewFare";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminStations from "./pages/AdminStations";
import AdminFareConfig from "./pages/AdminFareConfig";
import NotFound from "./pages/NotFound";

export const App = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/book"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/history"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TicketHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/feedback"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/preview-fare"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <PreviewFare />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fare-config"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminFareConfig />
            </ProtectedRoute>
          }
        />
        {/* for any type of error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
