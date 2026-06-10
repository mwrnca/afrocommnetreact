import "./Generalcomponents.css"

export default function Footer () {
    return (
        <footer className="footer">
            <p>© 2026 Afrocommnet™. All rights reserved.</p>
        <p>Afrocommnet, logo, and content are protected under copyright and trademark law.</p>
        <div className="footer-links">
          <a onClick={() => navigate('/terms')}>Terms</a>
          <a onClick={() => navigate('/privacy')}>Privacy</a>
          <a onClick={() => navigate('/contact')}>Contact</a>
        </div>
        </footer>
    )
}