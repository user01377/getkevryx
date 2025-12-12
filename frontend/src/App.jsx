import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css"
import "./styles/hero-image.css"

import LandingPage from "./pages/landing-page";
import Contact from "./pages/contact-page";
import Mission from "./pages/mission-page";
import FaqPage from "./pages/faq-page";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
