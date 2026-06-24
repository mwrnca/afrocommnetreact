import { useNavigate } from 'react-router-dom'
import ProfileBar from '../../components/HomeComponents/ProfileBar'
import Logout from '../../components/HomeComponents/Logout'
import "./Dash.css"
import ProfileAppearance  from "./ConsComponents/ProfileAppearance"

export default function ConsSettings () {

    const navigate = useNavigate()

    return (
        <div className="bss-settings-page-container">
            <div>
                <ProfileBar />  
            </div>
            <div>
                <ProfileAppearance />
            </div>
        </div>
    );
}