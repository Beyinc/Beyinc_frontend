import React, { useEffect, useRef, useState } from "react";
import "./Posts.css";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import Post from "../Editprofile/Activities/Posts/Post";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import AllNotifications from "../Conversation/Notification/AllNotifications";
import { getAllNotifications } from "../../redux/Conversationreducer/ConversationReducer";
import { socket_io, postTypes, followerController } from "../../Utils";
import { io } from "socket.io-client";
import RecommendedConnectButton from "./RecommendedConnectButton";
import { RxCaretDown } from "react-icons/rx";

const Posts = () => {
  const {
    role,
    userName,
    image,
    _id: user_id,
  } = useSelector((store) => store.auth.userDetails);

  const location = useLocation();
  const notifications = useSelector((state) => state.conv.notifications);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const [allPosts, setAllPosts] = useState([]);
  const [topTrendingPosts, setTopTrendingPosts] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(false);
  const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [filterPage, setFilterPage] = useState(1);
  const pageSize = 10;
  const [people, setPeople] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [tags, setTags] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const feedRef = useRef(null);
  const scrollRestorationAttempted = useRef(false);
  const isNavigatingAway = useRef(false);

  // Save scroll position helper
  const saveScrollPosition = () => {
    if (feedRef.current && !isNavigatingAway.current) {
      const scrollPos = feedRef.current.scrollTop;
      sessionStorage.setItem("feedScrollTop", scrollPos.toString());
      sessionStorage.setItem("feedScrollSaved", "true");
    }
  };

  // Restore scroll position helper
  const restoreScrollPosition = () => {
    const savedScroll = sessionStorage.getItem("feedScrollTop");
    const wasScrollSaved = sessionStorage.getItem("feedScrollSaved");

    if (savedScroll && wasScrollSaved === "true" && feedRef.current && !scrollRestorationAttempted.current) {
      const scrollValue = Number(savedScroll);

      if (scrollValue > 0) {
        // Try multiple times with increasing delays to handle async content loading
        const attemptScroll = (delay) => {
          setTimeout(() => {
            if (feedRef.current && feedRef.current.scrollHeight > scrollValue) {
              feedRef.current.scrollTop = scrollValue;
            }
          }, delay);
        };

        // Multiple restoration attempts
        attemptScroll(0);
        attemptScroll(100);
        attemptScroll(200);
        attemptScroll(400);
        attemptScroll(600);

        scrollRestorationAttempted.current = true;

        // Clear the flag after restoration
        setTimeout(() => {
          sessionStorage.removeItem("feedScrollSaved");
        }, 1000);
      }
    }
  };

  // Dashboard details
  useEffect(() => {
    dispatch(setLoading({ visible: "yes" }));
    ApiServices.getDashboardDetails()
      .then((res) => {
        setData(res.data);
        dispatch(setLoading({ visible: "no" }));
      })
      .catch((err) => {
        dispatch(setLoading({ visible: "no" }));
      });
  }, []);

  // Get all posts
  useEffect(() => {
    if (filterPage === 1) setAllPosts([]);

    ApiServices.getAllPosts({ page: filterPage, pageSize: pageSize })
      .then((res) => {
        setAllPosts((prev) => [...prev, ...res.data]);
        dispatch(setLoading({ visible: "no" }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured!",
            bgColor: ToastColors.failure,
            visible: "yes",
          }),
        );
      });
  }, [loadingTrigger]);

  // useEffect(()=>{
  //   console.log("all posts-:",allPosts);
  // },[allPosts])
  useEffect(() => {
    console.log("all posts-:", allPosts);
  }, [allPosts]);

  useEffect(() => {
    ApiServices.getTopTrendingPosts()
      .then((res) => {
        setTopTrendingPosts(res.data);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occurred!",
            bgColor: ToastColors.failure,
            visible: "yes",
          }),
        );
      });
  }, [dispatch]);

  // Get recommended users
  useEffect(() => {
    ApiServices.getRecommendedUsers({ userId: user_id })
      .then((res) => {
        setRecommendedUsers(res.data);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured!",
            bgColor: ToastColors.failure,
            visible: "yes",
          }),
        );
      });
  }, [recommendedUserTrigger]);

  // Socket setup
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  // Get notifications
  const getNotifys = async () => {
    await ApiServices.getUserRequest({ userId: user_id }).then((res) => {});
    dispatch(getAllNotifications(user_id));
  };

  useEffect(() => {
    getNotifys();
  }, []);

  // Fetch filtered posts
  useEffect(() => {
    const fetchFilteredPosts = async () => {
      try {
        const filterData = {
          tags: selectedTags,
          sortOption: selectedSortOption,
          people: people,
          public: isPublic,
          private: isPrivate,
          page: filterPage, // send page
          pageSize, // send pageSize
        };

        const response = await ApiServices.getFilterPosts(filterData);

        if (filterPage === 1) {
          setFilteredPosts(response.data);
        } else {
          setFilteredPosts((prev) => [...prev, ...response.data]);
        }
      } catch (error) {
        // Error handling if needed
      }
    };

    fetchFilteredPosts();
  }, [
    people,
    selectedSortOption,
    selectedTags,
    isPublic,
    isPrivate,
    filterPage,
  ]);

  // ============ SCROLL RESTORATION LOGIC ============
  // This runs after posts are loaded
  useEffect(() => {
    const hasData = filteredPosts.length > 0 || allPosts.length > 0;
    if (hasData) {
      restoreScrollPosition();
    }
  }, [filteredPosts, allPosts]);

  // Save scroll position on unmount
  useEffect(() => {
    // Set up scroll listener to continuously save position
    const handleScroll = () => {
      if (feedRef.current) {
        const scrollPos = feedRef.current.scrollTop;
        sessionStorage.setItem("feedScrollTop", scrollPos.toString());
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (feedElement) {
        feedElement.removeEventListener('scroll', handleScroll);
        saveScrollPosition();
        sessionStorage.setItem("feedScrollSaved", "true");
      }
    };
  }, []);

  // Reset scroll restoration flag when navigating away and back
  useEffect(() => {
    scrollRestorationAttempted.current = false;
    isNavigatingAway.current = false;
  }, [location.pathname]);
  // ============ END SCROLL RESTORATION LOGIC ============

  const handlePublicCheckboxChange = (event) => {
    setIsPublic(event.target.checked);
  };

  const handlePrivateCheckboxChange = (event) => {
    setIsPrivate(event.target.checked);
  };

  const handleLoadMore = () => {
    setFilterPage((prev) => prev + 1);
  };

  const handleTagsChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTags((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value),
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
    setFilteredPosts([]);
  };

  const filteredTagsOptions = postTypes.filter((option) =>
    option.value.toLowerCase().includes(tags.toLowerCase()),
  );

  const createMarkup = (html) => {
    return { __html: html };
  };

  const getDescription = (post) => {
    return post?.description?.length > 100
      ? post?.description.slice(0, 150) + "..."
      : post?.description;
  };

  return (
    <div className="Homepage-Container">
      <div className="mobile-menu-icon" onClick={() => setIsSidebarOpen(true)}>
        <RxHamburgerMenu />
      </div>
      <div
        className={`Homepage-left-container ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        <div
          className="mobile-close-icon"
          onClick={() => setIsSidebarOpen(false)}
        >
          <RxCross2 />
        </div>
        {user_id ? (
        <div className="sidebar-menu shadow-lg">
          <div className="Homepage-left-container-profile">
            <div>
              <img
                id="Profile-img"
                className="Homepage-profile-img"
                src={
                  image !== undefined && image !== ""
                    ? image.url
                    : "/profile.png"
                }
                alt=""
              />
            </div>

            <div>
              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                {userName}
              </div>
              <div style={{ fontSize: "12px" }}>{role}</div>
            </div>
          </div>
          <div
            className="sidebar-menu-items"
            onClick={() => navigate("/createPostPage")}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16a16 16 0 0 1-16 16m0-30C8.268 2 2 8.268 2 16s6.268 14 14 14s14-6.268 14-14A14 14 0 0 0 16 2"
                />
                <path
                  fill="currentColor"
                  d="M23 15h-6V9h-2v6H9v2h6v6h2v-6h6z"
                  class="ouiIcon__fillSecondary"
                />
              </svg>
            </div>
            <div>Create post</div>
          </div>

          <div
            className="sidebar-menu-items"
            onClick={() => navigate("/conversations")}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"
                />
              </svg>
            </div>
            <div>Message</div>
          </div>

          <div className="sidebar-menu-items">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24a5.98 5.98 0 0 1 0 7.52c.42.14.86.24 1.33.24m-6 0c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2m0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4m6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2z"
                />
              </svg>
            </div>
            <div onClick={() => navigate("/connections")}>Connections</div>

            <div style={{ marginLeft: "80px" }}>
              {data?.connections_approved || 0}
            </div>
          </div>

          <div className="sidebar-menu-items">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M9.997 2.707a.75.75 0 0 1-.67.822a6.506 6.506 0 1 0 7.144 7.145a.75.75 0 1 1 1.492.153a8.006 8.006 0 1 1-8.788-8.79a.75.75 0 0 1 .822.67m1.02-.066a.75.75 0 0 1 .905-.555q.568.136 1.103.35a.75.75 0 0 1-.555 1.393q-.435-.173-.898-.284a.75.75 0 0 1-.554-.904m6.547 4.333a.75.75 0 0 0-1.394.555q.173.436.285.898a.75.75 0 1 0 1.459-.35a8 8 0 0 0-.35-1.103M14.29 3.926a.75.75 0 0 1 1.058-.073q.461.401.858.867a.75.75 0 0 1-1.143.972a7 7 0 0 0-.7-.708a.75.75 0 0 1-.073-1.058M10 5.75a.75.75 0 0 0-1.5 0v5c0 .415.336.75.75.75h3a.75.75 0 1 0 0-1.5H10z"
                />
              </svg>
            </div>
            <div onClick={() => navigate("/editProfile?editPostToggler=posts")}>
              Activity
            </div>
          </div>
        </div>): null }

        <div class="filter-sidebar shadow-lg">
          <div class="filter-section">
            <h3 className="label">Filter</h3>

            <h4 className="mt-3 mb-2">People</h4>
            <input
              type="text"
              placeholder="Search people"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />

            <h4 className="mt-3 mb-2">Tags</h4>
            <div className="relative">
              <button
                className={`absolute right-1 top-[-45px] text-xl transform transition-transform duration-300 focus:outline-none focus:ring-0 border-none bg-transparent hover:bg-transparent text-gray-500 ${
                  isTagsOpen ? "rotate-180" : "rotate-0"
                }`}
                onClick={() => setIsTagsOpen(!isTagsOpen)}
              >
                <RxCaretDown />
              </button>
            </div>

            {isTagsOpen && (
              <div className="max-h-48 overflow-y-scroll overflow-x-hidden mt-2 border border-gray-300 rounded-md">
                <input
                  type="text"
                  className="w-60 mt-3"
                  placeholder="Search Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />

                {selectedTags.length > 0 && (
                  <div className="clear-container">
                    <div onClick={clearAllTags} className="x-box">
                      X
                    </div>
                    <a onClick={clearAllTags} className="clear-link">
                      Clear All
                    </a>
                  </div>
                )}

                {filteredTagsOptions.map((option) => (
                  <div key={option.value} className="p-0">
                    <label>
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedTags.includes(option.value)}
                        onChange={handleTagsChange}
                        className="mr-2"
                      />
                      {option.value}
                    </label>
                  </div>
                ))}
              </div>
            )}

            <hr className=" mt-4 mb-6" />

            <h4 className="mt-3 mb-2">Post Type</h4>

            <label>
              <input
                type="checkbox"
                name="public"
                checked={isPublic}
                onChange={handlePublicCheckboxChange}
              />
              <span className="text-sm mt-1 ml-2">Public Post</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="private"
                checked={isPrivate}
                onChange={handlePrivateCheckboxChange}
              />
              <span className="text-sm mt-1 ml-2">Private Post</span>
            </label>
            <hr className=" mt-4 mb-6" />
          </div>
        </div>
      </div>

      <div className="main-content" ref={feedRef}>
        <div className="allPostShowContainer">
          {filteredPosts.length > 0 &&
            filteredPosts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((p) => {
                return (
                  <Post
                    filteredPosts={filteredPosts}
                    key={p.id}
                    post={p}
                    setAllPosts={setAllPosts}
                    screenDecider={"home"}
                  />
                );
              })}
        </div>

        <div className="loadMore-Container">
          <button
            className="loadMore"
            onClick={handleLoadMore}
            hidden={filteredPosts.length <= 10}
          >
            Load More
          </button>
        </div>
      </div>

      {/* Right Bar */}

      <div className="sidebar-right">
        <div className="trending-section shadow-lg">
          <h3 className="label">Top Trending</h3>
          <div className="trending-item">
            {topTrendingPosts?.map((post, index) => (
              <div
                key={post?._id}
                onClick={() => {
                  isNavigatingAway.current = true;
                  saveScrollPosition();
                  navigate(`/posts/${post._id}`);
                }}
                className="hover:cursor-pointer"
              >
                <h5>{post?.type}</h5>
                <h4>
                  <b>{post?.postTitle}</b>
                </h4>

                <div
                  dangerouslySetInnerHTML={createMarkup(getDescription(post))}
                ></div>
                {index === topTrendingPosts.length - 1 ? null : (
                  <div className="line"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {user_id ? (<div className="suggestions-section shadow-lg">
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            <h4 className="label">Suggestions for you</h4>
            <span
              style={{
                width: " 90px",
                color: "gray",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/connections");
              }}
            >
              See All
            </span>
          </div>
          {recommendedUsers?.map((rec) => (
            <div className="suggestion-item" key={rec._id}>
              <div className="left-section">
                <img
                  src={
                    rec?.image?.url == undefined
                      ? "/profile.png"
                      : rec?.image?.url
                  }
                  alt="User Image"
                  className="user-image mb-5"
                />
              </div>
              <div className="right-section">
                <h4
                  style={{
                    fontFamily: '"Gentium Book Basic", serif',
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    if (rec._id == user_id) {
                      navigate("/editProfile");
                    } else {
                      navigate(`/user/${rec._id}`);
                    }
                  }}
                >
                  {rec?.userName}
                </h4>
                <p>{rec?.role}</p>
                <div className="follow-container -ml-14 mt-2">
                  <button
                    className="follow w-[100px] h-[30px]"
                    onClick={(e) => {
                      followerController({
                        dispatch,
                        e,
                        followingToId: rec._id,
                        recommendedUserTrigger,
                        setRecommendedUserTrigger,
                        socket,
                        user: { id: user_id, userName, image, role },
                        setRecommendedUsers,
                      });
                    }}
                  >
                    Follow
                  </button>
                  <RecommendedConnectButton
                    id={rec._id}
                    handleFollower={() => {
                      setRecommendedUserTrigger(!recommendedUserTrigger);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>): null }

        {user_id ? (<div className="activity-section shadow-lg">
          <h3 className="label">Latest Activities</h3>
          <div className="activity-item">
            <div className="activity-single-item">
              {notifications?.length > 0 && (
                <div>
                  {notifications?.slice(0, 5).map((n, index) => (
                    <div key={n.id}>
                      <AllNotifications n={n} />
                      {index < notifications.slice(0, 5).length - 1 && (
                        <div className="notification-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>) : null }
      </div>
    </div>
  );
};

export default Posts;