import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses } from "../../api";
import ProfileViews from "../../components/HomeComponents/ProfileViews";
import SalesContainer from './BssComponents/SalesContainer';
import ExpensesContainer from './BssComponents/ExpensesContainer';
import RevenueContainer from './BssComponents/RevenueContainer';
import "./Dash.css";
import { FEATURES } from "../../featureFlags";

export default function DashBss() {
  const navigate = useNavigate();
  const [sales,      setSales]      = useState([]);
  const [expenses,   setExpenses]   = useState([]);
  const [revenue,    setRevenue]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);   // ← added
  const [userId,     setUserId]     = useState(null); // ← added, fixes the user.id issue properly

  const triggerRefresh = () => setRefreshKey(prev => prev + 1); // ← added, call this after a sale/expense is logged

  useEffect(() => {
    const { id, role } = getUser();
    if (!id)                 { navigate("/login/bss"); return; }
    if (role !== "business") { navigate("/");           return; }

    setUserId(id); // ← store the real id once we know we're logged in

    Promise.all([
      fetchSales(id,    "weekly"),
      fetchExpenses(id, "weekly"),
    ])
      .then(([salesData, expensesData]) => {
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