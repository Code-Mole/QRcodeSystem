import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import "./App.css";
import QRcode from "./pages/QRcode";
function App() {
  return (
    <Router>
      <main className="main_content">
        <Routes>
          <Route path="/form" element={<Form />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/qrcode" element={<QRcode />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
