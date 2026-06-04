import { getUser } from "../../api";
import { useNavigate } from "react-router-dom";
import "./HomeComponents.css"

export default function ProfileBar () {

    const navigate = useNavigate();
    const { name, email } = getUser();

    return (
        <div className="settings-items">
                <div className="details1">
                    
                    <div>
                     <img src="https://via.placeholder.com/150" alt="User Avatar" className="avatar" />
                    </div>

                    <div>
                     <h2>{name || "User"}</h2>
                     <small>{email || "Email not available"}</small>
                    </div>
                </div>
                

                <div>
                    <a onclick={() => navigate("/profile")} className="edit-profile-link">
                        <span>Edit Profile</span>
                    </a>
                </div>
                
            </div>
    );
}