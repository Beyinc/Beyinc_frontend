import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuestNoticeModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
        
        {/* Header / Icon */}
        <div className="text-center mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Join the Conversation!</h3>
          <p className="text-sm text-gray-500 mt-2">
            You are currently viewing Bloomr as a guest. Log in to like posts, follow creators, and connect with others.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-6">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
          >
            Log In / Sign Up
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
          >
            Just Browse
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestNoticeModal;