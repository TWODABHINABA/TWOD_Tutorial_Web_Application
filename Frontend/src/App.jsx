import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'

// import Login from './pages/login_signup/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/login_signup/Register'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import UserInfo from './pages/Person/UserInfo'
import CourseTemplate from './pages/course/CourseTemplate'
import CategoryPage from './pages/course/CourseTemplate'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path='/register' element={<Register/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user" element={<UserInfo />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/courses/:courseId" element={<CourseTemplate />} />
      </Routes>
    </Router>
  )
}

export default App
