import { useNavigate } from "react-router-dom";
import "./pages.css";

export default function WorkspaceSelector () {

    const navigate = useNavigate();

    return (
        <div className="page-container">
            <section className="roles">
        <h2>PLEASE SELECT AN ACCOUNT TYPE TO PROCEED:</h2>

        <div className="role-buttons">

          <div onClick={() => navigate('/login/bss')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Business Operator</h2>
            <small>Producers • Wholesalers • Retailers • Service Providers</small>
          </div>

          <div onClick={() => navigate('/login/inst')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Institution</h2>
            <small>Government • NGOs • Enterprises • Agencies</small>
          </div>

          <div onClick={() => navigate('/login/cons')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Consumer</h2>
            <small>Buyers • Sourcing • Marketplace Users</small>
          </div>

          <div onClick={() => navigate('/login/prof')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Professionals</h2>
            <small>Lawyers • Engineers • Doctors</small>
          </div>

          <div onClick={() => navigate('/login/mgmt')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>EMPLOYEE MANAGEMENT</h2>
            <small>Busiiness Owners and Managers</small>
          </div>

          <div onClick={() => navigate('/login/employee')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Employee</h2>
            <small>Employees of Bussinesses and Institutions</small>
          </div>

        </div>
      </section>
        </div>
    );
}