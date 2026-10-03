import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Challenges from "./pages/Challenges";
import Startups from "./pages/Startups";
import NewChallenge from "./pages/NewChallenge";
import SubmitProposal from "./pages/SubmitProposal";
import Escrow from "./pages/Escrow";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import GovDashboard from "./pages/GovDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AuditLedger from "./pages/AuditLedger";
import Sandbox from "./pages/Sandbox";
import Landing from "./pages/Landing"; // NEW IMPORT
import axios from 'axios';

function DashboardHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Prevent UI flashing while checking local storage
  if (loading) return null;

  // If no user is logged in, show the beautiful Landing Page
  if (!user) {
    return <Landing />;
  }

  // Serve the entirely separate dashboards based on the role
  if (user.role === 'gov') {
    return <GovDashboard user={user} />;
  }

  return <StudentDashboard user={user} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Public Route for the Audit Ledger so judges can view it directly */}
          <Route path="ledger" element={<AuditLedger />} />

          {/* Home Route - Unprotected so the Landing Page can be viewed by guests */}
          <Route index element={<DashboardHome />} />

          {/* Protected Routes (Must be logged in) */}
          <Route path="challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
          <Route path="escrow" element={<ProtectedRoute><Escrow /></ProtectedRoute>} />

          {/* Government-Only Protected Routes */}
          <Route path="startups" element={<ProtectedRoute allowedRoles={['gov']}><Startups /></ProtectedRoute>} />
          <Route path="new-challenge" element={<ProtectedRoute allowedRoles={['gov']}><NewChallenge /></ProtectedRoute>} />

          {/* Student-Only Protected Routes */}
          <Route path="apply/:challengeId" element={<ProtectedRoute allowedRoles={['startup']}><SubmitProposal /></ProtectedRoute>} />

          {/* Sandbox Route */}
          <Route path="sandbox" element={<ProtectedRoute allowedRoles={['startup']}><Sandbox /></ProtectedRoute>} />
        </Route>

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
axios.interceptors.request.use((config) => {
  const liveBackendUrl = "https://govspark-backend.onrender.com"; // Paste your Render URL here
  if (config.url && config.url.includes("127.0.0.1:8000")) {
    config.url = config.url.replace("http://127.0.0.1:8000", liveBackendUrl);
  }
  return config;
});


export default App;