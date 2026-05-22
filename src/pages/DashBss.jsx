import { useNavigate } from 'react-router-dom'
import "./Dash.css"

export default function DashBss() {
  const toggleMenu = () => {
    const popup = document.getElementById("popup")
    if (popup) popup.style.display = popup.style.display === "block" ? "none" : "block"
  }

  return (
    <>
      <div className="dashboard">

        {/* Sidebar */}
        <div className="sidebar">
          <button className="profile" onClick={toggleMenu}>
            ☰
          </button>

          <a href="buss.dash.html" className="nav-item">🏠</a>
          <a href="tools.html" className="nav-item">🛠️</a>
          <a href="messages.html" className="nav-item">💬</a>
          <a href="settings.html" className="nav-item">⚙️</a>
        </div>

        {/* Main Section */}
        <div className="main">

          {/* Topbar */}
          <div className="topbar">
            <div id="myH2">
              <h2>Home</h2>
            </div>

            <a href="profile.html">
              <img src="assets/profile.jpg" alt="profile" className="profile-pic" />
            </a>

            {/* Popup Menu */}
            <div className="popup-menu" id="popup">
              <p>Profile</p>
              <p>Settings</p>
              <p>Logout</p>
            </div>
          </div>

          <div className="container">
            <div className="card sales">
              <div className="card-header" id="salesSlot">
              </div>
            </div>

            <div className="card completed">
              <h3>Completed Orders</h3>
              <h2>21</h2>
            </div>

            <div className="card pending">
              <h3>Pending Orders</h3>
              <h2>5</h2>
            </div>

            <div className="card pending">
              <h3>Pending Orders</h3>
              <h2>5</h2>
            </div>

            <div className="card slaes-growth">
              <div className="card-header">
                <h2>sales growth</h2>
              </div>
              <select>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <h2>30%</h2>
            </div>

            <div className="card sales-target">
              <h3>SASLES TARGET</h3>
              <h2>5</h2>
            </div>
          </div>

          <div className="container">
            <div className="card expenses">
              <div className="card-header">
                <h2>expenses</h2>
              </div>
            </div>

            <div className="card completed">
              <h3>Completed expenses</h3>
              <h2>21</h2>
            </div>

            <div className="card pending">
              <h3>Pending expenses</h3>
              <h2>5</h2>
            </div>

            <div className="card completed">
              <h3>Completed expenses</h3>
              <h2>21</h2>
            </div>

            <div className="card revenue">
              <div className="card-header">
                <h2>expenses growth</h2>
              </div>
              <select>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <h2>30%</h2>
            </div>

            <div className="card pending">
              <h3>Pending expenses</h3>
              <h2>5</h2>
            </div>
          </div>

          <div className="container">
            <div className="card profit-loss">
              <div className="card-header">
                <h2>Profit/Loss</h2>
              </div>
            </div>

            <div className="card revenue">
              <div className="card-header">
                <h2>bussiness growth</h2>
              </div>
              <select>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <h2>30%</h2>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}