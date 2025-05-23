import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import "../LivePitches/IndividualPitch.css";
import IndividualPostComments from "./IndividualPostComments";
import "./PostComments.css";

const PostComments = ({ fetchComments, postId }) => {
  console.log(postId);
  const [pitch, setpitch] = useState("");
  const { user_id, image } = useSelector((state) => state.auth.loginDetails);
  const [comment, setComment] = useState("");
  const [postTrigger, setpostTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allComments, setAllComments] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const sendText = async () => {
    dispatch(setLoading({ visible: "yes" }));

    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("commentBy", user_id);
    formData.append("comment", comment);
    formData.append("parentCommentId", undefined);

    // Append each attachment
    attachments.forEach(file => {
      formData.append("files", file);
    });

    setComment("");
    setAttachments([]);

    await ApiServices.addPostComment(formData)
      .then((res) => {
        setpostTrigger(!postTrigger);
      })
      .catch((err) => {
        navigate("/");
      });

    dispatch(setLoading({ visible: "no" }));
  };

  const onLike = async (commentId, isLike) => {
    dispatch(setLoading({ visible: "yes" }));

    await ApiServices.likePostComment({
      comment_id: commentId,
    })
      .then((res) => {})
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occurred",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    dispatch(setLoading({ visible: "no" }));
  };

  const onDisLike = async (commentId, isLike) => {
    dispatch(setLoading({ visible: "yes" }));

    await ApiServices.DislikePostComment({
      comment_id: commentId,
    })
      .then((res) => {})
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occurred",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    dispatch(setLoading({ visible: "no" }));
  };

  const deleteComment = async (id) => {
    await ApiServices.removePitchComment({ postId: postId, commentId: id })
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

  return (
    <div className="">
      <div className="postCommentAddSection">
      <div style={{display:'flex', flexDirection: 'row'}}>
      <div
        >
          <img
            id="Profile-img"
            className="Profile-img"
            src={image !== undefined && image !== "" ? image : "/profile.png"}
            alt=""
          />
        </div>
        <div
          // className="writing-review"
          className="CommentPostContainer"
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <textarea
              className="textarea"
              rows={2}
              cols={80}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                resize: "none",
              }}
            />
            {/* Remove this non-working pin SVG */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              className="send-button-svg"
              style={{
                cursor: comment === "" ? "not-allowed" : "pointer",
                padding: "10px",
                position: "absolute",
                right: "45px",
                top: "6px",
                transform: "rotate(-230deg)",
              }}
            >
              <path
                fill="gray"
                d="M7.5 18A5.5 5.5 0 0 1 2 12.5A5.5 5.5 0 0 1 7.5 7H18a4 4 0 0 1 4 4a4 4 0 0 1-4 4H9.5A2.5 2.5 0 0 1 7 12.5A2.5 2.5 0 0 1 9.5 10H17v1.5H9.5a1 1 0 0 0-1 1a1 1 0 0 0 1 1H18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 18 8.5H7.5a4 4 0 0 0-4 4a4 4 0 0 0 4 4H17V18z"
              />
            </svg> */}
            <svg
              onClick={sendText}
              className="send-button-svg"
              width="30"
              height="30"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                cursor: comment === "" ? "not-allowed" : "pointer",
                padding: "10px",
                position: "absolute",
                right: "0px",
                top: "6px",
              }}
            >
              <path
                d="M13.6668 20.3333L32.0001 2M13.6668 20.3333L19.5001 32C19.5732 32.1596 19.6906 32.2948 19.8384 32.3896C19.9861 32.4844 20.1579 32.5348 20.3335 32.5348C20.509 32.5348 20.6808 32.4844 20.8285 32.3896C20.9763 32.2948 21.0937 32.1596 21.1668 32L32.0001 2M13.6668 20.3333L2.00012 14.5C1.84055 14.4269 1.70533 14.3095 1.61053 14.1618C1.51573 14.014 1.46533 13.8422 1.46533 13.6667C1.46533 13.4911 1.51573 13.3193 1.61053 13.1716C1.70533 13.0239 1.84055 12.9065 2.00012 12.8333L32.0001 2"
                stroke="gray"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            
            {/* Add file input */}
            <label htmlFor="file-input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  position: "absolute",
                  right: "90px",
                  top: "6px",
                }}
              >
                <path
                  fill="gray"
                  d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
                />
              </svg>
            </label>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            {/* Preview attachments */}
            {attachments.length > 0 && (
              <div className="attachments-preview" style={{
                marginLeft: '20px',  // Add space from the left
                marginTop: '15px'    // Increase top margin
              }}>
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-item" style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px',    // Increased padding
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 'fit-content',
                    backgroundColor: '#f8f8f8',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'  // Subtle shadow
                  }}>
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="attachment"
                        style={{ 
                          width: '140px', 
                          height: '140px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          margin: '4px'  // Add margin around image
                        }} 
                      />
                    ) : (
                      <video 
                        src={URL.createObjectURL(file)} 
                        controls
                        style={{ 
                          width: '140px', 
                          height: '140px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          margin: '4px'  // Add margin around video
                        }} 
                      />
                    )}
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      style={{
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginTop: '6px',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#ff3333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4d'}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
      </div>
      {/* {allComments.length > 0 && (
        <div>
          <b>Discussions:</b>
        </div>
      )} */}
      <div
        style={{ height: "500px", overflowY: "scroll", overflowX: "hidden" }}
      >
        {allComments.length > 0 &&
          allComments.map(
            (c) =>
              c.parentCommentId === undefined && (
                <IndividualPostComments
                  key={c._id}
                  c={c}
                  deleteComment={deleteComment}
                  setpostTrigger={setpostTrigger}
                  postTrigger={postTrigger}
                  onLike={onLike}
                  onDisLike={onDisLike}
                  postId={postId}
                />
              )
          )}
      </div>
    </div>
  );
};

export default PostComments;
