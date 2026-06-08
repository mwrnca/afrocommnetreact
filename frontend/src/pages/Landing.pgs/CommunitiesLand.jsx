import Header from "../../components/Generalcomponents/Header";
import Footer from "../../components/Generalcomponents/Footer";
import "./pages.css";

export default function CommunitiesLand() {
  return (
    <section className="page-container">

        <Header />

        <section className="hero">
        <h2>Connecting Afrika,</h2>
        <h2>Through Trade and education</h2>
        <p>Discover the power of connectivity with Afrocommnet.</p>
        <p>We are dedicated to bridging the divide among Africans to ease the strain of doing business across borders.</p>
        <p>Join us in our mission to connect Afrika and empower its market through technology.</p>
        <a>Get Started</a>
        </section>

        <Footer />
    </section>
  );
}