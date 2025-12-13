import React from "react";
import "../styles/contact-page.css";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
<main className="contact-page page">

    <h1 className="contact-header">CONTACT US</h1>

    <div className="contact-intro">
        <h2 className="contact-subheader">have a question for our team?</h2>
        <p className="contact-subtext">
            Our Customer Service Team is actively working on replying to inquiries. 
            Currently, our estimated response time is 1-2 business days.
        </p>
        <p className="contact-subtext">
            Please see the <Link to="/faq" className="contact-faq">FAQ page</Link> before submitting a contact form. Thank You!
        </p>
    </div>

    <form className="contact-form">
        <label htmlFor="subject">Subject</label>
        <input type="text" id="subject" name="subject" placeholder="Please enter a subject" required />

        <label htmlFor="name">First Name</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="lastname">Last Name</label>
        <input type="text" id="lastname" name="lastname" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="your@email.com" required />

        <label htmlFor="phone">Phone Number</label>
        <input type="text" id="phone" name="phone" placeholder="ex. 123-456-6789" />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>

        <button type="submit">Send</button>
    </form>

</main>

  );
}
