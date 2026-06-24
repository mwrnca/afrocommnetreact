import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses } from "../../api";
import SalesContainer from "./InstComponents/SalesContainer";
import ExpensesContainer from "./InstComponents/ExpensesContainer";
import RevenueContainer from "./InstComponents/RevenueContainer";
import "./Dash.css"
import { FEATURES } from "../../featureFlags";
import ProfileViews from "../../components/HomeComponents/ProfileViews";

export default function DashInst() {
  const navigate = useNavigate();
  const [sales,    setSales]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue,  setRevenue]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const user = getUser
  const [refreshKey, setRefreshKey] = useState(0);   // ← added
  const [userId,     setUserId]     = useState(null); // ← added, fixes the user.id issue properly

  const triggerRefresh = () => setRefreshKey(prev => prev + 1); // ← added, call this after a sale/expense is logged

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
        {FEATURES.salesGraph && (
          <SalesContainer initialData={sales} userId={userId} refreshKey={refreshKey} />
        )}
      </div>
      <div>
        {FEATURES.expensesGraph && (
          <ExpensesContainer initialData={expenses} userId={userId} refreshKey={refreshKey} />
        )}
      </div>
      <div>
        {FEATURES.revenueGraph && (
          <RevenueContainer userId={userId} refreshKey={refreshKey} />
        )}
      </div>
      <ProfileViews />
    </section>
  ); 
}