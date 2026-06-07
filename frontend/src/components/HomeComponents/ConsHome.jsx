import "./Homecomponents.css"
import ConsCard from "../Generalcomponents/DirectoryCard"

export default function ConsHome({ userData, communities }) {
  return (
    <section className="cons-card-cont">
      <ConsCard userData={userData} communities={communities} />
    </section>
  );
}