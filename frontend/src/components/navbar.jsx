import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const scrollThreshold = 10; // higher means more pixels needed to hide/show navbar
  
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      if (currentScrollY > lastScrollY + scrollThreshold) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY - scrollThreshold) {
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
