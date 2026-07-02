import { getUser } from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./HomeComponents.css"
import ProfileDetail from "./ProfileDetail";
import Logout from "./Logout";
import AvatarImage from "./AvatarImage";

export default function ProfileBar ( user) {

    const [ open, setOpen ] = useState(false);
    const navigate = useNavigate();
    const { first_name, email } = getUser();

    return (
        <>
        <div onClick={() => setOpen(true)} className="profilebar">
            <div className="details1">
                <div>
                    {/* <AvatarImage  src={user.profile_image} name={user.name || user.first_name} size={48} /> */}
                </div>
                <div>
                    <h2>{ first_name || "User"}</h2>
                    <small>{email || "Email not available"}</small>
                </div>
                </div>
                <div>
                    <Logout />
                </div>
        </div>
        {open && <ProfileDetail onClose={() => setOpen(false)} />}
            </>
    );
}