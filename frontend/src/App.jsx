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
import LogIn from './pages/Landing.pgs/LogIn'

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

import { FEATURES } from "./featureFlags";

// shows a friendly placeholder instead of the real page when a flag is off
function FeatureGate({ enabled, children }) {
  if (!enabled) {
    return <div className="feature-disabled">This feature isn't available yet.</div>;
  }
  return children;
}

function App() {
  return (
    <section className='app-container'>
      <Routes>
        {/* LANDING PAGES — always on, never gated */}
        <Route path="/" element={<Landing />} />
        <Route path="/communitiesLand" element={<CommunitiesLand />} />
        <Route path="/toolsLand" element={<ToolsLng />} />
        <Route path="/eduLand" element={<EduLand />} />
        <Route path="/workspaces" element={<WorkspaceSelector />} />
        <Route path="/about" element={<About />} />

        {/* AUTH PAGES — always on */}
        <Route path="/login" element={<LogIn />} />

        {/* SIGNUP PAGES — always on */}
        <Route path="/signup/bss" element={<SignUpBss />} />
        <Route path="/signup/prof" element={<SignUpProf />} />
        <Route path="/signup/inst" element={<SignUpInst />} />
        <Route path="/signup/cons" element={<SignUpCons />} />
        <Route path="/signup/mgmt" element={<SignUpMgmt />} />

        {/* Business DASHBOARD PAGES */}
        <Route path="/dash/bss" element={<Layout />}>
          <Route index element={<DashBss />} />
          <Route path="todo" element={
            <FeatureGate enabled={FEATURES.todo}><BssToDo /></FeatureGate>
          } />
          <Route path="inbox" element={
            <FeatureGate enabled={FEATURES.inbox}><BssInbox /></FeatureGate>
          } />
          <Route path="tools" element={
            <FeatureGate enabled={FEATURES.tools}><BssTools /></FeatureGate>
          } />
          <Route path="communities" element={
            <FeatureGate enabled={FEATURES.communities}><BssCommunities /></FeatureGate>
          } />
          <Route path="settings" element={
            <FeatureGate enabled={FEATURES.settings}><BssSettings /></FeatureGate>
          } />
        </Route>

        {/* CONSUMER DASHBOARD PAGES */}
        <Route path="/dash/cons" element={<Layout />}>
          <Route index element={<DashCons />} />
          <Route path="todo" element={
            <FeatureGate enabled={FEATURES.todo}><ConsToDo /></FeatureGate>
          } />
          <Route path="tools" element={
            <FeatureGate enabled={FEATURES.tools}><ConsTools /></FeatureGate>
          } />
          <Route path="inbox" element={
            <FeatureGate enabled={FEATURES.inbox}><ConsInbox /></FeatureGate>
          } />
          <Route path="communities" element={
            <FeatureGate enabled={FEATURES.communities}><ConsCommunities /></FeatureGate>
          } />
          <Route path="settings" element={
            <FeatureGate enabled={FEATURES.settings}><ConsSettings /></FeatureGate>
          } />
        </Route>

        {/* ── Institution dashboard ── */}
        <Route path="/dash/inst" element={<Layout />}>
          <Route index element={<DashInst />} />
          <Route path="tools" element={
            <FeatureGate enabled={FEATURES.tools}><InstTools /></FeatureGate>
          } />
          <Route path="todo" element={
            <FeatureGate enabled={FEATURES.todo}><InstToDo /></FeatureGate>
          } />
          <Route path="inbox" element={
            <FeatureGate enabled={FEATURES.inbox}><InstInbox /></FeatureGate>
          } />
          <Route path="communities" element={
            <FeatureGate enabled={FEATURES.communities}><InstCommunities /></FeatureGate>
          } />
          <Route path="settings" element={
            <FeatureGate enabled={FEATURES.settings}><InstSettings /></FeatureGate>
          } />
        </Route>

        {/* ── Professional dashboard ── */}
        <Route path="/dash/prof" element={<Layout />}>
          <Route index element={<DashProf />} />
          <Route path="todo" element={
            <FeatureGate enabled={FEATURES.todo}><ProfToDo /></FeatureGate>
          } />
          <Route path="inbox" element={
            <FeatureGate enabled={FEATURES.inbox}><ProfInbox /></FeatureGate>
          } />
          <Route path="tools" element={
            <FeatureGate enabled={FEATURES.tools}><ProfTools /></FeatureGate>
          } />
          <Route path="communities" element={
            <FeatureGate enabled={FEATURES.communities}><ProfCommunities /></FeatureGate>
          } />
          <Route path="settings" element={
            <FeatureGate enabled={FEATURES.settings}><ProfSettings /></FeatureGate>
          } />
        </Route>

        {/* ── Employee dashboard ── */}
        <Route path="/dash/empl" element={<Layout />}>
          <Route index element={
            <FeatureGate enabled={FEATURES.employeeApp}><DashEmpl /></FeatureGate>
          } />
          <Route path="todo" element={
            <FeatureGate enabled={FEATURES.employeeApp}><EmplToDo /></FeatureGate>
          } />
          <Route path="communities" element={
            <FeatureGate enabled={FEATURES.employeeApp && FEATURES.communities}><EmplCommunities /></FeatureGate>
          } />
          <Route path="inbox" element={
            <FeatureGate enabled={FEATURES.employeeApp && FEATURES.inbox}><EmplInbox /></FeatureGate>
          } />
          <Route path="tools" element={
            <FeatureGate enabled={FEATURES.employeeApp && FEATURES.tools}><EmplTools /></FeatureGate>
          } />
          <Route path="settings" element={
            <FeatureGate enabled={FEATURES.employeeApp && FEATURES.settings}><EmplSettings /></FeatureGate>
          } />
        </Route>

        {/* ── Employee management dashboard ── */}
        <Route path="/dash/mgmt" element={<Layout />}>
          <Route index element={
            <FeatureGate enabled={FEATURES.employeeMgmt}><DashMgmt /></FeatureGate>
          } />
          <Route path="tasks" element={
            <FeatureGate enabled={FEATURES.employeeMgmt}><MgmtToDo /></FeatureGate>
          } />
          <Route path="inbox" element={
            <FeatureGate enabled={FEATURES.employeeMgmt && FEATURES.inbox}><MgmtInbox /></FeatureGate>
          } />
          <Route path="tools" element={
            <FeatureGate enabled={FEATURES.employeeMgmt && FEATURES.tools}><MgmtTools /></FeatureGate>
          } />
          <Route path="communities" element={
            <FeatureGate enabled={FEATURES.employeeMgmt && FEATURES.communities}><MgmtCommunities /></FeatureGate>
          } />
          <Route path="settings" element={
            <FeatureGate enabled={FEATURES.employeeMgmt && FEATURES.settings}><MgmtSettings /></FeatureGate>
          } />
        </Route>

      </Routes>
    </section>
  )
}

export default App