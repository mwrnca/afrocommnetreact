import { useState } from "react";
import "./FinanceCalculators.css";

const getSolvency = (ratio) => {
  if (ratio <= 0.3)  return { label: "Very healthy — low debt",       cls: "positive" };
  if (ratio <= 0.5)  return { label: "Healthy — manageable debt",     cls: "positive" };
  if (ratio <= 0.7)  return { label: "Moderate — watch liabilities",  cls: "neutral"  };
  if (ratio <= 0.9)  return { label: "High risk — heavy debt load",   cls: "negative" };
  return               { label: "Critical — liabilities exceed assets", cls: "negative" };
};

const fmt = (n) => n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function BusinessNetWorthCalculator() {
  const [assets, setAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");

  const a = parseFloat(assets);
  const l = parseFloat(liabilities);
  const valid = !isNaN(a) && !isNaN(l) && a > 0;

  const netWorth = valid ? a - l : null;
  const ratio = valid && a > 0 ? l / a : null;
  const solvency = ratio !== null ? getSolvency(ratio) : null;

  return (
    <div className="fin-calc">
      <h2 className="fin-title">Net Worth Calculator</h2>
      <p className="fin-formula">Net Worth = Total Assets − Total Liabilities</p>

      <div className="fin-fields">
        <label>Total Assets
          <input type="number" placeholder="0.00" value={assets} onChange={e => setAssets(e.target.value)} />
        </label>
        <label>Total Liabilities
          <input type="number" placeholder="0.00" value={liabilities} onChange={e => setLiabilities(e.target.value)} />
        </label>
      </div>

      {valid && (
        <div className="fin-results">
          <div className="fin-card">
            <span className="fin-label">Net Worth (Equity)</span>
            <span className={`fin-value ${netWorth >= 0 ? "positive" : "negative"}`}>
              {netWorth >= 0 ? "" : "−"}{fmt(Math.abs(netWorth))}
            </span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Debt to Asset Ratio</span>
            <span className="fin-value">{(ratio * 100).toFixed(1)}%</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Solvency Assessment</span>
            <span className={`fin-value ${solvency.cls}`}>{solvency.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
