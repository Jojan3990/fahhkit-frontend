import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import EditProfilePage from "./pages/EditProfilePage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import AthleteSearchPage from "./pages/AthleteSearchPage";
import AthleteProfilePage from "./pages/AthleteProfilePage";
import HistoryPage from "./pages/HistoryPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/create" element={<CreateEventPage />} />
      <Route path="/athletes" element={<AthleteSearchPage />} />
      <Route path="/athletes/:userId" element={<AthleteProfilePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
