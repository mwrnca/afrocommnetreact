import { useNavigate } from 'react-router-dom'
import ProfileBar from '../../components/HomeComponents/ProfileBar'
import "./Dash.css"

export default function BssSettings () {

    const navigate = useNavigate()

    return (
        <div className="bss-settings-page-container">
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