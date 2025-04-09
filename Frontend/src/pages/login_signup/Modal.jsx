import React, { useEffect } from "react";
import AuthForm from "./Register"; 

const Modal = ({ onClose, initialAction }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full max-h-[90vh] ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <AuthForm onClose={onClose} initialAction={initialAction} />
      </div>
    </div>
  );
};

export default Modal;
