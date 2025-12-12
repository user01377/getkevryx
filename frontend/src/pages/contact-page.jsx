import React from "react";
import "../styles/contact-page.css";

export default function Contact() {
  return (
    <main className="contact-page page">
        <h1>Contact Us</h1>
        <h1>Have A Question For Us?</h1>
        <p>Our Customer Service Team is actively working on replying to inquiries. Currently, our estimated response time is 1-2 business days.</p>
        <p>Please see the FAQ page before submitting a contact form. Thank You!</p>

        <form className="contact-form">

          <label htmlFor="name">Subject</label>
          <input type="text" id="subject" name="subject" placeholder="Please enter a subject" required />

          <label htmlFor="name">First Name</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="name">Last Name</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="your@email.com" required />

          <label htmlFor="email">Phone Number</label>
          <input type="text" id="phone" name="phone" placeholder="ex. 123-456-6789" />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>

          <button type="submit">Send</button>

        </form>
        
    </main>
  );
}
