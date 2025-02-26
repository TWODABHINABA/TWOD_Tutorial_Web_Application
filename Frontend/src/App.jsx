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
import CategoryCoursesPage from "./pages/course/CategoryCoursesPage";
import CourseDetailsPage from "./pages/course/CourseDetailsPage";
import { Resource } from './pages/resource/Resource'
import AddCourse from './pages/addCourse/AddCourse'
import Pricing from "./pages/Pricing/Pricing";
import AuthSuccess from './pages/AuthSuccess'
import SetPassword from './pages/login_signup/SetPassword'
import SetPasswordWrapper from './pages/login_signup/SetPasswordWrapper'
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
        <Route path="/resources" element={<Resource/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/category/:categoryName" element={<CategoryCoursesPage />} />
        {/* <Route path="/course/:courseName" element={<CourseDetailsPage />} /> */}
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/set-password" element={<SetPasswordWrapper />} />
        
      </Routes>
      
    </Router>
  )
}

export default App
