import "./ProfComponents.css";
import { useState, useEffect } from "react";
import { getUser, fetchSales } from "../../../api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const periods = ["weekly", "monthly", "yearly"];

export default function SalesContainer() {
  const [data,    setData]    = useState([]);
  const [period,  setPeriod]  = useState("weekly");
  const [totals,  setTotals]  = useState({ orders: 0, completed: 0, pending: 0, growth: 0 });

  // in SalesContainer.jsx — format date for display
const formatDay = (day) => {
  if (!day) return "";
  const d = new Date(day);
  return d.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
};

  useEffect(() => {
    const { id } = getUser();
    if (!id) return;

    fetchSales(id, period).then(periodData => {

      if (!Array.isArray(periodData)) return;

      setData(periodData);
      
      const orders    = periodData.reduce((sum, d) => sum + d.orders,    0);
      const completed = periodData.reduce((sum, d) => sum + d.completed, 0);
      const pending   = periodData.reduce((sum, d) => sum + d.pending,   0);
      const first  = periodData[0]?.orders || 1;
      const last   = periodData[periodData.length - 1]?.orders || 1;
      const growth = (((last - first) / first) * 100).toFixed(1);
      setTotals({ orders, completed, pending, growth });
    });
  }, [period]);

  return (
    <div className="bss-sales-container">
      <div className="bss-sales-card">
        <div className="bss-sales-header">
          <h2 className="bss-sales-cardtitle">Clients Overview</h2>
          <div className="bss-sales-period-tabs">
            {periods.map(p => (
              <button
                key={p}
                className={`bss-sales-period-tab ${period === p ? "bss-sales-period-active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
           </div>
         </div>
        {data.length < 2 ? (
          <div className="bss-no-data">
              <p>Add more entries to see the graph</p>
          </div>
        ):(<ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
            <XAxis dataKey="day" tick={{ fill: "#d4af37", fontSize: 11 }} tickFormatter={formatDay}/>
            <YAxis tick={{ fill: "#d4af37", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1a1d23", border: "1px solid #b8860b", borderRadius: 8 }}
              labelStyle={{ color: "#d4af37" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "#d4af37", fontSize: 12 }} />
            <Line type="monotone" dataKey="orders"    stroke="#d4af37" strokeWidth={2} dot={{ fill: "#d4af37", r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="completed" stroke="#27ae60" strokeWidth={2} dot={{ fill: "#27ae60", r: 3 }} />
            <Line type="monotone" dataKey="pending"   stroke="#e74c3c" strokeWidth={2} dot={{ fill: "#e74c3c", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>)}
      </div>

      <div className="bss-sales-cards-container">
        <div className="bss-sales-cards">
          <h3>Total Clients</h3>
          <h2>{totals.orders}</h2>
        </div>

        <div className="bss-sales-cards">
          <h3>Completed Jobs</h3>
          <h2>{totals.completed}</h2>
        </div>

        <div className="bss-sales-cards">
          <h3>Pending Jobs</h3>
          <h2>{totals.pending}</h2>
        </div>
      
        <div className="bss-sales-cards">
          <h3>Clients Growth</h3>
          <h2 style={{ color: totals.growth >= 0 ? "#27ae60" : "#e74c3c" }}>
            {totals.growth >= 0 ? "+" : ""}{totals.growth}%
          </h2>
        </div>
      </div>

    </div>
  );
}