import LandingPage from "./pages/landing-page";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="content">
        <LandingPage />
      </main>

      <Footer />
    </div>
  );
}

export default App;
