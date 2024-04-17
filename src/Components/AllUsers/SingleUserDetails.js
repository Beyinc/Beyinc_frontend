import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";


// import Typography from "@mui/material/Typography";
// import AddPitch from "../Common/AddPitch";
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer";

const SingleUserDetails = ({
  d, setIsAdmin,
  connectStatus,
  setPitchSendTo,
  pitchSendTo,
  receiverRole,
  setreceiverRole,
}) => {
  // console.log(d);
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const dispatch = useDispatch();

  const [averagereview, setAverageReview] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setAverageReview(0);
    if (d.review !== undefined && d.review.length > 0) {
      let avgR = 0;
      d.review?.map((rev) => {
        avgR += rev.review;
      });
      setAverageReview(avgR / d.review.length);
    }
  }, [d]);

  const openUser = () => {
    if (user_id == d._id) {
      navigate(`/editProfile`)
    } else {
      navigate(`/user/${d._id}`)
    }
  };

  const isCurrentUser = email === d.email;
  const openChat = async (e) => {
    // await ApiServices.getProfile({ email: a.members.filter((f) => f.email !== email)[0].email }).then((res) => {
    dispatch(setReceiverId(d));
    // })
    navigate(`/conversations/${connectStatus[d._id]?.id}`);
  };
  return (
    <>
      <div
        className={
          "user-card-main-container " +
          (d.role === "Entrepreneur"
            ? "margin-entrepreneur"
            : d.role === "Mentor"
              ? "margin-mentor"
              : d.role === "Investor" ? 'margin-investor' : "")
        }
      >
        <div className="user-card-details">
          <div className="user-card-img-rating-container">
            <div className="user-card-image" onClick={openUser}>
              <img
                alt="user-pic"
                src={
                  d.image !== '' && d.image !== undefined && d.image.url !== ""
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
            <div className="user-card-rating">
              <div className="rating-content">
                <i className="far fa-comment"></i>
                <span style={{ marginLeft: "3px" }}>{d.comments?.length}</span>
              </div>
              <div className="rating-content">
                <i className="far fa-star"></i>
                <span style={{ marginLeft: "3px" }}>
                  {averagereview.toFixed(1).split(".")[1] != "0"
                    ? averagereview.toFixed(1)
                    : averagereview.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          <div className="user-card-details-text">
            <span className="user-name" onClick={openUser}>
              {d.userName}
            </span>
            {d.educationDetails.length > 0 ? <span>
              {d.educationDetails[0]?.grade} @ {d.educationDetails[0]?.college}
            </span> : <span style={{color: 'orange', border: '1px dashed orange', padding: '5px', width: '123px', whiteSpace: 'noWrap'}}>
                Profile not updated
            </span>}
            
            <span className="skills">{d.skills?.join(", ")}</span>
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
            <span style={{ fontWeight: "600", fontSize: '12px' }}>{d.role}</span>
            <span>

            </span>
          </div>

          {!isCurrentUser &&
            (connectStatus[d._id]?.status === "pending" ? (
              <button className="pending-color">Pending</button>
            ) : connectStatus[d._id]?.status === "approved" ? (
              <button className="approved-color" onClick={openChat}>
                Chat
              </button>
            ) : (
              <button
                className="connect-color"
                onClick={() => {
                  setPitchSendTo(d._id);
                  setreceiverRole(d.role);
                  setIsAdmin(d.email == process.env.REACT_APP_ADMIN_MAIL)
                }}
              >
                Connect
              </button>
            ))}
        </div>
      </div>
    </>
  );
};

export default SingleUserDetails;
