import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate, } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'  
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(!user){
        navigate("/");
      }
    })

    return () => unsubscribe();
  }, [navigate]);

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
