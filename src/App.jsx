// src/App.jsx

import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  BrowserRouter as Router,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewRequestPage from "./pages/NewRequestPage.jsx";
import MyRequestsPage from "./pages/MyRequestsPage.jsx";
import RequestDetailsPage from "./pages/RequestDetailsPage.jsx";
import LogoutHandler from "./components/logout_handler/LogoutHandler.jsx";
import ScrollToTop from "./utils/scrollToTop.js";
import ProfilePage from "./pages/ProfilePage.jsx";
import "leaflet/dist/leaflet.css";

function AppContent() {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/new-request" element={<NewRequestPage />} />
        <Route path="/my-requests" element={<MyRequestsPage />} />
        <Route path="/requests/:requestId" element={<RequestDetailsPage />} />
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
