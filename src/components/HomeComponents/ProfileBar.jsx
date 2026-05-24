import "./HomeComponents.css"

export default function ProfileBar () {
    return (
        <div className="settings-items">
                <div className="details1">
                    
                    <div>
                     <img src="https://via.placeholder.com/150" alt="User Avatar" className="avatar" />
                    </div>

                    <div>
                     <h2>John Doe</h2>
                     <small>Email: john.doe@example.com</small>
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