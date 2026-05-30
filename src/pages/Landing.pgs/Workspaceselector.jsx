import "./pages.css";

export default function WorkspaceSelector () {
    return (
        <div className="page-container">
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

        </div>
      </section>
        </div>
    );
}