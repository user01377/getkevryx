import "../styles/mission-page.css";

export default function Mission() {
    return(
        <main className="mission-page page">
            
            {/* the banner image */}
            <div className="hero-banner">
                <img src="https://placecats.com/1920/1080" alt="Image Banner" className="hero-image"/>
                <div className="hero-text">
                    <h1>MISSION</h1>
                </div>
            </div>

            {/* body */}
            <div className="body-content">

                <div className="mission-container">
                    <h1>our mission</h1>
                    <p><strong>kevryx</strong> is built for those who carve their own way. Clothing should be more than fashion; it should withstand the environments we face every day, no matter how extreme. We design purpose-driven performance apparel engineered for the elements. At <strong>kevryx</strong>, we don’t chase trends — we chase performance.</p>
                </div>

                <div className="motto-container">
                    <h1>our motto</h1>
                    <p>For those who make their own way.</p>
                </div>

                <div className="why-container">
                    <h1>why `&quot;`kevryx`&quot;`</h1>
                    <p><strong>kevryx</strong> originates from the Hmong word `&quot;`<em>kev</em>,`&quot;` meaning `&quot;`way`&quot;` or `&quot;`path.`&quot;`</p>
                    <p>Our name represents the idea that everyone walks their own journey — shaped by culture, environment, experiences, and identity. At <strong>kevryx</strong>, we create clothing that reflects that individuality. Your path defines you — not anyone else.</p>
                </div>

                <div className="bio-container">
                    <h1>who am i?</h1>
                    <p>I’m someone who learned early that nothing is guaranteed and everything is earned. As a first-generation student coming from humble beginnings, I’ve spent my life carving my own path — one challenge, one step, one lesson at a time. <strong>kevryx</strong> is rooted in that same spirit. It represents the bravery to dream bigger, the discipline to keep going, and the belief that anyone can forge their own way. This project isn’t just a brand concept — it’s a reflection of who I am and what I stand for.</p>
                </div>

            </div>

        </main>

        
    );
}