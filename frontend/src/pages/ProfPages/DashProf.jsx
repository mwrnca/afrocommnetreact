import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses } from "../../api";
import SalesContainer from './ProfComponents/SalesContainer';
import ExpensesContainer from './ProfComponents/ExpensesContainer';
import RevenueContainer from './ProfComponents/RevenueContainer';
import "./Dash.css";

export default function DashProf() {
  const navigate = useNavigate();
  const [sales,    setSales]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue,  setRevenue]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const user = getUser


  useEffect(() => {
    const { id, role } = getUser();
    if (!id)               { navigate("/login/prof"); return; }
    if (role !== "professional") { navigate("/");         return; }

    Promise.all([
      fetchSales(id,    "weekly"),
      fetchExpenses(id, "weekly"),
    ])
      .then(([salesData, expensesData ]) => {
        setSales(salesData);
        setExpenses(expensesData);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="bss-page-container">
      <div>
        <SalesContainer initialData={sales} userId={user.id} />
      </div>
      <div>
        <ExpensesContainer initialData={expenses} userId={user.id} />
      </div>
      <div>
        <RevenueContainer />
      </div>
    </section>
  ); 
}