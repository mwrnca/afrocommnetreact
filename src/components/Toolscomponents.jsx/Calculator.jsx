import { useState, useEffect, useCallback } from "react";
import "./Toolscomponents.css";

export default function Calculator() {
  const [current, setCurrent] = useState("0");
  const [prev, setPrev] = useState("");
  const [operator, setOperator] = useState("");
  const [expr, setExpr] = useState("");
  const [freshInput, setFreshInput] = useState(false);
  const [justEvaled, setJustEvaled] = useState(false);

  const fmt = (n) => {
    const num = parseFloat(n);
    if (isNaN(num)) return n;
    const s = parseFloat(num.toPrecision(10)).toString();
    return s.length > 12 ? num.toExponential(4) : s;
  };

  const compute = useCallback((a, op, b) => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return b;
    switch (op) {
      case "+": return String(x + y);
      case "−": return String(x - y);
      case "×": return String(x * y);
      case "÷": return y === 0 ? "Error" : String(x / y);
      default:   return b;
    }
  }, []);

  const handle = useCallback((action, val) => {
    setCurrent(cur => {
      setPrev(p => {
        setOperator(op => {
          setExpr(ex => {
            setFreshInput(fi => {
              setJustEvaled(je => {

                let newCurrent = cur;
                let newPrev = p;
                let newOp = op;
                let newExpr = ex;
                let newFresh = fi;
                let newEvaled = je;

                if (action === "digit") {
                  if (cur === "Error") newCurrent = val;
                  else if (fi || cur === "0") { newCurrent = val; newFresh = false; }
                  else if (cur.length < 12) newCurrent = cur + val;
                  newEvaled = false;
                }
                else if (action === "dot") {
                  if (fi) { newCurrent = "0."; newFresh = false; }
                  else if (!cur.includes(".")) newCurrent = cur + ".";
                }
                else if (action === "op") {
                  if (cur === "Error") return fi;
                  if (op && !fi) {
                    newCurrent = compute(p, op, cur);
                    newExpr = "";
                  }
                  newPrev = newCurrent;
                  newOp = val;
                  newExpr = fmt(newPrev) + " " + val;
                  newFresh = true;
                  newEvaled = false;
                }
                else if (action === "equals") {
                  if (!op || cur === "Error") return fi;
                  newExpr = fmt(p) + " " + op + " " + fmt(cur) + " =";
                  newCurrent = compute(p, op, cur);
                  newOp = "";
                  newPrev = "";
                  newFresh = true;
                  newEvaled = true;
                }
                else if (action === "clear") {
                  newCurrent = "0";
                  newPrev = "";
                  newOp = "";
                  newExpr = "";
                  newFresh = false;
                  newEvaled = false;
                }
                else if (action === "sign") {
                  if (cur !== "0" && cur !== "Error")
                    newCurrent = cur.startsWith("-") ? cur.slice(1) : "-" + cur;
                }
                else if (action === "percent") {
                  const n = parseFloat(cur);
                  if (!isNaN(n)) newCurrent = String(n / 100);
                }
                else if (action === "backspace") {
                  if (!fi && !je)
                    newCurrent = cur.length > 1 ? cur.slice(0, -1) : "0";
                }

                setCurrent(newCurrent);
                setPrev(newPrev);
                setOperator(newOp);
                setExpr(newExpr);
                setJustEvaled(newEvaled);
                return newFresh;
              });
              return op;
            });
            return ex;
          });
          return p;
        });
        return cur;
      });
      return cur;
    });
  }, [compute]);

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (k >= "0" && k <= "9")   handle("digit", k);
      else if (k === ".")          handle("dot");
      else if (k === "+")          handle("op", "+");
      else if (k === "-")          handle("op", "−");
      else if (k === "*")          handle("op", "×");
      else if (k === "/")          { e.preventDefault(); handle("op", "÷"); }
      else if (k === "Enter" || k === "=") handle("equals");
      else if (k === "Escape")     handle("clear");
      else if (k === "Backspace")  handle("backspace");
      else if (k === "%")          handle("percent");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handle]);

  const fontSize =
    fmt(current).length > 9 ? "1.5rem" :
    fmt(current).length > 6 ? "1.875rem" : "2.25rem";

  const buttons = [
    { label: "AC",  action: "clear",   cls: "fn" },
    { label: "+/−", action: "sign",    cls: "fn" },
    { label: "%",   action: "percent", cls: "fn" },
    { label: "÷",   action: "op",      cls: "op", val: "÷" },
    { label: "7",   action: "digit",   val: "7" },
    { label: "8",   action: "digit",   val: "8" },
    { label: "9",   action: "digit",   val: "9" },
    { label: "×",   action: "op",      cls: "op", val: "×" },
    { label: "4",   action: "digit",   val: "4" },
    { label: "5",   action: "digit",   val: "5" },
    { label: "6",   action: "digit",   val: "6" },
    { label: "−",   action: "op",      cls: "op", val: "−" },
    { label: "1",   action: "digit",   val: "1" },
    { label: "2",   action: "digit",   val: "2" },
    { label: "3",   action: "digit",   val: "3" },
    { label: "+",   action: "op",      cls: "op", val: "+" },
    { label: "0",   action: "digit",   val: "0",  wide: true },
    { label: ".",   action: "dot" },
    { label: "=",   action: "equals",  cls: "eq" },
  ];

  return (
    <div className="calc-wrap">
      <div className="calc">
        <div className="calc-display">
          <div className="calc-expr">{expr}</div>
          <div className="calc-result" style={{ fontSize }}>
            {fmt(current)}
          </div>
        </div>

        <div className="calc-grid">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className={`calc-btn ${btn.cls || ""} ${btn.wide ? "wide" : ""}`}
              onClick={() => handle(btn.action, btn.val ?? btn.label)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
