import React, { useEffect, useRef, useState } from "react";
import "./Post.css";
import { gridCSS } from "../../../CommonStyles";
import { Icon } from "@iconify/react";
import { MMDDYYFormat } from "../../../../Utils";
import { useNavigate } from "react-router";
import { ApiServices } from "../../../../Services/ApiServices";
import { ToastColors } from "../../../Toast/ToastColors";
import {
  setToast,
} from "../../../../redux/AuthReducers/AuthReducer";
import { Dialog, DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ShareButton from "../../ShareButton";
import ReactionButton from "../../../components/ReactionButton";
import { ReactionServices } from "../../../../Services/PostServices";
import { ReactionDisplay } from "../../../Posts/components/ReactionDisplay";
import { useAuthAction } from "../../../../hooks/useAuthAction"; // Import Auth Hook

const Post = ({
  post: initialPost,
  setAllPosts,
  screenDecider,
}) => {
  const userDetailsRef = useRef(null);
  const [post, setPost] = useState(initialPost || {});
  // Removed legacy localLikes/Dislikes state as we use unified reactions
  const { email, role, userName, user_id } = useSelector(
    (store) => store.auth.loginDetails || {}
  );
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState([]);
  const dispatch = useDispatch();
  const requireAuth = useAuthAction(); // Initialize Auth Hook

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
    }
  }, [initialPost]);

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
  }, [post?._id, dispatch]);

  // Enhanced handleReaction with Auth Guard
  const handleReaction = requireAuth(async (type, postId) => {
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

      // Also update parent state to reflect changes immediately across the feed
      if (setAllPosts) {
        setAllPosts((prevPosts) =>
          prevPosts.map((p) =>
            p?._id === postId
              ? {
                ...p,
                userReaction: response.data.userReaction,
                reactions: response.data.reactions,
              }
              : p
          )
        );
      }

    } catch (err) {
      dispatch(
        setToast({
          message: "Error updating reaction",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }
  });

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "menu"
    ) {
      document
        .getElementsByClassName(`postSubActions${post?._id}`)[0]
        ?.classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [deletePop, setdeletePopUp] = useState(false);
  const [reportpopup, setreportpopUp] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState("");

  const deletePost = async (e) => {
    e.target.disabled = true;
    await ApiServices.deletepost({ id: post?._id })
      .then((res) => {
        setAllPosts((prev) => [...prev.filter((p) => p._id !== post?._id)]);
        setdeletePopUp(false);
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
    e.target.disabled = false;
  };

  const reportPost = async (e) => {
    e.target.disabled = true;
    await ApiServices.addReport({
      id: post?._id,
      reportby: user_id,
      reason: reportText,
      reportType: reportType,
    })
      .then((res) => {
        setReportText("");
        setreportpopUp(false);
        dispatch(setToast({
          message: "Post Reported Successfuly",
          bgColor: ToastColors.success,
          visible: "yes",
        }));
      })
      .catch((err) => {
        dispatch(setToast({
          message: "Error occured when Reporting",
          bgColor: ToastColors.failure,
          visible: "yes",
        }));
      });
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const createMarkup = (html) => {
    return { __html: html };
  };

  const getDescription = () => {
    if (isExpanded) {
      return post?.description;
    } else {
      return post?.description?.length > 100
        ? post?.description.slice(0, 350) + "..."
        : post?.description;
    }
  };

  return (
    <section
      className={` shadow-lg ${screenDecider === "home" && "homeEditProfileOuterCard "}`}
    >
      <div className="ProfilepostContainer hover:cursor-pointer mt-1">
        <div className="PostHeaderContainer ">
          <div className="postTotaldetails ">
            <div
              className="PostheaderimageContainer"
              onClick={() => {
                if (!user_id) {
                  navigate("/signup");
                  return;
                }
                navigate(`/user/${post?.createdBy?._id}`);
              }}
            >
              <img
                src={
                  post?.createdBy?.image?.url
                    ? post.createdBy.image.url
                    : "/profile.png"
                }
                alt="profile"
              />
            </div>

            <div className="PostDetailsContainer">
              <div
                className="postCardUserName"
                onClick={() => {
                  if (!user_id) {
                    navigate("/signup");
                    return;
                  }
                  navigate(`/user/${post?.createdBy?._id}`);
                }}
              >
                {post?.createdBy?.userName && post?.createdBy?.userName[0]?.toUpperCase() +
                  post?.createdBy?.userName?.slice(1)}
              </div>
              <div className="postCardRole">{post?.createdBy?.role}</div>
              <div className="flex flex-row">
                <div className="postCardRole">{MMDDYYFormat(post?.updatedAt)}</div>
                <div>
                  {post?.visibility && (
                    <div>
                      {post.visibility === "public" ? (
                        <Icon
                          icon="ic:round-people-alt"
                          className="text-xl ml-3 text-neutral-600"
                        />
                      ) : post.visibility === "private" ? (
                        <Icon
                          className="text-xl ml-3 text-neutral-600"
                          icon="ri:chat-private-line"
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginTop: "-40px",
            }}
          >
            <div className="flex flex-col mt-0 space-y-3 relative">
              <div className="flex space-x-3">
                <div className="postType hidden md:block text-xs mt-1 sm:text-sm sm:mt-0">
                  {post?.type}
                </div>

                {/* Only show menu icon for authenticated users */}
                {user_id && (
                  <div
                    className="transition-transform menu-icon-wrapper cursor-pointer"
                    onClick={() => {
                      document
                        .getElementsByClassName(`postSubActions${post?._id}`)[0]
                        ?.classList.toggle("show");
                    }}
                  >
                    <svg
                      className="icon transition-transform"
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
                )}
              </div>

              {/* SubMenu - Only shown for authenticated users */}
              {user_id && (
                <div className={`subMenu postSubActions${post?._id} absolute top-full left-0 mt-2 hidden bg-white border rounded-md shadow-md z-50`} ref={userDetailsRef} >
                  {post?.createdBy?._id === user_id ? (
                    // Owner can edit and delete their own posts
                    <>
                      <div
                        style={{ color: "black" }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(`/editPostPage/${post?._id}`);
                        }}
                      >
                        Edit
                      </div>
                      <div
                        style={{ color: "black" }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setdeletePopUp(true)}
                      >
                        Delete
                      </div>
                    </>
                  ) : (
                    // Non-owners can only report
                    <div
                      style={{ color: "black" }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setreportpopUp(true)}
                    >
                      Report
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* post desc */}
        <div
          className="postDescContainer"
        >
          <div className="postTypeM md:hidden">
            {post?.type}
          </div>
          {/* Post container */}
          <div onClick={() => navigate(`/posts/${post?._id}`)}>
            <div className="postDesc">
              <b>{post?.postTitle}</b>
            </div>
            <div className="postDesc" style={{ whiteSpace: "pre-wrap" }}>
              <div
                dangerouslySetInnerHTML={createMarkup(getDescription())}
              ></div>
              {!isExpanded && post?.description?.length > 100 && (
                <span className="seeMore" onClick={toggleExpanded}>
                  ...See more
                </span>
              )}
            </div>
            <div className="tagsContainer">
              {post?.tags?.map((t) => (
                <div
                  key={t?._id}
                  className="indiTag"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user_id) {
                      navigate("/signup");
                      return;
                    }
                    navigate(`/user/${t._id}`);
                  }}
                >
                  {`@${t?.userName}`}
                </div>
              ))}
            </div>
            <div className="PostimageContainer">
              {post?.image?.url ? (
                <img
                  src={post.image.url}
                  style={{ objectFit: "contain" }}
                  alt=""
                  onClick={() => navigate(`/posts/${post?._id}`)}
                />
              ) : null}
            </div>
            <div className="likeCommentDetails mt-2">
              <ReactionDisplay reactions={post?.reactions} />
              <div className="commentTotal">{allComments?.length} comments</div>
            </div>
          </div>
        </div>
        <div className="actionsHolder font-semibold">
          <div className="actionsHolder-leftContent">
            <div className="likeActionHolder">
              <ReactionButton
                postId={post?._id}
                onReact={handleReaction}
                userReaction={post?.userReaction}
                post={post}
              />
            </div>
            <div
              className="likeActionHolder"
              onClick={() => {
                // Redirect unauthenticated users to signup
                if (!user_id) {
                  navigate("/signup");
                  return;
                }
                navigate(`/posts/${post?._id}`);
              }}
            >
              <div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 sm:w-5 sm:h-5"
                >
                  <path
                    d="M17 32C19.9667 32 22.8668 31.1203 25.3336 29.4721C27.8003 27.8238 29.7229 25.4811 30.8582 22.7403C31.9935 19.9994 32.2906 16.9834 31.7118 14.0737C31.133 11.1639 29.7044 8.49119 27.6066 6.3934C25.5088 4.29562 22.8361 2.86701 19.9264 2.28823C17.0166 1.70945 14.0006 2.0065 11.2597 3.14181C8.51886 4.27713 6.17618 6.19972 4.52796 8.66645C2.87973 11.1332 2 14.0333 2 17C2 19.48 2.6 21.8183 3.66667 23.8783L2 32L10.1217 30.3333C12.1817 31.4 14.5217 32 17 32Z"
                    stroke="var(--likeAction-bg)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="actionText  hidden sm:block font-thin">
                Comment
              </div>
            </div>

            <div className="likeActionHolder">
              <ShareButton url={`${window.location.origin}/posts/${post?._id}`} />
            </div>
          </div>

          <Dialog
            open={deletePop}
            onClose={() => {
              setdeletePopUp(false);
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
                    setdeletePopUp(false);
                  }}
                >
                  No
                </button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={reportpopup}
            onClose={() => {
              setreportpopUp(false);
              setReportText("");
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
              <div>
                <select
                  className="select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select Report Type</option>
                  <option value="spam">Spam</option>
                  <option value="abuse">Irrelevant content</option>
                </select>
              </div>

              <div>
                <textarea
                  className="textarea"
                  rows={2}
                  cols={50}
                  value={reportText}
                  onChange={(e) => {
                    setReportText(e.target.value);
                  }}
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
                  disabled={reportText === "" && reportType === ""}
                  onClick={(e) => {
                    reportPost(e);
                  }}
                >
                  Report
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Post;