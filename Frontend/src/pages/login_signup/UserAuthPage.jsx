import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetPassword from "./SetPassword";

const UserAuthPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isGoogleLogin = urlParams.get("googleLogin"); 
    if (isGoogleLogin) {
      setIsModalOpen(true); 
    }
  }, []);

  return (
    <div>
      {isModalOpen && <SetPassword isOpen={isModalOpen} onClose={() => navigate("/")} />}
    </div>
  );
};

export default UserAuthPage;