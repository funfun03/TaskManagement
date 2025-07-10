import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center -mt-20 p-6">
      <div className="bg-white rounded-2xl shadow-strong p-12 max-w-md text-center hover-lift">
        <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl">🚫</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          You don't have permission to access this page. Please log in first to
          continue.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-gradient-secondary text-white rounded-xl hover:scale-[1.02] transition-all duration-200 shadow-medium font-semibold"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
