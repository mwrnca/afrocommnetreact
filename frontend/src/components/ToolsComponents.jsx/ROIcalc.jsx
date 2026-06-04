import { useState } from "react";
// import "./FinanceCalculators.css";

export default function ROIcalc() {
  const [initial, setInitial] = useState("");
  const [final, setFinal] = useState("");
  const [years, setYears] = useState("");

  const i = parseFloat(initial);
  const f = parseFloat(final);
  const y = parseFloat(years);

  const valid = !isNaN(i) && !isNaN(f) && i > 0;
  const roi = valid ? ((f - i) / i) * 100 : null;
  const net = valid ? f - i : null;
  const annualized = valid && !isNaN(y) && y > 0
    ? (Math.pow(f / i, 1 / y) - 1) * 100
    : null;

  const fmt = (n) => n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const color = (n) => n >= 0 ? "positive" : "negative";

  return (
    <div className="fin-calc">
      <h2 className="fin-title">ROI Calculator</h2>

      <div className="fin-fields">
        <label>Initial Investment
          <input type="number" placeholder="0.00" value={initial} onChange={e => setInitial(e.target.value)} />
        </label>
        <label>Final Value
          <input type="number" placeholder="0.00" value={final} onChange={e => setFinal(e.target.value)} />
        </label>
        <label>Time Period (years) <span className="optional">optional</span>
          <input type="number" placeholder="e.g. 3" value={years} onChange={e => setYears(e.target.value)} />
        </label>
      </div>

      {valid && (
        <div className="fin-results">
          <div className="fin-card">
            <span className="fin-label">ROI</span>
            <span className={`fin-value ${color(roi)}`}>{fmt(roi)}%</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Net Profit / Loss</span>
            <span className={`fin-value ${color(net)}`}>{net >= 0 ? "+" : ""}{fmt(net)}</span>
          </div>
          {annualized !== null && (
            <div className="fin-card">
              <span className="fin-label">Annualized ROI</span>
              <span className={`fin-value ${color(annualized)}`}>{fmt(annualized)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
