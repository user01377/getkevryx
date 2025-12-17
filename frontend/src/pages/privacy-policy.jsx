import React from "react";
import "../styles/privacy-policy.css";

export default function PrivacyPolicy() {
  return (
    <main className="privacy-policy page">
      <div className="privacy-container">
        <header className="privacy-title">
          <h1>privacy policy</h1>
          <p className="privacy-updated">last updated: december 2025</p>
        </header>

        <section className="privacy-body">
          <p>
            your privacy is important to us. this privacy policy explains how
            information is collected, used, and protected when you visit this
            website.
          </p>

          <div className="privacy-section">
            <h2>information we collect</h2>
            <p>
              this website does not knowingly collect personal information such
              as names, addresses, or payment details. limited technical data
              (such as browser type or device information) may be collected
              automatically for performance and analytics purposes.
            </p>
          </div>

          <div className="privacy-section">
            <h2>how information is used</h2>
            <p>
              any collected information is used solely to improve site
              functionality, performance, and user experience. data is never
              sold, rented, or shared with third parties.
            </p>
          </div>

          <div className="privacy-section">
            <h2>cookies</h2>
            <p>
              this site may use minimal cookies or similar technologies to
              ensure proper functionality. you can disable cookies through
              your browser settings if you prefer.
            </p>
          </div>

          <div className="privacy-section">
            <h2>third-party links</h2>
            <p>
              this website may contain links to external sites. we are not
              responsible for the privacy practices or content of those
              websites.
            </p>
          </div>

          <div className="privacy-section">
            <h2>changes to this policy</h2>
            <p>
              this privacy policy may be updated occasionally. any changes will
              be reflected on this page with an updated revision date.
            </p>
          </div>

          <div className="privacy-section">
            <h2>contact</h2>
            <p>
              if you have any questions about this privacy policy, please reach
              out through the contact information provided on this website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}