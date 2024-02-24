import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { format } from "timeago.js";
import ReviewStars from "./ReviewStars";
import PitchDetailsReadOnly from "../Common/PitchDetailsReadOnly";
import IndividualPitchComment from "./IndividualPitchComment";
import SendIcon from "@mui/icons-material/Send";
import AddReviewStars from "./AddReviewStars";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import moment from "moment";
import "./IndividualPitch.css";
import { setLoading } from "../../redux/AuthReducers/AuthReducer";

const IndividualPitch = () => {
  const [pitch, setpitch] = useState("");
  const { email, image, userName, user_id } = useSelector(
    (state) => state.auth.loginDetails
  );
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [averagereview, setAverageReview] = useState(0);
  const [value, setValue] = useState(1);
  const [open, setOpen] = useState(false);
  const { pitchId } = useParams();
  const [comment, setComment] = useState("");
  const [pitchTrigger, setPitchTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allComments, setAllComments] = useState([]);

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    ApiServices.getStarsFrom({ pitchId: pitchId, email: email }).then((res) => {
      setFilledStars(res.data.review !== undefined ? res.data.review : 0);
    });
  }, [pitchId]);

  const sendReview = async () => {
    await ApiServices.addPitchReview({
      pitchId: pitchId,
      review: { email: email, review: filledStars },
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Review Updated",
            visible: "yes",
            bgColor: ToastColors.success,
          })
        );
        setPitchTrigger(!pitchTrigger);
        socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: pitch?.userInfo,
        });
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            visible: "yes",
            bgColor: ToastColors.failure,
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          visible: "",
          bgColor: "",
        })
      );
    }, 4000);
  };

  useEffect(() => {
    // console.log("object");
    if (pitchId) {
      dispatch(setLoading({ visible: "yes" }));
      ApiServices.fetchSinglePitch({ pitchId: pitchId })
        .then((res) => {
          // console.log(res.data);
          setpitch({
            ...res.data,
          });
          if (res.data.review !== undefined && res.data.review?.length > 0) {
            let avgR = 0;
            res.data.review?.map((rev) => {
              avgR += rev.review;
            });
            setAverageReview(avgR / res.data.review.length);
          }
          dispatch(setLoading({ visible: "no" }));
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error Occured",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  }, [pitchId, pitchTrigger]);

  useEffect(() => {
    if (pitchId) {
      ApiServices.getPitchComments({ pitchId: pitchId })
        .then((res) => {
          // console.log(res.data);
          setAllComments(
            res.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error Occured",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  }, [pitchId, pitchTrigger]);

  const sendText = async () => {
    setComment("");
    await ApiServices.addPitchComment({
      pitchId: pitchId,
      commentBy: user_id,
      comment: comment,
      parentCommentId: undefined,
    })
      .then((res) => {
        setPitchTrigger(!pitchTrigger);
      })
      .catch((err) => {
        navigate("/livePitches");
      });
  };

  const onLike = (commentId, isLike) => {
    ApiServices.likePitchComment({
      comment_id: commentId,
      comment_owner: pitch._id,
    })
      .then((res) => {
        // dispatch(
        //   setToast({
        //     message: isLike ? "Comment Liked" : "Comment Disliked",
        //     bgColor: ToastColors.success,
        //     visible: "yes",
        //   })
        // );
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occurred",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  const onDisLike = (commentId, isLike) => {
    ApiServices.dislikePitchComment({
      comment_id: commentId,
      comment_owner: pitch._id,
    })
      .then((res) => { })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occurred",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  const deleteComment = async (id) => {
    await ApiServices.removePitchComment({ pitchId: pitchId, commentId: id })
      .then((res) => {
        setpitch((prev) => ({
          ...prev,
          comments: (pitch.comments = pitch.comments.filter(
            (f) => f._id !== id
          )),
        }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            visible: "yes",
            message: "Error Occured",
            bgColor: "red",
          })
        );
      });
  };

  const addToIntrest = async () => {
    await ApiServices.addIntrest({ pitchId: pitchId, email: email })
      .then((res) => {
        setpitch((prev) => ({
          ...prev,
          intrest: [
            ...pitch.intrest,
            { email: email, profile_pic: image, userName: userName },
          ],
        }));
        dispatch(
          setToast({
            message: "Added to Interest",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: pitch?.userInfo,
        });
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const removeFromIntrest = async () => {
    await ApiServices.removeIntrest({ pitchId: pitchId, email: email })
      .then((res) => {
        setpitch((prev) => ({
          ...prev,
          intrest: [...pitch.intrest.filter((p) => p.email !== email)],
        }));
        dispatch(
          setToast({
            message: "Removed from Interest",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  return (
    <div className="profile-Container">
      <div className="individualPitchContainer">
        <div className="indiPitchDetailsContainer">
          <div className="indiPitchDetails">
            <div className="main-container">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="indiPitchHeading">
                  {pitch?.heading}
                  <i
                    className="fas fa-eye"
                    title="View Pitch"
                    style={{ fontSize: "16px", marginLeft: "20px" }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  ></i>
                </div>
              </div>
              <div>
                <div className="indiPitchDate">
                  Posted about{" "}
                  <b>{moment(pitch?.createdAt).format("MMM Do YY")}</b> by{" "}
                  <b>{pitch?.userInfo?.userName}</b>
                </div>
              </div>
              <div className="indiPitchDesc">
                <textarea
                  style={{
                    resize: "none",
                    width: "95%",
                    border: "none",
                    textAlign: "justify",
                    outline: "0",
                    fontFamily: "Poppins",
                  }}
                  disabled
                  rows={16}
                  value={pitch?.description}
                ></textarea>
              </div>

              {pitch?.hiringPositions?.length > 0 && (
                <div className="indiPitchHiringPositions">
                  <b className="side-headings"> People Needed:</b>
                  {pitch?.hiringPositions?.map((h) => (
                    <div className="hp">{h}</div>
                  ))}
                </div>
              )}
              {pitch?.industry1 !== "" && (
                <div className="indiPitchHiringPositions">
                  <b className="side-headings"> Domain:</b>
                  <div className="hp">{pitch?.industry1}</div>
                </div>
              )}
              {pitch?.industry2 !== "" && (
                <div className="indiPitchHiringPositions">
                  <b className="side-headings"> Tech:</b>

                  <div className="hp">{pitch?.industry2}</div>
                </div>
              )}

              <PitchDetailsReadOnly
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                pitchDetails={pitch}
              />
            </div>
            <div className="rating-container">
              <div className="reviewInterestContainer">
                <h4>{pitch.review?.length} Global Ratings</h4>
                <div className="">
                  <ReviewStars avg={averagereview} />
                </div>
                {email !== pitch?.email && (
                  <div
                    className={`intrestButton ${pitch?.intrest?.length > 0 &&
                        pitch?.intrest.filter((p) => p.email === email).length > 0
                        ? "removeIntrest"
                        : "addIntrest"
                      }`}
                  >
                    {pitch?.intrest?.length > 0 &&
                      pitch?.intrest.filter((p) => p.email === email).length >
                      0 ? (
                      <span onClick={removeFromIntrest}>
                        Remove from interest
                      </span>
                    ) : (
                      <span onClick={addToIntrest}>Add to interest</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="commentsContainer">
          <h2 className="Rating-heading">Ratings & Discussion</h2>
          <div>
            <div style={{ display: "flex", gap: "10px" }}>
              <img src={image} />
              <div>
                <span>
                  <b>{userName}</b>
                </span>
                <div style={{ fontSize: "12px", marginBottom: "20px" }}>
                  Discussions are public and include your account details
                </div>
              </div>
            </div>

            <div className="Rating-Content" style={{ marginLeft: "60px" }}>
              <h4>Rate this user</h4>
              <h6>Tell others what you think</h6>
              <div
                className="stars"
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <AddReviewStars
                  filledStars={filledStars}
                  setFilledStars={setFilledStars}
                />{" "}
                <button className="sendIcon" onClick={sendReview}>
                  Post
                </button>
              </div>
              <div>
                {!isWritingReview && (
                  <div
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => setIsWritingReview(true)}
                  >
                    <b>Write a Review</b>
                  </div>
                )}
                {isWritingReview && (
                  <div
                    className="writing-review"
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <textarea
                        className="textarea"
                        rows={2}
                        cols={50}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Describe Your Experience"
                        style={{ resize: "none" }}
                      />
                    </div>
                    <div>
                      <button
                        onClick={sendText}
                        className="sendIcon"
                        style={{
                          cursor: comment == "" ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          padding: "10px",
                        }}
                      >
                        Post Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {allComments.length > 0 && (
            <div>
              <b>Discussions:</b>
            </div>
          )}
          {allComments.length > 0 &&
            allComments?.map(
              (c) =>
                c.parentCommentId == undefined && (
                  <IndividualPitchComment
                    c={c}
                    deleteComment={deleteComment}
                    setPitchTrigger={setPitchTrigger}
                    pitchTrigger={pitchTrigger}
                    onLike={onLike}
                    onDisLike={onDisLike}
                  />
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default IndividualPitch;
