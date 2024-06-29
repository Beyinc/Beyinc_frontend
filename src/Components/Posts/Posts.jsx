import React, { useEffect, useState } from "react";
import "./Posts.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import Post from "../Editprofile/Activities/Posts/Post";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";

const Posts = () => {
  const { role, userName, image, user_id  } = useSelector(
    (store) => store.auth.loginDetails
  );
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    ApiServices.getDashboardDetails()
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [allPosts, setAllPosts] = useState([])
  useEffect(() =>{
    ApiServices.getUsersPost({ user_id }).then(res => {
      setAllPosts(res.data)
  }).catch(err => {
      dispatch(
          setToast({
              message: 'Error Occured!',
              bgColor: ToastColors.failure,
              visible: "yes",
          })
      );
  })
  },[]);


  return (
    <div className="Homepage-Container">
      <div className="Homepage-left-container">
        <div className="sidebar-menu">
          <div className="Homepage-left-container-profile">
            <div>
              <img
                id="Profile-img"
                className="Homepage-profile-img"
                src={
                  image !== undefined && image !== "" ? image : "/profile.png"
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
                  d="M4 21q-.825 0-1.412-.587T2 19V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v14q0 .825-.587 1.413T20 21zm0-2h16V5H4zm2-2h12v-2H6zm0-4h4V7H6zm6 0h6v-2h-6zm0-4h6V7h-6zM4 19V5z"
                />
              </svg>
            </div>
            <div>Newsfeed</div>
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
            <div>Connections</div>

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
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M80 144a24 24 0 1 1 24 24a24 24 0 0 1-24-24m136 56h-56.57a64.4 64.4 0 0 0-28.83-26.16a40 40 0 1 0-53.2 0A64.4 64.4 0 0 0 48.57 200H40V56h176ZM56 96V80a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8v96a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h8V88H72v8a8 8 0 0 1-16 0"
                />
              </svg>
            </div>
            <div>Expertise</div>
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
            <div>Activity</div>
          </div>
        </div>

        <div className="filter-section">
          <h3 className="label">Filter</h3>
        </div>
      </div>

      <div className="main-content">
      <div className="allPostShowContainer">
                                {allPosts?.map(post => (
                                    <Post post={post} setAllPosts={setAllPosts} screenDecider = {"home"} />
                                ))}
                            </div>
      </div>

      <div className="sidebar-right">
        <div className="trending-section">
          <h3 className="label">Top Trending</h3>
          <div className="trending-item">
            <h4>Introducing the revolutionary 'EchoSphere'</h4>
            <p>
              The ultimate productivity solution for the modern professional...
            </p>
          </div>

          <div className="trending-item">
            <h4>Embrace Innovation: The Key to a Thriving Future!</h4>
            <p>
              Innovation isn't just about creating something new; it's about
              transforming ideas into reality...
            </p>
          </div>
        </div>

        <div className="suggestions-section">
          <h3 className="label">Suggestions for you</h3>
          <div className="suggestion-item">
            <h4>Alexander Clark</h4>
            <button className="follow">Follow</button>
            <button className="connect">Connect</button>
          </div>
          <div className="suggestion-item">
            <h4>Jacob Thompson</h4>
            <button className="follow">Follow</button>
            <button className="connect">Connect</button>{" "}
          </div>
          <div className="suggestion-item">
            <h4>Elena Gorobets</h4>
            <button className="follow">Follow</button>
            <button className="connect">Connect</button>{" "}
          </div>
        </div>

        <div className="activity-section">
          <h3 className="label">Latest Activities</h3>
          <div className="activity-item">
            <p>Lucas Rodriguez posted an update</p>
            <span>18 hours ago</span>
          </div>
          <div className="activity-item">
            <p>Mia Taylor reacted to your post</p>
            <span>1 day ago</span>
          </div>
          <div className="activity-item">
            <p>Mia Taylor commented on your post</p>
            <span>1 day ago</span>
          </div>
          <div className="activity-item">
            <p>Annette Black followed you</p>
            <span>5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
