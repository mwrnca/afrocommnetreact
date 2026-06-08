import { useEffect, useState } from "react";
import "./ConsumerComponents.css";

const roleOptions = [
  { value: "",             label: "All Types" },
  { value: "business",     label: "Business" },
  { value: "professional", label: "Professional" },
  { value: "institution",  label: "Institution" },
];

export default function DirectoryFilters({ onFilter }) {
  const [search, setSearch] = useState("");
  const [role,   setRole]   = useState("");
  const [county, setCounty] = useState("");
  const [debounced, setDebounced] = useState("");

  // debounce the search input — waits 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // fire onFilter whenever any filter changes
  useEffect(() => {
    onFilter({ search: debounced, role, county });
  }, [debounced, role, county]);

  return (
    <div className="dir-filters">

      {/* search by name */}
      <input
        type="text"
        placeholder="Search by name, business or category..."
        className="dir-filter-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* filter by type */}
      <select
        className="dir-filter-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        {roleOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* filter by county */}
      <input
        type="text"
        placeholder="County e.g. Nairobi, Mombasa"
        className="dir-filter-input"
        value={county}
        onChange={(e) => setCounty(e.target.value)}
      />

      {/* clear all filters */}
      {(search || role || county) && (
        <button
          className="dir-clear-btn"
          onClick={() => {
            setSearch("");
            setRole("");
            setCounty("");
          }}
        >
          Clear Filters
        </button>
      )}

    </div>
  );
}