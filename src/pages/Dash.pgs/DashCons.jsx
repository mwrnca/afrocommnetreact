import { useNavigate } from 'react-router-dom'
// import SalesContainer from '../../components/HomeComponents/SalesContainer'
// import ExpensesContainer from '../../components/HomeComponents/ExpensesContainer'
// import RevenueContainer from '../../components/HomeComponents/RevenueContainer'
import ConsHome from '../../components/HomeComponents/ConsHome'
import "./Dash.css"

export default function Dashcons() {
  const toggleMenu = () => {
    const popup = document.getElementById("popup")
    if (popup) popup.style.display = popup.style.display === "block" ? "none" : "block"
  }

  return (
    <section className="page-container">

      <div className='cons-home'>
        <ConsHome />
      </div>

      {/* <div className="sales-content">
        <SalesContainer />
      </div>

      <div className="sales-content">
        <ExpensesContainer />
      </div>

      <div className="sales-content">
        <RevenueContainer />
      </div> */}
    
      
    </section>
  )
}