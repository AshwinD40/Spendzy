import './App.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'  


function App() {

  return (
  <>
    <Toaster position='top-center' reverseOrder={false}/>
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </>
  )
}

export default App
