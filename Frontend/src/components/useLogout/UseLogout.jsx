import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Modal from "../../pages/login_signup/Modal";

const UseLogout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate=useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    navigate("/");
    setShowLoginModal(true)
  };
  const handleLogoutRemoveAuthentication=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (!token) 
        return handleLogoutRemoveAuthentication();

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 

        if (decoded.exp < currentTime) {
          handleLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogoutRemoveAuthentication();
      }
    };

    // Check token on load and every minute
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 800);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated, handleLogout, modal:showLoginModal && (
    <Modal
      initialAction="Login"
      onClose={() => setShowLoginModal(false)}
    />
  ) };
};
export default UseLogout;
