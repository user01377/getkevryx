import React from "react";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            {/* split the navbar into 3 sections so styling is easier */}
            <div className="nav-left">
                <a href="/" className="nav-logo">
                    <img src="/logo.svg" alt="Logo" className="navbar-logo" />
                    <span className="logo-text">Kevryx</span>
                </a>
            </div>

            <div className="nav-center">
                <a href="/" className="nav-products">Products</a>
                <a href="/" className="nav-mission">Mission</a>
                <a href="/" className="nav-faq">FAQ</a>
                <a href="/" className="nav-contact">Contact</a>
            </div>

            <div className="nav-right">
                <a href="/" className="nav-cart">
                    <img src="/shopping-cart.svg" alt="Cart" />
                </a>
            </div>

        </nav>

    );
}