import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import { ApiServices } from "../../Services/ApiServices";

const Comment = ({ id, user_id }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ rating: "", review: "" });
  const [reviews, setReviews] = useState([]);

  const onSubmit = async () => {
    // Reset errors at the start
    setError({ rating: "", review: "" });

    let errors = { rating: "", review: "" };
    let hasError = false;

    if (!rating || rating === 0) {
      errors.rating = "Please provide a rating.";
      hasError = true;
    }

    if (!review || review.trim() === "") {
      errors.review = "Please write a review.";
      hasError = true;
    }

    if (hasError) {
      setError(errors);
      return;
    }

    try {
      setLoading(true);

      // Current date in IST
      const istTime = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      istTime.setTime(
        istTime.getTime() + istTime.getTimezoneOffset() * 60 * 1000 + istOffset
      );

      console.log("user_id", user_id, id);

      const reviewData = {
        user_id: id,
        reviewByID: user_id,
        rating: rating,
        review: review.trim(),
      };

      const response = await ApiServices.addReview(reviewData);

      if (response?.status === 200) {
        setRating(0);
        setReview("");
        getReviews();
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError({
        rating: "",
        review: err.response?.data?.message || "Failed to submit review",
      });
    } finally {
      setLoading(false);
    }
  };

  const getReviews = async () => {
    const response = await ApiServices.getReviews({ user_id: id });
    if (response?.status === 200) {
      setReviews(response.data.reviews);
    } else {
      console.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="w-[60vw]">
      <div className="mb-4">
        <p className="mb-2 text-gray-700 font-medium">Rate your experience:</p>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
            // Clear rating error when user makes a selection
            if (newValue > 0) {
              setError((prev) => ({ ...prev, rating: "" }));
            }
          }}
          max={5}
          sx={{
            "& .MuiRating-icon": {
              fontSize: "2rem",
            },
          }}
        />
        {error.rating && (
          <p className="text-red-500 text-sm mt-1">{error.rating}</p>
        )}
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Write your review here..."
          onChange={(e) => {
            setReview(e.target.value);
            // Clear review error when user starts typing
            if (e.target.value.trim()) {
              setError((prev) => ({ ...prev, review: "" }));
            }
          }}
          value={review}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error.review && (
          <p className="text-red-500 text-sm mt-1">{error.review}</p>
        )}
      </div>
      <button onClick={onSubmit} disabled={loading} className="rounded-lg mb-3">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
      <div className="space-y-4">
        {reviews.toReversed().map((review, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200 w-full"
          >
            {/* Rating at top */}
            <div className="mb-3">
              <Rating value={review.rating} precision={0.5} readOnly />
            </div>

            {/* Review text */}
            <div className="mb-4">
              <p className="text-gray-700">{review.review}</p>
            </div>

            {/* Reviewer and date */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="font-bold">
                {review.reviewBy || "Anonymous"}
              </span>
              <span>{review.createdAt.split(",")[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
