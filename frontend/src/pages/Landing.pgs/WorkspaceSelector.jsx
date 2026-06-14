import { useNavigate } from "react-router-dom";
import Header from "../../components/Generalcomponents/Header";
import "./pages.css";
import Footer from "../../components/Generalcomponents/Footer";

export default function WorkspaceSelector () {

    const navigate = useNavigate();

    return (
        <div className="page-container">
            <Header />
        <section className="roles">
        <h2>WELCOME TO THE LOGIN PAGE</h2>

        <div className="role-buttons">

          <div onClick={() => navigate('/login/bss')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>LOGIN</h2>
            <small>Bussiness Operators • Consumers • Institutions • Professionals • Employees • Employee Management</small>
          </div>

          {/* <div onClick={() => navigate('/login/inst')} className="role-btn">
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
            <h2>Employee Management</h2>
            <small>Business Owners and Managers</small>
          </div>

          <div onClick={() => navigate('/login/employee')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Employees</h2>
            <small>Employees of Businesses and Institutions</small>
          </div> */}

        </div>
      </section>

      <Footer />
        </div>
    );
}