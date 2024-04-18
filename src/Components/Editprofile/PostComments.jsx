import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import "../LivePitches/IndividualPitch.css";
import IndividualPostComments from "./IndividualPostComments";
import './EditProfileUI.css'
const PostComments = ({ fetchComments, postId }) => {
    console.log(postId);
    const [pitch, setpitch] = useState("");
    const { user_id } = useSelector(
        (state) => state.auth.loginDetails
    );
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
    }, [postId, postTrigger, fetchComments]);

    const sendText = async () => {
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
    };

    const onLike = (commentId, isLike) => {
        ApiServices.likePostComment({
            comment_id: commentId,
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
        ApiServices.DislikePostComment({
            comment_id: commentId,
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
            <div className="">
                
                <div className="">
                    
                  

                    {allComments.length > 0 && (
                        <div>
                            <b>Discussions:</b>
                        </div>
                    )}
                    {allComments.length > 0 &&
                        allComments?.map(
                            (c) =>
                                c.parentCommentId == undefined && (
                                    <IndividualPostComments
                                        c={c}
                                        deleteComment={deleteComment}
                                        setpostTrigger={setpostTrigger}
                                        postTrigger={postTrigger}
                                        onLike={onLike}
                                        onDisLike={onDisLike} postId={postId}
                                    />
                                )
                        )}
                    
                    <div>



                        <div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostComments;
