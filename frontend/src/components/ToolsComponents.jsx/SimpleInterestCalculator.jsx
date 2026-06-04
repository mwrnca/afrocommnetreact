import { useState } from "react";
import "./FinanceCalculators.css";

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const t = parseFloat(time);
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0;

  const interest = valid ? (p * r * t) / 100 : null;
  const total = valid ? p + interest : null;

  const fmt = (n) => n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fin-calc">
      <h2 className="fin-title">Simple Interest Calculator</h2>
      <p className="fin-formula">I = P × R × T / 100</p>

      <div className="fin-fields">
        <label>Principal (P)
          <input type="number" placeholder="0.00" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </label>
        <label>Annual Rate % (R)
          <input type="number" placeholder="e.g. 5" value={rate} onChange={e => setRate(e.target.value)} />
        </label>
        <label>Time in Years (T)
          <input type="number" placeholder="e.g. 3" value={time} onChange={e => setTime(e.target.value)} />
        </label>
      </div>

      {valid && (
        <div className="fin-results">
          <div className="fin-card">
            <span className="fin-label">Interest Earned</span>
            <span className="fin-value positive">{fmt(interest)}</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Total Amount</span>
            <span className="fin-value">{fmt(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
