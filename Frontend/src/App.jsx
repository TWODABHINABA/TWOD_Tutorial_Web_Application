import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "../src/components/pages/Home";
// import Login from './pages/login_signup/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Register from '../src/components/login_signup/Register';
=======
import Register from './pages/login_signup/Register'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
>>>>>>> 6a115f04063c5da386039160130617b85725717a
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path='/register' element={<Register/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
