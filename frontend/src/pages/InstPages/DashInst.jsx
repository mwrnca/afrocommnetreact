import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses } from "../../api";
import "./Dash.css";

export default function DashInst() {
  const navigate = useNavigate();
  const [sales,    setSales]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue,  setRevenue]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const { id, role } = getUser();
    if (!id)                   { navigate("/login/inst"); return; }
    if (role !== "institution") { navigate("/");           return; }

    Promise.all([
      fetchSales(id,    "weekly"),
      fetchExpenses(id, "weekly"),
      fetchRevenue(id,  "weekly"),
    ])
      .then(([salesData, expensesData, revenueData]) => {
        setSales(salesData);
        setExpenses(expensesData);
        setRevenue(revenueData);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="page-container">
      <div className="sales-content">
        <SalesContainer data={sales} />
      </div>
      <div className="sales-content">
        <ExpensesContainer data={expenses} />
      </div>
      <div className="sales-content">
        <RevenueContainer data={revenue} />
      </div>
    </section>
  );
}