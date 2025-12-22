// Components/Bookings/BookingRequestCard.js
import React from 'react';
import { CalendarMonth, AccessTime } from '@mui/icons-material';

const BookingRequestCard = ({ booking }) => {
  // Helper to determine status style
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStyle = (isPaid) => {
     return isPaid 
        ? 'bg-blue-50 text-blue-600 border-blue-100' 
        : 'bg-gray-50 text-gray-500 border-gray-100';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-3">
            {/* Avatar could go here if needed, image shows just text though */}
            <div>
                 <h3 className="font-bold text-lg text-gray-900">{booking.topic || "Startup Mentorship"}</h3>
                 <p className="text-sm text-gray-600 font-medium">Mentor: <span className="text-gray-900">{booking.mentorName}</span></p>
            </div>
        </div>
        
        {/* Status Chips */}
        <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(booking.status)}`}>
                {booking.status === 'approved' && '✓'} {booking.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStyle(booking.isPaid)}`}>
                {booking.isPaid ? '✓ Paid' : 'Unpaid'}
            </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        {booking.description}
      </p>

      {/* Footer: Date, Time, Price */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
         <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
                <CalendarMonth fontSize="small" />
                <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-1">
                <AccessTime fontSize="small" />
                <span>{booking.duration} mins</span>
            </div>
         </div>
         <div className="font-bold text-blue-600 text-lg">
            ₹ {booking.price}
         </div>
      </div>
    </div>
  );
};

export default BookingRequestCard;