import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { useAuthAction } from "../../hooks/useAuthAction";

const IndividualPostSubComments = ({
  c,
  onLike,
  onDisLike,
  setReplyBox,
  replyBox,
  scrollRef,
}) => {
  const loginDetails = useSelector((state) => state.auth.loginDetails || {});
  const { email, user_id } = loginDetails;
  const navigate = useNavigate();
  const authenticated = useAuthAction();
  const { pitchId } = useParams();

  const [liked, setLiked] = useState(false);

  const [disliked, setdisLiked] = useState(false);

  const [count, setCount] = useState(0);
  const [dislikecount, setdislikecount] = useState(0);

  useEffect(() => {
    console.log(c);
    setLiked(user_id ? c.likes?.includes(user_id) : false);
    setdisLiked(user_id ? c.Dislikes?.includes(user_id) : false);
    setCount(c.likes?.length);
    setdislikecount(c.Dislikes?.length);
  }, [c, user_id]);

  const handleLike = authenticated((id) => {
    if (liked) {
      setLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
      setdislikecount((prev) => (prev > 0 ? prev - 1 : 0));
      setdisLiked(false);
    }
    onLike(id, !c.likes?.includes(user_id));
  });

  const handleDisLike = authenticated((id) => {
    if (disliked) {
      setdisLiked(false);
      setdislikecount((prev) => prev - 1);
    } else {
      setdisLiked(true);
      setLiked(false);

      setdislikecount((prev) => prev + 1);
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }
    onDisLike(id, !c.Dislikes?.includes(user_id));
  });

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
          <div className="IndicommentsSectionDetailsUserName">
            <div>{c?.userName || c?.commentBy?.userName}</div>
            <div
              style={{ fontWeight: "200" }}
              className="IndicommentsSectionDetailsdate"
            >
              {format(c?.createdAt)}
            </div>
            {/* <div title={'Delete Comment'} onClick={()=>deleteComment(c._id)}>{(c?.email || c?.commentBy?.email) == email && <i className='fas fa-trash'></i>}</div> */}
          </div>
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
                onClick={authenticated(() => {
                  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                  setReplyBox(!replyBox);
                })}
              >
                Reply
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualPostSubComments;
