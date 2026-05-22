import { useNavigate } from 'react-router-dom'
import "./Pages.css"

export default function SignUpProf() {

  const navigate = useNavigate()

  return (
    <>
      <header className="header">
        <div className="brand">
          <img src="ACN__1_-removebg-preview.png" className="logo" />
          <div className="brand-text">
            <h1><a href="index.html">.AFROCOMMNET.</a></h1>
          </div>
        </div>
      </header>

      <section className="roles">
        <h2>Create Account</h2>
        <div style={{ marginTop: '20px' }}>
          <p>We employ a Role-based registration system to ensure your account is tailored to your needs and preferences.</p><br />
          <p>By selecting the appropriate role during registration, you will gain access to features and functionalities that are relevant to your specific role,</p><br />
          <p>this will help in enhancing your overall experience on our platform.</p>
        </div>
      </section>

      <section className="container">
        <div className="input">
          <input id="name" type="text" placeholder="Full Name" required />
          <input id="email" type="email" placeholder="Email Address" required />
          <input id="phone" type="text" placeholder="Phone Number" required />
          <input id="title" type="text" placeholder="Professional Title" required />
          <input id="address" type="text" placeholder="Office Address" required />
          <input id="password" type="password" placeholder="Password" required />
          <input id="confPassword" type="password" placeholder="Confirm Password" required />
          <a className="btn-cont" onClick={() => navigate('/dash.prof')}>Sign Up</a>
        </div>
      </section>

      <section className="roles">
        <h3 style={{ color: 'rgb(243, 238, 238)' }}>you have selected professional as the nature of your account if this is the intended nature of your account you may proceed if not click on the button bellow to direct you back to the home page</h3>
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
    </>
  )
}