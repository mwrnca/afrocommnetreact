import Header from "../../components/Generalcomponents/Header";
import Footer from "../../components/Generalcomponents/Footer";
import "./pages.css";

export default function About() {
  return (
    <section className="page-container">
      <Header />

      <div className="hero">
        <h2>About Afrocommnet</h2>
        <p>Afrocommnet is a platform dedicated to connecting Africans across the continent through trade and education. Our mission is to bridge the divide among Africans and ease the strain of doing business across borders.</p>
        <p>We believe that by fostering connectivity and collaboration, we can empower individuals and businesses to thrive in the African market. Through our platform, we provide resources, tools, and opportunities for Africans to connect, learn, and grow together.</p>
        <p>Join us in our mission to connect Afrika and empower its market through technology. Together, we can create a more connected and prosperous future for all Africans.</p>
      </div>

      <Footer />

    </section>
  );
}