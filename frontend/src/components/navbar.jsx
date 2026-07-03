import { useEffect, useState } from "react";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  // pre-render navbar after threshold
  const [renderNavbar, setRenderNavbar] = useState(!isLanding);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLanding) {
      setRenderNavbar(true);
      setVisible(true);
      return;
    }

    const threshold = 120; // controls the px needed to render navbar

    const handleScroll = () => {
      if (!renderNavbar && window.scrollY > threshold) {
        setRenderNavbar(true);
      }
  
      if (renderNavbar) {
        setVisible(window.scrollY < threshold);
      }

    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding, renderNavbar]);

  // If not yet rendered, return null
  if (!renderNavbar) return null;

  return (
    <nav className={`navbar ${visible ? "navbar-visible" : ""}`}>
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          {/* <img src="/logo-here.svg" alt="Logo" className="navbar-logo" /> */}
          <span className="logo-text">kevryx</span>
        </Link>
      </div>

      <div className="nav-center">
        <Link to="/all-products" className="nav-link">all products</Link>
        <Link to="/mission" className="nav-link">mission</Link>
        <Link to="/faq" className="nav-link">faq</Link>
        <Link to="/contact" className="nav-link">contact</Link>
      </div>

      <div className="nav-right">
        <Link to="/shopping-cart" className="nav-cart">
          <img src="/shopping-cart.svg" alt="Cart" />
        </Link>
      </div>
    </nav>
  );
}
