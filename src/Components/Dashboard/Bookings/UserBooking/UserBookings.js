import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import { CalendarServices } from "../../../../Services/CalendarServices";
import FeedbackModal from "./FeedbackPop.js";
import BookSession from "../../../Editprofile/BookSession/BookSession2";
import dayjs from "dayjs";
import { AccessTime, VideoCameraFront, MoreVert } from "@mui/icons-material";

// --- Sub-Component: User Booking Card ---
const UserBookingCard = ({ booking, type, onJoin, onMenuOpen, onFeedback }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 hover:shadow-lg transition-all duration-200">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      
      {/* Visual Indicator */}
      <div className="hidden md:block w-1 h-24 bg-[#4f55c7] rounded-full flex-shrink-0 opacity-80"></div>

      {/* Date & Time */}
      <div className="w-32 flex-shrink-0">
        <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wider">
           {dayjs(booking.startDateTime).format("MMM D, YYYY")}
        </p>
        <p className="font-bold text-gray-900 text-xl">
           {new Date(booking.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Mentor Info */}
      <div className="flex items-center gap-4 flex-shrink-0 min-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#4f55c7] font-bold text-xl border border-gray-200">
            {booking.mentorId?.userName?.charAt(0) || "M"}
        </div>
        <div>
          <p className="font-bold text-gray-900">{booking.mentorId?.userName || "Unknown Mentor"}</p>
          <p className="text-xs text-gray-500 truncate max-w-[150px]">
            {booking.mentorId?.email || "No Email"}
          </p>
        </div>
      </div>

      {/* Session Details */}
      <div className="flex-1">
        <p className="font-bold text-gray-900 mb-1">{booking.title || "Session"}</p>
        <div className="flex items-center gap-3 text-sm text-gray-600">
             <span className="flex items-center gap-1"><AccessTime fontSize="small"/> {booking.duration} mins</span>
             <span>|</span>
             <span className="font-semibold text-[#4f55c7]">₹ {booking.amount}</span>
        </div>
        {type === "rescheduled" && (
            <p className="text-xs text-orange-600 mt-2 font-medium">
                Reason: {booking.mentorReschedule[1] || "No reason provided"}
            </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
        {type !== "completed" ? (
             <>
                {/* Join Button: Explicit White Text */}
                <button 
                    onClick={() => onJoin(booking.meetLink)}
                    className="px-4 py-2 bg-[#4f55c7] text-white font-semibold rounded-lg hover:bg-[#3e44a8] transition-colors shadow-md shadow-[#4f55c7]/20 flex items-center gap-2"
                >
                    <VideoCameraFront fontSize="small" /> Join
                </button>
                <button 
                    onClick={(e) => onMenuOpen(e, booking)}
                    className="p-2 bg-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <MoreVert />
                </button>
             </>
        ) : (
             /* Feedback Button: Explicit White Background to prevent transparency issues */
             <button 
                onClick={() => onFeedback(booking, "feedback")}
                className="px-4 py-2 bg-white border border-[#4f55c7] text-[#4f55c7] font-semibold rounded-lg hover:bg-[#4f55c7]/5 transition-colors"
             >
                Give Feedback
             </button>
        )}
      </div>

    </div>
  </div>
);

// --- Sub-Component: Request List Item ---
const RequestListItem = ({ req, isSelected, onSelect }) => (
    <div
      onClick={() => onSelect(req)}
      className={`relative p-4 cursor-pointer transition-all duration-200 rounded-xl mb-3 border
        ${isSelected 
          ? "bg-white border-[#4f55c7] shadow-[0_0_0_1px_#4f55c7]" 
          : "bg-white border-transparent hover:border-gray-200 hover:shadow-md hover:translate-x-1"
        }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
            {req.mentorId?.userName?.charAt(0) || "M"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={`font-bold text-sm ${isSelected ? 'text-[#4f55c7]' : 'text-gray-900'}`}>
              {req.mentorId?.userName}
            </p>
            <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${req.requestStatus ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {req.requestStatus ? "Approved" : "Pending"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2 truncate">{req.mentorId?.email}</p>
          <p className="text-sm text-gray-800 line-clamp-2 bg-gray-50 p-2 rounded-md italic border border-gray-100">
             "{req.requestMessage}"
          </p>
        </div>
      </div>
    </div>
);

const UserBooking = () => {
  // --- Logic State ---
  const [tabValue, setTabValue] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [rescheduledBookings, setRescheduledBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionType, setActionType] = useState("");
  const [bookingType, setBookingType] = useState("1:1");
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [userBookingRequest, setUserBookingRequest] = useState([]);
  const [showBookSession, setShowBookSession] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  // --- Effects ---
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Fetching user bookings...");
        const { userBookings } = await CalendarServices.userBookings();
        console.log("User Bookings:", userBookings);

        const now = new Date();

        const upcomingBookings = userBookings.filter(
          (booking) =>
            new Date(booking.startDateTime) > now &&
            booking.status === "upcoming"
        );

        const completedBookings = userBookings.filter(
          (booking) =>
            new Date(booking.startDateTime) <= now &&
            booking.status === "completed"
        );

        const rescheduledBookings = userBookings.filter(
          (booking) => booking.mentorReschedule[0] === true
        );

        setUpcomingBookings(upcomingBookings);
        // Note: Preserving your original logic where you set completed = upcoming
        // If this is a bug in logic, please change 'upcomingBookings' to 'completedBookings' below
        setCompletedBookings(upcomingBookings); 
        setRescheduledBookings(rescheduledBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        let res = await CalendarServices.userBookingRequest();
        setUserBookingRequest(res.pendingRequests);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserRequests();
  }, []);

  // --- Handlers ---
  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
    setAnchorEl(null);

    if (type === "reschedule") {
      setOpenRescheduleDialog(true);
    } else if (type === "cancel") {
      setOpenCancelDialog(true);
    }
  };

  const handleCloseDialog = (type) => {
    if (type === "reschedule") {
      setOpenRescheduleDialog(false);
    } else if (type === "cancel") {
      setOpenCancelDialog(false);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await CalendarServices.cancelBooking({
        selectedBooking,
      });

      if (response.status === 200) {
        setOpenDialog(false);
        alert("Booking has been successfully canceled.");
        handleCloseDialog("cancel");
      }
    } catch (error) {
      alert("Failed to cancel the booking. Please try again.");
    }
  };

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTestimonial = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
    setOpenFeedbackDialog(true);
  };

  const handleJoinCall = (url) => {
    window.open(url, "_blank");
  };

  const handleContinueBooking = (req) => {
    setShowBookSession(true);
    setSelectedReq(req);
  };

  const openMenu = Boolean(anchorEl);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6 font-roboto">User Bookings</h1>

        {/* 1:1 vs Webinar Tabs (Updated with Explicit BG Colors) */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-200 rounded-lg w-fit">
            {["1:1", "webinar"].map((type) => (
                <button
                    key={type}
                    onClick={() => setBookingType(type)}
                    className={`px-6 py-1.5 rounded-md text-sm font-semibold transition-all ${
                        bookingType === type 
                        ? "bg-white text-[#4f55c7] shadow-sm"  // Active: Explicit White BG
                        : "bg-transparent text-gray-500 hover:text-gray-700" // Inactive: Transparent BG
                    }`}
                >
                    {type === "1:1" ? "1:1 Sessions" : "Webinar"}
                </button>
            ))}
        </div>

        {/* Main Tabs (Pill Style) */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
            {[
                { label: "Upcoming", value: 0 },
                { label: "Completed", value: 1 },
                { label: "Rescheduled", value: 2 },
                { label: "Requests", value: 3 }
            ].map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
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

        {/* --- Content Areas --- */}

        {/* Tab 0: Upcoming */}
        {tabValue === 0 && (
            <div className="w-full animate-in fade-in duration-300">
                {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                        <UserBookingCard 
                            key={booking._id}
                            booking={booking}
                            type="upcoming"
                            onJoin={handleJoinCall}
                            onMenuOpen={handleMenuClick}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No upcoming bookings.</p>
                    </div>
                )}
            </div>
        )}

        {/* Tab 1: Completed */}
        {tabValue === 1 && (
            <div className="w-full animate-in fade-in duration-300">
                {completedBookings.length > 0 ? (
                    completedBookings.map((booking) => (
                        <UserBookingCard 
                            key={booking._id}
                            booking={booking}
                            type="completed"
                            onFeedback={handleTestimonial}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No completed bookings.</p>
                    </div>
                )}
            </div>
        )}

        {/* Tab 2: Rescheduled */}
        {tabValue === 2 && (
            <div className="w-full animate-in fade-in duration-300">
                {rescheduledBookings.length > 0 ? (
                    rescheduledBookings.map((booking) => (
                        <UserBookingCard 
                            key={booking._id}
                            booking={booking}
                            type="rescheduled"
                            onJoin={handleJoinCall}
                            onMenuOpen={handleMenuClick}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No rescheduled bookings.</p>
                    </div>
                )}
            </div>
        )}

        {/* Tab 3: Requests (Split View) */}
        {tabValue === 3 && (
            <div className="flex flex-col lg:flex-row gap-6 relative items-start animate-in fade-in duration-300">
                {/* Left Panel: List */}
                <div className="w-full lg:w-4/12">
                   {userBookingRequest && userBookingRequest.length > 0 ? (
                       userBookingRequest.map((req) => (
                           <RequestListItem 
                                key={req._id}
                                req={req}
                                isSelected={selectedReq?._id === req._id}
                                onSelect={() => {
                                    handleContinueBooking(req);
                                    setSelectedReq(req);
                                }}
                           />
                       ))
                   ) : (
                       <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                            No pending requests.
                       </div>
                   )}
                </div>

                {/* Right Panel: Action Area */}
                <div className="w-full lg:w-8/12">
                   {selectedReq ? (
                       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                           <div className="flex justify-between items-center mb-4">
                               <h3 className="text-lg font-bold text-gray-900">Complete Your Booking</h3>
                               {selectedReq.requestStatus && (
                                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Approved</span>
                               )}
                           </div>
                           
                           <div className="mb-6">
                               <p className="text-sm text-gray-500 mb-1">Mentor</p>
                               <p className="font-bold text-gray-800 text-lg">{selectedReq.mentorId?.userName}</p>
                           </div>

                           {selectedReq.requestStatus ? (
                               <div className="BookSessionCardWrapper">
                                    <BookSession
                                        name={selectedReq.mentorId.userName}
                                        mentorId={selectedReq.mentorId._id}
                                        reschedule={false}
                                        selectedDuration={selectedReq.duration}
                                    />
                               </div>
                           ) : (
                               <div className="p-8 bg-gray-50 rounded-lg text-center border border-gray-200">
                                   <p className="text-gray-500 italic">This request is still pending approval from the mentor.</p>
                               </div>
                           )}
                       </div>
                   ) : (
                       <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-10 min-h-[300px]">
                            <p className="font-medium">Select a request to continue</p>
                       </div>
                   )}
                </div>
            </div>
        )}

        {/* --- Dialogs --- */}
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => handleOpenDialog(selectedBooking, "reschedule")}
          >
            Reschedule
          </MenuItem>
          <MenuItem onClick={() => handleOpenDialog(selectedBooking, "cancel")}>
            Cancel
          </MenuItem>
        </Menu>

        <Dialog
            open={openRescheduleDialog}
            onClose={() => handleCloseDialog("reschedule")}
            maxWidth="md"
            fullWidth
        >
            <div className="p-4">
                <BookSession
                    onClose={() => handleCloseDialog("reschedule")}
                    rescheduleBooking={selectedBooking}
                    mentorId={selectedBooking ? selectedBooking.mentorId._id : null}
                    reschedule={true}
                    name={selectedBooking ? selectedBooking.mentorId.userName : null}
                />
            </div>
        </Dialog>

        <Dialog
            open={openCancelDialog}
            onClose={() => handleCloseDialog("cancel")}
        >
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Are you sure you want to cancel the following booking?
                </Typography>
                {selectedBooking && (
                    <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
                        <li><strong>Booking ID:</strong> {selectedBooking._id}</li>
                        <li><strong>Date:</strong> {new Date(selectedBooking.startDateTime).toLocaleDateString()}</li>
                        <li><strong>Time:</strong> {new Date(selectedBooking.startDateTime).toLocaleTimeString()}</li>
                    </ul>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCloseDialog("cancel")} color="primary">
                    Keep Booking
                </Button>
                <Button onClick={handleConfirmCancel} color="error" variant="contained">
                    Confirm Cancel
                </Button>
            </DialogActions>
        </Dialog>

        <FeedbackModal
            openFeedbackDialog={openFeedbackDialog}
            setOpenFeedbackDialog={setOpenFeedbackDialog}
            handleTestimonial={handleTestimonial}
            booking={selectedBooking}
            actionType={actionType}
        />

      </div>
    </div>
  );
};

export default UserBooking;