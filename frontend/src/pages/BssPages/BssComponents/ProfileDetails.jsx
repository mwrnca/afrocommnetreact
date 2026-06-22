import "./BussinessComponents.css"

export default function ProfileDetails () {
    return(
        <section className="profile-display-cont">
        <span>This is how people view your profile.</span>
        <section className="profile-display">
            <div className="profile-header">
                <div className="profile-header-info">
                    <img src="#" alt="profile picture goes here"/>
                    <div>
                        <span>mm</span>
                        <span>mm</span>
                    </div>
                </div>
                <div>
                    <button>
                        CONTACT
                    </button>
                </div>
            </div> 
            <div className="profile-body">
                <span className="profile-title"></span>
                <small className="category"></small>
                <div className="location-info">
                    {/* {user.location && <p>📍 {user.location}</p>}
                    {user.county   && <p>🗺 {user.county}</p>} */}
                </div>
                <div className="description">
                </div>
                <div>
                    <button>SAVE</button>
                    <button>EDIT</button>
                </div>
            </div>
        </section>
        </section>
    )
}