import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p className="footer-brand">© 2026 kevryx. All rights reserved.</p>

        <div className="social-icons">
          <a href="https://github.com/user01377/getkevryx"><img src="/github.svg" alt="GitHub"/></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          <Link to="/privacy-policy" className="links-footer">Privacy Policy</Link> | <Link to="/terms-conditions" className="links-footer">Terms & Conditions</Link>
        </p>
      </div>

    </footer>
  );
}
