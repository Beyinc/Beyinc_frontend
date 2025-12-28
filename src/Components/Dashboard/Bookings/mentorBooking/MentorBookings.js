import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CalendarServices } from "../../../../Services/CalendarServices.js";
import dayjs from "dayjs";
import { AccessTime, CalendarMonth, Close } from "@mui/icons-material";

// --- Sub-Component: Request List Item (Left Side of Tab 2) ---
const IncomingRequestItem = ({ item, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative p-4 cursor-pointer transition-all duration-200 rounded-xl mb-3 border
      ${isSelected 
        ? "bg-white border-[#4f55c7] shadow-[0_0_0_1px_#4f55c7]" 
        : "bg-white border-transparent hover:border-gray-200 hover:shadow-md hover:translate-x-1"
      }`}
  >
    <div className="flex items-start gap-4">
      <img
        alt={item.userId?.userName || "User"}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-100"
        src={item.userId?.image?.url || "/profile.png"}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`font-bold text-base ${isSelected ? 'text-[#4f55c7]' : 'text-gray-900'}`}>
            {item.userId?.userName || "Unknown User"}
          </p>
          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${item.requestStatus ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {item.requestStatus ? "Approved" : "Pending"}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800 mb-1">{item.requestType}</p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.requestMessage}</p>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 font-medium">
             <span>{item.duration} mins</span>
             <span>•</span>
             <span>₹ {item.amount}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Component: Request Detail View (Right Side of Tab 2) ---
const RequestDetailView = ({ request, onApprove, onDelete }) => {
  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-10 min-h-[400px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#4f55c7]">
           <CalendarMonth sx={{ fontSize: 32 }} />
        </div>
        <p className="font-medium text-gray-500">Select a request to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 sticky top-6 shadow-sm">
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
           <img
            alt={request.userId?.userName}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            src={request.userId?.image?.url || "/profile.png"}
           />
           <div>
            <h3 className="text-xl font-bold text-gray-900">{request.userId?.userName}</h3>
            <p className="text-xs font-medium text-gray-500">{request.userId?.email}</p>
           </div>
        </div>
        <div className="text-right">
             <p className="text-2xl font-bold text-[#4f55c7]">₹ {request.amount || "Free"}</p>
             <p className="text-xs text-gray-400">Total Price</p>
        </div>
      </div>
      
      {/* Title */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Request Type</p>
        <p className="font-semibold text-gray-800 text-lg">{request.requestType}</p>
      </div>

      {/* Message */}
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#4f55c7]">
           <p className="text-sm text-gray-600 leading-relaxed italic">
           "{request.requestMessage}"
           </p>
        </div>
      </div>

      {/* Duration Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 mb-1">Duration</p>
             <p className="font-semibold text-gray-900 flex items-center gap-2">
                <AccessTime sx={{fontSize: 16, color: '#4f55c7'}}/> 
                {request.duration} mins
             </p>
        </div>
        <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 mb-1">Status</p>
             <p className={`font-semibold ${request.requestStatus ? 'text-green-600' : 'text-yellow-600'}`}>
                {request.requestStatus ? "Approved" : "Pending"}
             </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        {!request.requestStatus && (
            <button 
                onClick={onApprove}
                className="w-full px-6 py-3 bg-[#4f55c7] text-white font-semibold rounded-xl hover:bg-[#3e44a8] transition-all shadow-md shadow-[#4f55c7]/20 flex items-center justify-center gap-2"
            >
                Approve Request
            </button>
        )}
        
        {request.requestStatus && (
            <button 
                onClick={() => onDelete(request._id)}
                className="w-full px-4 py-3 border border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
            >
               Delete Request
            </button>
        )}
      </div>
    </div>
  );
};

// --- Sub-Component: Confirmed Booking Card (Tabs 0 & 1) ---
const BookingCard = ({ booking, onReschedule }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all mb-4">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Visual Decoration Pill */}
        <div className="hidden md:block w-1 h-20 bg-[#4f55c7] rounded-full flex-shrink-0 opacity-80"></div>
        
        {/* Date / Time */}
        <div className="w-24 flex-shrink-0">
             <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wider">
                {dayjs(booking.startDateTime).format("MMM D")}
             </p>
             <p className="font-bold text-gray-900 text-xl">
                {new Date(booking.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-4 flex-shrink-0 min-w-[200px]">
          <img 
            alt="User" 
            className="w-14 h-14 rounded-full object-cover border border-gray-200" 
            src={booking.userId?.image?.url || "/profile.png"} 
          />
          <div>
            <p className="font-bold text-gray-900">{booking.userId?.userName || "Unknown"}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.userId?.email || "No Email"}</p>
          </div>
        </div>

        {/* Session Details */}
        <div className="flex-1">
          <p className="font-bold text-gray-900 mb-1">{booking.title || "Session"}</p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <AccessTime sx={{ fontSize: 14 }} /> {booking.duration} mins | ₹ {booking.amount}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
          <button 
            onClick={() => onReschedule(booking)}
            // Changed this to SOLID style to fix the "color change" issue and make it visible
            className="px-6 py-2.5 bg-[#4f55c7] text-white font-semibold rounded-lg hover:bg-[#3e44a8] transition-colors shadow-md shadow-[#4f55c7]/20"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
);

const MentorBooking = () => {
  // --- Logic State (Preserved) ---
  const [tabValue, setTabValue] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  
  // Reschedule Dialog Logic
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState("");

  const {
    user_id,
    userName,
  } = useSelector((store) => store.auth.loginDetails);

  // --- Fetch Bookings Logic ---
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { mentorBookings } = await CalendarServices.mentorBookings({
          mentorId: user_id,
        });

        const filterByDate = (filterType) => {
          const now = new Date();
          return mentorBookings.filter((booking) => {
            const bookingDate = new Date(booking.startDateTime);
            if (filterType === "upcoming") {
              return bookingDate > now;
            } else if (filterType === "completed") {
              return bookingDate <= now;
            }
            return false;
          });
        };

        const upcoming = filterByDate("upcoming");
        const completed = filterByDate("completed");

        setUpcomingBookings(upcoming);
        setCompletedBookings(completed);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [user_id, userName]);

  // --- Fetch Requests Logic ---
  const [mentorBookingRequests, setMentorBookingRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);

  const fetchMentorRequests = async () => {
    try {
      let res = await CalendarServices.mentorBookingRequest();
      setMentorBookingRequests(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMentorRequests();
  }, []);

  // --- Action Handlers ---
  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRescheduleReason("");
  };

  const handleReschedule = async () => {
    await CalendarServices.mentorReschedule({
      id: selectedBooking._id,
      rescheduleReason,
      booleanValue: true,
    });
    handleCloseDialog();
    // Refresh logic could go here if needed
  };

  const handleApproveRequest = async () => {
    try {
      const res = await CalendarServices.updateRequestStatusByMentor({
        requestId: selectedReq._id
      });
      alert(res.message || "Request approved successfully!");
      fetchMentorRequests();
      // Optimistic update
      setSelectedReq(prev => ({...prev, requestStatus: true})); 
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request");
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      const res = await CalendarServices.deleteRequestByMentor({
        requestId: id
      });
      alert(res.message || "Request deleted successfully!");
      fetchMentorRequests();
      setSelectedReq(null); 
    } catch (err) {
      console.error("Error deleting request:", err);
      alert("Failed to delete request");
    }
  };

  // --- Main Render ---
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6 font-roboto">Mentor Bookings</h1>

        {/* Navigation Pills (Styled exactly like AllUsers.js) */}
        <div className="flex flex-wrap gap-3 mb-8">
            {[
                { label: "Upcoming", value: 0 },
                { label: "Completed", value: 1 },
                { label: "Requests", value: 2 }
            ].map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setTabValue(tab.value)}
                    className={`
                        px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                        ${tabValue === tab.value 
                        ? "bg-[#4f55c7] text-white border-[#4f55c7] shadow-lg shadow-[#4f55c7]/30" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#4f55c7]/50 hover:text-[#4f55c7] hover:bg-white"}
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* --- Tab Content --- */}
        
        {/* Tab 0: Upcoming */}
        {tabValue === 0 && (
            <div className="w-full animate-in fade-in duration-300">
                {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                        <BookingCard 
                            key={booking._id} 
                            booking={booking} 
                            onReschedule={handleOpenDialog} 
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                         <img src="/Search.gif" alt="Empty" className="w-24 opacity-60 mb-2"/>
                         <p className="text-gray-500 font-medium">No upcoming bookings found.</p>
                    </div>
                )}
            </div>
        )}

        {/* Tab 1: Completed */}
        {tabValue === 1 && (
             <div className="w-full animate-in fade-in duration-300">
                {completedBookings.length > 0 ? (
                    completedBookings.map((booking) => (
                        <BookingCard 
                            key={booking._id} 
                            booking={booking} 
                            onReschedule={handleOpenDialog} 
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                         <p className="text-gray-500 font-medium">No completed bookings found.</p>
                    </div>
                )}
            </div>
        )}

        {/* Tab 2: Requests (Split View) */}
        {tabValue === 2 && (
             <div className="flex flex-col lg:flex-row gap-6 relative items-start animate-in fade-in duration-300">
                {/* Left Panel: List */}
                <div className="w-full lg:w-5/12">
                   {mentorBookingRequests.length > 0 ? (
                       mentorBookingRequests.map((req) => (
                           <IncomingRequestItem 
                               key={req._id}
                               item={req}
                               isSelected={selectedReq?._id === req._id}
                               onClick={() => setSelectedReq(req)}
                           />
                       ))
                   ) : (
                       <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                            No requests found
                       </div>
                   )}
                </div>

                {/* Right Panel: Details */}
                <div className="hidden lg:block lg:w-7/12">
                    <RequestDetailView 
                        request={selectedReq} 
                        onApprove={handleApproveRequest}
                        onDelete={handleDeleteRequest}
                    />
                </div>
             </div>
        )}

        {/* Reschedule Modal (Tailwind Styled) */}
        {openDialog && (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in duration-200">
                    <button 
                        onClick={handleCloseDialog}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <Close />
                    </button>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Request Reschedule</h2>
                    
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Reason for Reschedule
                        </label>
                        <textarea 
                            className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#4f55c7]/20 focus:border-[#4f55c7] outline-none resize-none bg-gray-50"
                            rows="4"
                            placeholder="Please explain why you need to reschedule..."
                            value={rescheduleReason}
                            onChange={(e) => setRescheduleReason(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={handleCloseDialog}
                            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleReschedule}
                            className="px-5 py-2.5 bg-[#4f55c7] text-white font-semibold rounded-xl hover:bg-[#3e44a8] transition-colors shadow-lg shadow-[#4f55c7]/20"
                        >
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default MentorBooking;