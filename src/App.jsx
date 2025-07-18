import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages
import Dashboard from "@/components/pages/Dashboard";
import EventsPage from "@/components/pages/EventsPage";
import VenuesPage from "@/components/pages/VenuesPage";
import SeatMapsPage from "@/components/pages/SeatMapsPage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import ScannerPage from "@/components/pages/ScannerPage";
import EventPurchasePage from "@/components/pages/EventPurchasePage";
import SettingsPage from "@/components/pages/SettingsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId/purchase" element={<EventPurchasePage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/seat-maps" element={<SeatMapsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;