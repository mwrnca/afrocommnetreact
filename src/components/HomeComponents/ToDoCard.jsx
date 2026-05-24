import "./HomeComponents.css"

export default function ToDoCard () {
    return (
        <div className="card-container">
            <div>
                <div className="priority-tag">
                    <h1>TOP</h1>
                </div>

                <div className="task-title">
                    <h1>SOMETHING</h1>
                </div>
            </div>
            

            <div className="task-desc">
                <p>MCFUWIAEJN  </p>
            </div>

            <div className="task-checkbox">
                <select></select>
            </div>
            
        </div>
    );
}