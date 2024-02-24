import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import "./individualUser.css";
import ReviewStars from "../LivePitches/ReviewStars";
import AddReviewStars from "../LivePitches/AddReviewStars";
import { jwtDecode } from "jwt-decode";
import IndividualPitchComment from "../LivePitches/IndividualPitchComment";
import { convertToDate, formatedDate } from "../../Utils";
import IndividualUserReview from "./IndividualUserReview";


const IndividualUser = () => {
  const { image, userName, user_id } = useSelector(
    (state) => state.auth.loginDetails
  );
  const [isWritingReview, setIsWritingReview] = useState(false);
  const { visible } = useSelector((state) => state.auth.LoadingDetails);
  const [user, setuser] = useState("");
  const [averagereview, setAverageReview] = useState(0);
  const [emailTrigger, setemailTrigger] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [showOldEducation, setShowOldEducation] = useState(false);
  const [showOldExperience, setShowOldExperience] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [convExits, setConvExists] = useState(false)
  useEffect(() => {
    if (user !== '') {
      ApiServices.checkConvBtwTwo({ senderId: user_id, receiverId: user._id }).then(res => {
        setConvExists(true)
      }).catch(err => {
        setConvExists(false)
      })
    }
  }, [user, user_id])
  const onLike = (commentId, isLike) => {
    ApiServices.likeComment({ comment_id: commentId, comment_owner: user._id })
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
    ApiServices.dislikeComment({
      comment_id: commentId,
      comment_owner: user._id,
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

  // useEffect(() => console.log(user), [user]);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(setLoading({ visible: "yes" }));
      ApiServices.getProfile({ id: id })
        .then((res) => {
          setuser({
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
              message: "Error Occurred",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          navigate("/searchusers");
        });
    }
  }, [id, emailTrigger]);

  useEffect(() => {
    if (id !== undefined) {
      // dispatch(setLoading({ visible: "yes" }));
      ApiServices.getuserComments({ userId: id })
        .then((res) => {
          setAllComments(
            res.data.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
          );
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error Occurred",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          // console.log(err);
          // navigate("/searchusers");
        });
    }
  }, [id, emailTrigger]);

  const [filledStars, setFilledStars] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    ApiServices.getUsersStarsFrom({
      userId: id,
      reviewBy: user_id,
    }).then((res) => {
      setFilledStars(res.data.review !== undefined ? res.data.review : 0);
    });
  }, [id]);

  const sendReview = async () => {
    await ApiServices.addUserReview({
      userId: user._id,
      review: {
        reviewBy: user_id,
        review: filledStars,
      },
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Review Updated",
            visible: "yes",
            bgColor: ToastColors.success,
          })
        );
        setemailTrigger(!emailTrigger);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occurred",
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

  const sendText = async () => {
    setComment("");
    if (comment !== "") {
      await ApiServices.addUserComment({
        userId: id,
        comment: comment,
        commentBy: user_id,
      })
        .then((res) => {
          setemailTrigger(!emailTrigger)

        })
        .catch((err) => {
          // navigate("/searchusers");
          dispatch(
            setToast({
              visible: "yes",
              message: "Error Occurred while adding comment",
              bgColor: ToastColors.failure,
            })
          );
        });
    }
  };

  const deleteComment = async (did) => {
    await ApiServices.removeUserComment({ userId: id, commentId: did })
      .then((res) => {
        setuser((prev) => ({
          ...prev,
          comments: (user.comments = user.comments.filter((f) => f._id !== did)),
        }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            visible: "yes",
            message: "Error Occurred",
            bgColor: "red",
          })
        );
      });
  };

  return visible === "yes" ? (
    ""
  ) : (
    <div className="profile-Container">
      <div className="individualUserContainer">
        <div className="indiUserDetailsContainer">
          <div className="indiUserDetails">
            <div className="left-container">
              <div className="user-image">
                <img
                  className="profile"
                    src={
                      user?.image !== '' &&
                    user?.image?.url !== undefined
                      ? user?.image?.url
                      : "/profile.png"
                  }
                  alt=""
                  srcset=""
                />
              </div>

              <div className="ed-ex-container">
                {user.educationDetails?.length > 0 && (
                  <div className="" style={{ flexDirection: "column" }}>
                    <h4 className="Headings">Educational Details</h4>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div className="company indiPitchHiringPositions">
                            {user.educationDetails[0].college}
                          </div>
                          <div>
                            <div className="profession indiPitchHiringPositions">
                              {user.educationDetails[0].grade}
                            </div>
                            <div className="timeline indiPitchHiringPositions">
                              {convertToDate(user.educationDetails[0].Edstart)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {user.educationDetails.length > 1 && (
                      <div>
                        <div
                          onClick={() => setShowOldEducation(!showOldEducation)}
                        >
                          {showOldEducation ? (
                            <i
                              title="close"
                              className="fas fa-chevron-up"
                              onClick={() => setShowOldEducation(false)}
                            ></i>
                          ) : (
                            <i
                              title="show previous education"
                              className="fas fa-chevron-down"
                              onClick={() => setShowOldEducation(true)}
                            ></i>
                          )}
                        </div>
                        {showOldEducation && (
                          <div className="old-education">
                            {user.educationDetails.slice(1).map((te, i) => (
                              <div key={i}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div className="company indiPitchHiringPositions">
                                      {te.college}
                                    </div>
                                    <div>
                                      <div className="profession indiPitchHiringPositions">
                                        {te.grade}
                                      </div>
                                      <div className="timeline indiPitchHiringPositions">
                                        {convertToDate(te.Edstart)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {user.experienceDetails?.length > 0 && (
                  <div className="" style={{ flexDirection: "column" }}>
                    <h4 className="Headings">Experience Details</h4>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div className="company indiPitchHiringPositions">
                            {user.experienceDetails[0].company}
                          </div>
                          <div>
                            <div className="profession indiPitchHiringPositions">
                              {user.experienceDetails[0].profession}
                            </div>
                            <div className="timeline indiPitchHiringPositions">
                              {convertToDate(user.experienceDetails[0].start)} -{" "}
                              {user.experienceDetails[0].end === ""
                                ? "Present"
                                : convertToDate(user.experienceDetails[0].end)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {user.experienceDetails.length > 1 && (
                      <div>
                        <div
                          onClick={() =>
                            setShowOldExperience(!showOldExperience)
                          }
                        >
                          {showOldExperience ? (
                            <i
                              title="close"
                              className="fas fa-chevron-up"
                              onClick={() => setShowOldExperience(false)}
                            ></i>
                          ) : (
                            <i
                              title="show previous experience"
                              className="fas fa-chevron-down"
                              onClick={() => setShowOldExperience(true)}
                            ></i>
                          )}
                        </div>
                        {showOldExperience && (
                          <div className="old-experience">
                            {user.experienceDetails.slice(1).map((te, i) => (
                              <div key={i}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div className="company indiPitchHiringPositions">
                                      {te.company}
                                    </div>
                                    <div>
                                      <div className="profession indiPitchHiringPositions">
                                        {te.profession}
                                      </div>
                                      <div className="timeline indiPitchHiringPositions">
                                        {convertToDate(te.start)} -{" "}
                                        {te.end === ""
                                          ? "Present"
                                          : convertToDate(te.end)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="right-container">
              <div className="User-Top-Details">
                <div className="indiUserHeading">
                  <div className="profile-details">
                    <div className="profile-name">
                      {" "}
                      {user?.userName}{" "}
                      {user.verification == "approved" && (
                        <img
                          title="verified"
                          src="/verify.png"
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </div>
                    <div className="profile-role">{user?.role}</div>
                    <div className="indiPitchDate">
                      Profile Created on <b>{formatedDate(user?.createdAt)}</b>
                    </div>
                    <div className="location-info">
                      {user?.town && <div>{user.town}</div>}
                      {user?.state && (
                        <>
                          {user.country && (
                            <div style={{ margin: "0 5px" }}>|</div>
                          )}
                          <div>{user.state}</div>
                          {user.town && (
                            <div style={{ margin: "0 5px" }}>|</div>
                          )}
                        </>
                      )}

                      {user?.country && (
                        <div>{user.country}</div>
                      )}
                    </div>

                    <div className="language">
                      {user.languagesKnown?.length > 0 && (
                        <div className="listedTeam">
                          {user.languagesKnown?.map((t, i) => (
                            <div className="singleMember indiPitchHiringPositions">
                              <div>{t}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="aboutme">
                {user.bio && (
                  <div>
                    <h4 className="Headings">About</h4>
                  </div>
                )}
                {user.bio && (
                  <textarea
                    style={{
                      resize: "none",
                      width: "100%",
                      border: "none",
                      textAlign: "justify",
                      outline: "0",
                      fontFamily: 'Poppins',
                    }}
                    id="outlined-multiline-flexible"
                    name="bio"
                    value={user.bio}
                    cols="20"
                    rows="20"
                  />
                )}
              </div>

              <div className="ed-ex-container-dummy">
                {user.educationDetails?.length > 0 && (
                  <div className="" style={{ flexDirection: "column" }}>
                    <h4 className="Headings">Educational Details</h4>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div className="company indiPitchHiringPositions">
                            {user.educationDetails[0].college}
                          </div>
                          <div>
                            <div className="profession indiPitchHiringPositions">
                              {user.educationDetails[0].grade}
                            </div>
                            <div className="timeline indiPitchHiringPositions">
                              {convertToDate(user.educationDetails[0].Edstart)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {user.educationDetails.length > 1 && (
                      <div>
                        <div
                          onClick={() => setShowOldEducation(!showOldEducation)}
                        >
                          {showOldEducation ? (
                            <i
                              title="close"
                              className="fas fa-chevron-up"
                              onClick={() => setShowOldEducation(false)}
                            ></i>
                          ) : (
                            <i
                              title="show previous education"
                              className="fas fa-chevron-down"
                              onClick={() => setShowOldEducation(true)}
                            ></i>
                          )}
                        </div>
                        {showOldEducation && (
                          <div className="old-education">
                            {user.educationDetails.slice(1).map((te, i) => (
                              <div key={i}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div className="company indiPitchHiringPositions">
                                      {te.college}
                                    </div>
                                    <div>
                                      <div className="profession indiPitchHiringPositions">
                                        {te.grade}
                                      </div>
                                      <div className="timeline indiPitchHiringPositions">
                                        {convertToDate(te.Edstart)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {user.experienceDetails?.length > 0 && (
                  <div className="" style={{ flexDirection: "column" }}>
                    <h4 className="Headings">Experience Details</h4>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div className="company indiPitchHiringPositions">
                            {user.experienceDetails[0].company}
                          </div>
                          <div>
                            <div className="profession indiPitchHiringPositions">
                              {user.experienceDetails[0].profession}
                            </div>
                            <div className="timeline indiPitchHiringPositions">
                              {convertToDate(user.experienceDetails[0].start)} -{" "}
                              {user.experienceDetails[0].end === ""
                                ? "Present"
                                : convertToDate(user.experienceDetails[0].end)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {user.experienceDetails.length > 1 && (
                      <div>
                        <div
                          onClick={() =>
                            setShowOldExperience(!showOldExperience)
                          }
                        >
                          {showOldExperience ? (
                            <i
                              title="close"
                              className="fas fa-chevron-up"
                              onClick={() => setShowOldExperience(false)}
                            ></i>
                          ) : (
                            <i
                              title="show previous experience"
                              className="fas fa-chevron-down"
                              onClick={() => setShowOldExperience(true)}
                            ></i>
                          )}
                        </div>
                        {showOldExperience && (
                          <div className="old-experience">
                            {user.experienceDetails.slice(1).map((te, i) => (
                              <div key={i}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div className="company indiPitchHiringPositions">
                                      {te.company}
                                    </div>
                                    <div>
                                      <div className="profession indiPitchHiringPositions">
                                        {te.profession}
                                      </div>
                                      <div className="timeline indiPitchHiringPositions">
                                        {convertToDate(te.start)} -{" "}
                                        {te.end === ""
                                          ? "Present"
                                          : convertToDate(te.end)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="review-container">
              <div className="reviewContainer">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <b>{user.review?.length}</b> <span> Global Ratings</span>
                </div>
                <ReviewStars avg={averagereview} />
                <span></span>
              </div>
              <div>
                <div className="texts">
                  {user.skills?.length > 0 && (
                    <div className="profile_skills ">
                      <h4 className="Headings">Skills</h4>
                      {user.skills?.map((t, i) => (
                        <div className="skill indiPitchHiringPositions" key={i}>
                          <div>{t}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="commentsContainer">
          <h2 className="Rating-heading">Ratings & Reviews</h2>
            {(convExits || jwtDecode(JSON.parse(localStorage.getItem("user")).accessToken).role=='Admin') ? (id !==
            jwtDecode(JSON.parse(localStorage.getItem("user")).accessToken)
              .user_id && (
              <div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <img src={image !== '' &&
                   image!== undefined ? image : '/profile.png'} />
                  <div>
                    <span>
                      <b>{userName}</b>
                    </span>
                    <div style={{ fontSize: "12px", marginBottom: "20px" }}>
                      Reviews are public and include your account details
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
                    <button
                      style={{
                        cursor: "pointer",
                        fontSize: "13px",
                        width: "auto",
                      }}
                      onClick={sendReview}
                    >
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
                            style={{ resize: "none" }}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe Your Experience"
                          />
                        </div>
                        <div>
                          <button
                            onClick={sendText}
                            className="sendIcon"
                            style={{
                              cursor: comment === "" ? "not-allowed" : "pointer",
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
            )) : <>
            <div style={{ fontSize: "20px", marginBottom: "20px" }}>
              Conversation with this user should exist to add reviews
            </div>
          </>}

          {allComments.length > 0 && (
            <div>
              <b>Reviews:</b>
            </div>
          )}
          <div
            style={{
              maxHeight: "340px",
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {allComments.length > 0 &&
              allComments.map((c, index) => (
                <IndividualUserReview
                  onLike={onLike}
                  key={index}
                  c={c}
                  deleteComment={deleteComment}
                  onDisLike={onDisLike}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualUser;
