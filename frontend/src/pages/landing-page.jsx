import React from "react";
import "../styles/landing-page.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      {/* the banner image */}
      <section className="hero">
        <img
          src="https://placecats.com/1920/1080"
          alt="Kevryx hero banner"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="brand">kevryx.</h1>
          <p className="tagline">For those who make their own way</p>
        </div>
      </section>

      {/* body content */}
      <section className="marketing">
        
      </section>

    </main>
  );
}