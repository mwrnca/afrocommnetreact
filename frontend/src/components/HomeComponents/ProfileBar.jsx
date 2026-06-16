import { getUser } from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./HomeComponents.css"
import ProfileDetail from "./ProfileDetail";

export default function ProfileBar () {

    const [ open, setOpen ] = useState(false);
    const navigate = useNavigate();
    const { first_name, email } = getUser();

    return (
        <>
        <div className="profilebar">
            <div className="details1">
                <div>
                    <img src="https://via.placeholder.com/150" alt="User Avatar" className="avatar" />
                </div>
                <div>
                <h2>{ first_name || "User"}</h2>
                    <small>{email || "Email not available"}</small>
                </div>
                </div>
                <div>
                    <a onclick={() => navigate("/profile")} className="edit-profile-link">
                        <span>Edit Profile</span>
                    </a>
                </div>
        </div>
        
        {open && <ProfileDetail task={task} onClose={() => setOpen(false)} />}
            </>
    );
}