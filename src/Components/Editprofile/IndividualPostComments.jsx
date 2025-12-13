import React, { useEffect, useRef, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import IndividualPostSubComments from "./IndividualPostSubComments";
import { setLoading } from "../../redux/AuthReducers/AuthReducer";
const IndividualPostComments = ({
  c,
  postId,
  deleteComment,
  setpostTrigger,
  postTrigger,
  parentCommentId,
  onLike,
  onDisLike,
}) => {
  const { user_id } = useSelector((state) => state.auth.loginDetails);
  const scrollRef = useRef();
  const [comment, setComment] = useState("");
  const [replyBox, setReplyBox] = useState(false);
  const [subCommentOpen, setSubCommentOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const [liked, setLiked] = useState(false);

  const [disliked, setdisLiked] = useState(false);

  const [count, setCount] = useState(0);
  const [dislikecount, setdislikecount] = useState(0);

  useEffect(() => {
    setLiked(c.likes?.includes(user_id));
    setdisLiked(c.Dislikes?.includes(user_id));
    setCount(c.likes?.length);
    setdislikecount(c.Dislikes?.length);
  }, [c, user_id]);

  // const addSubComment = async () => {
  //   setReplyBox(false);
  //   setComment("");
  //   await ApiServices.addPostComment({
  //     postId: postId,
  //     commentBy: user_id,
  //     comment: comment,
  //     parentCommentId: c._id,
  //   })
  //     .then((res) => {
  //       setpostTrigger(!postTrigger);
  //       setComment("");
  //     })
  //     .catch((err) => {
  //       navigate("/livePitches");
  //     });
  // };

  const handleFileUpload = (selectedFile) => {
    console.log("file selected");
    setFile(selectedFile);
    if (selectedFile) {
      console.log("Selected file:", selectedFile.name);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const addSubComment = async () => {
    console.log("add comment clicked");
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
      await ApiServices.addPostComment({
        postId,
        commentBy: user_id,
        comment,
        fileBase64,
        parentCommentId: c._id,
      });

      setComment("");
      setFile(null);
      setpostTrigger((prev) => !prev);
    } catch (err) {
      alert(err?.response?.data?.error || "Something went wrong");
    } finally {
      dispatch(setLoading({ visible: "no" }));
    }
  };

  const handleLike = (id) => {
    if (liked) {
      setLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
      setdislikecount((prev) => prev - 1);
      setdisLiked(false);
    }
    onLike(id, !c.likes?.includes(user_id));
  };

  const handleDisLike = (id) => {
    if (disliked) {
      setdisLiked(false);
      setdislikecount((prev) => prev - 1);
    } else {
      setdisLiked(true);
      setLiked(false);

      setdislikecount((prev) => prev + 1);
      setCount((prev) => prev - 1);
    }
    onDisLike(id, !c.Dislikes?.includes(user_id));
  };

  return (
    <>
      <div className="IndicommentsSection">
        <div
          className="IndicommentsSectionImage"
          onClick={() => {
            if (c?.commentBy?._id === user_id) {
              navigate("/editProfile");
            } else {
              navigate(`/user/${c?.commentBy?._id}`);
            }
          }}
        >
          <img
            src={c?.profile_pic || c?.commentBy?.image?.url || "/profile.png"}
            alt=""
          />
        </div>
        <div className="IndicommentsSectionDetails">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="IndicommentsSectionDetailsUserName">
              <div>{c?.userName || c?.commentBy?.userName} </div>
              {/* <div title={'Delete Comment'} onClick={()=>deleteComment(c._id)}>{(c?.email || c?.commentBy?.email) == email && <i className='fas fa-trash'></i>}</div> */}
            </div>
            <div
              style={{ fontWeight: "200" }}
              className="IndicommentsSectionDetailsdate"
            >
              {format(c?.createdAt)}
            </div>
          </div>
          {/* <div className="IndicommentsSectionDetailscomment">{c?.comment?c.comment:c.fileUrl}</div> */}
          <div className="IndicommentsSectionDetailscomment">
            <>
              {/* Always show comment if it exists */}
              {c?.comment && (
                <div style={{ marginBottom: "5px" }}>{c.comment}</div>
              )}

              {/* Show file if fileUrl exists */}
              {c?.fileUrl &&
                (() => {
                  const fileName = c.fileUrl.split("/").pop();

                  return (
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fileName.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img
                          src={c.fileUrl}
                          alt="comment file"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "8px",
                            marginTop: "5px",
                            cursor: "pointer",
                            display: "block",
                          }}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0073e6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginTop: "5px" }}
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                      )}
                    </a>
                  );
                })()}
            </>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              margin: "5px",
            }}
          >
            <div className="IndicommentsSectionActions">
              <div
                style={{ display: "flex", gap: "3px", alignItems: "center" }}
              >
                {count > 0 && <div>{count}</div>}
                {liked ? (
                  <i
                    class="fa fa-thumbs-up icon-blue"
                    aria-hidden="true"
                    onClick={() => handleLike(c._id)}
                  />
                ) : (
                  <i
                    class="far fa-thumbs-up"
                    aria-hidden="true"
                    onClick={() => handleLike(c._id)}
                  />
                )}
              </div>

              <div
                style={{ display: "flex", gap: "3px", alignItems: "center" }}
              >
                {dislikecount > 0 && <div>{dislikecount}</div>}
                {disliked ? (
                  <i
                    class="fa fa-thumbs-down icon-blue"
                    aria-hidden="true"
                    onClick={() => handleDisLike(c._id)}
                  />
                ) : (
                  <i
                    class="far fa-thumbs-down"
                    aria-hidden="true"
                    onClick={() => handleDisLike(c._id)}
                  />
                )}
              </div>
            </div>

            <div>
              <span
                className="replyTag"
                onClick={() => {
                  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                  setReplyBox(!replyBox);

                  // setReplyBox(!replyBox)
                }}
              >
                Reply
              </span>
            </div>
          </div>

          {c.subComments?.length > 0 && (
            <div
              className="totalSubComments"
              onClick={() => setSubCommentOpen(!subCommentOpen)}
            >
              <div>
                <i
                  class={`fas ${subCommentOpen ? "fa-caret-down" : "fa-caret-right"
                    }`}
                ></i>
              </div>
              <div>{c.subComments?.length} replies</div>
            </div>
          )}
        </div>
      </div>
      <div className="subcommentsContainer">
        {subCommentOpen &&
          c.subComments?.length > 0 &&
          c.subComments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ?.map((cs) => (
              <IndividualPostSubComments
                c={cs}
                scrollRef={scrollRef}
                setReplyBox={setReplyBox}
                replyBox={replyBox}
                onLike={onLike}
                onDisLike={onDisLike}
              />
            ))}
      </div>
      <div ref={scrollRef}>
        {replyBox && (
          <div
            // className="writing-review"
            className="CommentPostContainer"
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
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
                style={{ resize: "none" }}

                onKeyDown={(e) => {
                  if (e.key === "Enter" && (comment.trim() || file)) {
                    e.preventDefault();
                    addSubComment();
                  }
                }}
              />

              {/* File upload icon */}
              <label htmlFor="file-upload-subcomments">
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
                    position: "absolute",
                    right: "90px",
                    top: "10px",
                  }}
                >
                  <path d="M21.44 11.05l-9.19 9.2a4 4 0 0 1-5.66-5.66l9.2-9.2a3 3 0 0 1 4.24 4.24l-8.49 8.49a1 1 0 0 1-1.42-1.42l7.78-7.78" />
                </svg>
              </label>

              <input
                id="file-upload-subcomments"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  console.log("File selected");
                  handleFileUpload(e.target.files[0]);
                }}

              />

              {/* File name preview */}
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

              {/* Send button */}
              <svg
                onClick={addSubComment} // or sendText, depending on function logic
                className="send-button-svg"
                width="30"
                height="30"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  cursor: comment === "" && !file ? "not-allowed" : "pointer",
                  padding: "10px",
                  position: "absolute",
                  right: "0px",
                  top: "6px",
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
        )}
      </div>
    </>
  );
};

export default IndividualPostComments;
