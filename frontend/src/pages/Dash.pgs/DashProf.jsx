import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses, fetchRevenue } from "../../api";
import SalesContainer from '../../components/HomeComponents/SalesContainer';
import ExpensesContainer from '../../components/HomeComponents/ExpensesContainer';
import RevenueContainer from '../../components/HomeComponents/RevenueContainer';
import "./Dash.css";

export default function DashProf() {
  const navigate = useNavigate();
  const [sales,    setSales]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue,  setRevenue]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const { id, role } = getUser();
    if (!id)                    { navigate("/login/prof"); return; }
    if (role !== "professional") { navigate("/");           return; }

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