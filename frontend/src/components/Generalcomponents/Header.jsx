import "./Generalcomponents.css";
import { useNavigate } from 'react-router-dom'

function Header() {

    const navigate = useNavigate()

  return (
    <header className="header">

          <div>
            <img src="assets/ACN__1_-removebg-preview.png" alt="Afrocommnet Logo" className="logo" />
          </div>
          
          <div className="brand-text">
              <span onClick={() => navigate('/')}>.AFROCOMMNET.</span>
              {/* <small>ONE</small> */}
          </div>

          <div>
            <a onClick={() => navigate('/workspaces')} className="btn-green">LOG IN</a>
          </div>

      </header>
    );
  }

export default Header;