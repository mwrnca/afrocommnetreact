import { useState } from "react";
import "./ToolsComponents.css";

const BASE_URL = "http://localhost:8000";

const emptyForm = {
  itemName:        "",
  amount:          "",
  category:        "",
  paymentMethod:   "",
  transactionCode: "",
  date:            "",
};

export default function UpdateDataForm() {
  // separate state for each form
  const [salesForm,    setSalesForm]    = useState(emptyForm);
  const [expensesForm, setExpensesForm] = useState(emptyForm);
  const [salesMsg,     setSalesMsg]     = useState("");
  const [expensesMsg,  setExpensesMsg]  = useState("");

  // get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // generic change handler — takes the setter as argument
  const handleChange = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // submit sales entry
  const handleSalesSubmit = async () => {
    if (!salesForm.itemName || !salesForm.amount || !salesForm.date) {
      setSalesMsg("Please fill in required fields");
      return;
    }

    const res = await fetch(`${BASE_URL}/sales/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day:       salesForm.date,
        orders:    1,
        completed: 1,
        pending:   0,
        period:    "weekly",
        itemName:  salesForm.itemName,
        amount:    parseFloat(salesForm.amount),
      }),
    });

    if (res.ok) {
      setSalesMsg("Sales updated successfully");
      setSalesForm(emptyForm);
    } else {
      setSalesMsg("Failed to update sales");
    }

    setTimeout(() => setSalesMsg(""), 3000);
  };

  // submit expenses entry
  const handleExpensesSubmit = async () => {
    if (!expensesForm.itemName || !expensesForm.amount || !expensesForm.date) {
      setExpensesMsg("Please fill in required fields");
      return;
    }

    const res = await fetch(`${BASE_URL}/expenses/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day:      expensesForm.date,
        amount:   parseFloat(expensesForm.amount),
        category: expensesForm.category || expensesForm.itemName,
        period:   "weekly",
      }),
    });

    if (res.ok) {
      setExpensesMsg("Expenses updated successfully");
      setExpensesForm(emptyForm);
    } else {
      setExpensesMsg("Failed to update expenses");
    }

    setTimeout(() => setExpensesMsg(""), 3000);
  };

  return (
    <div className="update-container">

      {/* ── Sales Form ── */}
      <div className="sales-update">
        <h3 className="update-title">Record Sale</h3>

        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          className="update-input"
          value={salesForm.itemName}
          onChange={handleChange(setSalesForm)}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="update-input"
          value={salesForm.quantity}
          onChange={handleChange(setSalesForm)}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="update-input"
          value={salesForm.amount}
          onChange={handleChange(setSalesForm)}
        />
        <input
          type="text"
          name="paymentMethod"
          placeholder="Payment Method"
          className="update-input"
          value={salesForm.paymentMethod}
          onChange={handleChange(setSalesForm)}
        />
        <input
          type="text"
          name="transactionCode"
          placeholder="Transaction Code"
          className="update-input"
          value={salesForm.transactionCode}
          onChange={handleChange(setSalesForm)}
        />
        <input
          type="date"
          name="date"
          className="update-input"
          value={salesForm.date}
          onChange={handleChange(setSalesForm)}
        />

        {salesMsg && <p className="update-msg">{salesMsg}</p>}

        <button className="update-button" onClick={handleSalesSubmit}>
          Record Sale
        </button>
      </div>

      {/* ── Expenses Form ── */}
      <div className="expenses-update">
        <h3 className="update-title">Record Expense</h3>

        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          className="update-input"
          value={expensesForm.itemName}
          onChange={handleChange(setExpensesForm)}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="update-input"
          value={expensesForm.amount}
          onChange={handleChange(setExpensesForm)}
        />
        <input
          type="text"
          name="category"
          placeholder="Category e.g. Rent, Salaries, Utilities"
          className="update-input"
          value={expensesForm.category}
          onChange={handleChange(setExpensesForm)}
        />
        <input
          type="text"
          name="paymentMethod"
          placeholder="Payment Method"
          className="update-input"
          value={expensesForm.paymentMethod}
          onChange={handleChange(setExpensesForm)}
        />
        <input
          type="text"
          name="transactionCode"
          placeholder="Transaction Code"
          className="update-input"
          value={expensesForm.transactionCode}
          onChange={handleChange(setExpensesForm)}
        />
        <input
          type="date"
          name="date"
          className="update-input"
          value={expensesForm.date}
          onChange={handleChange(setExpensesForm)}
        />

        {expensesMsg && <p className="update-msg">{expensesMsg}</p>}

        <button className="update-button" onClick={handleExpensesSubmit}>
          Record Expense
        </button>
      </div>

    </div>
  );
}