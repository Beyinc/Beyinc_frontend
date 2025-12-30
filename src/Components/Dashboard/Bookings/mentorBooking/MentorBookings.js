import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { CalendarServices } from "../../../../Services/CalendarServices.js";
import "../Bookings.css";
import dayjs from "dayjs";

const MentorBooking = () => {
  // Access route parameter to distinguish user or mentor
  const [tabValue, setTabValue] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState("");

  const {
    email: userEmail,
    user_id,
    userName,
  } = useSelector((store) => store.auth.loginDetails);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("mentorId", user_id, userName);
        const { mentorBookings } = await CalendarServices.mentorBookings({
          mentorId: user_id,
        }); // Fetch user bookings
        console.log("mentor Bookings:", mentorBookings); // Log user bookings data

        const filterByDate = (filterType) => {
          const now = new Date();

          return mentorBookings.filter((booking) => {
            const bookingDate = new Date(booking.startDateTime);

            if (filterType === "upcoming") {
              return bookingDate > now;
            } else if (filterType === "completed") {
              return bookingDate <= now;
            }
            return false; // For any invalid filterType
          });
        };

        // Example usage:
        const upcomingBookings = filterByDate("upcoming");
        const completedBookings = filterByDate("completed");

        console.log("Upcoming Bookings:", upcomingBookings);
        console.log("Completed Bookings:", completedBookings);
      
        setUpcomingBookings(upcomingBookings);
        setCompletedBookings(completedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    // Log the current type
    fetchBookings();
  }, [user_id, userName]);



  const fetchMentorRequests = async () => {
  try {
    let res = await CalendarServices.mentorBookingRequest();
    console.log("mentor requests", res);
    setMentorBookingRequests(res);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchMentorRequests();
}, []);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    }); // Adjust if needed

    handleCloseDialog();
  };

  const { beyincProfile } = useSelector((store) => store.auth.userDetails);

  const [mentorBookingRequests, setMentorBookingRequests] = useState([]);

  // useEffect(() => {
  //     const fetchMentorRequests = async () => {
  //     try {
  //       let res = await CalendarServices.mentorBookingRequest();
  //       await console.log("mentor requests", res);
  //       setMentorBookingRequests(res);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchMentorRequests();
  // }, []);

  const [openReqDialog, setOpenReqDialog] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
 const [selectedRew, setSelectedRow] = useState(null);

  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [declineReasonText, setDeclineReasonText] = useState("");

  const handleOpenReqDialog = (req) => {
    setSelectedReq(req);
    setOpenReqDialog(true);
  };

  const handleCloseReqDialog = () => {
    setOpenReqDialog(false);
    setSelectedReq(null);
  };
const handleApproveRequest = async () => {
  try {
    console.log("Approving Request:", selectedReq);

    const res = await CalendarServices.updateRequestStatusByMentor({
      requestId: selectedReq._id
    });

    alert(res.message || "Request approved successfully!");

    setOpenReqDialog(false);

    // fetchMentorRequests();
    fetchMentorRequests();

  } catch (err) {
    console.error("Error approving request:", err);
    alert("Failed to approve request");
  }
};


const handleDeleteRequest=async (id)=>{
//  alert(`request deleted ${id}`);
  try {
    console.log("deleting request:", id);

    const res = await CalendarServices.deleteRequestByMentor({
      requestId:id
    });

    alert(res.message || "Request deleted successfully!");


    // fetchMentorRequests();
    fetchMentorRequests();

  } catch (err) {
    console.error("Error deleting request:", err);
    alert("Failed to delete request");
  }
}

const handleOpenDeclineDialog = (req) => {
  setSelectedReq(req);
  setDeclineReasonText("");
  setOpenDeclineDialog(true);
};

const handleCloseDeclineDialog = () => {
  setOpenDeclineDialog(false);
  setDeclineReasonText("");
};

const handleConfirmDecline = async () => {
  try {
    if (!selectedReq) return;
    const res = await CalendarServices.declineRequestByMentor({
      requestId: selectedReq._id,
      declineReason: declineReasonText,
    });

    alert(res.message || "Request declined successfully");
    handleCloseDeclineDialog();
    fetchMentorRequests();
  } catch (err) {
    console.error("Error declining request:", err);
    alert("Failed to decline request");
  }
};


  return (
    <Box px={4} py={3}>
      <Box p={8} bgcolor={"white"} borderRadius={3} boxShadow={2}>
        <Typography variant="h5" align="left" style={{ fontFamily: "Roboto" }}>
          Mentor Bookings
        </Typography>

        {/* Tabs for Upcoming and Completed */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          style={{ width: "50%", marginTop: "10px" }}
        >
          <Tab label="Upcoming" />
          <Tab label="Completed" />
          <Tab label="Requests" />
        </Tabs>

        <Divider style={{ margin: "20px 0" }} />
        {/* ----------- Review Request Dialog ----------- */}
        <Dialog open={openReqDialog} onClose={handleCloseReqDialog}>
          <DialogTitle>Review Request</DialogTitle>

          <DialogContent>
            {selectedReq && (
              <>
                <Typography>
                  <strong>Type:</strong> {selectedReq.requestType}
                </Typography>
                <Typography>
                  <strong>Message:</strong> {selectedReq.requestMessage}
                </Typography>
              </>
            )}
          </DialogContent>

          <DialogActions>
            {!selectedReq?.requestStatus && (
              <Button
                onClick={handleApproveRequest}
                color="primary"
                variant="contained"
              >
                Approve
              </Button>
            )}
            <Button onClick={handleCloseReqDialog} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Box mt={4}>
          {/* Upcoming Bookings */}
          {tabValue === 0 && (
            <>
              {upcomingBookings.length > 0 ? (
                <List>
                  {upcomingBookings.map((booking) => (
                    <Box key={booking._id} mb={3}>
                      <Typography
                        variant="h6"
                        align="left"
                        style={{ marginBottom: "10px" }}
                      >
                        {dayjs(booking.startDateTime).format("MMMM D, YYYY")}
                      </Typography>

                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        border="1px solid black"
                        borderRadius={1}
                        p={0}
                      >
                        {/* 1st Column: Purple Vertical Box */}
                        <Box width="1.5%" bgcolor="#4F55C7" height="120px" />

                        {/* 2nd Column: Booking Time */}
                        <Box width="20%" ml={4}>
                          <Typography variant="body1">
                            {new Date(
                              booking.startDateTime
                            ).toLocaleTimeString()}
                          </Typography>
                        </Box>

                        {/* 3rd Column: User Details */}
                        <Box width="20%" ml={4}>
                          <Typography variant="body1">
                            User:{" "}
                            {booking.userId ? booking.userId.userName : "N/A"}
                          </Typography>
                          <Typography variant="body1">
                            Email:{" "}
                            {booking.userId ? booking.userId.email : "N/A"}
                          </Typography>
                        </Box>

                        <Box width="20%" ml={15}>
                          <Typography variant="body1">
                            Title: {booking.title ? booking.title : "N/A"}
                          </Typography>
                          <Typography variant="body1">
                            Duration: {booking.duration} mins
                          </Typography>
                          <Typography variant="body1">
                            Amount:{" "}
                            {booking.amount ? `${booking.amount} Rs` : "N/A"}
                          </Typography>
                        </Box>

                        {/* 4th Column: Request Reschedule Button */}
                        <Box width="20%" ml={5}>
                          <button
                            className="joinCall"
                            onClick={() => handleOpenDialog(booking)}
                          >
                            Request Reschedule
                          </button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography>No upcoming bookings.</Typography>
              )}
            </>
          )}

          {/* Completed Bookings */}
          {tabValue === 1 && (
            <>
              {completedBookings.length > 0 ? (
                <List>
                  {completedBookings.map((booking) => (
                    <Box key={booking._id} mb={3}>
                      <Typography
                        variant="h6"
                        align="left"
                        style={{ marginBottom: "10px" }}
                      >
                        {dayjs(booking.startDateTime).format("MMMM D, YYYY")}
                      </Typography>

                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        border="1px solid black"
                        borderRadius={1}
                        p={0}
                      >
                        {/* 1st Column: Purple Vertical Box */}
                        <Box width="1.5%" bgcolor="#4F55C7" height="120px" />

                        {/* 2nd Column: Booking Time */}
                        <Box width="20%" ml={4}>
                          <Typography variant="body1">
                            {new Date(
                              booking.startDateTime
                            ).toLocaleTimeString()}
                          </Typography>
                        </Box>

                        {/* 3rd Column: User Details */}
                        <Box width="20%" ml={4}>
                          <Typography variant="body1">
                            User:{" "}
                            {booking.userId ? booking.userId.userName : "N/A"}
                          </Typography>
                          <Typography variant="body1">
                            Email:{" "}
                            {booking.userId ? booking.userId.email : "N/A"}
                          </Typography>
                        </Box>

                        <Box width="20%" ml={15}>
                          <Typography variant="body1">
                            Title: {booking.title ? booking.title : "N/A"}
                          </Typography>
                          <Typography variant="body1">
                            Duration: {booking.duration} mins
                          </Typography>
                          <Typography variant="body1">
                            Amount:{" "}
                            {booking.amount ? `${booking.amount} Rs` : "N/A"}
                          </Typography>
                        </Box>

                        {/* No 4th Column for completed bookings */}
                      </Box>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography>No completed bookings.</Typography>
              )}
            </>
          )}

       {tabValue === 2 && (
  <Box display="flex" gap={3}>
    
    {/* LEFT: Request List */}
    <Box width="70%">
      {mentorBookingRequests.length ? (
        mentorBookingRequests.map((req) => (
          <Box
            key={req._id}
            mb={2}
            p={2}
            borderRadius={2}
            boxShadow={1}
            bgcolor={selectedReq?._id === req._id ? "#EEF2FF" : "#fff"}
            sx={{ cursor: "pointer" }}
            onClick={() => setSelectedReq(req)}
          >
             
            <Typography fontSize={13}>
              <strong>User: </strong>{req.userId?.userName}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
             <strong>Email:</strong> {req.userId?.email}
            </Typography>

            <Typography fontSize={13} mt={1}>
              {req.requestMessage.slice(0, 60)}...
            </Typography>

            <Typography
              mt={0.5}
              fontSize={12}
              fontWeight={600}
              color={
                req.requestDeclined
                  ? "red"
                  : req.requestStatus
                  ? "green"
                  : "orange"
              }
            >
              {req.requestDeclined ? "Declined" : req.requestStatus ? "Approved" : "Pending"}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No requests found</Typography>
      )}
    </Box>

    {/* RIGHT: Request Details */}
    <Box width="30%">
      {selectedReq ? (
        <Box
          p={3}
          borderRadius={3}
          boxShadow={2}
          bgcolor="#fff"
        >
          <Typography variant="h6" mb={2}>
            Request Details
          </Typography>

          <Typography>
            <strong>User:</strong> {selectedReq.userId?.userName}
          </Typography>

          <Typography>
            <strong>Email:</strong> {selectedReq.userId?.email}
          </Typography>

          <Typography mt={2}>
            <strong>Type:</strong> {selectedReq.requestType}
          </Typography>

  <Typography mt={1}>
            <strong>Amoount :</strong> ₹{selectedReq.amount}
          </Typography>

  <Typography mt={0}>
            <strong>Duration:</strong> {selectedReq.duration} <strong>minutes</strong>
          </Typography>

          <Typography mt={1}>
            <strong>Message:</strong>
          </Typography>
          <Typography color="text.secondary">
            {selectedReq.requestMessage}
          </Typography>

          <Typography
            mt={2}
            fontWeight={600}
            color={
              selectedReq.requestDeclined
                ? "red"
                : selectedReq.requestStatus
                ? "green"
                : "orange"
            }
          >
            Status: {selectedReq.requestDeclined ? "Declined" : selectedReq.requestStatus ? "Approved" : "Pending"}
          </Typography>

          {/* ACTIONS */}
          <Box mt={3} display="flex" gap={2}>
            {selectedReq.requestDeclined ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteRequest(selectedReq._id)}
              >
                Delete Request
              </Button>
            ) : selectedReq.requestStatus ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteRequest(selectedReq._id)}
              >
                Delete Request
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={handleApproveRequest}
                >
                  Approve Request
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOpenDeclineDialog(selectedReq)}
                >
                  Decline Request
                </Button>
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="text.secondary"
        >
          Select a request to view details
        </Box>
      )}
    </Box>
  </Box>
)}

        </Box>

        {/* Dialog for Reschedule Request */}
        {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Request Reschedule</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Reschedule"
              type="text"
              fullWidth
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleReschedule} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog> */}

        {/* Dialog for Decline Confirmation */}
        <Dialog open={openDeclineDialog} onClose={handleCloseDeclineDialog}>
          <DialogTitle>Decline Request</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel this request?
            </Typography>

            <TextField
              autoFocus
              margin="dense"
              label="Reason (optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={declineReasonText}
              onChange={(e) => setDeclineReasonText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeclineDialog} color="primary">
              Keep Request
            </Button>
            <Button onClick={handleConfirmDecline} color="error" variant="contained">
              Confirm Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MentorBooking;
