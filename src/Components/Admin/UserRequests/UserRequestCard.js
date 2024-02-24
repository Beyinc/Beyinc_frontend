import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ApiServices } from "../../../Services/ApiServices";
import { useNavigate } from "react-router";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function UserRequestCard({ d }) {
  const navigate = useNavigate();
  // const [image, setImage] = React.useState('')
  // React.useEffect(() => {
  //     ApiServices.getProfile({ email: d.email }).then(res => {
  //         setImage(res.data.image.url)
  //     })
  // }, [d])

  const openUser = () => navigate(`/user/${d.userInfo._id}`);
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
                d.userInfo?.image !== undefined && d.userInfo?.image !== ""
                  ? d.userInfo?.image.url
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
      </div>
    </div>
  );
}
