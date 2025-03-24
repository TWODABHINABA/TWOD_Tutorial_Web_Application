import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UseLogout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate=useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // window.location.reload();
    navigate("/");
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (!token) return handleLogout();

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decoded.exp < currentTime) {
          handleLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
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
