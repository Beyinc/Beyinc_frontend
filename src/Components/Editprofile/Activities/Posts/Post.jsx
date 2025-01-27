import React, { useEffect, useRef, useState } from "react";
import "./Post.css";
import { gridCSS } from "../../../CommonStyles";
import { Icon } from "@iconify/react";
import { MMDDYYFormat, convertToDate } from "../../../../Utils";
import { useNavigate } from "react-router";
import { ApiServices } from "../../../../Services/ApiServices";
import { ToastColors } from "../../../Toast/ToastColors";
import {
  setLoading,
  setToast,
} from "../../../../redux/AuthReducers/AuthReducer";
import { Dialog, DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import EditPost from "./EditPost";
import ShareButton from "../../ShareButton";

const Post = ({filteredPosts,post:initialPost, setAllPosts, screenDecider }) => {
  const userDetailsRef = useRef(null);
  const [editPostPopup, setEditPostpopup] = useState(false);
  const [EditPostCount, setEditPostCount] = useState(false);
  const [post, setPost] = useState(initialPost ||{});
  const { email, role, userName, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState([]);
  // const [post, setPost] = useState(null);

  const dispatch = useDispatch();


 console.log('post',post)

  useEffect(() => {
    if (post?._id) {
      ApiServices.getPostComments({ postId: post?._id })
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
  }, [post?._id]);

  // useEffect(() => {
  //   console.log("Updated posts:", post);
  // }, [post,allPosts]);
  

  const likingpost = async () => {
    dispatch(setLoading({ visible: "yes" }));

    await ApiServices.likePost({ id: post?._id })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error occured when updating Pitch",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    dispatch(setLoading({ visible: "no" }));
  };


  const dislikePost = async () => {
    dispatch(setLoading({ visible: "yes" }));

    await ApiServices.dislikePost({ id: post?._id })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error occured when updating Pitch",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    dispatch(setLoading({ visible: "no" }));
  };


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

  const deletePost = async (e) => {
    e.target.disabled = true;
    await ApiServices.deletepost({ id: post?._id })
      .then((res) => {
        // navigate(-1);
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
    })
      .then((res) => {
        setReportText("");
        navigate(-1);
      })
      .catch((err) => {
        setToast({
          message: "Error occured when Reporting",
          bgColor: ToastColors.failure,
          visible: "yes",
        });
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
        ? post?.description.slice(0, 100) + "..."
        : post?.description;
    }
  };

  // const addingRequestDiscussion = async (e) => {
  //   e.target.disabled = true;
  //   await ApiServices.requestIntoOpenDiscussion({ id: post?._id, user_id })
  //     .then((res) => {
  //       setPost(res.data);
  // socket.current.emit("sendNotification", {
  //   senderId: user_id,
  //   receiverId: post?.createdBy._id,
  // });
  //     })
  //     .catch((err) => {
  //       dispatch(
  //         setToast({
  //           message: "Error occured when updating Pitch",
  //           bgColor: ToastColors.failure,
  //           visible: "yes",
  //         })
  //       );
  //       e.target.disabled = false;
  //     });
  // };

  return (
    <section
      className={` mt-4 ${
        screenDecider == "home" && "homeEditProfileOuterCard "
      }`}
    >
      <div className="ProfilepostContainer">
        <div className="PostHeaderContainer">
          <div className="postTotaldetails">
            <div
              className="PostheaderimageContainer"
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
                />

          
                {/* {post?.createdBy?.image?.url ? (
                      <img
                        src={post.createdBy.image.url}
                        alt=""
                      />
                    ) : null} */}

            </div>

            <div className="PostDetailsContainer">
              <div
                className="postCardUserName"
                onClick={() => {
                  navigate(`/user/${post?.createdBy?._id}`);
                }}
              >
                {post?.createdBy?.userName[0]?.toUpperCase() +
                  post?.createdBy?.userName?.slice(1)}
              </div>
              <div className="postCardRole">{post?.createdBy?.role}</div>
              <div className="flex flex-row">
                <div className="postCardRole">
                  {MMDDYYFormat(post?.updatedAt)}
                </div>
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
            <div className="flex flex-col mt-12 space-y-3">
              <div className="flex space-x-3">
                <div className="postType">{post?.type}</div>
                <div
                  id="menu"
                  onClick={() => {
                    document
                      .getElementsByClassName(`postSubActions${post?._id}`)[0]
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
              </div>
            </div>

            <div
              id="menu"
              className={`subMenu postSubActions${post?._id}`}
              ref={userDetailsRef}
            >
              {post?.createdBy?._id == user_id && (
                <>
                  <div
                    id="menu"
                    style={{ color: "black" }}
                    onClick={() => {
                      setEditPostCount((prev) => prev + 1);
                      // setEditPostpopup(true);
                      navigate(`/editPostPage/${post?._id}`);
                    }}
                  >
                    Edit
                  </div>
                  <div
                    id="menu"
                    style={{ color: "black" }}
                    onClick={() => setdeletePopUp(true)}
                  >
                    Delete
                  </div>
                </>
              )}
              {post?.createdBy?._id !== user_id && (
                <div
                  id="menu"
                  style={{ color: "black" }}
                  onClick={() => setreportpopUp(true)}
                >
                  Report
                </div>
              )}
            </div>
          </div>
        </div>

        {/* post desc */}
        <div className="postDescContainer"
        //  onClick={() => navigate(`/posts/${post?._id}`)}
        >

              {/* Post container */}
          <div        onClick={() => navigate(`/posts/${post?._id}`)} >  
                 

       
          
          <div  className="postDesc">
            <b>{post?.postTitle}</b>
          </div>
          <div className="postDesc" style={{ whiteSpace: "pre-wrap" }}>
            <div dangerouslySetInnerHTML={createMarkup(getDescription())}></div>
            {!isExpanded && post?.description?.length > 100 && (
              <span className="seeMore" onClick={toggleExpanded}>
                ...See more
              </span>
            )}
          </div>
          <div className="tagsContainer">
            {post?.tags?.map((t) => (
              <div
                className="indiTag"
                onClick={() => navigate(`/user/${t._id}`)}
              >
                {`@${t?.userName}`}
              </div>
            ))}
          </div>
          <div className="PostimageContainer">
                      {post?.image !== "" &&
              post?.image !== undefined &&
              post?.image?.url !== "" && (
                <img
                  src={
                    post?.image !== "" &&
                    post?.image !== undefined &&
                    post?.image?.url !== ""
                      ? post?.image?.url
                      : "/profile.png"
                  }
                  style={{ objectFit: "contain" }}
                  alt=""
                  onClick={() => navigate(`/posts/${post?._id}`)}
                />
              )}

{/* 
            {post?.image?.url && ( // Check if the image URL is available
              <img
                src={post.image.url}
                style={{ objectFit: "contain" }}
                alt=""
                onClick={() => navigate(`/posts/${post?._id}`)}
              />
            )} */}
          </div>
          <div className="likeCommentDetails">
            <div className="likeTotal">
              <div>
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25.9541 15.6358C26.4463 14.9854 26.7188 14.1885 26.7188 13.3594C26.7188 12.044 25.9834 10.7988 24.7998 10.1045C24.4951 9.92579 24.1482 9.83172 23.7949 9.83205H16.7695L16.9453 6.23147C16.9863 5.36135 16.6787 4.53518 16.0811 3.9053C15.7878 3.59483 15.4339 3.34781 15.0414 3.17951C14.6488 3.01121 14.2259 2.92519 13.7988 2.92678C12.2754 2.92678 10.9277 3.95217 10.5234 5.41994L8.00684 14.5313H4.21875C3.7002 14.5313 3.28125 14.9502 3.28125 15.4688V26.1328C3.28125 26.6514 3.7002 27.0703 4.21875 27.0703H21.835C22.1045 27.0703 22.3682 27.0176 22.6113 26.9121C24.0059 26.3174 24.9053 24.9551 24.9053 23.4434C24.9053 23.0742 24.8525 22.711 24.7471 22.3594C25.2393 21.709 25.5117 20.9121 25.5117 20.083C25.5117 19.7139 25.459 19.3506 25.3535 18.999C25.8457 18.3487 26.1182 17.5518 26.1182 16.7227C26.1123 16.3535 26.0596 15.9873 25.9541 15.6358ZM5.39062 24.961V16.6406H7.76367V24.961H5.39062ZM24.0352 14.6192L23.3936 15.1758L23.8008 15.9199C23.9349 16.1651 24.0045 16.4403 24.0029 16.7197C24.0029 17.2031 23.792 17.6631 23.4287 17.9795L22.7871 18.5362L23.1943 19.2803C23.3285 19.5254 23.3981 19.8007 23.3965 20.0801C23.3965 20.5635 23.1855 21.0235 22.8223 21.3399L22.1807 21.8965L22.5879 22.6406C22.7221 22.8858 22.7916 23.161 22.79 23.4404C22.79 24.0967 22.4033 24.6885 21.8057 24.958H9.63867V16.5469L12.5537 5.98537C12.6289 5.71467 12.7902 5.47585 13.0133 5.30509C13.2364 5.13433 13.5091 5.04095 13.79 5.03908C14.0127 5.03908 14.2324 5.10354 14.4082 5.23537C14.6982 5.45217 14.8535 5.78029 14.8359 6.12893L14.5547 11.9414H23.7656C24.2871 12.2608 24.6094 12.7998 24.6094 13.3594C24.6094 13.8428 24.3984 14.2998 24.0352 14.6192Z"
                      fill="var(--personalDetails-color)"
                    />
                  </svg>
                </div>
                <div style={{ color: "var(--personalDetails-color)" }}>
                  {post?.likes?.length > 0 && post?.likes[0]?.userName}{" "}
                  {post?.likes?.length > 1 &&
                    `and ${post?.likes?.length - 1} other`}
                </div>
              </div>

              <div>
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 40 40"
                    fill={"none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.6055 19.1524C34.7461 18.6836 34.8164 18.1993 34.8164 17.7071C34.8164 16.6016 34.4531 15.5391 33.7969 14.6719C33.9375 14.2032 34.0078 13.7188 34.0078 13.2266C34.0078 12.1211 33.6445 11.0586 32.9883 10.1914C33.1289 9.72269 33.1992 9.23831 33.1992 8.74613C33.1992 6.7305 32 4.91409 30.1406 4.12113C29.8138 3.98022 29.4614 3.90841 29.1055 3.91019H5.625C4.93359 3.91019 4.375 4.46878 4.375 5.16019V19.3789C4.375 20.0703 4.93359 20.6289 5.625 20.6289H10.6758L14.0273 32.7696C14.5664 34.7266 16.3633 36.0938 18.3945 36.0938C19.5547 36.0938 20.6367 35.6328 21.4375 34.7891C22.2383 33.9493 22.6484 32.8477 22.5898 31.6875L22.3555 26.8868H31.7266C32.1992 26.8868 32.6602 26.7618 33.0664 26.5235C34.6445 25.6055 35.625 23.9414 35.625 22.1875C35.625 21.0821 35.2617 20.0196 34.6055 19.1524ZM7.1875 17.8125V6.71878H10.3516V17.8125H7.1875ZM31.6875 24.0782H19.4062L19.7812 31.8282C19.8047 32.293 19.5977 32.7305 19.2109 33.0196C18.9727 33.1953 18.6797 33.2852 18.3867 33.2813C18.0124 33.2777 17.6494 33.1527 17.3522 32.9252C17.0549 32.6977 16.8395 32.3799 16.7383 32.0196L12.8516 17.9375V6.71878H29.0781C29.4686 6.89377 29.8002 7.17783 30.033 7.53679C30.2659 7.89576 30.39 8.31435 30.3906 8.74222C30.3906 9.12113 30.3008 9.4805 30.1211 9.80863L29.5781 10.8008L30.4336 11.543C30.6744 11.7515 30.8674 12.0095 30.9995 12.2994C31.1316 12.5892 31.1998 12.9041 31.1992 13.2227C31.1992 13.6016 31.1094 13.961 30.9297 14.2891L30.3867 15.2813L31.2422 16.0235C31.483 16.232 31.676 16.49 31.8081 16.7798C31.9402 17.0697 32.0083 17.3846 32.0078 17.7032C32.0078 18.0821 31.918 18.4414 31.7383 18.7696L31.1914 19.7657L32.0469 20.5078C32.2877 20.7164 32.4807 20.9744 32.6128 21.2642C32.7449 21.5541 32.813 21.869 32.8125 22.1875C32.8125 22.9336 32.3828 23.6524 31.6875 24.0782Z"
                      fill="var(--personalDetails-color)"
                    />
                  </svg>
                </div>
                <div style={{ color: "var(--personalDetails-color)" }}>
                  {post?.disLikes?.length > 0 && post?.disLikes[0]?.userName}{" "}
                  {post?.disLikes?.length > 1 &&
                    `and ${post?.disLikes?.length - 1} other`}
                </div>
              </div>
            </div>
            <div className="commentTotal">{allComments?.length} comments</div>
          </div>
          </div>
          <div className="actionsHolder">
            <div className="actionsHolder-leftContent">
              <div className="likeActionHolder" onClick={likingpost}>
                {/* LIKE ACTION */}
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 40 40"
                    fill={"none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.6055 20.8477C35.2617 19.9805 35.625 18.918 35.625 17.8125C35.625 16.0586 34.6445 14.3985 33.0664 13.4727C32.6601 13.2344 32.1976 13.109 31.7266 13.1094H22.3594L22.5938 8.30862C22.6484 7.14847 22.2383 6.0469 21.4414 5.20706C21.0503 4.79311 20.5785 4.46375 20.0551 4.23935C19.5318 4.01494 18.9679 3.90025 18.3984 3.90237C16.3672 3.90237 14.5703 5.26956 14.0312 7.22659L10.6758 19.375H5.625C4.93359 19.375 4.375 19.9336 4.375 20.625V34.8438C4.375 35.5352 4.93359 36.0938 5.625 36.0938H29.1133C29.4727 36.0938 29.8242 36.0235 30.1484 35.8828C32.0078 35.0899 33.207 33.2735 33.207 31.2578C33.207 30.7657 33.1367 30.2813 32.9961 29.8125C33.6523 28.9453 34.0156 27.8828 34.0156 26.7774C34.0156 26.2852 33.9453 25.8008 33.8047 25.3321C34.4609 24.4649 34.8242 23.4024 34.8242 22.2969C34.8164 21.8047 34.7461 21.3164 34.6055 20.8477ZM7.1875 33.2813V22.1875H10.3516V33.2813H7.1875ZM32.0469 19.4922L31.1914 20.2344L31.7344 21.2266C31.9133 21.5534 32.006 21.9204 32.0039 22.293C32.0039 22.9375 31.7227 23.5508 31.2383 23.9727L30.3828 24.7149L30.9258 25.7071C31.1047 26.0339 31.1974 26.4009 31.1953 26.7735C31.1953 27.418 30.9141 28.0313 30.4297 28.4532L29.5742 29.1953L30.1172 30.1875C30.2961 30.5144 30.3888 30.8814 30.3867 31.2539C30.3867 32.1289 29.8711 32.918 29.0742 33.2774H12.8516V22.0625L16.7383 7.9805C16.8385 7.61956 17.0536 7.30113 17.3511 7.07345C17.6486 6.84577 18.0121 6.72126 18.3867 6.71878C18.6836 6.71878 18.9766 6.80472 19.2109 6.9805C19.5977 7.26956 19.8047 7.70706 19.7812 8.1719L19.4062 15.9219H31.6875C32.3828 16.3477 32.8125 17.0664 32.8125 17.8125C32.8125 18.4571 32.5312 19.0664 32.0469 19.4922Z"
                      fill={
                        post?.likes?.map((l) => l._id).includes(user_id)
                          ? "var(--followBtn-bg)"
                          : "var(--likeAction-bg)"
                      }
                    />
                  </svg>
                </div>
                <div className="actionText">upvote</div>
              </div>
              {/* DISLIKE ACTION */}
              <div className="likeActionHolder" onClick={dislikePost}>
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 40 40"
                    fill={"none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.6055 19.1524C34.7461 18.6836 34.8164 18.1993 34.8164 17.7071C34.8164 16.6016 34.4531 15.5391 33.7969 14.6719C33.9375 14.2032 34.0078 13.7188 34.0078 13.2266C34.0078 12.1211 33.6445 11.0586 32.9883 10.1914C33.1289 9.72269 33.1992 9.23831 33.1992 8.74613C33.1992 6.7305 32 4.91409 30.1406 4.12113C29.8138 3.98022 29.4614 3.90841 29.1055 3.91019H5.625C4.93359 3.91019 4.375 4.46878 4.375 5.16019V19.3789C4.375 20.0703 4.93359 20.6289 5.625 20.6289H10.6758L14.0273 32.7696C14.5664 34.7266 16.3633 36.0938 18.3945 36.0938C19.5547 36.0938 20.6367 35.6328 21.4375 34.7891C22.2383 33.9493 22.6484 32.8477 22.5898 31.6875L22.3555 26.8868H31.7266C32.1992 26.8868 32.6602 26.7618 33.0664 26.5235C34.6445 25.6055 35.625 23.9414 35.625 22.1875C35.625 21.0821 35.2617 20.0196 34.6055 19.1524ZM7.1875 17.8125V6.71878H10.3516V17.8125H7.1875ZM31.6875 24.0782H19.4062L19.7812 31.8282C19.8047 32.293 19.5977 32.7305 19.2109 33.0196C18.9727 33.1953 18.6797 33.2852 18.3867 33.2813C18.0124 33.2777 17.6494 33.1527 17.3522 32.9252C17.0549 32.6977 16.8395 32.3799 16.7383 32.0196L12.8516 17.9375V6.71878H29.0781C29.4686 6.89377 29.8002 7.17783 30.033 7.53679C30.2659 7.89576 30.39 8.31435 30.3906 8.74222C30.3906 9.12113 30.3008 9.4805 30.1211 9.80863L29.5781 10.8008L30.4336 11.543C30.6744 11.7515 30.8674 12.0095 30.9995 12.2994C31.1316 12.5892 31.1998 12.9041 31.1992 13.2227C31.1992 13.6016 31.1094 13.961 30.9297 14.2891L30.3867 15.2813L31.2422 16.0235C31.483 16.232 31.676 16.49 31.8081 16.7798C31.9402 17.0697 32.0083 17.3846 32.0078 17.7032C32.0078 18.0821 31.918 18.4414 31.7383 18.7696L31.1914 19.7657L32.0469 20.5078C32.2877 20.7164 32.4807 20.9744 32.6128 21.2642C32.7449 21.5541 32.813 21.869 32.8125 22.1875C32.8125 22.9336 32.3828 23.6524 31.6875 24.0782Z"
                      fill={
                        post?.disLikes?.map((l) => l._id).includes(user_id)
                          ? "var(--followBtn-bg)"
                          : "var(--likeAction-bg)"
                      }
                    />
                  </svg>
                </div>
                <div className="actionText">downvote</div>
              </div>
              {/* COMMENT ACTION */}
              <div
                className="likeActionHolder"
                onClick={() => navigate(`/posts/${post?._id}`)}
              >
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 32C19.9667 32 22.8668 31.1203 25.3336 29.4721C27.8003 27.8238 29.7229 25.4811 30.8582 22.7403C31.9935 19.9994 32.2906 16.9834 31.7118 14.0737C31.133 11.1639 29.7044 8.49119 27.6066 6.3934C25.5088 4.29562 22.8361 2.86701 19.9264 2.28823C17.0166 1.70945 14.0006 2.0065 11.2597 3.14181C8.51886 4.27713 6.17618 6.19972 4.52796 8.66645C2.87973 11.1332 2 14.0333 2 17C2 19.48 2.6 21.8183 3.66667 23.8783L2 32L10.1217 30.3333C12.1817 31.4 14.5217 32 17 32Z"
                      stroke="var(--likeAction-bg)"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="actionText">Comment</div>
              </div>

              {/* SHARE ACTION */}
              <div className="likeActionHolder">
                <ShareButton url={`${window.location.href}/${post?._id}`} />
              </div>
            </div>

            <div className="join-button-container">
              {/* <button
                className="join-button"
                onClick={() => navigate(`/posts/${post?._id}`)}
              >
                Join
              </button> */}

              {/* {!(post?.createdBy._id == user_id) && (
                    <div className="openDiscussion-Buttons">
                      {post?.openDiscussionRequests
                        .map((o) => o._id)
                        .includes(user_id) ? (
                        <button>Discussion Request Pending</button>
                      ) : post?.openDiscussionTeam
                          .map((o) => o._id)
                          .includes(user_id) ? (
                        <button>Joined</button>
                      ) : (
                        <button onClick={addingRequestDiscussion}>
                          Join for discussion
                        </button>
                      )}
                    </div>
                  )} */}
            </div>
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
            // Setting width to auto
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
            // Setting width to auto
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
                disabled={reportText == ""}
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
    </section>
  );
};

export default Post;
