import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UseLogout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate=useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    navigate(0);
    navigate("/");
    setShowRegisterModal(true)
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
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated, handleLogout };
};
export default UseLogout;
