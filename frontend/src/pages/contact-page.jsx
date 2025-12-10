import React from "react";
import "../styles/contact-page.css";

export default function Contact() {
  return (
    <main className="contact-page page">
        <h1>Contact The Team</h1>

        <form className="contact-form">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Your Name" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your@email.com" required />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Write your message..." rows="5" required></textarea>

            <button type="submit">Send</button>
        </form>
    </main>
  );
}
