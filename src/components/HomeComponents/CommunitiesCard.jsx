import "./HomeComponents.css"

function CommunitiesCard () {
    return (
        <div className="card-container">
            <div>
                <div>
                    <span className="notification-bubble">m</span>
                    <span className="community-image">m</span>
                </div>
                
                <div>
                     <span className="community-name">m</span>
                     <small className="community-description">m</small>
                </div>
               
            </div>

            <div>
                <span className="category-name">m</span>
            </div>

            <div>
                <span className="members-count">m</span>
            </div>

        </div>
    );
}

export default CommunitiesCard