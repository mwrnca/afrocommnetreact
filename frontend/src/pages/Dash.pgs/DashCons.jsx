import { useState, useEffect } from "react";
import DirectoryCard    from "../../components/GeneralComponents/DirectoryCard";
import DirectoryFilters from "../../components/GeneralComponents/DirectoryFilters";

export default function DashCons({ userData, communities }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", role: "", county: "" });

  useEffect(() => {
    const fetchDirectory = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.role)   params.append("role",   filters.role);
      if (filters.county) params.append("county", filters.county);

      const res  = await fetch(
        `http://localhost:8000/directory${params.toString() ? `?${params}` : ""}`
      );
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };

    fetchDirectory();
  }, [filters]);

  return (
    <div className="consumer-home">
      <div className="consumer-home-header">
        <h2 className="consumer-home-title">Discover</h2>
        <p className="consumer-home-sub">
          Browse businesses, professionals and institutions
        </p>
      </div>

      <DirectoryFilters onFilter={setFilters} />

      {loading ? (
        <p className="dir-loading">Loading...</p>
      ) : users.length === 0 ? (
        <p className="dir-empty">No results found</p>
      ) : (
        <div className="dir-grid">
          {users.map(user => (
            <DirectoryCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}