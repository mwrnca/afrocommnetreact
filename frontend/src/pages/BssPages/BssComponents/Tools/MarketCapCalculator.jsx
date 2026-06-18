import { useState } from "react";
import "./FinanceCalculators.css";

const getCategory = (cap) => {
  if (cap >= 200e9) return { label: "Mega Cap",  cls: "positive",  desc: "200B+" };
  if (cap >= 10e9)  return { label: "Large Cap", cls: "positive",  desc: "10B – 200B" };
  if (cap >= 2e9)   return { label: "Mid Cap",   cls: "neutral",   desc: "2B – 10B" };
  if (cap >= 300e6) return { label: "Small Cap", cls: "neutral",   desc: "300M – 2B" };
  if (cap >= 50e6)  return { label: "Micro Cap", cls: "negative",  desc: "50M – 300M" };
  return              { label: "Nano Cap",  cls: "negative",  desc: "Under 50M" };
};

const fmtLarge = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6)  return (n / 1e6).toFixed(2) + "M";
  return n.toLocaleString("en-KE");
};

export default function MarketCapCalculator() {
  const [price, setPrice] = useState("");
  const [shares, setShares] = useState("");

  const p = parseFloat(price);
  const s = parseFloat(shares);
  const valid = !isNaN(p) && !isNaN(s) && p > 0 && s > 0;

  const cap = valid ? p * s : null;
  const category = valid ? getCategory(cap) : null;

  return (
    <div className="fin-calc">
      <h2 className="fin-title">Market Cap Calculator</h2>
      <p className="fin-formula">Market Cap = Share Price × Shares Outstanding</p>

      <div className="fin-fields">
        <label>Share Price
          <input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} />
        </label>
        <label>Total Shares Outstanding
          <input type="number" placeholder="e.g. 1000000" value={shares} onChange={e => setShares(e.target.value)} />
        </label>
      </div>

      {valid && (
        <div className="fin-results">
          <div className="fin-card">
            <span className="fin-label">Market Capitalisation</span>
            <span className="fin-value">{fmtLarge(cap)}</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Category</span>
            <span className={`fin-value ${category.cls}`}>{category.label}</span>
          </div>
          <div className="fin-card">
            <span className="fin-label">Range</span>
            <span className="fin-value">{category.desc}</span>
          </div>
        </div>
      )}
    </div>
  );
}
