import { useState } from "react";
import "./FinanceCalculators.css";

export default function RiskRewardCalculator() {
  const [risk, setRisk] = useState("");
  const [reward, setReward] = useState("");

  const r = parseFloat(risk);
  const w = parseFloat(reward);
  const valid = !isNaN(r) && !isNaN(w) && r > 0 && w > 0;

  const ratio = valid ? w / r : null;
  const breakeven = valid ? (r / (r + w)) * 100 : null;

  const assessment = () => {
    if (!valid) return null;
    if (ratio >= 3) return { label: "Excellent", cls: "positive" };
    if (ratio >= 2) return { label: "Good", cls: "positive" };
    if (ratio >= 1) return { label: "Acceptable", cls: "neutral" };
    return { label: "Poor — reward doesn't justify risk", cls: "negative" };
  };

  const a = assessment();
  const fmt = (n, d = 2) => n.toLocaleString("en-KE", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="fin-calc">
      <h2 className="fin-title">Risk / Reward Calculator</h2>

      <div className="fin-fields">
        <label>Potential Risk (amount you could lose)
          <input type="number" placeholder="0.00" value={risk} onChange={e => setRisk(e.target.value)} />
        </label>
        <label>Potential Reward (amount you could gain)
          <input type="number" placeholder="0.00" value={reward} onChange={e => setReward(e.target.value)} />
        </label>
      </div>

      {valid && (
        <div className="fin-results">
          <div className="fin-card">
            <span className="fin-label">Risk : Reward Ratio</span>
            <span className="fin-value">1 : {fmt(ratio)}</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Breakeven Success Rate</span>
            <span className="fin-value">{fmt(breakeven)}%</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Assessment</span>
            <span className={`fin-value ${a.cls}`}>{a.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
