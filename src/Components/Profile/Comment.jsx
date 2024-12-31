import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';
import UserComment from '../Editprofile/Activities/userComment/UserComment';
import "./Comment.css";

const Comment = () => {

  const [allComments, setAllComments] = useState([]);
  const [convExits, setConvExists] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const { id } = useParams();
  const {
    user_id,
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);

  const sendText = async () => {
    setComment("");
    if (comment !== "") {
      await ApiServices.addUserComment({
        userId: id !== undefined ? id : user_id,
        comment: comment,
        commentBy: user_id,
      })
        .then((res) => {
          setAllComments(res.data);
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
        // setuser((prev) => ({
        //   ...prev,
        //   comments: (user.comments = user.comments.filter((f) => f._id !== did)),
        // }));
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

  const onLike = async (commentId, isLike) => {
    await ApiServices.likeComment({
      comment_id: commentId,
      comment_owner: id == undefined ? user_id : id,
    })
      .then((res) => {
        setAllComments(res.data);
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

  const onDisLike = async (commentId, isLike) => {
    await ApiServices.dislikeComment({
      comment_id: commentId,
      comment_owner: id == undefined ? user_id : id,
    })
      .then((res) => {
        setAllComments(res.data);
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

  return (
    <div>
      {/* Comment SECTION */}
      {(
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div className="allCommentShowContainer">
                <section className="EditProfileCard">
                  <div className="commentheader">Reviews</div>
                  <div className="commentLengthheader">
                    {allComments?.length} Reviews
                  </div>

                  {convExits ||
                  id == undefined ||
                  jwtDecode(
                    JSON.parse(localStorage.getItem("user")).accessToken
                  ).role == "Admin" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        marginLeft: "-15px",
                      }}
                    >
                      {id !== undefined && (
                        <div className="addingCommentImageShow">
                          <img
                            src={
                              loggedImage !== undefined && loggedImage !== ""
                                ? loggedImage
                                : "/profile.png"
                            }
                          />
                        </div>
                      )}
                      {id !== undefined && (
                        <section className="CommentPostContainer">
                          <div>
                            <textarea
                              type="text"
                              name=""
                              id=""
                              value={comment}
                              placeholder="Add a review comment..."
                              style={{ resize: "none" }}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                          <div
                            onClick={sendText}
                            style={{ cursor: comment == "" && "not-allowed" }}
                          >
                            <svg
                              className="send-button-svg"
                              width="34"
                              height="34"
                              viewBox="0 0 34 34"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.6668 20.3333L32.0001 2M13.6668 20.3333L19.5001 32C19.5732 32.1596 19.6906 32.2948 19.8384 32.3896C19.9861 32.4844 20.1579 32.5348 20.3335 32.5348C20.509 32.5348 20.6808 32.4844 20.8285 32.3896C20.9763 32.2948 21.0937 32.1596 21.1668 32L32.0001 2M13.6668 20.3333L2.00012 14.5C1.84055 14.4269 1.70533 14.3095 1.61053 14.1618C1.51573 14.014 1.46533 13.8422 1.46533 13.6667C1.46533 13.4911 1.51573 13.3193 1.61053 13.1716C1.70533 13.0239 1.84055 12.9065 2.00012 12.8333L32.0001 2"
                                stroke="var(--post-outer-border)"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                        </section>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "20px",
                        marginBottom: "20px",
                        textAlign: "center",
                      }}
                    >
                      Conversation with this user should exist to add reviews
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "40px",
                    }}
                  >
                    {allComments?.map((comment, index) => (
                      <UserComment
                        onLike={onLike}
                        key={index}
                        comment={comment}
                        deleteComment={deleteComment}
                        onDisLike={onDisLike}
                        setAllComments={setAllComments}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
    </div>
  )
}

export default Comment