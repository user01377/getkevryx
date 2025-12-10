import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p className="footer-brand">© 2025 Kevryx. All rights reserved.</p>

        <div className="social-icons">
          <a href="#"><img src="/instagram.svg" alt="GitHub"/></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Privacy Policy | Terms & Conditions</p>
      </div>
    </footer>
  );
}
