import React from "react";
import "./AvgReview.css"
const ReviewStars = ({ avg }) => {
  const filledStars = Math.round(avg * 2) / 2; // Round to the nearest half star

  const renderStars = () => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      let starClass = "empty";

      if (i <= filledStars) {
        starClass = "filled";
      } else if (i - 0.5 === filledStars) {
        starClass = "half-filled";
      }

      stars.push(
        <span
          key={i}
          className={`Star ${starClass}`}
          style={{ cursor: "pointer" }}
        >
          &#9733;
        </span>
      );
    }

    return stars;
  };

  return (
    <div title="Average review">
      <div className="Star-rating">
        <span style={{background: '#F77D0E', color: 'white', padding: '3px 6px', borderRadius: '5px', fontSize: '12px', marginRight: '5px'}}>
          {avg.toFixed(1).split(".")[1] != "0"
            ? avg.toFixed(1)
            : avg.toFixed(0)}
        </span>
        {renderStars()}
      </div>
    </div>
  );
};

export default ReviewStars;
