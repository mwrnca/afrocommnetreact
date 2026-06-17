import { logout } from "../../api";
import { useNavigate } from "react-router-dom";
import "./HomeComponents.css"

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="logout-bar" onClick={handleLogout}>
      Logout
    </div>  
    );
}