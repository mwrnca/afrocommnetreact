import { useNavigate } from 'react-router-dom'
import Header from '../../components/Generalcomponents/Header';
import PublicChannel from './PublicChannel';
import './Pages.css';

function Landing() {

    const navigate = useNavigate()

  return (
    <section className="page-container">
      
      <Header />

      <section className="hero">
        <div className="hero-content">
          <h2>WELCOME!</h2>
          <h3>TO THE </h3>
          <h1>ALL IN</h1>
          <h1>ONE</h1>
          <h1>COMMUNITY</h1>
          {/* <h1>ONE</h1>
          <h3>COMMUNITY IN KENYA</h3>
          <h3>WHERE ALL CAN FIND WHATEVER</h3>
          <h3>SERVICE OR GOODS THEY</h3>
          <h3>ARE IN SEARCH FOR</h3> */}

          <a onClick={() => navigate('/about')} className="btn-green">WHO WE ARE</a>
        </div>
      </section>

      {/* <nav className="vertical-nav">
        <a onClick={() => navigate('/communitiesLand')}>Communities</a>
        <a onClick={() => navigate('/eduLand')}>Education</a>
        <a onClick={() => navigate('/toolsLand')}>Tools</a>
      </nav> */}

      <section className="roles">
        <h2>ARE YOU A:</h2>

        <div className="role-buttons">

          <a onClick={() => navigate('/signup/bss')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Business Operator</h2>
            <small>Producers • Wholesalers • Retailers • Service Providers</small>
          </a>

          <a onClick={() => navigate('/signup/inst')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Institution</h2>
            <small>Government • NGOs • Enterprises • Agencies</small>
          </a>

          <a onClick={() => navigate('/signup/cons')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Consumer</h2>
            <small>Buyers • Sourcing • Marketplace Users</small>
          </a>

          <a onClick={() => navigate('/signup/prof')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Professionals</h2>
            <small>Lawyers • Engineers • Doctors</small>
          </a>

         {/* <a onClick={() => navigate('/signup/mgmt')} className="role-btn">
            <span className="icon">⬢</span>
            <h2>Employee Management</h2>
            <small>Business Owners and Managers</small>
          </a> */}

        </div>
      </section>

      {/* <section className="hero">
        <div>
          <h4>A platform for people to manage risk and resources as well as grow capital and expertise in their areas of involvement allowing us to grow.</h4>
        </div>
      </section>

      <div className="investors">
          <PublicChannel/>
      </div> */}

      {/* <section className="investors">
        <h2 style={{ color: 'black' }}>credits</h2>
      </section>

      <section className="public-chat">
        <div className="investors">
          <h2>Public Lobby</h2>
        </div>

        <div className="chat-window" id="chatWindow">
        </div>
      </section>

      <div className="investors">
        <h2>"please note that to gain full access to the public chat you must be an account holder"</h2>
      </div> */}

      <footer className="hero">
        <p>© 2026 Afrocommnet™. All rights reserved.</p>
        <p>Afrocommnet, logo, and content are protected under copyright and trademark law.</p>
        <div className="footer-links">
          <a onClick={() => navigate('/terms')}>Terms</a>
          <a onClick={() => navigate('/privacy')}>Privacy</a>
          <a onClick={() => navigate('/contact')}>Contact</a>
        </div>
      </footer>
    </section>
  )
}

export default Landing
