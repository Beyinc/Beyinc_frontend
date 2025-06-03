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
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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
            <svg
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
            </svg>
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
