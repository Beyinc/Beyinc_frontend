import React, { useState, useEffect } from "react";
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { CalendarServices } from "../../../../Services/CalendarServices";
import "../Bookings.css";
import FeedbackModal from "./FeedbackPop.js";
import RescheduleCalendar from "./Calendar";
import BookSession from "../../../Editprofile/BookSession/BookSession2";
import dayjs from "dayjs";

const UserBooking = () => {
  const [tabValue, setTabValue] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [rescheduledBookings, setRescheduledBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionType, setActionType] = useState("");
  const [bookingType, setBookingType] = useState("1:1");
  const [reschedule, setReschedule] = useState(true);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Fetching user bookings...");
        const { userBookings } = await CalendarServices.userBookings(); // Fetch user bookings
        console.log("User Bookings:", userBookings); // Log user bookings data

        const now = new Date();

        // Separate the bookings into upcoming, completed, and rescheduled
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

        console.log("Upcoming Bookings:", upcomingBookings);
        console.log("Completed Bookings:", completedBookings);
        console.log("Rescheduled Bookings:", rescheduledBookings);

        setUpcomingBookings(upcomingBookings);
        setCompletedBookings(upcomingBookings);
        // setCompletedBookings(completedBookings);
        setRescheduledBookings(rescheduledBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [userBookingRequest, setUserBookingRequest] = useState([]);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        let res = await CalendarServices.userBookingRequest();
        console.log("user requests", res);
        setUserBookingRequest(res.pendingRequests);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserRequests();
  }, []);

  const handleOpenDialog = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);

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

  // Function to handle API request for cancellation
  const handleConfirmCancel = async () => {
    console.log("Cancelling", selectedBooking);
    try {
      // Assuming you have an API endpoint for canceling a booking
      const response = await CalendarServices.cancelBooking({
        selectedBooking,
      });

      if (response.status === 200) {
        // Handle success (e.g., close modal and show success message)
        setOpenDialog(false);
        alert("Booking has been successfully canceled.");
      }
    } catch (error) {
      // Handle error (e.g., show error message)
      alert("Failed to cancel the booking. Please try again.");
    }
  };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);

  // };

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReschedule = () => {
    // Implement reschedule functionality here
    handleCloseDialog();
  };

  const handleCancel = () => {
    // Implement cancel functionality here
    handleCloseDialog();
  };

  const handleTestimonial = (booking, type) => {
    console.log("type", type, booking);

    setSelectedBooking(booking);
    setActionType(type); // Set the action type
    setOpenFeedbackDialog(true);
  };

  const handleJoinCall = (url) => {
    window.open(url, "_blank");
  };

  const openMenu = Boolean(anchorEl);
  const [showBookSession, setShowBookSession] = useState(false);
  const [expandedReqId, setExpandedReqId] = useState(null);

  const handleContinueBooking = (req) => {
    setShowBookSession(true);
    // setExpandedReqId(reqId)
    setSelectedReq(req);
  };

  const [selectedReq, setSelectedReq] = useState(null);

  return (
    <Box sx={{ px: { xs: 0, sm: 6 } }} px={6} py={3}>
      <Box
        sx={{ p: { xs: 2, sm: 10 } }}
        bgcolor={"white"}
        borderRadius={3}
        boxShadow={2}
      >
        <Typography
          variant="h5"
          align="left"
          style={{ fontFamily: "Roboto", fontWeight: "bold" }}
        >
          User Bookings
        </Typography>

        {/* Tab navigation */}
        <div className="tabs">
          <div
            className={`tab ${bookingType === "1:1" ? "active" : ""}`}
            onClick={() => setTabValue("1:1")}
          >
            1:1
          </div>
          <div
            className={`tab ${tabValue === "webinar" ? "active" : ""}`}
            onClick={() => setTabValue("webinar")}
          >
            Webinar
          </div>
        </div>

        {/* Tabs for Upcoming, Completed, and Rescheduled Bookings */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ width: { xs: "100%", sm: "50%" }, marginTop: "10px" }}
        >
          <Tab label="Upcoming" />
          <Tab label="Completed" />
          <Tab label="Rescheduled" />
          <Tab label="Requests" />
        </Tabs>

        <Divider style={{ margin: "20px 0" }} />

        <Box mt={4}>
          {tabValue === 0 && (
            <>
              {upcomingBookings.length > 0 ? (
                <List>
                  {upcomingBookings.map((booking) => (
                    <Box>
                      <Typography
                        variant="h6"
                        align="left"
                        style={{ marginBottom: "10px" }}
                      >
                        {dayjs(booking.startDateTime).format("MMMM D, YYYY")}
                      </Typography>
                      <Box
                        key={booking._id}
                        border="1px solid black"
                        borderRadius={1}
                        mb={3}
                      >
                        {/* Booking Date */}

                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          {/* 1st Column: Purple Vertical Box */}
                          <Box width="1.5%" bgcolor="#4F55C7" height="100px" />

                          {/* 2nd Column: Booking Time */}
                          <Box width="20%" ml={8}>
                            <Typography variant="body1">
                              {new Date(
                                booking.startDateTime
                              ).toLocaleTimeString()}
                            </Typography>
                          </Box>

                          {/* 3rd Column: Mentor Name */}
                          <Box width="20%" ml={2}>
                            <Typography variant="body1">
                              Mentor:{" "}
                              {booking.mentorId
                                ? booking.mentorId.userName
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box width="20%" ml={15}>
                            {/* Display Booking Title */}
                            <Typography variant="body1">
                              Title: {booking.title ? booking.title : "N/A"}
                            </Typography>

                            {/* Display Duration */}
                            <Typography variant="body1">
                              Duration:{" "}
                              {booking.duration
                                ? `${booking.duration} mins`
                                : "N/A"}
                            </Typography>

                            {/* Display Amount */}
                            <Typography variant="body1">
                              Amount:{" "}
                              {booking.amount ? `${booking.amount} Rs` : "N/A"}
                            </Typography>
                          </Box>

                          {/* 4th Column: Join Call Button */}
                          <Box width="20%" ml={5}>
                            <button
                              className="joinCall"
                              onClick={() => handleJoinCall(booking.meetLink)}
                            >
                              Join Call
                            </button>
                          </Box>

                          {/* 5th Column: More Actions Button */}
                          <Box width="15%" ml={2}>
                            <button
                              className="moreActions"
                              onClick={(event) =>
                                handleMenuClick(event, booking)
                              }
                            >
                              More Actions
                            </button>
                          </Box>
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
                      >
                        {/* 1st Column: Purple Vertical Box */}
                        <Box width="1.5%" bgcolor="#4F55C7" height="100px" />

                        {/* 2nd Column: Booking Time */}
                        <Box width="20%" ml={8}>
                          <Typography variant="body1">
                            {new Date(
                              booking.startDateTime
                            ).toLocaleTimeString()}
                          </Typography>
                        </Box>

                        {/* 3rd Column: Mentor Name and Details */}
                        <Box width="20%" ml={2}>
                          <Typography variant="body1">
                            Mentor:{" "}
                            {booking.mentorId
                              ? booking.mentorId.userName
                              : "N/A"}
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

                        {/* 4th Column: Give Feedback Button */}
                        <Box width="20%" ml={5}>
                          <button
                            className="joinCall"
                            onClick={() =>
                              handleTestimonial(booking, "feedback")
                            }
                            color="primary"
                          >
                            Give Feedback
                          </button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography>No completed bookings.</Typography>
              )}
            </>
          )}

          {/* Rescheduled Bookings */}
          {tabValue === 2 && (
            <>
              <Typography variant="body1">Rescheduled Bookings:</Typography>
              {rescheduledBookings.length > 0 ? (
                <List>
                  {rescheduledBookings.map((booking) => (
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
                      >
                        {/* 1st Column: Purple Vertical Box */}
                        <Box width="1.5%" bgcolor="#4F55C7" height="100px" />

                        {/* 2nd Column: Booking Time */}
                        <Box width="20%" ml={8}>
                          <Typography variant="body1">
                            {new Date(
                              booking.startDateTime
                            ).toLocaleTimeString()}
                          </Typography>
                        </Box>

                        {/* 3rd Column: Mentor Name and Details */}
                        <Box width="20%" ml={2}>
                          <Typography variant="body1">
                            Mentor:{" "}
                            {booking.mentorId
                              ? booking.mentorId.userName
                              : "N/A"}
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

                        {/* 4th Column: Reschedule Reason */}
                        <Box width="20%" ml={5}>
                          <Typography variant="body1">Reason:</Typography>
                          <Typography variant="body1">
                            {booking.mentorReschedule[1] ||
                              "No reason provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography>No rescheduled bookings.</Typography>
              )}
            </>
          )}
          {tabValue === 3 && (
            <Box display="flex" width="100%" gap={2}>
              {/* LEFT SIDE – 70% */}
<Box
  width="70%"
  
>
                {userBookingRequest && userBookingRequest.length > 0 ? (
                  <List>
                    {userBookingRequest.map((req) => (
                      <Box key={req._id} mb={3}>
                        <Typography variant="h6" mb={1}>
                          Request Type: {req.requestType.toUpperCase()}
                        </Typography>

                        <Box
                          display="flex"
                          alignItems="center"
                          border="1px solid black"
                          borderRadius={1}
                          sx={{
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
    },
  }}
                        >
                          <Box width="1.5%" bgcolor="#4F55C7" height="100px" />

                          <Box width="25%" ml={6}>
                            <Typography>
                              <strong>Mentor:</strong> {req.mentorId?.userName}
                            </Typography>
                            <Typography>
                              <strong>Email:</strong> {req.mentorId?.email}
                            </Typography>
                          </Box>

                          <Box width="30%" ml={20}>
                            <Typography>
                              <strong>Message: </strong>
                              {req.requestMessage.slice(0, 30)}...
                            </Typography>
                            <Typography>
                              <strong>Status:</strong>{" "}
                              {req.requestStatus ? (
                                <span
                                  style={{ color: "green", fontWeight: "bold" }}
                                >
                                  Approved
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "orange",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Pending
                                </span>
                              )}
                            </Typography>
                          </Box>

                          <Box width="20%" ml={10}>
                            {req.requestStatus ? (
                              <button
                                className="joinCall"
                                style={{
    padding: "10px 28px",
    borderRadius: "4px",
    whiteSpace: "nowrap"
  }}
                                onClick={() => handleContinueBooking(req)}
                              >
                                Continue to Booking
                              </button>
                            ) : (
                              <Typography color="gray">
                                Still Pending…
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography>No pending requests.</Typography>
                )}
              </Box>

              {/* RIGHT SIDE – 30% */}
              <Box width="30%" marginTop={4}>
                {selectedReq && (
                  <Box className="BookSessionCard">
                    <BookSession
                      name={selectedReq.mentorId.userName}
                      mentorId={selectedReq.mentorId._id}
                      reschedule={false}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Drop-down Menu for More Actions */}
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

        {/* Reschedule Calendar Modal */}
        {/* Reschedule Modal */}
        {actionType === "reschedule" && (
          <Dialog
            open={openRescheduleDialog}
            onClose={() => handleCloseDialog("reschedule")}
          >
            <div>
              <h1>Reschedule</h1>
              <BookSession
                onClose={() => handleCloseDialog("reschedule")}
                rescheduleBooking={selectedBooking}
                mentorId={selectedBooking ? selectedBooking.mentorId._id : null}
                reschedule={true}
                name={
                  selectedBooking ? selectedBooking.mentorId.userName : null
                }
              />
            </div>
          </Dialog>
        )}

        {/* Cancel Modal */}
        {actionType === "cancel" && (
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
                <ul>
                  <li>
                    <strong>Booking ID:</strong> {selectedBooking._id}
                  </li>
                  <li>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      selectedBooking.startDateTime
                    ).toLocaleDateString()}
                  </li>
                  <li>
                    <strong>Time:</strong>{" "}
                    {new Date(
                      selectedBooking.startDateTime
                    ).toLocaleTimeString()}
                  </li>
                </ul>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleCloseDialog("cancel")}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCancel}
                color="secondary"
                variant="contained"
              >
                Confirm Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}

        <FeedbackModal
          openFeedbackDialog={openFeedbackDialog}
          setOpenFeedbackDialog={setOpenFeedbackDialog}
          handleTestimonial={handleTestimonial}
          booking={selectedBooking}
          actionType={actionType}
        />
      </Box>
    </Box>
  );
};

export default UserBooking;
