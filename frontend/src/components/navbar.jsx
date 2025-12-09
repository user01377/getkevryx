import React from "react";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <div className="navbar">
            
            <img src="/logo.svg" alt="Logo" className="navbar-logo" />

            <nav className="nav-links">
                <a href="/shop">Shop</a>
                <a href="/contact">Contact</a>
            </nav>
        </div>
    );
}