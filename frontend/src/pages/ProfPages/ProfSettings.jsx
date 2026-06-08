import { useNavigate } from 'react-router-dom'
import ProfileBar from '../../components/HomeComponents/ProfileBar'
import "./Dash.css"

export default function ProfSettings () {

    const navigate = useNavigate()

    return (
        <div>
            <ProfileBar />  

            <div className="settings-items">

                <div onclick={() => navigate("/")} >
                <h3>SWITCH WORKSPACE</h3>
                </div>

                <button onclick={() => navigate("/workspace")} >
                    SWITCH
                </button>

            </div>
        </div>
    );
}