import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="nav-logo">
                <img src="/logo.svg" alt="Logo" className="navbar-logo" />
                <span className="logo-text">Kevryx</span>
                </Link>
            </div>

            <div className="nav-center">
                <Link to="/" className="nav-products">Products</Link>
                <Link to="/mission" className="nav-mission">Mission</Link>
                <Link to="/" className="nav-faq">FAQ</Link>
                <Link to="/contact" className="nav-contact">Contact</Link>
            </div>

            <div className="nav-right">
                <Link to="/" className="nav-cart">
                <img src="/shopping-cart.svg" alt="Cart" />
                </Link>
            </div>
        </nav>
    );
}