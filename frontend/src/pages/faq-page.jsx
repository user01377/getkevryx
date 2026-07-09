import "../styles/faq-page.css";

export default function FaqPage() {
    return (
        <main className="faq-page page">

            {/* hero banner */}
            <section className="hero-banner">
                <img
                    src="https://placecats.com/1920/1080"
                    alt="FAQ banner"
                    className="hero-image"
                />
                <div className="hero-text">
                    {/* <h1>FAQ</h1> */}
                </div>
            </section>

            {/* all faq content */}
            <section className="faq-body">

                {/* orders and shipping section */}
                <div className="faq-topic">
                    <h2>orders & shipping</h2>

                    <details>
                        <summary>Where is my order?</summary>
                        <div className="content">
                            <p>
                                You will receive a confirmation email after purchase.
                                A tracking number will be provided once your order ships.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>How do I track my order?</summary>
                        <div className="content">
                            <p>
                                Once your order ships, tracking details will be sent to you via email.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>Do you offer international shipping?</summary>
                        <div className="content">
                            <p>
                                Yes, we ship to most countries. Shipping fees may vary by location.
                            </p>
                        </div>
                    </details>
                </div>

                {/* accounts and billing section */}
                <div className="faq-topic">
                    <h2>account & billing</h2>

                    <details>
                        <summary>How can I create an account?</summary>
                        <div className="content">
                            <p>
                                Account creation is not available at this time.
                                Orders are tracked using your email confirmation.
                            </p>
                        </div>
                    </details>
                </div>

                {/* warranty and returns section */}
                <div className="faq-topic">
                    <h2>warranty & returns</h2>

                    <details>
                        <summary>What warranty do your products include?</summary>
                        <div className="content">
                            <p>
                                Products purchased directly from us include a one-year warranty.
                                Items purchased through resellers are not covered.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>What is your return policy?</summary>
                        <div className="content">
                            <p>
                                We offer a 30-day return policy for unopened items.
                                Partial refunds may be available after that period.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>Can I exchange clothing that doesn’t fit?</summary>
                        <div className="content">
                            <p>
                                Yes. Contact support within 30 days and we’ll help arrange an exchange.
                            </p>
                        </div>
                    </details>
                </div>

            </section>

        </main>
    );
}