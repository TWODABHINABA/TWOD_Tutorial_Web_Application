import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Explore from "./explore/Explore";
import ChatBot from "./chatBot/ChatBot";
import Toast from "./login_signup/Toast";
const [googleToast, setGoogleToast] = useState(null);
const Home = () => {
  useEffect(() => {
    if (googleToast) {
      const timer = setTimeout(() => setGoogleToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [googleToast]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      setGoogleToast({ message: error, type: "error" });

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);
  return (
    <div>
      {googleToast && (
        <Toast
          message={googleToast.message}
          type={googleToast.type}
          onClose={() => setGoogleToast(null)}
        />
      )}
      <Explore />
      <ChatBot />
    </div>
  );
};

export default Home;
