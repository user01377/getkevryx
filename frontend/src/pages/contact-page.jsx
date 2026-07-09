import "../styles/contact-page.css";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <main className="contact-page page">
      <div className="contact-container">

        <header className="contact-title">
          <h1>contact us</h1>
          <p className="contact-status">
            estimated response time: 1–2 business days
          </p>
        </header>

        <section className="contact-body">
          <p className="contact-intro">
            Have a question for our team? Before submitting a message, please
            review our{" "}
            <Link to="/faq" className="contact-faq" onClick={() => window.scrollTo(0, 0)}>
              FAQ page
            </Link>
            . If you still need assistance, feel free to reach out below.
          </p>

          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="subject">subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">first name</label>
                <input type="text" id="name" name="name" required />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">last name</label>
                <input type="text" id="lastname" name="lastname" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">phone (optional)</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="ex. 123-456-7890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">message</label>
              <textarea id="message" name="message" rows="5" required />
            </div>

            <button type="submit">send message</button>
          </form>
        </section>

      </div>
    </main>
  );
}
