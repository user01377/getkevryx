import { Link } from "react-router-dom";
import "../styles/landing-page.css";

export default function LandingPage() {
  return (
    <main className="landing">
      {/* HERO */}
      <section className="hero">
        <img
          src="https://placecats.com/1920/1080"
          alt="Kevryx hero"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="brand">kevryx</h1>
          <p className="tagline">for those who make their own way</p>
        </div>
      </section>

      {/* EDITORIAL STRIP WITH MINIMAL TEXT */}
      <section className="editorial-strip">
        <div className="editorial-grid">
          <div className="editorial-item" style={{ height: "520px" }}>
            <img src="https://placecats.com/millie/600/900" alt="Product 1" />
          </div>

          <div className="editorial-item" style={{ height: "420px", marginTop: "4rem" }}>
            <img src="https://placecats.com/601/700" alt="Product 2" />
          </div>

          <div className="editorial-item" style={{ height: "560px" }}>
            <img src="https://placecats.com/602/850" alt="Product 3" />
          </div>

          <div className="editorial-item" style={{ height: "460px", marginTop: "3rem" }}>
            <img src="https://placecats.com/603/720" alt="Product 4" />
          </div>

          <div className="editorial-item" style={{ height: "540px" }}>
            <img src="https://placecats.com/604/880" alt="Product 5" />
          </div>
        </div>
      </section>


      {/* LARGE SIDE-BY-SIDE IMAGES */}
      <section className="large-images">
        <div className="large-images-grid">
          <div style={{ position: "relative" }}>
            <img src="https://placecats.com/poppy/800/900" alt="Left" />
            <span className="caption top-left">Technical Jacket</span>
          </div>
          <div style={{ position: "relative" }}>
            <img src="https://placecats.com/neo_2/801/900" alt="Right" />
            <span className="caption bottom-right">Performance Pants</span>
          </div>
        </div>
      </section>

      {/* COMPANY BIO */}
      <section className="landing-bio">
        <div className="landing-bio-inner">
          {/* Text content */}
          <div className="landing-bio-text">
            <h3>
              Dedicated to crafting performance gear that empowers your journey, wherever you may go.
            </h3>
            <p>
              Founded in 2025, <strong className="kevryx-brand">kevryx</strong> creates mission-driven apparel for those who carve their own path. 
              More than clothing, our performance gear is built to endure the elements—engineered with purpose, 
              designed to perform, and made to last. Inspired by the Hmong word <em>“kev,”</em> meaning “way” or “path,” 
              <strong className="kevryx-brand"> kevryx</strong> embodies individuality, resilience, and the courage to define your own journey.
            </p>
            
            <div className="landing-bio-links">
              <Link to="/all-products" onClick={() => window.scrollTo(0, 0)}>all products</Link>
              <Link to="/mission" onClick={() => window.scrollTo(0, 0)}>our mission</Link>
              <Link to="https://github.com/user01377/getkevryx">github</Link>
            </div>
            
          </div>

          {/* Image */}
          <img src="https://placecats.com/neo_2/801/900" alt="Kevryx Image Here" />
        </div>
      </section>

    {/* BRAND STATEMENT */}
    <section className="statement">
      <div className="statement-inner">
        <h2>fabricated for your journey.</h2>
        <p>
          <strong className="kevryx-brand">kevryx</strong> crafts mission-driven gear for those with relentless passion and unwavering determination. 
          Wherever your journey takes you, <strong className="kevryx-brand">kevryx</strong> is built to be by your side. Every detail serves a purpose—nothing is added without reason.
        </p>
      </div>
    </section>


    </main>
  );
}
