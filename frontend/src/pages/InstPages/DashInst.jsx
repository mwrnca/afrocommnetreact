import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses } from "../../api";
import SalesContainer from "./InstComponents/SalesContainer";
import ExpensesContainer from "./InstComponents/ExpensesContainer";
import RevenueContainer from "./InstComponents/RevenueContainer";
import "./Dash.css"

export default function DashInst() {
  const navigate = useNavigate();
  const [sales,    setSales]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue,  setRevenue]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const user = getUser

  useEffect(() => {
    const { id, role } = getUser();
    if (!id)               { navigate("/login/inst"); return; }
    if (role !== "institution") { navigate("/");         return; }

    Promise.all([
      fetchSales(id,    "weekly"),
      fetchExpenses(id, "weekly"),
      // fetchRevenue(id,  "weekly"),
    ])
      .then(([salesData, expensesData ]) => {
        setSales(salesData);
        setExpenses(expensesData);
        // setRevenue(revenueData);
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