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
import { useAuthAction } from "../../hooks/useAuthAction";

const PostComments = ({ fetchComments, postId }) => {
  const loginDetails = useSelector((state) => state.auth.loginDetails || {});
  const { user_id, image } = loginDetails;
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [postTrigger, setpostTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useAuthAction();
  const [allComments, setAllComments] = useState([]);
  const socket = useRef();

  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  useEffect(() => {
    if (postId && fetchComments) {
      ApiServices.getPostComments({ postId })
        .then((res) => {
          setAllComments(
            res.data.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
          );
        })
        .catch(() => {
          dispatch(
            setToast({
              message: "Error Occurred",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  }, [postId, postTrigger, fetchComments]);

  const handleFileUpload = (selectedFile) => {
    console.log("file selected");
    setFile(selectedFile);
  };

  // const sendText = async () => {
  //   if (!comment.trim() && !file) return;

  //   dispatch(setLoading({ visible: "yes" }));
  //   const formData = new FormData();
  //   formData.append("postId", postId);
  //   formData.append("commentBy", user_id);
  //   formData.append("comment", comment);
  //   if (file) formData.append("file", file);

  //   try {
  //     await ApiServices.addPostComment(formData);
  //     setComment("");
  //     setFile(null);
  //     setpostTrigger((prev) => !prev);
  //   } catch (err) {
  //     // navigate("/posts");
  //     alert(err)
  //   } finally {
  //     dispatch(setLoading({ visible: "no" }));
  //   }
  // };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const sendText = authenticated(async () => {
    if (!comment.trim() && !file) return;

    dispatch(setLoading({ visible: "yes" }));

    let fileBase64 = "";

    if (file) {
      try {
        fileBase64 = await toBase64(file);
        if (!fileBase64.startsWith("data:")) {
          throw new Error("Invalid base64 file format");
        }
      } catch (err) {
        alert("Failed to convert file to base64.");
        dispatch(setLoading({ visible: "no" }));
        return;
      }
    }

    try {
      const response = await ApiServices.addPostComment({
        postId,
        commentBy: user_id,
        comment,
        fileBase64,
      });

      setComment("");
      setFile(null);
      setpostTrigger((prev) => !prev);
    } catch (err) {
      alert(err?.response?.data?.error || "Something went wrong");
    } finally {
      dispatch(setLoading({ visible: "no" }));
    }
  });

  const onLike = authenticated(async (commentId) => {
    dispatch(setLoading({ visible: "yes" }));
    try {
      await ApiServices.likePostComment({ comment_id: commentId });
    } catch {
      dispatch(
        setToast({
          message: "Error Occurred",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    } finally {
      dispatch(setLoading({ visible: "no" }));
    }
  });

  const onDisLike = authenticated(async (commentId) => {
    dispatch(setLoading({ visible: "yes" }));
    try {
      await ApiServices.DislikePostComment({ comment_id: commentId });
    } catch {
      dispatch(
        setToast({
          message: "Error Occurred",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    } finally {
      dispatch(setLoading({ visible: "no" }));
    }
  });

  const deleteComment = async (id) => {
    try {
      await ApiServices.removePitchComment({ postId, commentId: id });
      setAllComments((prev) => prev.filter((c) => c._id !== id));
    } catch {
      dispatch(
        setToast({
          visible: "yes",
          message: "Error Occurred",
          bgColor: "red",
        })
      );
    }
  };
  const handleKeyDown = (e) => {
    const currentValue = e.target.value.trim();

    if (e.key === "Enter" && !e.shiftKey) {
      console.log("entered");
      e.preventDefault();
      if (currentValue) {
        setComment(currentValue);
        sendText();
      }
    }
  };
  return (
    <div className="">
      <div className="postCommentAddSection ml-5">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <img
              id="Profile-img"
              className="Profile-img"
              src={
                image?.url !== undefined && image?.url !== ""
                  ? image.url
                  : "/profile.png"
              }
              alt=""
            />
          </div>
          <div
            className="CommentPostContainer"
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-end",
            }}
          >
            <div className="relative w-full  rounded-[30px] bg-[var(--editprofile-details-card-bg)] p">
              <div className="flex">
                <textarea
                  className="textarea grow !h-fit !p-[3px]"
                  rows={2}
                  cols={80}
                  onKeyDown={handleKeyDown}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{ resize: "none" }}
                />
                <div className="flex gap-2 items-center ">
                  <input
                    id="file-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                  <label htmlFor="file-upload">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="gray"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <path d="M21.44 11.05l-9.19 9.2a4 4 0 0 1-5.66-5.66l9.2-9.2a3 3 0 0 1 4.24 4.24l-8.49 8.49a1 1 0 0 1-1.42-1.42l7.78-7.78" />
                    </svg>
                  </label>
                  <svg
                    onClick={sendText}
                    className="send-button-svg w-[20px] h-[20px]"
                    width="30"
                    height="30"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      cursor:
                        comment === "" && !file ? "not-allowed" : "pointer",
                      padding: "10px",
                    }}
                  >
                    <path
                      d="M13.6668 20.3333L32.0001 2M13.6668 20.3333L19.5001 32C19.5732 32.1596 19.6906 32.2948 19.8384 32.3896C19.9861 32.4844 20.1579 32.5348 20.3335 32.5348C20.509 32.5348 20.6808 32.4844 20.8285 32.3896C20.9763 32.2948 21.0937 32.1596 21.1668 32L32.0001 2M13.6668 20.3333L2.00012 14.5C1.84055 14.4269 1.70533 14.3095 1.61053 14.1618C1.51573 14.014 1.46533 13.8422 1.46533 13.6667C1.46533 13.4911 1.51573 13.3193 1.61053 13.1716C1.70533 13.0239 1.84055 12.9065 2.00012 12.8333L32.0001 2"
                      stroke="gray"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 📎 Attach File Icon (paperclip) */}

              {/* ⬅️ Preview file name with a file icon */}
              {file && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    fontSize: "12px",
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="gray"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {file.name}
                </div>
              )}

              {/* Send Icon (SVG) */}
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div
        style={{ height: "500px", overflowY: "scroll", overflowX: "hidden" }}
      >
        {allComments.length > 0 &&
          allComments.map(
            (c) =>
              c?.parentCommentId === undefined && (
                <IndividualPostComments
                  key={c?._id}
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
