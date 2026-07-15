import { useEffect, useState } from "react";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  // pre-render navbar after threshold
  const [renderNavbar, setRenderNavbar] = useState(!isLanding);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // console.log("fetching cart..");
        const res = await fetch("/api/cart/summary", {
          credentials: "include",
        });
  
        if (!res.ok) return;
  
        const data = await res.json();
        // console.log(data);
  
        setCount(
          data.items.reduce((sum, item) => sum + item.quantity, 0)
        );
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchCart();
  
    window.addEventListener("cart-updated", fetchCart);
  
    return () => {
      window.removeEventListener("cart-updated", fetchCart);
    };
  }, []);

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
          <div className="cart-icon-wrapper">
            <img src="/shopping-cart.svg" alt="Cart" />

            {count > 0 && (
              <span className="cart-badge">{count}</span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
