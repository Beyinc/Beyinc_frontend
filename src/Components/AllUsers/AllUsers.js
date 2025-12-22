import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { setLoading } from "../../redux/AuthReducers/AuthReducer";
import FilterSidebar from "./FilterSidebar";
import SingleUserDetails from "./SingleUserDetails";
import { Collapse, Button } from "@mui/material";
import AddConversationPopup from "../Common/AddConversationPopup";
import CachedIcon from "@mui/icons-material/Cached";
import { AccessTime, CalendarMonth } from "@mui/icons-material";
import "./users.css";

// --- Sub-Component: Request List Item (Left Side) ---
const IncomingRequestItem = ({ item, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative p-4 cursor-pointer transition-all duration-200 rounded-xl mb-3 border
      ${isSelected 
        ? "bg-white border-[#4f55c7] shadow-[0_0_0_1px_#4f55c7]" // Selected State
        : "bg-white border-transparent hover:border-gray-200 hover:shadow-md hover:translate-x-1" // Default/Hover State
      }`}
  >
    <div className="flex items-start gap-4">
      <img
        alt={item.userName}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-100"
        src={item.userImg}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`font-bold text-base ${isSelected ? 'text-[#4f55c7]' : 'text-gray-900'}`}>
            {item.userName}
          </p>
          <span className="text-[10px] bg-[#4f55c7]/10 text-[#4f55c7] px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            {item.type}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800 mb-1">{item.title}</p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 font-medium">
            <span>{item.date}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Component: Request Detail View (Right Side) ---
const RequestDetailView = ({ request }) => {
  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-10">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#4f55c7]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
        </div>
        <p className="font-medium text-gray-500">Select a request to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 sticky top-24 shadow-sm">
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
            <img
            alt={request.userName}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            src={request.userImg}
            />
            <div>
            <h3 className="text-xl font-bold text-gray-900">{request.userName}</h3>
            <p className="text-xs font-medium text-gray-500">Requested {request.requestedTime || "Recently"}</p>
            </div>
        </div>
        <div className="text-right">
             <p className="text-2xl font-bold text-[#4f55c7]">₹ {request.price || "Free"}</p>
             <p className="text-xs text-gray-400">Total Price</p>
        </div>
      </div>
      
      {/* Title */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Session Topic</p>
        <p className="font-semibold text-gray-800 text-lg">{request.title}</p>
      </div>

      {/* Message */}
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#4f55c7]">
            <p className="text-sm text-gray-600 leading-relaxed italic">
            "{request.description}"
            </p>
        </div>
      </div>

      {/* Duration & Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 mb-1">Duration</p>
             <p className="font-semibold text-gray-900 flex items-center gap-2">
                <AccessTime sx={{fontSize: 16, color: '#4f55c7'}}/> 
                {request.durationSimple || "45 mins"}
             </p>
        </div>
        <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 mb-1">Session Type</p>
             <p className="font-semibold text-gray-900">{request.type}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button className="w-full px-6 py-3 bg-[#4f55c7] text-white font-semibold rounded-xl hover:bg-[#3e44a8] transition-all shadow-md shadow-[#4f55c7]/20 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
          Approve & Schedule
        </button>
        
        <div className="grid grid-cols-2 gap-3">
            <button className="w-full px-4 py-3 border border-[#4f55c7] text-[#4f55c7] font-semibold rounded-xl hover:bg-[#4f55c7]/5 transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
            Reschedule
            </button>
            <button className="w-full px-4 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            Decline
            </button>
        </div>
      </div>
    </div>
  );
};


const AllUsers = () => {
  // --- 1. Window Width Logic ---
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 2. State & Hooks ---
  const [activeTab, setActiveTab] = useState("Find Mentors");
  const [users, setUsers] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const { user_id } = useSelector((state) => state.auth.loginDetails);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    userName: "",
    categories: [],
    expertise: [],
    industries: [],
  });

  // --- 3. Mock Data ---

  // Tab 2: Bookings (Who booked me)
  const incomingBookings = [
    {
      id: 101,
      time: "12:00 PM",
      date: "Today",
      otherUserName: "Samantha Smith",
      otherUserTitle: "Individual/Entrepreneur",
      otherUserImg: "/profile.png", 
      topic: "Introduction",
      duration: "45 mins",
      price: "250",
      status: "Confirmed"
    },
    {
      id: 102,
      time: "10:38 PM",
      date: "Today",
      otherUserName: "John Foley",
      otherUserTitle: "Full Stack Developer",
      otherUserImg: "/profile.png",
      topic: "Technical Discussion",
      duration: "60 mins",
      price: "300",
      status: "Confirmed"
    }
  ];

  // Tab 3: Mentor Bookings (Who I booked)
  const myOutgoingRequests = [
    {
      id: 201,
      title: "Startup Mentorship",
      mentorName: "Samantha Smith",
      status: "Approved",
      isPaid: false,
      description: "Looking for guidance on launching my new SaaS product. I have a working prototype.",
      date: "12/19/2025",
      duration: "45",
      price: "250"
    },
    {
      id: 202,
      title: "Career Development",
      mentorName: "Samantha Smith",
      status: "Approved",
      isPaid: true,
      description: "Need advice on transitioning to product management from engineering.",
      date: "12/20/2025",
      duration: "45",
      price: "250"
    }
  ];

  // Tab 4: Requests (Inbox List Style)
  const inboxRequests = [
    {
      id: 301,
      userName: "Alex Johnson",
      userImg: "/profile.png",
      type: "1:1 Call",
      title: "Startup Mentorship",
      description: "Looking for guidance on launching my new SaaS product. I have a working prototype and need advice on market validation and fundraising strategies.",
      date: "Dec 22 • 45 mins",
      requestedTime: "9:30 AM",
      price: "250",
      durationSimple: "45 mins"
    },
    {
      id: 302,
      userName: "Sarah Williams",
      userImg: "/profile.png",
      type: "1:1 Call",
      title: "Career Development",
      description: "Need advice on transitioning to product management...",
      date: "Dec 19 • 45 mins",
      requestedTime: "Yesterday",
      price: "250",
      durationSimple: "45 mins"
    },
    {
      id: 303,
      userName: "Mike Chen",
      userImg: "/profile.png",
      type: "1:1 Call",
      title: "System Design Fundamentals",
      description: "I'm preparing for senior engineer interviews...",
      date: "Dec 19 • 60 mins",
      requestedTime: "Dec 19",
      price: "300",
      durationSimple: "60 mins"
    }
  ];

  // --- 4. Fetch Users (Only for Find Mentors) ---
  const fetchUsers = async () => {
    dispatch(setLoading({ visible: "yes" }));
    try {
      const response = await ApiServices.FilterData(filters);
      const validUsers = response.data.filter(user => 
        user.userName && (user.beyincProfile || user.role)
      );
      setUsers(validUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      dispatch(setLoading({ visible: "no" }));
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Find Mentors") {
        fetchUsers();
    }
  }, [filters, activeTab]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReloadClick = () => {
    setIsSpinning(true);
    setFilters({ userName: "", categories: [], expertise: [], industries: [] });
  };

  // --- 5. Custom Card Components (for other tabs) ---

  const ConfirmedSessionCard = ({ booking }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all mb-4">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="hidden md:block w-1 h-24 bg-[#4f55c7] rounded-full flex-shrink-0"></div>
        <div className="w-20 flex-shrink-0">
          <p className="font-bold text-gray-900 text-lg">{booking.time}</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <img alt={booking.otherUserName} className="w-16 h-16 rounded-full object-cover" src={booking.otherUserImg} />
          <div>
            <p className="font-bold text-gray-900">{booking.otherUserName}</p>
            <p className="text-sm text-gray-600">{booking.otherUserTitle}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 mb-1">{booking.topic}</p>
          <p className="text-sm text-gray-600">{booking.duration} | ₹ {booking.price}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-[#4f55c7] text-white font-medium rounded-lg hover:bg-[#3e44a8] transition-colors flex items-center gap-2">
            Join Call
          </button>
        </div>
      </div>
    </div>
  );

  const RequestStatusCard = ({ req }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
         <div>
            <h3 className="font-bold text-lg text-gray-900">{req.title}</h3>
            <p className="text-sm text-gray-600 font-medium mt-1">
               Mentor: <span className="text-gray-900">{req.mentorName}</span>
            </p>
         </div>
         <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold 
               ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
               {req.status === 'Approved' && '✓'} {req.status}
            </span>
         </div>
      </div>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed mt-3">{req.description}</p>
      <div className="flex justify-between items-center text-sm pt-2">
         <div className="flex gap-4 text-gray-500 font-medium">
             <div className="flex items-center gap-1"><CalendarMonth fontSize="small" className="text-gray-400"/> {req.date}</div>
             <div className="flex items-center gap-1"><AccessTime fontSize="small" className="text-gray-400"/> {req.duration} mins</div>
         </div>
         <div className="font-bold text-[#4f55c7]">₹ {req.price}</div>
      </div>
    </div>
  );


  // --- 6. Main Render ---
  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      
      {/* Mobile Filter Toggle */}
      {width < 770 && activeTab === "Find Mentors" && (
        <div className="p-4 bg-white shadow-sm mb-4">
           <Button variant="outlined" fullWidth onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
             <i className="fa fa-filter mr-2" /> {mobileFilterOpen ? "Hide Filters" : "Filter Mentors"}
           </Button>
           <Collapse in={mobileFilterOpen}>
             <div className="mt-4 bg-white p-4 rounded shadow-inner">
               <FilterSidebar updateFilters={updateFilters} />
             </div>
           </Collapse>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 max-w-[1400px] mx-auto mt-6">
        
        {/* --- LEFT SIDEBAR (Only for Find Mentors) --- */}
        {width >= 770 && activeTab === "Find Mentors" && (
          <div className="w-1/4 min-w-[280px] flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="font-bold text-xl text-gray-800">Filter By:</h2>
                 <CachedIcon style={{ cursor: "pointer", color: "#666" }} className={isSpinning ? "animate-spin" : ""} onClick={handleReloadClick} />
               </div>
               <FilterSidebar updateFilters={updateFilters} />
            </div>
          </div>
        )}

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="flex-1">
          
          {/* Navigation Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {["Find Mentors", "Bookings", "Mentor Bookings", "Requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                  ${activeTab === tab 
                    ? "bg-[#4f55c7] text-white border-[#4f55c7] shadow-lg shadow-[#4f55c7]/30" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#4f55c7]/50 hover:text-[#4f55c7] hover:bg-white"}
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: Find Mentors */}
          {activeTab === "Find Mentors" && (
            <>
              <div className="mb-4 text-gray-500 text-sm font-medium">
                  Showing {users.length} Mentors
              </div>
              <div className="flex flex-col gap-4">
                {users.length > 0 ? (
                  users.map(user => <SingleUserDetails key={user._id} user={user} />)
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-xl border border-gray-200 p-8">
                      <img src="/Search.gif" alt="Empty" className="w-32 opacity-80 mb-4" />
                      <h3 className="text-lg font-bold text-gray-700">No mentors found</h3>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: Bookings (Who Booked Me) */}
          {activeTab === "Bookings" && (
             <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Sessions</h3>
                {incomingBookings.map(b => <ConfirmedSessionCard key={b.id} booking={b} />)}
             </div>
          )}

          {/* TAB 3: Mentor Bookings (Who I Booked) */}
          {activeTab === "Mentor Bookings" && (
             <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Booking Requests</h3>
                {myOutgoingRequests.map(req => <RequestStatusCard key={req.id} req={req} />)}
             </div>
          )}

          {/* TAB 4: Requests (Inbox Style) - REFINED & THEMED */}
          {activeTab === "Requests" && (
             <div className="flex flex-col lg:flex-row gap-6 relative items-start">
                {/* Inbox List (Left Panel) */}
                <div className="w-full lg:w-5/12">
                   {inboxRequests.map(item => (
                      <IncomingRequestItem 
                        key={item.id} 
                        item={item} 
                        isSelected={selectedRequest?.id === item.id}
                        onClick={() => setSelectedRequest(item)}
                      />
                   ))}
                </div>

                {/* Detail View (Right Panel) */}
                <div className="hidden lg:block lg:w-7/12">
                   <RequestDetailView request={selectedRequest} />
                </div>
             </div>
          )}

        </div>
      </div>

      <div style={{ display: 'none' }}>
        <AddConversationPopup receiverId={""} setReceiverId={() => {}} receiverRole={""} IsAdmin={false} />
      </div>
    </div>
  );
};

export default AllUsers;