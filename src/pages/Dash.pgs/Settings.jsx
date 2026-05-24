import { useNavigate } from 'react-router-dom'
import ProfileBar from '../../components/HomeComponents/ProfileBar'
import "./Dash.css"

export default function Settings () {

    const navigate = useNavigate()

    return (
        <div>
            <ProfileBar />  

            <div className="settings-items">

                <div onclick={() => navigate("/workspacea")} >
                <h3>SWITCH WORKSPACE</h3>
                </div>

                <div onclick={() => navigate("/workspacea")} >
                    <span>SWITCH</span>
                </div>

            </div>
        </div>
    );
}