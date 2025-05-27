import React, { useEffect, useRef, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import IndividualPostSubComments from "./IndividualPostSubComments";

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
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const scrollRef = useRef();
  const [comment, setComment] = useState("");
  const [replyBox, setReplyBox] = useState(false);
  const [subCommentOpen, setSubCommentOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const addSubComment = async () => {
    setReplyBox(false);
    setComment("");
    await ApiServices.addPostComment({
      postId: postId,
      commentBy: user_id,
      comment: comment,
      parentCommentId: c._id,
    })
      .then((res) => {
        setpostTrigger(!postTrigger);
        setComment("");
      })
      .catch((err) => {
        navigate("/livePitches");
      });
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
            if (c?.commentBy?._id == user_id) {
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
          <div className="IndicommentsSectionDetailscomment">{c?.comment}</div>
          
          {/* File attachment display */}
          {c?.file && (
            <div className="comment-file-attachment" style={{ marginTop: '10px' }}>
              {c.file.type === 'image' && (
                <img 
                  src={c.file.url} 
                  alt="Comment attachment" 
                  style={{ 
                    maxWidth: '500px', 
                    maxHeight: '400px',
                    width: '100%',
                    borderRadius: '12px',
                    cursor: 'zoom-in',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  onClick={() => setZoomedImage(c.file.url)}
                />
              )}
              {c.file.type === 'video' && (
                <video 
                  controls 
                  style={{ 
                    maxWidth: '500px',
                    maxHeight: '400px',
                    width: '100%',
                    borderRadius: '12px',
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  <source src={c.file.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {c.file.type === 'pdf' && (
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px',
                    background: 'var(--comment-file-bg, #f5f5f5)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(c.file.url, '_blank')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>View PDF</span>
                </div>
              )}
            </div>
          )}

          {/* Image Zoom Modal */}
          {zoomedImage && (
            <div 
              className="image-zoom-modal" 
              onClick={() => setZoomedImage(null)}
            >
              <div className="close-button" onClick={() => setZoomedImage(null)}>
                ✕
              </div>
              <img 
                src={zoomedImage} 
                alt="Zoomed view" 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

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
                  class={`fas ${
                    subCommentOpen ? "fa-caret-down" : "fa-caret-right"
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
                onChange={(e) => {
                  setComment(e.target.value);
                }}
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
                onClick={addSubComment}
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
        )}
      </div>
    </>
  );
};

export default IndividualPostComments;
