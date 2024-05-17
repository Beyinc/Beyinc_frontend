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
  const { user_id } = useSelector((state) => state.auth.loginDetails);
  const [comment, setComment] = useState("");
  const [postTrigger, setpostTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allComments, setAllComments] = useState([]);

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  useEffect(() => {
    if (postId && fetchComments) {
      ApiServices.getPostComments({ postId: postId })
        .then((res) => {
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
  }, [postId, postTrigger, fetchComments]);

  const sendText = async () => {
    dispatch(setLoading({ visible: "yes" }));

    setComment("");
    await ApiServices.addPostComment({
      postId: postId,
      commentBy: user_id,
      comment: comment,
      parentCommentId: undefined,
    })
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
        <div
          className="writing-review"
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
                color: "gray",
                borderRadius: "35px",
                width: "100%",
                padding: "30px",
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              className="sendIcon"
              style={{
                cursor: comment === "" ? "not-allowed" : "pointer",
                padding: "10px",
                position: "absolute",
                right: "45px",
                top: "23px",
                transform: "rotate(45deg)",
              }}
            >
              <path
                fill="black"
                d="M7.5 18A5.5 5.5 0 0 1 2 12.5A5.5 5.5 0 0 1 7.5 7H18a4 4 0 0 1 4 4a4 4 0 0 1-4 4H9.5A2.5 2.5 0 0 1 7 12.5A2.5 2.5 0 0 1 9.5 10H17v1.5H9.5a1 1 0 0 0-1 1a1 1 0 0 0 1 1H18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 18 8.5H7.5a4 4 0 0 0-4 4a4 4 0 0 0 4 4H17V18z"
              />
            </svg>
            <svg
              onClick={sendText}
              className="sendIcon"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              style={{
                cursor: comment === "" ? "not-allowed" : "pointer",
                padding: "10px",
                position: "absolute",
                right: "5px",
                top: "23px",
                transform: "rotate(45deg)", // Added rotation
              }}
            >
              <path fill="black" d="m2 21l21-9L2 3v7l15 2l-15 2z" />
            </svg>
          </div>
          <div></div>
        </div>
      </div>
      {allComments.length > 0 && (
        <div>
          <b>Discussions:</b>
        </div>
      )}
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
