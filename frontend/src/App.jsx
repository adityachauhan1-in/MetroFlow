import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/ui/LoadingScreen";
import ProtectedRoute from "./routes/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/Signup"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const BookTicket = lazy(() => import("./pages/BookTicket"));
const TicketHistory = lazy(() => import("./pages/TicketHistory"));
const UserFeedback = lazy(() => import("./pages/UserFeedback"));
const PreviewFare = lazy(() => import("./pages/PreviewFare"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const AdminStations = lazy(() => import("./pages/AdminStations"));
const AdminFareConfig = lazy(() => import("./pages/AdminFareConfig"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const App = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </BrowserRouter>
  );
};
