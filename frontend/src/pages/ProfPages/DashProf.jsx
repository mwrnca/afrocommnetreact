import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, fetchSales, fetchExpenses } from "../../api";
import SalesContainer from './ProfComponents/SalesContainer';
import ExpensesContainer from './ProfComponents/ExpensesContainer';
import RevenueContainer from './ProfComponents/RevenueContainer';
import "./Dash.css";
import { FEATURES } from "../../featureFlags";
import ProfileViews from "../../components/HomeComponents/ProfileViews";

export default function DashProf() {
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