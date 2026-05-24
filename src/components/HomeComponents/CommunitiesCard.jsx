import "./HomeComponents.css"

function CommunitiesCard () {
    return (
        <div className="communities-card">
            <div>
                <div>
                    <span className="notification-bubble"></span>
                    <span className="community-image"></span>
                </div>
                
                <div>
                     <span className="community-name"></span>
                     <small className="community-description"></small>
                </div>
               
            </div>

            <div>
                <span className="category-name"></span>
            </div>

            <div>
                <span className="members-count"></span>
            </div>

        </div>
    );
}

export default CommunitiesCard