import { useState, useEffect } from "react";
import { getUser, fetchExpenses } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import "./Homecomponents.css";

const periods = ["weekly", "monthly", "yearly"];

export default function ExpensesContainer() {
  const [data,   setData]   = useState([]);
  const [period, setPeriod] = useState("weekly");
  const [totals, setTotals] = useState({ total: 0, biggest: "", growth: 0 });

  useEffect(() => {
    const { id } = getUser();
    if (!id) return;

    fetchExpenses(id, period).then(periodData => {
      setData(periodData);
      const total   = periodData.reduce((sum, d) => sum + d.amount, 0);
      const biggest = periodData.reduce((max, d) => d.amount > (max.amount || 0) ? d : max, {});
      const first   = periodData[0]?.amount || 1;
      const last    = periodData[periodData.length - 1]?.amount || 1;
      const growth  = (((last - first) / first) * 100).toFixed(1);
      setTotals({ total, biggest: biggest.category || "N/A", growth });
    });
  }, [period]);

  return (
    <div className="container">
      <div className="card-sales">
        <div className="card-header">
          <h2 className="card-title">Expenses Overview</h2>
          <div className="period-tabs">
            {periods.map(p => (
              <button key={p} className={`period-tab ${period === p ? "period-active" : ""}`} onClick={() => setPeriod(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
            <XAxis dataKey="day" tick={{ fill: "#d4af37", fontSize: 11 }} />
            <YAxis tick={{ fill: "#d4af37", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1a1d23", border: "1px solid #b8860b", borderRadius: 8 }} labelStyle={{ color: "#d4af37" }} itemStyle={{ color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#d4af37", fontSize: 12 }} />
            <Bar dataKey="amount" fill="#e74c3c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card completed"><h3>Total Expenses</h3><h2>{totals.total.toLocaleString("en-KE")}</h2></div>
      <div className="card pending"><h3>Biggest Expense</h3><h2>{totals.biggest}</h2></div>
      <div className="card sales-growth">
        <h3>Expense Growth</h3>
        <h2 style={{ color: totals.growth <= 0 ? "#27ae60" : "#e74c3c" }}>
          {totals.growth >= 0 ? "+" : ""}{totals.growth}%
        </h2>
      </div>
    </div>
  );
}