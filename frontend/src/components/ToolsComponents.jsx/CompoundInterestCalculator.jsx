import { useState } from "react";
import "./FinanceCalculators.css";

const frequencies = [
  { label: "Daily",     n: 365 },
  { label: "Monthly",   n: 12  },
  { label: "Quarterly", n: 4   },
  { label: "Yearly",    n: 1   },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [freq, setFreq] = useState(12);

  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(time);
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0;

  const total = valid ? p * Math.pow(1 + r / freq, freq * t) : null;
  const interest = valid ? total - p : null;

  const breakdown = valid
    ? Array.from({ length: Math.min(Math.ceil(t), 10) }, (_, i) => {
        const yr = i + 1;
        const val = p * Math.pow(1 + r / freq, freq * yr);
        return { year: yr, value: val, gained: val - p };
      })
    : [];

  const fmt = (n) => n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fin-calc">
      <h2 className="fin-title">Compound Interest Calculator</h2>
      <p className="fin-formula">A = P(1 + r/n)^(nt)</p>

      <div className="fin-fields">
        <label>Principal (P)
          <input type="number" placeholder="0.00" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </label>
        <label>Annual Rate % (r)
          <input type="number" placeholder="e.g. 8" value={rate} onChange={e => setRate(e.target.value)} />
        </label>
        <label>Time in Years (t)
          <input type="number" placeholder="e.g. 5" value={time} onChange={e => setTime(e.target.value)} />
        </label>
        <label>Compounding Frequency (n)
          <select value={freq} onChange={e => setFreq(Number(e.target.value))} className="compound-select">
            {frequencies.map(f => (
              <option key={f.n} value={f.n} className="compound-select">{f.label}</option>
            ))}
          </select>
        </label>
      </div>

      {valid && (
        <>
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

          {breakdown.length > 0 && (
            <div className="fin-breakdown">
              <p className="fin-breakdown-title">Year by year</p>
              <div className="fin-table-wrap">
                <table className="fin-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Total Value</th>
                      <th>Interest Gained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map(row => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td>{fmt(row.value)}</td>
                        <td className="positive">+{fmt(row.gained)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
