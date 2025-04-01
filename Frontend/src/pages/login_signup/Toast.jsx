import { useEffect, useState } from "react";

const Toast = ({ message, onClose }) => {
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    console.log("Toast mounted");

    setTimeout(() => {
      console.log("Tick should be visible now");
      setShowTick(true); 
    }, 200);

    const timer = setTimeout(() => {
      console.log("Closing Toast");
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-white px-6 py-4 rounded-xl shadow-2xl flex items-center 
                 gap-4 text-gray-900 text-lg font-semibold"
      style={{ zIndex: 1000 }}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute inset-0 bg-green-500 rounded-full"></div>

        {console.log("showTick in JSX:", showTick)}
        {showTick && (
          <svg
            className="absolute w-10 h-10"
            style={{ zIndex: 10 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l5 5L19 7" />
          </svg>
        )}
      </div>

      <span>{message}</span>
    </div>
  );
};

export default Toast;
