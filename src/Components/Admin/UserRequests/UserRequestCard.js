import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ApiServices } from "../../../Services/ApiServices";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
// import { AdminServices } from "../../../Services/ApiServices"; // Removed duplicate import if not used, or keep if needed
import { setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function UserRequestCard({ d }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // MOVED INSIDE

  // MOVED INSIDE so it can access 'd' and 'dispatch'
  const handleVerify = async (e) => {
    e.stopPropagation();
    try {
      await ApiServices.verifyUser({ userId: d._id });
      dispatch(
        setToast({
          message: "User Verified Successfully!",
          bgColor: ToastColors.success,
          visible: "yes",
        })
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      dispatch(
        setToast({
          message: "Error verifying user",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }
  };

  const openUser = () => navigate(`/singleProfileRequest/${d._id}`);

  return (
    <div
      className={
        "user-card-main-container " +
        (d?.role === "Entrepreneur"
          ? "margin-entrepreneur"
          : d?.role === "Mentor"
            ? "margin-mentor"
            : "")
      }
    >
      <div className="user-card-details">
        <div className="user-card-img-rating-container">
          <div className="user-card-image" onClick={openUser}>
            <img
              alt="user-pic"
              src={
                d.image !== undefined && d.image !== ""
                  ? d.image.url
                  : "/profile.png"
              }
            />
            {d.verification === "approved" && (
              <img
                src="/verify.png"
                alt=""
                style={{ width: "15px", height: "15px", position: 'absolute', right: '0' }}
              />
            )}
          </div>

        </div>
        <div className="user-card-details-text">
          <span className="user-name" onClick={openUser}>
            {d.userName}
          </span>
          <span>
            <b>Status</b>:
            <span
              style={{
                fontSize: "14px",
                marginLeft: "5px",
                color:
                  d.verification == "approved"
                    ? "green"
                    : d.verification == "pending"
                      ? "orange"
                      : "red",
                border: `1.5px dotted ${d.verification == "approved"
                    ? "green"
                    : d.verification == "pending"
                      ? "orange"
                      : "red"
                  }`,
                borderRadius: 5,
                padding: "3px",
              }}
            >
              {d.verification
                ? capitalizeFirstLetter(d.verification)
                : d.verification}
            </span>
          </span>
        </div>
      </div>
      <div className="user-card-actions">
        <div
          style={{
            fontWeight: "400",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span>{d.role}</span>

        </div>
        <button onClick={() => navigate(`/singleProfileRequest/${d._id}`)}>
          View
        </button>
        <button
          style={{
            backgroundColor: d.verified ? 'grey' : 'green',
            color: 'white',
            cursor: d.verified ? 'not-allowed' : 'pointer'
          }}
          onClick={handleVerify}
          disabled={d.verified}
        >
          {d.verified ? "Verified" : "Verify"}
        </button>
      </div>
    </div>
  );
}