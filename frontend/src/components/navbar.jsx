import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // this implements a smart Navbar, hiding and showing the Navbar
    // based on how far you scroll
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 20) { // adjusts the amount you need to scroll to hide navbar
        // scrolling down hides the nav bar
        setHidden(true);
      } else {
        // scrolling up shows navbar
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${hidden ? "hidden" : ""}`}>
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src="/logo.svg" alt="Logo" className="navbar-logo" />
          <span className="logo-text">Kevryx</span>
        </Link>
      </div>

      <div className="nav-center">
        <Link to="/" className="nav-products">ALL PRODUCTS</Link>
        <Link to="/mission" className="nav-mission">MISSION</Link>
        <Link to="/faq" className="nav-faq">FAQ</Link>
        <Link to="/contact" className="nav-contact">CONTACT</Link>
      </div>

      <div className="nav-right">
        <Link to="/" className="nav-cart">
          <img src="/shopping-cart.svg" alt="Cart" />
        </Link>
      </div>
    </nav>
  );
}
