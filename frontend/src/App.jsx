import { Route, Routes } from 'react-router-dom'
import Layout from './components/Generalcomponents/Layout'

// LANDING PAGES

import Landing from './pages/Landing.pgs/Landing'
import About from './pages/Landing.pgs/About'
import CommunitiesLand from './pages/Landing.pgs/CommunitiesLand'
import EduLand from './pages/Landing.pgs/EduLand'
import ToolsLng from './pages/Landing.pgs/ToolsLng'
import WorkspaceSelector from './pages/Landing.pgs/WorkspaceSelector'

// LOGIN PAGES
import LogInBss from './pages/Landing.pgs/LogInBss'
import LogInProf from './pages/Landing.pgs/LogInProf'
import LogInInst from './pages/Landing.pgs/LogInInst'
import LogInCons from './pages/Landing.pgs/LogInCons'
import LogInMgmt from './pages/Landing.pgs/LogInMgmt'
import LoginEmployee from './pages/Landing.pgs/LoginEmployee'

// SIGNUP PAGES
import SignUpBss from './pages/Landing.pgs/SignUpBss'
import SignUpProf from './pages/Landing.pgs/SignUpProf'
import SignUpInst from './pages/Landing.pgs/SignUpInst'
import SignUpCons from './pages/Landing.pgs/SignUpCons'
import SignUpMgmt from './pages/Landing.pgs/SignupMgmt'

// BSS PAGES
import DashBss from "./pages/BssPages/DashBss"
import BssSettings from './pages/BssPages/BssSettings'
import BssToDo from './pages/BssPages/BssToDo'
import BssCommunities from './pages/BssPages/BssCommunities'
import BssTools from './pages/BssPages/BssTools'
import BssInbox from './pages/BssPages/BssInbox'

// CONSUMER PAGES
import DashCons from './pages/ConsPages/DashCons'
import ConsSettings from './pages/ConsPages/ConsSettings'
import ConsInbox from './pages/ConsPages/ConsInbox'
import ConsCommunities from './pages/ConsPages/ConsCommunities'
import ConsToDo from './pages/ConsPages/ConsToDo'
import ConsTools from './pages/ConsPages/ConsTools'

// INSTITUTION PAGES
import DashInst from './pages/InstPages/DashInst'
import InstSettings from './pages/InstPages/InstSettings'
import InstToDo from './pages/InstPages/InstToDo'
import InstCommunities from './pages/InstPages/InstCommunities'
import InstTools from './pages/InstPages/instTools'
import InstInbox from './pages/InstPages/InstInbox'

// PROFESSIONAL PAGES
import DashProf from './pages/Profpages/DashProf'
import ProfSettings from './pages/ProfPages/ProfSettings'
import ProfToDo from './pages/ProfPages/ProfToDo'
import ProfCommunities from './pages/ProfPages/ProfCommunities'
import ProfTools from './pages/ProfPages/ProfTools'
import ProfInbox from './pages/ProfPages/ProfInbox'

// EMPLOYEE PAGES
import DashEmpl from './pages/EmplPages/DashEmpl'
import EmplSettings from './pages/EmplPages/EmplSettings'
import EmplToDo from './pages/EmplPages/EmplToDo'
import EmplCommunities from './pages/EmplPages/EmplCommunities'
import EmplInbox from './pages/EmplPages/EmplIinbox'
import EmplTools from './pages/EmplPages/EmplTools'

// EMPLOYEE MANAGEMENT PAGES
import DashMgmt from './pages/MgmtPages/DashMgmt'
import MgmtSettings from './pages/MgmtPages/MgmtSettings'
import MgmtToDo from './pages/MgmtPages/MgmtToDo'
import MgmtCommunities from './pages/MgmtPages/MgmtCommunities'
import MgmtTools from './pages/MgmtPages/MgmtTools'
import MgmtInbox from './pages/MgmtPages/MgmtInbox'

function App() {

  return (
    <section className='app-container'>
      <Routes>
        {/* LANDING PAGES */}
        <Route path="/" element={<Landing />} />
        <Route path="/communitiesLand" element={<CommunitiesLand />} />
        <Route path="/toolsLand" element={<ToolsLng />} />
        <Route path="/eduLand" element={<EduLand />} />
        <Route path="/workspaces" element={<WorkspaceSelector />} />
        <Route path="/about" element={<About />} />

        {/* AUTH PAGES */}
        <Route path="/login/bss" element={<LogInBss />} />
        <Route path="/login/prof" element={<LogInProf />} />
        <Route path="/login/inst" element={<LogInInst />} />
        <Route path="/login/cons" element={<LogInCons />} />
        <Route path="/login/mgmt" element={<LogInMgmt />} />
        <Route path="/login/employee" element={<LoginEmployee />} />

        {/* SIGNUP PAGES */}
        <Route path="/signup/bss" element={<SignUpBss />} />
        <Route path="/signup/prof" element={<SignUpProf />} />
        <Route path="/signup/inst" element={<SignUpInst />} />
        <Route path="/signup/cons" element={<SignUpCons />} />
        <Route path="/signup/mgmt" element={<SignUpMgmt />} />

        {/* Bussiness DASHBOARD PAGES */}
        <Route path="/dash/bss" element={<Layout />}>
          <Route index          element={<DashBss />} />
          <Route path="todo"        element={<BssToDo />} />
          <Route path="inbox"       element={<BssInbox />} />
          <Route path="tools"       element={<BssTools />} />
          <Route path="communities" element={<BssCommunities />} />
          <Route path="settings"    element={<BssSettings />} />
        </Route>

        {/* CONSUMER DASHBOARD PAGES */}
        <Route path="/dash/cons" element={<Layout />}>
          <Route index          element={<DashCons />} />
          <Route path="todo"        element={<ConsToDo />} />
          <Route path="tools"       element={<ConsTools />} />
          <Route path="inbox"       element={<ConsInbox />} />
          <Route path="communities" element={<ConsCommunities />} />
          <Route path="settings"    element={<ConsSettings />} />
        </Route>

        {/* ── Institution dashboard ── */}
        <Route path="/dash/inst" element={<Layout />}>
          <Route index             element={<DashInst />} />
          <Route path="tools"       element={<InstTools />} />
          <Route path="todo"        element={<InstToDo />} />
          <Route path="inbox"       element={<InstInbox />} />
          <Route path="communities" element={<InstCommunities />} />
          <Route path="settings"    element={<InstSettings />} />
        </Route>

        {/* ── Professional dashboard ── */}
        <Route path="/dash/prof" element={<Layout />}>
          <Route index             element={<DashProf />} />
          <Route path="todo"        element={<ProfToDo />} />
          <Route path="inbox"       element={<ProfInbox />} />
          <Route path="tools"       element={<ProfTools />} />
          <Route path="communities" element={<ProfCommunities />} />
          <Route path="settings"    element={<ProfSettings />} />
        </Route>

        {/* ── Employee dashboard ── */}
        <Route path="/dash/empl" element={<Layout />}>
          <Route index             element={<DashEmpl />} />
          <Route path="todo"       element={<EmplToDo />} />
          <Route path="communities" element={<EmplCommunities />} />
          <Route path="inbox"       element={<EmplInbox />} />
          <Route path="tools"       element={<EmplTools />} />
          <Route path="settings"    element={<EmplSettings />} />
        </Route>

        {/* ── Employee management dashboard ── */}
        <Route path="/dash/mgmt" element={<Layout />}>
          <Route index             element={<DashMgmt />} />
          <Route path="todo"       element={<MgmtToDo />} />
          <Route path="inbox"       element={<MgmtInbox />} />
          <Route path="tools"       element={<MgmtTools />} />
          <Route path="communities" element={<MgmtCommunities />} />
          <Route path="settings"    element={<MgmtSettings />} />
        </Route>

        </Routes>  
    </section>
  )
}

export default App