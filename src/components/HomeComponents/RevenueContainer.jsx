import "./Homecomponents.css"

export default function RevenueContainer () {
    return (
        <div class="container">

            <div class="card profit-loss">
              <div class="card-header">
                <h2>Profit/Loss</h2>
              </div>
            </div>

            <div class="card revenue">
              <div class="card-header">
                <h2>bussiness growth</h2>
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