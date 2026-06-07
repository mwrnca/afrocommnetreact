import { Route, Routes } from 'react-router-dom'
import Layout from './components/Generalcomponents/Layout'
import Landing from './pages/Landing.pgs/Landing'
import About from './pages/Landing.pgs/About'
import CommunitiesLand from './pages/Landing.pgs/CommunitiesLand'
import EduLand from './pages/Landing.pgs/EduLand'
import ToolsLng from './pages/Landing.pgs/ToolsLng'
import WorkspaceSelector from './pages/Landing.pgs/WorkspaceSelector'
import LogInBss from './pages/Landing.pgs/LogInBss'
import LogInProf from './pages/Landing.pgs/LogInProf'
import LogInInst from './pages/Landing.pgs/LogInInst'
import LogInCons from './pages/Landing.pgs/LogInCons'
import SignUpBss from './pages/Landing.pgs/SignUpBss'
import SignUpProf from './pages/Landing.pgs/SignUpProf'
import SignUpInst from './pages/Landing.pgs/SignUpInst'
import SignUpCons from './pages/Landing.pgs/SignUpCons'
import Communities from './pages/Dash.pgs/Communities'
import Edu from './pages/Dash.pgs/Edu'
import Inbox from './pages/Dash.pgs/Inbox'
import Settings from './pages/Dash.pgs/Settings'
import ToDo from './pages/Dash.pgs/ToDo'
import Tools from './pages/Dash.pgs/Tools'
import DashBss from './pages/Dash.pgs/DashBss'
import DashEmpl from './pages/Dash.pgs/DashEmployee'
import DashProf from './pages/Dash.pgs/DashProf'
import DashInst from './pages/Dash.pgs/DashInst'
import DashCons from './pages/Dash.pgs/DashCons'
import LoginEmployee from './pages/Landing.pgs/LoginEmployee'
import DashEmployee from './pages/Dash.pgs/DashEmployee'
import DashEmplMgmt from './pages/Dash.pgs/DashEmplMgmt'


function App() {

  return (
    <section className='app-container'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/communitiesLand" element={<CommunitiesLand />} />
        <Route path="/toolsLand" element={<ToolsLng />} />
        <Route path="/eduLand" element={<EduLand />} />
        <Route path="/workspaces" element={<WorkspaceSelector />} />
        <Route path="/about" element={<About />} />
        <Route path="/login/bss" element={<LogInBss />} />
        <Route path="/login/prof" element={<LogInProf />} />
        <Route path="/login/inst" element={<LogInInst />} />
        <Route path="/login/cons" element={<LogInCons />} />
        <Route path="/login/employee" element={<LoginEmployee />} />
        <Route path="/signup/bss" element={<SignUpBss />} />
        <Route path="/signup/prof" element={<SignUpProf />} />
        <Route path="/signup/inst" element={<SignUpInst />} />
        <Route path="/signup/cons" element={<SignUpCons />} />
        <Route path="/dash/communities" element={<Layout><Communities /></Layout>} />
        <Route path="/dash/edu" element={<Layout><Edu /></Layout>} />
        <Route path="/dash/inbox" element={<Layout><Inbox /></Layout>} />
        <Route path="/dash/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/dash/todo" element={<Layout><ToDo /></Layout>} />
        <Route path="/dash/tools" element={<Layout><Tools /></Layout>} />
        <Route path="/dash/bss" element={<Layout><DashBss /></Layout>} />
        <Route path="/dash/prof" element={<Layout><DashProf /></Layout>} />
        <Route path="/dash/inst" element={<Layout><DashInst /></Layout>} />
        <Route path="/dash/cons" element={<Layout><DashCons /></Layout>} />
        <Route path="/dash/employee" element={<Layout><DashEmployee /></Layout>} />
        <Route path="/dash/empl-mgmt" element={<Layout><DashEmplMgmt /></Layout>} />
      </Routes>
    </section>
  )
}

export default App