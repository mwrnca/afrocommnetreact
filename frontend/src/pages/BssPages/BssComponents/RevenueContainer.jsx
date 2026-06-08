import { useState, useEffect } from "react";
import { getUser, fetchRevenue } from "../../../api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import "./Homecomponents.css";

const periods = ["weekly", "monthly", "yearly"];

export default function RevenueContainer() {
  const [data,   setData]   = useState([]);
  const [period, setPeriod] = useState("weekly");
  const [totals, setTotals] = useState({ revenue: 0, profit: 0, growth: 0 });

  useEffect(() => {
    const { id } = getUser();
    if (!id) return;

    fetchRevenue(id, period).then(periodData => {
      setData(periodData);
      const revenue = periodData.reduce((sum, d) => sum + d.revenue, 0);
      const profit  = periodData.reduce((sum, d) => sum + d.profit,  0);
      const first   = periodData[0]?.revenue || 1;
      const last    = periodData[periodData.length - 1]?.revenue || 1;
      const growth  = (((last - first) / first) * 100).toFixed(1);
      setTotals({ revenue, profit, growth });
    });
  }, [period]);

  const profitLoss = totals.profit - (totals.revenue - totals.profit);

  return (
    <div className="container">
      <div className="card-sales">
        <div className="card-header">
          <h2 className="card-title">Revenue Overview</h2>
          <div className="period-tabs">
            {periods.map(p => (
              <button key={p} className={`period-tab ${period === p ? "period-active" : ""}`} onClick={() => setPeriod(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#27ae60" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
            <XAxis dataKey="day" tick={{ fill: "#d4af37", fontSize: 11 }} />
            <YAxis tick={{ fill: "#d4af37", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1a1d23", border: "1px solid #b8860b", borderRadius: 8 }} labelStyle={{ color: "#d4af37" }} itemStyle={{ color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#d4af37", fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} fill="url(#revenueGrad)" />
            <Area type="monotone" dataKey="profit"  stroke="#27ae60" strokeWidth={2} fill="url(#profitGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card completed"><h3>Total Revenue</h3><h2>{totals.revenue.toLocaleString("en-KE")}</h2></div>
      <div className="card completed"><h3>Total Profit</h3><h2>{totals.profit.toLocaleString("en-KE")}</h2></div>
      <div className="card pending">
        <h3>Profit / Loss</h3>
        <h2 style={{ color: profitLoss >= 0 ? "#27ae60" : "#e74c3c" }}>
          {profitLoss >= 0 ? "+" : ""}{profitLoss.toLocaleString("en-KE")}
        </h2>
      </div>
      <div className="card sales-growth">
        <h3>Business Growth</h3>
        <h2 style={{ color: totals.growth >= 0 ? "#27ae60" : "#e74c3c" }}>
          {totals.growth >= 0 ? "+" : ""}{totals.growth}%
        </h2>
      </div>
    </div>
  );
}