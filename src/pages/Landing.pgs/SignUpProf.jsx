import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../../components/Generalcomponents/Header'
import "./pages.css"

export default function SignUpProf() {

    const navigate = useNavigate()

  return (
    <section className="page-container">
      <Header />

      <section className="roles">
        <h2>Create Account</h2>
        <p>We employ a Role-based registration system to ensure your account is tailored to your needs and preferences.</p><br />
        <p>By selecting the appropriate role during registration, you will gain access to features and functionalities that are relevant to your specific role,</p><br />
        <p>this will help in enhancing your overall experience on our platform.</p>
      </section>

      <section className="signup-container">
          <div>
            <h1 id="myH1" style={{ margin: '20px' }}>SIGN UP</h1>
          </div>

          <div>
            <input id="name" type="text" placeholder="Full Name" required />
            <input id="email" type="email" placeholder="Email Address" required />
            <input id="phone" type="text" placeholder="Phone Number" required />
            <input id="bssName" type="text" placeholder="Name of Business" required />
            <input id="nature" type="text" placeholder="Nature of Business" required />
            <input id="location" type="text" placeholder="Location of Business" required />
            <input id="password" type="password" placeholder="Account Password" required />
            <input id="confPassword" type="password" placeholder="Confirm Password" required />
          </div>
          
          <div onClick={() => navigate('/dash/prof')} className="btn-green" style={{ margin: '20px', width: '80%' }}>
            <span>FINISH</span>
          </div>
          
      </section>

      <section id="fillAllFeilds" className="fill-all-feilds">
        <div className="feilds-card">
          <h1>PLEASE FILL IN ALL FEILDS.</h1>
        </div>
      </section>

      <section className="roles">
        <h3 style={{ color: 'rgb(243, 238, 238)' }}>you have selected Professional as the nature of your account if this is the intended nature of your account you may proceed if not click on the button bellow to direct you back to the home page</h3>
        <a onClick={() => navigate('/')} className="btn-green">HOME</a>
      </section>

      <footer className="hero">
        <p>© 2026 Afrocommnet™. All rights reserved.</p>
        <p>Afrocommnet, logo, and content are protected under copyright and trademark law.</p>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </section>
  )
}