import React from "react";
import "../styles/faq-page.css";

export default function FaqPage() {
    return (
        <main className="faq-page page">
            
            {/* the banner image */}
            <div className="hero-banner">
                <img src="https://placecats.com/1920/1080" alt="Image Banner" className="hero-image"/>
                <div className="hero-text">
                    <h1></h1>
                </div>
            </div>
            
            <div className="faq-body">

                {/* FAQ Topic 1 */}
                <section className="faq-topic">
                    <h1>Orders and Shipping</h1>

                    <details>
                        <summary>Where Is My Order?</summary>
                        <div className="content">
                            <p>You will be sent a confirmation email and upon purchase. A tracking number will be provided whenever tracking is available.</p>
                        </div>
                    </details>

                    <details>
                        <summary>How do I track my order?</summary>
                        <div className="content">
                            <p>Once your order ships, you will receive a tracking number via email.</p>
                        </div>
                    </details>

                    <details>
                        <summary>Do you offer international shipping?</summary>
                        <div className="content">
                            <p>Yes, we ship to most countries. Shipping fees may vary based on location.</p>
                        </div>
                    </details>

                </section>


                {/* FAQ Topic 2 */}
                <section className="faq-topic">
                <h1>Account & Billing</h1>
        
                <details>
                    <summary>How Can I Create An Account?</summary>
                    <div className="content">
                    <p>No account creation is available at this time. All orders will be tracked via email and confirmation number.</p>
                    </div>
                </details>

                </section>

                {/* FAQ Topic 3 */}
                <section className="faq-topic">
                <h1>Warranty & Returns</h1>

                <details>
                    <summary>What warranty do your products have?</summary>
                    <div className="content">
                    <p>All products from our website come with a one-year warranty, if purchased directly from us. Resellers lose all warranty, though products may still be mailed in and repaired with a discount if proof of purchase is providied.</p>
                    </div>
                </details>
                </section>

                <details>
                    <summary>What is your return policy?</summary>
                    <div className="content">
                        <p>We offer a 30-day full refund return policy for all unopened items. After 30 days, items on record which are purchased from us and do not show significant significant wear may be eligible for a partial refund.</p>
                    </div>
                </details>

                <details>
                    <summary>The clothing item I purchased does not fit me, can I exchange?</summary>
                    <div className="content">
                        <p>Absolutely! If you have purchased directly from us and are within the 30-day return policy, contact support before the 30 days and we will exchange your item.</p>
                    </div>
                </details>

            </div>

        </main>
    )
}