import React from "react";
import "../styles/privacy-policy.css";

export default function PrivacyPolicy() {
  return (
    <main className="privacy-policy page">
      <div className="privacy-container">

        <header className="privacy-title">
          <h1>privacy policy</h1>
          <p className="privacy-updated">last updated: december 3, 2025</p>
        </header>

        <section className="privacy-body">

          <p className="privacy-intro">
            your privacy is important to us. this privacy policy explains how
            information is collected, used, and protected when you visit this
            website.
          </p>

          <div className="privacy-section">
            <h2>information we collect</h2>
            <p>
              this website does not knowingly collect personal information such
              as names, addresses, or payment details. limited technical data
              may be collected automatically for performance and analytics
              purposes.
            </p>
          </div>

          <div className="privacy-section">
            <h2>how information is used</h2>
            <p>
              any collected information is used solely to improve site
              functionality, performance, and user experience.
            </p>
          </div>

          <div className="privacy-section">
            <h2>cookies</h2>
            <p>
              this site may use minimal cookies or similar technologies to
              ensure proper functionality. you can disable cookies through
              your browser settings.
            </p>
          </div>

          <div className="privacy-section">
            <h2>third-party links</h2>
            <p>
              this website may contain links to external sites. we are not
              responsible for their privacy practices or content.
            </p>
          </div>

          <div className="privacy-section">
            <h2>changes to this policy</h2>
            <p>
              this privacy policy may be updated occasionally. changes will
              be reflected on this page with a revised date.
            </p>
          </div>

          <div className="privacy-section">
            <h2>contact</h2>
            <p>
              if you have questions about this privacy policy, please reach
              out using the contact information on this website.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}
