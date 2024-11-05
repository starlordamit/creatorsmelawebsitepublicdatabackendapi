// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreatorsPage from "./pages/CreatorsPage";
import NavBar from "./components/NavBar";
import BrandPage from "./pages/BrandPage";
import SettingsPage from "./pages/SettingsPage";
function App() {
  const authToken = localStorage.getItem("authToken");

  return (
    <Router>
      {authToken && <NavBar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={authToken ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/creator"
          element={authToken ? <CreatorsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/brand"
          element={authToken ? <BrandPage /> : <Navigate to="/" />}
        />

        <Route
          path="/settings"
          element={authToken ? <SettingsPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
