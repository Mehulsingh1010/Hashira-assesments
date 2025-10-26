// App.jsx
"use client";
import { useState } from "react";
import LandingPage from "./components/LandingPage.js";
import LoginPage from "./components/LoginForm.js";
import RegisterPage from "./components/RegisterPage.js";
import HomePage from "./components/HomePage.js";


export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  const handleLogin = () => {
    setCurrentPage("home");
  };

  const handleRegister = () => {
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setCurrentPage("landing");
  };

  return (
    <>
      {currentPage === "landing" && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === "login" && <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />}
      {currentPage === "register" && <RegisterPage onNavigate={setCurrentPage} onRegister={handleRegister} />}
      {currentPage === "home" && <HomePage onLogout={handleLogout} />}
    </>
  );
}