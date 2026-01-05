import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { formatedDate, socket_io } from "../../Utils";
import { ApiServices } from "../../Services/ApiServices";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import useWindowDimensions from "../Common/WindowSize";
import { gridCSS } from "../CommonStyles";
import "./IndividualPostDetailsCard.css";
import ShareButton from "./ShareButton";
import { Dialog, DialogContent } from "@mui/material";
import PostComments from "./PostComments";
import { LiveChat } from "./LiveChat";
import { useAuthAction } from "../../hooks/useAuthAction";
import { ReactionServices } from "../../Services/PostServices";
import { ReactionDisplay } from "../Posts/components/ReactionDisplay";
import ReactionButton from "../components/ReactionButton";

const IndividualPostDetailsCard = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id !== undefined) {
      ApiServices.getPost({ id })
        .then((res) => {
          setPost(res.data);
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error occured when fetching post",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  }, [id]);

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const authenticated = useAuthAction();
  const loginDetails = useSelector((store) => store.auth.loginDetails || {});
  const { email, role, userName, verification, user_id } = loginDetails;
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const handleReaction = async (type, postId) => {
    try {
      const response = await ReactionServices.addOrUpdate({
        postId,
        reactionType: type,
      });

      setPost((prev) => ({
        ...prev,
        userReaction: response.data.userReaction,
        reactions: response.data.reactions
      }));
    } catch (err) {
      dispatch(
        setToast({
          message: "Error updating reaction",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }
  };

  const userDetailsRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "menu"
    ) {
      document
        .getElementsByClassName(`editpostSubActions${id}`)[0]
        ?.classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [deletePop, setDeletePopUp] = useState(false);
  const [reportPopup, setReportPopup] = useState(false);
  const [reportText, setReportText] = useState("");

  const deletePost = async (e) => {
    e.target.disabled = true;
    await ApiServices.deletepost({ id })
      .then((res) => {
        navigate(-1);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error occured when updating post",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  const reportPost = authenticated(async (e) => {
    e.target.disabled = true;
    await ApiServices.addReport({ id, reportby: user_id, reason: reportText })
      .then((res) => {
        setReportText("");
        navigate(-1);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error occured when Reporting",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  });

  const [editPostPopup, setEditPostPopup] = useState(false);
  const [editPostCount, setEditPostCount] = useState(false);

  const addingRequestDiscussion = authenticated(async (e) => {
    e.target.disabled = true;
    await ApiServices.requestIntoOpenDiscussion({ id: post?._id, user_id })
      .then((res) => {
        setPost(res.data);
        socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: post?.createdBy?._id,
        });
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error occured when updating Pitch",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = false;
      });
  });
  const [allComments, setAllComments] = useState([]);
  useEffect(() => {
    if (post?._id) {
      ApiServices.getPostComments({ postId: post?._id })
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
  }, [post?._id]);

  const onlineUsers = useSelector((state) => state.conv.onlineUsers);
  const [onlineEmails, setOnlineEmails] = useState([]);

  useEffect(() => {
    if (onlineUsers.length > 0) {
      const emails = [];
      onlineUsers.map((ol) => {
        if (!emails.includes(ol.userId)) {
          emails.push(ol.userId);
        }
      });
      setOnlineEmails(emails);
    }
  }, [onlineUsers]);

  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div className="post-details-main-container sm:p-4 p-2">
      {post !== null && (
        <div className="post-details-container">
          <div className="post-details-content-left grow">
            <div style={{ position: "relative" }}>
              <div className="PostHeaderContainer">
                <div className="individualPostTotalDetails gap-2">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${post?.createdBy?._id}`);
                    }}
                  >
                    <img
                      src={
                        post?.createdBy?.image !== "" &&
                          post?.createdBy?.image !== undefined &&
                          post?.createdBy?.image?.url !== ""
                          ? post?.createdBy?.image?.url
                          : "/profile.png"
                      }
                      alt=""
                      className="size-8 rounded-full"
                    />
                  </div>
                  <div className="IndividualPostDetailsContainer">
                    <div
                      className="postCardUserName"
                      onClick={() => {
                        navigate(`/user/${post?.createdBy?._id}`);
                      }}
                    >
                      {post?.createdBy?.userName?.[0]?.toUpperCase() +
                        post?.createdBy?.userName?.slice(1)}
                    </div>
                    <div className="postCardRole">{post?.createdBy?.role}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="postType"> {post?.type}</span>

                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="editpostSubActions"
                      style={{ cursor: "pointer" }}
                      id="menu"
                      onClick={() => {
                        document
                          .getElementsByClassName(`editpostSubActions${id}`)[0]
                          ?.classList.toggle("show");
                      }}
                    >
                      <svg
                        id="menu"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.75 15C8.75 15.663 8.48661 16.2989 8.01777 16.7678C7.54893 17.2366 6.91304 17.5 6.25 17.5C5.58696 17.5 4.95107 17.2366 4.48223 16.7678C4.01339 16.2989 3.75 15.663 3.75 15C3.75 14.337 4.01339 13.7011 4.48223 13.2322C4.95107 12.7634 5.58696 12.5 6.25 12.5C6.91304 12.5 7.54893 12.7634 8.01777 13.2322C8.48661 13.7011 8.75 14.337 8.75 15ZM17.5 15C17.5 15.663 17.2366 16.2989 16.7678 16.7678C16.2989 17.2366 15.663 17.5 15 17.5C14.337 17.5 13.7011 17.2366 13.2322 16.7678C12.7634 16.2989 12.5 15.663 12.5 15C12.5 14.337 12.7634 13.7011 13.2322 13.2322C13.7011 12.7634 14.337 12.5 15 12.5C15.663 12.5 16.2989 12.7634 16.7678 13.2322C17.2366 13.7011 17.5 14.337 17.5 15ZM26.25 15C26.25 15.663 25.9866 16.2989 25.5178 16.7678C25.0489 17.2366 24.413 17.5 23.75 17.5C23.087 17.5 22.4511 17.2366 21.9822 16.7678C21.5134 16.2989 21.25 15.663 21.25 15C21.25 14.337 21.5134 13.7011 21.9822 13.2322C22.4511 12.7634 23.087 12.5 23.75 12.5C24.413 12.5 25.0489 12.7634 25.5178 13.2322C25.9866 13.7011 26.25 14.337 26.25 15Z"
                          fill="var(--text-total-color)"
                        />
                      </svg>
                    </div>
                    <div
                      id="menu"
                      className={`subMenu editpostSubActions${id}`}
                      ref={userDetailsRef}
                    >
                      {post?.createdBy?._id == user_id && (
                        <>
                          <div
                            id="menu"
                            style={{
                              color: "black",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setEditPostCount((prev) => prev + 1);
                              navigate(`/editPostPage/${post?._id}`);
                            }}
                          >
                            Edit
                          </div>
                          <div
                            id="menu"
                            style={{
                              color: "black",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => setDeletePopUp(true)}
                          >
                            Delete
                          </div>
                        </>
                      )}
                      {post?.createdBy?._id !== user_id && (
                        <div
                          id="menu"
                          style={{ color: "black" }}
                          onClick={() => {
                            if (!user_id) {
                              navigate("/signup");
                            } else {
                              setReportPopup(true);
                            }
                          }}
                        >
                          Report
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* post desc */}
            <div className="postDescContainer">
              <div>
                <div className="postDesc">
                  <b dangerouslySetInnerHTML={createMarkup(post?.postTitle)}></b>
                </div>
                <div
                  className="postDesc"
                  style={{
                    whiteSpace: "pre-wrap",
                    padding: "0 0 0 10px",
                  }}
                  dangerouslySetInnerHTML={createMarkup(post?.description)}
                ></div>
              </div>

              <div className="tagsContainer">
                {post?.tags?.map((t) => (
                  <div
                    key={t?._id}
                    className="indiTag"
                    onClick={() => navigate(`/user/${t?._id}`)}
                  >
                    {`@${t?.userName}`}
                  </div>
                ))}
              </div>

              <div className="PostimageContainer">
                {post?.image?.url && (
                  <img
                    src={post.image.url}
                    style={{ objectFit: "contain" }}
                    alt=""
                    onClick={() => navigate(`/posts/${post?._id}`)}
                    className="w-[850px]"
                  />
                )}
              </div>
              <div
                className="postDesc w-[850px]"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {post?.fullDetails}
              </div>

              <div className="likeCommentDetails">
                <ReactionDisplay reactions={post?.reactions} />
                <div className="commentTotal">
                  {allComments?.length} comments
                </div>
              </div>
              <div className="actionsHolder">
                <div className="actionsHolder-leftContent">
                  <div className="likeActionHolder">
                    <ReactionButton
                      postId={post?._id}
                      onReact={handleReaction}
                      userReaction={post?.userReaction}
                      post={post}
                    />
                  </div>
                  <div className="likeActionHolder">
                    <div className="actionText">
                      <ShareButton url={window.location.href} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rightPostWrapper">
                {(post?.openDiscussion === true ||
                  post?.openDiscussionTeam
                    ?.map((o) => o._id)
                    .includes(user_id) ||
                  post?.createdBy?._id === user_id ||
                  role === "Admin") && (
                    <PostComments
                      postId={post?._id}
                      fetchComments={
                        post?.openDiscussion === true ||
                        post?.openDiscussionTeam
                          ?.map((o) => o._id)
                          .includes(user_id) ||
                        post?.createdBy?._id === user_id ||
                        role === "Admin"
                      }
                    />
                  )}
              </div>
            </div>
          </div>
          <div className="post-details-content-right grow min-w-[450px] max-w-[600px]">
            <div className="wholePostWrapper h-auto ">
              <div style={{ flex: "1", margin: "10px" }}>
                <div className="individualPostTotalDetailsRight gap-4">
                  <img
                    onClick={() => {
                      navigate(`/user/${post?.createdBy?._id}`);
                    }}
                    src={
                      post?.createdBy?.image !== "" &&
                        post?.createdBy?.image !== undefined &&
                        post?.createdBy?.image?.url !== ""
                        ? post?.createdBy?.image?.url
                        : "/profile.png"
                    }
                    alt=""
                    className="size-8 rounded-full"
                  />

                  <div className="IndividualPostDetailsContainer">
                    <div
                      className="postCardUserName"
                      onClick={() => {
                        navigate(`/user/${post?.createdBy?._id}`);
                      }}
                    >
                      {post?.createdBy?.userName?.[0]?.toUpperCase() +
                        post?.createdBy?.userName?.slice(1)}
                    </div>
                  </div>
                  {post?.createdBy?._id !== user_id &&
                    post.visibility === "private" && (
                      <div className="openDiscussion-Buttons">
                        {post?.openDiscussionRequests
                          ?.map((o) => o?._id)
                          .includes(user_id) ? (
                          <button>Discussion Request Pending</button>
                        ) : post?.openDiscussionTeam
                          ?.map((o) => o?._id)
                          .includes(user_id) ? (
                          <button>Joined</button>
                        ) : (
                          <button onClick={addingRequestDiscussion}>
                            Join for discussion
                          </button>
                        )}
                      </div>
                    )}
                </div>
                {post?.openDiscussion == false &&
                  post?.openDiscussionTeam?.length !== 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "100px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <div>
                        Members
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {post?.openDiscussionTeam?.length}
                        </div>
                      </div>
                      <div>
                        Online
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {
                            post?.openDiscussionTeam
                              ?.map((p) => p._id)
                              ?.filter((op) => onlineEmails?.includes(op))
                              .length
                          }
                        </div>
                      </div>
                    </div>
                  )}

                <div className="h-[1px] bg-gray-600 my-4 w-full"></div>
                <div className="text-[12px] w-fit">
                  <div style={{ marginBottom: "10px" }}>
                    <b>Updated at :</b> {formatedDate(post?.updatedAt)}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <b>Post type : </b> <span> {post?.visibility}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
                    <b style={{ padding: "5px 0px" }}>Tags:</b>
                    <div className="tagsContainer">
                      {post?.tags?.map((t) => (
                        <div
                          key={t?._id}
                          style={{
                            background: "var( --tag-bg-right)",
                            padding: "5px 10px",
                            borderRadius: "20px",
                          }}
                          className="indiTag"
                          onClick={() => navigate(`/user/${t._id}`)}
                        >
                          {t?.userName}
                        </div>
                      ))}
                    </div>
                  </div>

                  {post?.openDiscussion !== true && (
                    <div
                      style={{
                        marginBottom: "10px",
                        whiteSpace: "pre-wrap",
                        textAlign: "justify",
                      }}
                    >
                      <b>Group Discussion :</b> {post?.groupDiscussion}
                    </div>
                  )}

                  {post?.pitchId && (
                    <div style={{ marginBottom: "10px" }}>
                      <b>Pitch :</b> {post?.pitchId?.title}
                      {(post?.openDiscussion === true ||
                        post?.openDiscussionTeam
                          .map((o) => o._id)
                          .includes(user_id) ||
                        post?.createdBy._id === user_id ||
                        role === "Admin") && (
                          <Link to={`/livePitches/${post?.pitchId?._id}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.4em"
                              height="1.4em"
                              viewBox="0 0 24 24"
                              style={{ marginLeft: "10px", position: "absolute" }}
                            >
                              <title>View Pitch</title>
                              <path
                                fill="var( --button-background)"
                                d="M17 18c.6 0 1 .4 1 1s-.4 1-1 1s-1-.4-1-1s.4-1 1-1m0-3c-2.7 0-5.1 1.7-6 4c.9 2.3 3.3 4 6 4s5.1-1.7 6-4c-.9-2.3-3.3-4-6-4m0 6.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5m-7.9-1.8l-.3-.7H4V8h16v5.6c.7.3 1.4.6 2 1.1V8c0-.5-.2-1-.6-1.4S20.6 6 20 6h-4V4c0-.6-.2-1-.6-1.4S14.6 2 14 2h-4c-.6 0-1 .2-1.4.6S8 3.4 8 4v2H4c-.6 0-1 .2-1.4.6S2 7.5 2 8v11c0 .5.2 1 .6 1.4s.8.6 1.4.6h5.8c-.3-.4-.5-.8-.7-1.3M10 4h4v2h-4z"
                              />
                            </svg>
                          </Link>
                        )}
                    </div>
                  )}

                  {post?.link && (
                    <div style={{ marginBottom: "10px" }}>
                      <b>Link :</b>{" "}
                      <a href={post?.link} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <LiveChat
              post={post}
              onlineEmails={onlineEmails}
              userName={userName}
              user_id={user_id}
              isEnabled={
                post?.visibility === "public"
                  ? true
                  : post?.openDiscussionTeam?.find((u) => u._id === user_id) ||
                  post?.createdBy?._id === user_id
              }
            />
          </div>
        </div>
      )}

      {deletePop && (
        <Dialog
          open={deletePop}
          onClose={() => {
            setDeletePopUp(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          sx={{
            ...gridCSS.tabContainer,
          }}
        >
          <DialogContent
            style={{
              padding: "10px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            Are you sure to delete the post?
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={(e) => {
                  deletePost(e);
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setDeletePopUp(false);
                }}
              >
                No
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {reportPopup && (
        <div className="modal">
          <div className="modal-content">
            <div>
              <textarea
                className="textarea"
                rows={2}
                cols={50}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Report reason"
                style={{ resize: "none" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                disabled={reportText === ""}
                onClick={(e) => reportPost(e)}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualPostDetailsCard;
