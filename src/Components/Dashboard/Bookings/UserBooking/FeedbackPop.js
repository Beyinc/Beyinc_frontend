import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { CalendarServices } from "../../../../Services/CalendarServices"; // Assuming named import

function FeedbackModal ({ openFeedbackDialog, handleTestimonial, booking ,actionType,setOpenFeedbackDialog})  {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(""); // Add error state
  // const [open, setOpen] = useState(true); 

  const handleClose = (e) => {
    setOpenFeedbackDialog(false)
  }
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    if (!rating || !feedback) {
      setError("Please provide both a rating and feedback.");
      return;
    }

    setError(""); // Clear the error before submitting

    try {
      const response = await CalendarServices.addFeedback({
        feedback: [rating.toString(), feedback],
        bookingId: booking?._id, // Optional chaining for safety
      });

      console.log(response);
      setRating(0);
      setFeedback("");
      handleClose();
    } catch (error) {
      setRating(0);
      setFeedback("");
      setError("Failed to submit feedback. Please try again later.");
      console.error("Error submitting feedback:", error);
    }
  };


  return (
    <Dialog open={openFeedbackDialog} onClose={handleClose}>
      {actionType === "feedback" && ( // Conditional rendering based on actionType
        <>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogContent>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
            <Box display="flex" mb={2}>
              {[...Array(5)].map((_, index) => (
                <IconButton key={index} onClick={() => handleStarClick(index)}>
                  {index < rating ? (
                    <StarIcon sx={{ color: "gold" }} />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>
              ))}
            </Box>
            <TextField
              label="Feedback"
              multiline
              rows={4}
              fullWidth
              value={feedback}
              onChange={handleFeedbackChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

};

export default FeedbackModal;
