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
import AddCourse from './pages/addCourse/AddCourse'
import Pricing from "./pages/Pricing/Pricing";
import AuthSuccess from './pages/AuthSuccess'
import SetPassword from './pages/login_signup/SetPassword'
import SetPasswordWrapper from './pages/login_signup/SetPasswordWrapper'
import SuccessPage from './pages/sucessPage/SuccessPage'
import CancelPage from './pages/cancelPage/CancelPage'
import AddTutor from './pages/addTutor/AddTutor'
import AddAvailability from './pages/addAvailibility/AddAvailability'
import SessionAdmin from './pages/sessionTiming/SessionAdmin'
import PurchasedCourse from './pages/purchasedCourse/PurchasedCourse'
import PrivacyPolicy from './pages/footerPages/PrivacyPoilcy'
import TermsAndConditions from './pages/footerPages/TermsAndConditions'
import ForgotPasswordFlow from './pages/login_signup/ForgotPasswordFlow'
import CourseSummary from './pages/course/CourseSummary'
import Dashboard from './pages/tutors/Dashboard'
import Controls from './pages/tutors/Controls'
import TutorAddCourse from './pages/tutors/TutorAddCourse'
import TutorAddAvailability from './pages/tutors/TutorAddAvailability'
import Requests from './pages/tutors/Requests'
import SetPasswordTutor from './pages/login_signup/SetPasswordTutor'
import TutorAddAssignment from './pages/tutors/TutorAddAssignment'
import Assignment from './pages/tutors/Assignment'
import SendAssignment from './pages/tutors/SendAssignment'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminControls from './pages/admin/AdminControls'
import AssignmentViewPage from './pages/Assignment/AssignmentViewPage'
import { CurrencyProvider } from './currencyConfig/CurrencyContext'

function App() {
  // const isAdmin=localStorage.getItem("role");
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path='/register' element={<Register/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/about/:tutorName" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user" element={<UserInfo />} />
          <Route path="/pricing" element={<Pricing/>}/>
          <Route path="/category/:categoryName" element={<CategoryCoursesPage />} />
          <Route path="/tutors/:tutorName" element={<About/>}/>
          {/* <Route path="/course/:courseName" element={<CourseDetailsPage />} /> */}
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/set-password" element={<SetPasswordWrapper />} />
          <Route path="/set-password-tutor" element={<SetPasswordTutor />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/add-tutor" element={<AddTutor />} />
          <Route path="/add-availability" element={<AddAvailability />} />
          <Route path="/add-session-time" element={<SessionAdmin />} />
          <Route path="/purchased-course" element={<PurchasedCourse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/forgot-password-page" element={<ForgotPasswordFlow/>} />
          <Route path="/course-summary" element={<CourseSummary/>}/>
          <Route path='/tutor-dashboard' element={<Dashboard/>}/>
          <Route path='/tutor-controls' element={<Controls/>}/>
          <Route path='/tutor-add-course' element={<TutorAddCourse/>}/>
          <Route path='/tutor-add-availability' element={<TutorAddAvailability/>}/>
          <Route path='/tutor-requests' element={<Requests/>}/>
          <Route path='/tutor-assignment' element={<Assignment/>}/>
          <Route path='/tutor-add-assignment' element={<TutorAddAssignment/>}/>  
          <Route path='/tutor-send-assignment' element={<SendAssignment/>}/>
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin-controls' element={<AdminControls/>}/>
          <Route path="/assignment-view/:id" element={<AssignmentViewPage />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  )
}

export default App
