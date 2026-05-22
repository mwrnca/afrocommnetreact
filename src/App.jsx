import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import SignUpBss from './pages/SignUpBss'
import SignUpProf from './pages/SignUpProf'
import SignUpInst from './pages/SignUpInst'
import SignUpCons from './pages/SignUpCons'
import DashBss from './pages/DashBss'
import DashProf from './pages/DashProf'
import DashInst from './pages/DashInst'
import DashCons from './pages/DashCons'

function App() {

  return (
    <section className='app-container'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup.bss" element={<SignUpBss />} />
        <Route path="/signup.prof" element={<SignUpProf />} />
        <Route path="/signup.inst" element={<SignUpInst />} />
        <Route path="/signup.cons" element={<SignUpCons />} />
        <Route path="/dash.bss" element={<DashBss />} />
        <Route path="/dash.prof" element={<DashProf />} />
        <Route path="/dash.inst" element={<DashInst />} />
        <Route path="/dash.cons" element={<DashCons />} />
      </Routes>
    </section>
  )
}

export default App