// Components/Modals/RequestCallModal.js
import React, { useState } from 'react';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RequestCallModal = ({ open, handleClose, user }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // Logic to send request to backend
    console.log("Sending request to:", user._id, "Message:", message);
    handleClose();
  };

  return (
    <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
            style: { borderRadius: '16px', padding: '10px' }
        }}
    >
      <div className="relative p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Request a Call</h2>
            <IconButton onClick={handleClose} size="small">
                <CloseIcon />
            </IconButton>
        </div>

        {/* Mentor Mini Profile */}
        <div className="flex items-center gap-3 mb-6">
            <img 
                src={user?.image?.url || "/profile.png"} 
                alt="mentor" 
                className="w-12 h-12 rounded-full object-cover"
            />
            <div>
                <h3 className="font-bold text-gray-900">{user?.userName || "John Foley"}</h3>
                <p className="text-sm text-gray-500">Mentor</p>
            </div>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Text Area Input */}
        <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell them about your request
            </label>
            <textarea
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
                rows={5}
                placeholder="Describe what you'd like to discuss..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
                {message.length}/500 characters
            </div>
        </div>

        {/* Submit Button */}
        <button 
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors mt-4 shadow-lg shadow-blue-200"
        >
            <i className="fa fa-paper-plane mr-2"></i>
            Send Request
        </button>

      </div>
    </Dialog>
  );
};

export default RequestCallModal;