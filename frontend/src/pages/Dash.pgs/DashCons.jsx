import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchUserData, fetchCommunities } from "../../api";
import ConsHome from '../../components/HomeComponents/ConsHome';
import "./Dash.css";

export default function DashCons() {
  const navigate = useNavigate();
  const [userData,    setUserData]    = useState(null);
  const [communities, setCommunities] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const { id, role } = getUser();
    if (!id)                { navigate("/login/cons"); return; }
    if (role !== "consumer") { navigate("/");           return; }

    Promise.all([
      fetchUserData(id),
      fetchCommunities(),
    ])
      .then(([userData, commsData]) => {
        setUserData(userData);
        setCommunities(commsData);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="page-container">
      <div className="cons-home">
        <ConsHome userData={userData} communities={communities} />
      </div>
    </section>
  );
}