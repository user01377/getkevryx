import React from "react";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <div className="navbar">
            
            

            <nav className="nav-links">
                <a href="/" className="nav-products">
                    <img src="/logo.svg" alt="Logo" className="navbar-logo" />
                </a>
                <a href="/" className="nav-products">Products</a>
                <a href="/" className="nav-faq">FAQ</a>
                <a href="/" className="nav-mission">Mission</a>
                <a href="/" className="nav-cart">
                    <img src="/shopping-cart.svg" alt="Cart" />
                </a>
            </nav>
        </div>
    );
}