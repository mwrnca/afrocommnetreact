import "./Homecomponents.css"

export default function SalesContainer () {
    return (
         <div className="container">
            <div className="card-sales">
              <div className="card-header" id="salesSlot">
              </div>
            </div>

            <div className="card completed">
              <h3>Completed Orders</h3>
              <h2>21</h2>
            </div>

            <div className="card pending">
              <h3>Pending Orders</h3>
              <h2>5</h2>
            </div>

            <div className="card slaes-growth">
              <div className="card-header">
                <h2>sales growth</h2>
              </div>
              <select>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <h2>30%</h2>
            </div>

          </div>

    );
}