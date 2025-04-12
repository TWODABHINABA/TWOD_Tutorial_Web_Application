
import { useEffect, useState } from "react";

const Toast = ({ message, type, onClose }) => {
  const [showIcon, setShowIcon] = useState(false);
  const [currentType, setCurrentType] = useState(type); 
  
  useEffect(() => {
    console.log("Toast Mounted - Type:", type); 
    
    setCurrentType(type); 
    
    setTimeout(() => {
      setShowIcon(true);
    }, 200);
    
    const timer = setTimeout(() => {
      onClose();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [onClose, type]);
  
  const isSuccess = currentType === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const borderColor = isSuccess ? "border-green-500" : "border-red-500";
  
  return (
    <div
    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      bg-white px-6 py-4 rounded-xl shadow-2xl flex items-center 
      gap-4 text-gray-900 text-lg font-semibold border-2 ${borderColor}`}
      style={{ zIndex: 1000 }}
      >
      <div className="relative w-20 sm:w-16 h-16 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full animate-ping ${bgColor}`} />
        <div className={`absolute inset-0 rounded-full ${bgColor}`} />

        {showIcon && isSuccess && (
          <svg
          className="absolute w-10 h-10"
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
        {showIcon && !isSuccess && (
          <svg
          className="absolute w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          >
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        )}
      </div>

      <span>{message}</span>
    </div>
  );
};

export default Toast;

