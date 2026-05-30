import { useNavigate } from 'react-router-dom'
import SalesContainer from '../../components/HomeComponents/SalesContainer'
import ExpensesContainer from '../../components/HomeComponents/ExpensesContainer'
import RevenueContainer from '../../components/HomeComponents/RevenueContainer'
import "./Dash.css"

export default function DashInst() {
  const toggleMenu = () => {
    const popup = document.getElementById("popup")
    if (popup) popup.style.display = popup.style.display === "block" ? "none" : "block"
  }

  return (
    <section className="page-container">

      <div className="sales-content">
        <SalesContainer />
      </div>

      <div className="sales-content">
        <ExpensesContainer />
      </div>

      <div className="sales-content">
        <RevenueContainer />
      </div>
    
      
    </section>
  )
}