import "../styles/terms-conds.css";

export default function TermsConditions() {
  return (
    <main className="terms-conditions page">

      <div className="terms-container">

        <header className="terms-title">
          <h1>terms & conditions</h1>
          <p className="terms-status">in effect: december 1, 2025</p>
        </header>

        <section className="terms-body">
            
          <p className="terms-intro">
            Welcome to <strong className="kevryx-brand">kevryx</strong>. By accessing or using our website,
            you agree to the following terms & policies. Please read them carefully
            before making a purchase or using our services.
          </p>

          <div className="terms-section">
            <h2>general terms</h2>
            <p>
              By using this website, you confirm that you are at least 18 years old
              or have permission from a parent or legal guardian. You agree to use
              the site for lawful purposes only and not engage in any activity that
              may harm the website, its users, or the business.
            </p>
            <p>
              We reserve the right to update, modify, or replace any part of these
              terms & policies at any time without prior notice.
            </p>
          </div>

          <div className="terms-section">
            <h2>products & availability</h2>
            <p>
              All products displayed on our website are subject to availability.
              while we strive for accuracy in descriptions, images, and pricing,
              we do not guarantee that all details are error-free.
            </p>
            <p>
              We reserve the right to limit quantities, discontinue products,
              or change specifications at any time.
            </p>
          </div>

          <div className="terms-section">
            <h2>pricing & payments</h2>
            <p>
              All prices are listed in usd and are subject to change without notice.
              taxes and shipping fees, if applicable, are calculated at checkout.
            </p>
            <p>
              We use secure third-party payment processors and do not store or have
              access to your full payment details.
            </p>
          </div>

          <div className="terms-section">
            <h2>shipping & delivery</h2>
            <p>
              Orders are processed within 2–3 business days. delivery times may
              vary depending on location and shipping method.
            </p>
            <p>
              We are not responsible for delays caused by carriers, customs,
              weather conditions, or other factors beyond our control.
            </p>
          </div>

          <div className="terms-section">
            <h2>returns & exchanges</h2>
            <p>
              Returns and exchanges are accepted within 30 days of delivery,
              provided items are unused, unworn, and in original condition.
            </p>
            <p>
              Clearance items or gift cards may be non-returnable. Return shipping
              costs are the responsibility of the customer unless otherwise stated.
            </p>
          </div>

          <div className="terms-section">
            <h2>intellectual property</h2>
            <p>
              All content on this website — including text, images, logos,
              and product designs — is the property of <strong className="kevryx-brand">kevryx</strong> and protected
              by applicable intellectual property laws.
            </p>
          </div>

          <div className="terms-section">
            <h2>privacy statement</h2>
            <p>
              We collect personal information only as necessary to process orders,
              provide customer support, and improve our services.
            </p>
            <p>
              Your data is never sold and is shared only when required to fulfill
              orders or comply with legal obligations.
            </p>
          </div>

          <div className="terms-section">
            <h2>cookies & tracking</h2>
            <p>
              We use cookies to enhance user experience, analyze traffic, and
              personalize content. disabling cookies may affect site functionality.
            </p>
          </div>

          <div className="terms-section">
            <h2>limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, <strong className="kevryx-brand">kevryx</strong> shall not be liable
              for any indirect or consequential damages arising from the use of
              our website or products.
            </p>
          </div>

          <div className="terms-section">
            <h2>third-party links</h2>
            <p>
              Our website may contain links to external sites. We are not
              responsible for their content, policies, or practices.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}
