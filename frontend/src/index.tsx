import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ModeSelection from "./pages/ModeSelection";
import reportWebVitals from "./reportWebVitals";
import DashboardGroup from "./pages/Dashboardgroup";
import GroupSelection from "./pages/GroupSelection";
import LandingPage from "./pages/landing";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Default route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/ModeSelection" element={<ModeSelection />} />
        <Route path="/dashboard/group/:groupId" element={<DashboardGroup />} />
        <Route path="/GroupSelection" element={<GroupSelection />} />
        <Route path="/join-group/:groupId" element={<DashboardGroup />} />
        <Route path="/landing" element={<LandingPage />} />


      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
