import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import { setLoginData, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { Howl } from "howler";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { jwtDecode } from "jwt-decode";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { io } from "socket.io-client";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EventIcon from "@mui/icons-material/Event";
import {
  getAllNotifications,
  setMessageCount,
  setNotification,
} from "../../redux/Conversationreducer/ConversationReducer";
import { Drawer, Tab, Tabs, Typography } from "@mui/material";
import MessageRequest from "../Conversation/Notification/MessageRequest";
import useWindowDimensions from "../Common/WindowSize";
import { socket_io } from "../../Utils";
import ProfileImageUpdate from "./ProfileImageUpdate";
import PostDiscussionRequest from "../Editprofile/PostDiscussionRequestNotifications";
import { useLocation } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { className, children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={className}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Navbar = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate1 = useNavigate();
  const location = useLocation()
  const {
    beyincProfile,
    email, role, userName, image
  } = useSelector((store) => store.auth.userDetails);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate1(`/search?query=${searchQuery}`);
    }
  };

  const { verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );

  // console.log(beyincProfile,image.url)
  const [logoutOpen, setLogoutOpen] = useState(false);
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
    checkFirsttime();
  }, []);
  const messageCount = useSelector((state) => state.conv.messageCount);

  const notificationSound = new Howl({
    src: ["/send.mp3"],
  });

  const messageSound = new Howl({
    src: ["/send.mp3"],
  });

  const [messageRequest, setMessageRequest] = useState([]);
  const [postDiscussionRequest, setpostDiscussionRequest] = useState([]);

  const notifications = useSelector((state) => state.conv.notifications);
  const [value, setValue] = useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [isMobile, setIsMobile] = useState(window.outerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const notificationAlert = useSelector(
    (state) => state.conv.notificationAlert
  );
  useEffect(() => {
    if (notificationAlert) {
      notificationSound.play();
    }
    if (messageCount.length > 0) {
      messageSound.play();
    }
  }, [notificationAlert, messageCount]);
  const liveMessage = useSelector((state) => state.conv.liveMessage);

  useEffect(() => {
    if (liveMessage && user_id !== undefined) {
      ApiServices.getTotalMessagesCount({
        receiverId: user_id,
        checkingUser: user_id,
      })
        .then((res) => {
          const d = [];
          for (let i = 0; i < res.data.length; i++) {
            d.push({
              conversationId: res.data[i]._id,
              receiverId: res.data[i].members.filter((f) => f !== user_id)[0],
              lastText: res.data[i].lastMessageText,
            });
          }
          console.log(d);
          dispatch(setMessageCount(d));
        })
        .catch((err) => { });
    }
  }, [liveMessage]);

  const [notificationDrawerState, setNotificationDrawerState] = useState({
    right: false,
  });
  const getNotifys = async () => {
    await ApiServices.getUserRequest({ userId: user_id }).then((res) => {
      setMessageRequest(res.data);
    });
    dispatch(getAllNotifications(user_id));
  };

  const getPostDiscussionRequest = async () => {
    await ApiServices.getPostRequestDiscussion({ user_id: user_id }).then(
      (res) => {
        setpostDiscussionRequest(res.data);
      }
    );
    dispatch(getAllNotifications(user_id));
  };

  useEffect(() => {
    if (notificationDrawerState.right == true) {
      getNotifys();
      getPostDiscussionRequest();
    }
  }, [notificationDrawerState]);

  // NOTIFICATION DRAWER
  const [drawerState, setDrawerState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const toggleNotificationDrawer = (anchor, open) => (event) => {
    dispatch(setNotification(false));
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setNotificationDrawerState({ ...drawerState, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "var(--menubar-bg)",
        color: "var(--menubar-txt)",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {width < 770 && (
          <>
            <div className="menubar-profile-container">
              <img
                id="Profile-img"
                className="menu-profile-img"
                src={
                  image !== undefined && image !== "" ? image.url : "/profile.png"
                }
                alt=""
              />
              <div className="menu-profile-content">
                <div
                  style={{ fontWeight: "600", fontSize: "16px", color: "#fff" }}
                >
                  {userName}
                </div>
                <div style={{ fontSize: "10px", color: "#fff" }}>{role}</div>
              </div>
            </div>

            {/* DARK AND WHITE THEME */}
            <ListItem
              button
              key="themeIcon"
              onClick={(e) => {
                const body = document.body;
                const currentTheme = body.getAttribute("data-theme");
                const newTheme = currentTheme === "light" ? "dark" : "light";
                const mode = newTheme === "light" ? "Dark" : "Light";

                body.setAttribute("data-theme", newTheme);
                localStorage.setItem("theme", newTheme);
                document.getElementById("themeIcon");
                newTheme == "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 20 20"
                    id=""
                    className="menu-icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                    id=""
                    className="menu-icon"
                  >
                    <path
                      fill="none"
                      stroke="var(--nav-head-icons)"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4V2m0 18v2M6.414 6.414L5 5m12.728 12.728l1.414 1.414M4 12H2m18 0h2m-4.271-5.586L19.143 5M6.415 17.728L5 19.142M12 17a5 5 0 1 1 0-10a5 5 0 0 1 0 10"
                    />
                  </svg>
                );

                // Switching the logo based on the theme
                const logoImg = document.getElementById("logoImage");
                logoImg.src =
                  newTheme === "light" ? "/logo.png" : "/Footer-Logo.png";
                logoImg.alt = `${mode} Logo`;
                e.currentTarget.title = `${mode} Mode`;
              }}
            >
              {/* <i
            id="themeIcon"
            class={`fas fa-${
              localStorage.getItem("theme") == "light" ? "moon" : "sun"
            }`}
          >
            </i> */}
              <ListItemIcon>
                {localStorage.getItem("theme") === "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 20 20"
                    id=""
                    className="menu-icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    id=""
                    className="menu-icon"
                  >
                    <path
                      fill="none"
                      stroke="var(--nav-head-icons)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4V2m0 18v2M6.414 6.414L5 5m12.728 12.728l1.414 1.414M4 12H2m18 0h2m-4.271-5.586L19.143 5M6.415 17.728L5 19.142M12 17a5 5 0 1 1 0-10a5 5 0 0 1 0 10"
                    />
                  </svg>
                )}
              </ListItemIcon>

              <ListItemText
                primary={`${localStorage.getItem("theme") === "light" ? "Dark" : "Light"
                  } Mode`}
              />
            </ListItem>

            <ListItem
              button
              key="editProfile"
              onClick={() => navigate("/editProfile")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 1024 1024"
                  id="editProfile"
                  className="menu-icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"
                  />
                  <path
                    fill="var(--nav-head-icons)"
                    d="m469.952 554.24l52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItem>

            <ListItem button key="home" onClick={() => navigate("/posts")}>
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  className="menu-icon"
                >
                  <path
                    fill="none"
                    stroke="var(--nav-head-icons)"
                    stroke-width="2"
                    d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            {/* <ListItem
              button
              key="dashboard"
              onClick={() => navigate("/dashboard")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  className="menu-icon"
                >
                  <path
                    fill="none"
                    stroke="var(--nav-head-icons)"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16v-5m4 5V8m4 8v-2m2-10H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Pitches" />
            </ListItem> */}
            <ListItem
              button
              key="searchUsers"
              onClick={() => navigate("/searchusers")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 256 256"
                  className="menu-icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M80 144a24 24 0 1 1 24 24a24 24 0 0 1-24-24m136 56h-56.57a64.39 64.39 0 0 0-28.83-26.16a40 40 0 1 0-53.2 0A64.39 64.39 0 0 0 48.57 200H40V56h176ZM56 96V80a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8v96a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h8V88H72v8a8 8 0 0 1-16 0"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Mentors" />
            </ListItem>
            <ListItem
              button
              key="conversations"
              onClick={() => navigate("/conversations")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  className="menu-icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"
                  />
                </svg>
                {messageCount.length > 0 && (
                  <div className="Conversations-count mobile">
                    {messageCount.length}
                  </div>
                )}
              </ListItemIcon>
              <ListItemText primary="Conversations" />
            </ListItem>

            <ListItem
              button
              key="notifications"
              onClick={() => navigate("/notifications")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="notifications"
                  className="menu-icon"
                >
                  <g fill="none" fill-rule="evenodd">
                    <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="var(--nav-head-icons)"
                      d="M5 9a7 7 0 0 1 14 0v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 18h-3.964a4.002 4.002 0 0 1-7.748 0H4.162a1.1 1.1 0 0 1-.984-1.592L5 12.764zm5.268 9a2 2 0 0 0 3.464 0zM12 4a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 16h12.763l-1.17-2.342a2.001 2.001 0 0 1-.212-.894V9a5 5 0 0 0-5-5"
                    />
                  </g>
                  {notificationAlert && <div className="blinkBall"> </div>}
                </svg>
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
          </>
        )}

        {width < 770 && (
          <>
            {/* <ListItem
              button
              key="livePitches"
              onClick={() => navigate("/livePitches")}
            >
              <ListItemIcon>
                <BallotOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Live Pitches" />
            </ListItem> */}
          </>
        )}

        {role === "Admin" && (
          <>
            <ListItem
              button
              key="profileRequests"
              onClick={() => navigate("/profileRequests")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 32 32"
                  id="profileRequests"
                  className="menu-icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M7.5 3A4.5 4.5 0 0 0 3 7.5v17A4.5 4.5 0 0 0 7.5 29h8.792a9.018 9.018 0 0 1-1.357-2H7.5A2.5 2.5 0 0 1 5 24.5v-17A2.5 2.5 0 0 1 7.5 5h17A2.5 2.5 0 0 1 27 7.5v7.435c.728.362 1.4.82 2 1.357V7.5A4.5 4.5 0 0 0 24.5 3zM14 23a8.983 8.983 0 0 1 3.343-7h-5.914A2.429 2.429 0 0 0 9 18.429c0 3.02 2.153 5.205 5.092 5.864A9.067 9.067 0 0 1 14 23m5.75-12.25a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0M23 15.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15m4.53 4.72a.75.75 0 0 0-1.06 0l-4.72 4.72l-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Profile Requests" />
            </ListItem>

            {/* <ListItem button key="pitches" onClick={() => navigate("/pitches")}>
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 32 32"
                  id="profileRequests"
                  className="menu-icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M7.5 3A4.5 4.5 0 0 0 3 7.5v17A4.5 4.5 0 0 0 7.5 29h8.792a9.018 9.018 0 0 1-1.357-2H7.5A2.5 2.5 0 0 1 5 24.5v-17A2.5 2.5 0 0 1 7.5 5h17A2.5 2.5 0 0 1 27 7.5v7.435c.728.362 1.4.82 2 1.357V7.5A4.5 4.5 0 0 0 24.5 3zM14 23a8.983 8.983 0 0 1 3.343-7h-5.914A2.429 2.429 0 0 0 9 18.429c0 3.02 2.153 5.205 5.092 5.864A9.067 9.067 0 0 1 14 23m5.75-12.25a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0M23 15.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15m4.53 4.72a.75.75 0 0 0-1.06 0l-4.72 4.72l-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Pitch Request" />
            </ListItem> */}
            <ListItem
              button
              key="postReports"
              onClick={() => navigate("/postReports")}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="postReports"
                  className="menu-icon"
                  onClick={() => navigate("/postReports")}
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8zm2.9-7"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText primary="Post Reports" />
            </ListItem>
          </>
        )}
      </List>
      <List>
        <ListItem
          button
          key="logout"
          onClick={() => {
            setLogoutOpen(true);
          }}
          style={{ borderTop: "1px solid var(--icons-border)" }}
        >
          <ListItemIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
              className="menu-icon"
            >
              <path
                fill="var(--nav-head-icons)"
                d="M3 21V3h9v2H5v14h7v2zm13-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
              />
            </svg>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
  const NotificationList = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 800,
        overFlowX: "hidden",
      }}
      role="presentation"
    >
      {/* <Tabs
        value={value}
        className="pitchTabs"
        style={{ width: "500px" }}
        textColor="primary"
        indicatorColor="secondary"
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab
          className="tabs"
          sx={{
            width: "250px",
            background: "none",
            textTransform: "capitalize",
            padding: "0px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          label={`Notifications (${notifications?.length})`}
          {...a11yProps(1)}
        />
        <Tab
          className="tabs"
          sx={{
            width: "250px",
            background: "none",
            textTransform: "capitalize",
            padding: "0px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          label={`Message Requests (${messageRequest?.length})`}
          {...a11yProps(0)}
        />
      </Tabs> */}
      <div className="SideNotificationHeader">
        <div
          className={`sideNavIcons ${value == 1 && "sideselected"}`}
          onClick={() => setValue(1)}
        >
          Notifications ({notifications?.length})
        </div>
        <div
          className={`sideNavIcons ${value == 2 && "sideselected"}`}
          onClick={() => setValue(2)}
        >
          Message Requests ({messageRequest?.length})
        </div>
        <div
          className={`sideNavIcons ${value == 3 && "sideselected"}`}
          onClick={() => setValue(3)}
        >
          Post Discussion Requests ({postDiscussionRequest?.length})
        </div>
      </div>
      {value == 1 &&
        notifications.map((n) => (
          <>
            <div
              className={`individualrequest`}
              style={{ marginLeft: "15px", textAlign: "start" }}
            >
              <div
                className="individualrequestWrapper"
                style={{ gap: "5px", alignItems: "center", width: "100%" }}
              >
                <div
                  onClick={() => {
                    navigate(`/user/${n.senderInfo?._id}`);
                  }}
                >
                  <img
                    style={{
                      height: "30px",
                      width: "30px",
                      borderRadius: "50%",
                    }}
                    src={
                      n.senderInfo?.image?.url == undefined
                        ? "/profile.png"
                        : n.senderInfo?.image?.url
                    }
                    alt=""
                    srcset=""
                  />
                </div>
                <div>
                  {n.message}{" "}
                  {n.type == "postDiscussion" && (
                    <Link to={`/posts/${n.postId}`}>View Post</Link>
                  )}{" "}
                  {n.type == "report" && (
                    <Link style={{ color: "red" }} to={`/posts/${n.postId}`}>
                      View Post
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="divider"></div> */}
          </>
        ))}
      {value == 2 &&
        (messageRequest.length > 0 || notifications.length > 0) && (
          <>
            <div>
              {messageRequest?.map((m) => (
                <>
                  <MessageRequest m={m} setMessageRequest={setMessageRequest} />
                </>
              ))}
            </div>
          </>
        )}
      {value == 3 &&
        (postDiscussionRequest.length > 0 || notifications.length > 0) && (
          <>
            <div>
              {postDiscussionRequest?.map((m) => (
                <>
                  <PostDiscussionRequest
                    m={m}
                    setpostDiscussionRequest={setpostDiscussionRequest}
                  />
                </>
              ))}
            </div>
          </>
        )}
    </Box>
  );

  // Sidebar
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleSideBarDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const sideBarList = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "var(--menubar-bg)",
        color: "var(--menubar-txt)",
      }}
      role="presentation"
      onClick={toggleSideBarDrawer(anchor, false)}
      onKeyDown={toggleSideBarDrawer(anchor, false)}
    >
      <List>
        <div className="menubar-profile-container">
          <img
            id="Profile-img"
            className="menu-profile-img"
            src={image !== undefined && image !== "" ? image.url : "/profile.png"}
            alt=""
            onClick={() => navigate("/editProfile")}
            style={{ cursor: "pointer" }}
          />
          <div className="menu-profile-content">
            <div
              style={{
                fontWeight: "600",
                fontSize: "16px",
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={() => navigate("/editProfile")}
            >
              {userName}
            </div>
            <div style={{ fontSize: "10px", color: "#fff" }}>{role}</div>
          </div>
        </div>

        {/* DARK AND WHITE THEME */}
        {/* <ListItem
          button
          key="themeIcon"
          onClick={(e) => {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const mode = newTheme === "light" ? "Dark" : "Light";

            body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            document.getElementById("themeIcon");
            newTheme == "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 20 20"
                id=""
                className="menu-icon"
              >
                <path
                  fill="var(--nav-head-icons)"
                  d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 24 24"
                id=""
                className="menu-icon"
              >
                <path
                  fill="none"
                  stroke="var(--nav-head-icons)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4V2m0 18v2M6.414 6.414L5 5m12.728 12.728l1.414 1.414M4 12H2m18 0h2m-4.271-5.586L19.143 5M6.415 17.728L5 19.142M12 17a5 5 0 1 1 0-10a5 5 0 0 1 0 10"
                />
              </svg>
            );

            // Switching the logo based on the theme
            const logoImg = document.getElementById("logoImage");
            logoImg.src =
              newTheme === "light" ? "/logo.png" : "/Footer-Logo.png";
            logoImg.alt = `${mode} Logo`;
            e.currentTarget.title = `${mode} Mode`;
          }}
        >
          <ListItemIcon>
            {localStorage.getItem("theme") === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 20 20"
                id=""
                className="menu-icon"
              >
                <path
                  fill="var(--nav-head-icons)"
                  d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                id=""
                className="menu-icon"
              >
                <path
                  fill="none"
                  stroke="var(--nav-head-icons)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4V2m0 18v2M6.414 6.414L5 5m12.728 12.728l1.414 1.414M4 12H2m18 0h2m-4.271-5.586L19.143 5M6.415 17.728L5 19.142M12 17a5 5 0 1 1 0-10a5 5 0 0 1 0 10"
                />
              </svg>
            )}
          </ListItemIcon>

          <ListItemText
            primary={`${localStorage.getItem("theme") === "light" ? "Dark" : "Light"
              } Mode`}
          />
        </ListItem> */}

        {/* Conditional rendering of the Calendar button */}
        {beyincProfile !== "" && (
          <ListItem
            button
            key="calendar"
            onClick={() => navigate("/dashboard/availability")}
          >
            <ListItemIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 24 24"
                id="calendar"
                className="menu-icon"
              >
                <path
                  fill="var(--nav-head-icons)"
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-1.99.9-1.99 2L3 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V10h14v11zm0-13H5V5h14v3z"
                />
              </svg>
            </ListItemIcon>
            <ListItemText primary="Services" />
          </ListItem>
        )}


        {/* User Bookings */}
        <ListItem
          button
          key="userBookings"
          onClick={() => navigate("/dashboard/userBookings")}
        >
          <ListItemIcon>
            <EventIcon
              className="menu-icon"
              sx={{ width: "0.8em", height: "0.8em", color: "var(--nav-head-icons)" }}
            />
          </ListItemIcon>
          <ListItemText primary="User Bookings" />
        </ListItem>

        {/* Mentor Bookings - Render only if role === "Mentor" */}
        {(beyincProfile === "Mentor" || beyincProfile === "Co-Founder") && (
          <ListItem
            button
            key={beyincProfile === "Mentor" ? "mentorBookings" : "cofounderBookings"}
            onClick={() => navigate(`/dashboard/mentorBookings`)}
          >
            <ListItemIcon>
              <EventIcon
                className="menu-icon"
                sx={{ width: "0.8em", height: "0.8em", color: beyincProfile === "Mentor" ? "blue" : "green" }} // Different color for Mentor and Cofounder
              />
            </ListItemIcon>
            <ListItemText primary={beyincProfile === "Mentor" ? "Mentor Bookings" : "Cofounder Bookings"} />
          </ListItem>
        )}


        <ListItem
          button
          key="editProfile"
          onClick={() => navigate("/editProfile")}
        >
          <ListItemIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 1024 1024"
              id="editProfile"
              className="menu-icon"
            >
              <path
                fill="var(--nav-head-icons)"
                d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"
              />
              <path
                fill="var(--nav-head-icons)"
                d="m469.952 554.24l52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
              />
            </svg>
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </ListItem>
      </List>

      <List style={{ borderTop: "1px solid var(--icons-border)" }}>
        <ListItem
          button
          key="logout"
          onClick={() => {
            setLogoutOpen(true);
          }}
        >
          <ListItemIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
              id="logout"
              className="menu-icon"
            >
              <path
                fill="var(--nav-head-icons)"
                d="M3 21V3h9v2H5v14h7v2zm13-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
              />
            </svg>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);

  const handleClickOpen = () => {
    document
      .getElementsByClassName("userDetails")[0]
      .classList.remove("showUserDetails");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "editProfile" &&
      event.target.id !== "Profile-img"
    ) {
      document
        .getElementsByClassName("userDetails")[0]
        .classList.remove("showUserDetails");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // console.log(window.location.pathname.slice(1));

    if (document.getElementsByClassName("navSelected")?.length > 0) {
      document
        .getElementsByClassName("navSelected")[0]
        ?.classList.remove("navSelected");
    }
    if (document.getElementsByClassName("highletNavImg")?.length > 0) {
      document
        .getElementsByClassName("highletNavImg")[0]
        ?.classList.remove("highletNavImg");
    }

    if (window.location.pathname.slice(1) !== "editProfile") {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.classList.add("navSelected");
      if (window.location.pathname.slice(1).split("/")[0] === "conversations") {
        document
          .getElementById("conversations")

          ?.classList.add("navSelected");
      }

      if (window.location.pathname.slice(1).split("/")[0] === "user") {
        document
          .getElementById("searchusers")

          ?.classList.add("navSelected");
      }

      if (window.location.pathname.slice(1).split("/")[0] === "livePitches") {
        document
          .getElementById("livePitches")

          ?.classList.add("navSelected");
      }
    } else {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.children[0].classList.add("highletNavImg");
    }
  }, [window.location.pathname]);

  const { height, width } = useWindowDimensions();

  const logoutDecider = (value) => {
    if (value == "All") {
      socket.current.emit("logoutAll", {
        userId: user_id,
      });
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    } else if (value == "Single") {
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const [firstTime, setFirstTime] = useState(null);

  const checkFirsttime = async () => {
    if (
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user")).accessToken
    ) {
      const res = await ApiServices.isFirstTimeLogin();
      return setFirstTime(!res.data.isProfileComplete);
    }
    setFirstTime(false);
  };

  const [selectedIcon, setSelectedIcon] = useState("");

  const handleItemClick = (val) => {
    setSelectedIcon(val);
  };
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath === "/posts") {
      setSelectedIcon("home");
    } else if (currentPath === "/") {
      setSelectedIcon("");
    } else if (currentPath === "/dashboard") {
      setSelectedIcon("dashboard");
    } else if (currentPath === "/searchusers") {
      setSelectedIcon("mentors");
    } else if (currentPath === "/profileRequests" && role === "Admin") {
      setSelectedIcon("profiles");
    } else if (currentPath === "/pitches" && role === "Admin") {
      setSelectedIcon("pitches");
    } else if (currentPath === "/postReports" && role === "Admin") {
      setSelectedIcon("reports");
    } else if (currentPath === "/conversations") {
      setSelectedIcon("messages");
    }
  }, [currentPath, role]);
  return (
    <div
      className="navbar "
    >

      <div
        className="w-full max-w-[1550px] m-auto"
        style={{
          display: localStorage.getItem("user") == undefined ? "none" : "flex",
        }}
      >
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            id="logoImage"
            src={
              localStorage.getItem("theme") == "light"
                ? "/logo.png"
                : "/Footer-Logo.png"
            }
            alt="logo"
          />
        </div>

        <div class="search-container">
          <div class="search-icon">
            <i style={{ cursor: "default" }} class="fa fa-search"></i>
          </div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search input value
            />
          </form>
        </div>

        <div className="menuIcons">
          {width > 770 && (
            <>
              <div
                className={`navbar-item ${selectedIcon === "beyinc" ? "selected" : ""
                  }`}
                onClick={() => {
                  navigate("/beyincProfesional");
                  handleItemClick("beyinc");
                }}
              >
                <button className="navbar-btn rounded-2xl h-12 w-50 py-1 text-xs font-normal">
                  Become Professional
                </button>

              </div>
              {/* HOME ICON */}

              <div
                className={`navbar-item ${selectedIcon === "home" ? "selected" : ""
                  }`}
                onClick={() => {
                  navigate("/posts");
                  handleItemClick("home");
                }}
              >
                {selectedIcon === "home" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                    id="dashboard"
                    className="icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M13 3v6h8V3m-8 18h8V11h-8M3 21h8v-6H3m0-2h8V3H3z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                    id="dashboard"
                    className="icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6zm2-10h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5zm4-2"
                    />
                  </svg>
                )}
                <div
                  className={`navbar-title ${selectedIcon === "home" ? "selected-title" : ""
                    }`}
                >
                  Home
                </div>
              </div>

              {/* DASHBOARD ICON */}

              {/* <div
              className={`navbar-item ${
                selectedIcon === "dashboard" ? "selected" : ""
              }`}
              onClick={() => {
                navigate("/dashboard");
                handleItemClick("dashboard");
              }}
            >
              {selectedIcon === "dashboard" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="dashboard"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="dashboard"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"
                  />
                </svg>
              )}
              <div
                className={`navbar-title${
                  selectedIcon === "dashboard" ? " selected-title" : ""
                }`}
              >
                Pitches
              </div>
            </div> */}

              {/* MENTOR ICON */}
              <div
                className={`navbar-item ${selectedIcon === "mentors" ? "selected" : ""
                  }`}
                onClick={() => {
                  navigate("/searchusers");
                  handleItemClick("mentors");
                }}
              >
                {selectedIcon === "mentors" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 256 256"
                    id="searchusers"
                    className="icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M104 168a32 32 0 1 1 32-32a32 32 0 0 1-32 32m112 32h-56.57a63.93 63.93 0 0 0-13.16-16H192a8 8 0 0 0 8-8V80a8 8 0 0 0-8-8H64a8 8 0 0 0-8 8v96a8 8 0 0 0 6 7.75A63.72 63.72 0 0 0 48.57 200H40V56h176Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 256 256"
                    id="searchusers"
                    className="icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M80 144a24 24 0 1 1 24 24a24 24 0 0 1-24-24m136 56h-56.57a64.39 64.39 0 0 0-28.83-26.16a40 40 0 1 0-53.2 0A64.39 64.39 0 0 0 48.57 200H40V56h176ZM56 96V80a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8v96a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h8V88H72v8a8 8 0 0 1-16 0"
                    />
                  </svg>
                )}
                <div
                  className={`navbar-title${selectedIcon === "mentors" ? " selected-title" : ""
                    }`}
                >
                  Mentors
                </div>
              </div>

              {role === "Admin" && (
                <>
                  {/* PROFILE REQUEST ICON */}
                  {role === "Admin" && (
                    <div
                      className={`navbar-item ${selectedIcon === "profiles" ? "selected" : ""
                        }`}
                      onClick={() => {
                        navigate("/profileRequests");
                        handleItemClick("profiles");
                      }}
                    >
                      {selectedIcon === "profiles" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 24 24"
                          id="profileRequests"
                          className="icon"
                        >
                          <path
                            fill="var(--nav-head-icons)"
                            d="M3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h5.772a6.462 6.462 0 0 1-1.008-3.07C8.474 17.556 7 15.755 7 14v-.5A1.5 1.5 0 0 1 8.5 12h5.534a6.47 6.47 0 0 1 3.466-1a6.47 6.47 0 0 1 3.5 1.022V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25m9-.75a2.75 2.75 0 1 1 0 5.5a2.75 2.75 0 0 1 0-5.5m11 12a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0m-2.146-2.354a.5.5 0 0 0-.708 0L16.5 18.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 32 32"
                          id="profileRequests"
                          className="icon"
                        >
                          <path
                            fill="var(--nav-head-icons)"
                            d="M7.5 3A4.5 4.5 0 0 0 3 7.5v17A4.5 4.5 0 0 0 7.5 29h8.792a9.018 9.018 0 0 1-1.357-2H7.5A2.5 2.5 0 0 1 5 24.5v-17A2.5 2.5 0 0 1 7.5 5h17A2.5 2.5 0 0 1 27 7.5v7.435c.728.362 1.4.82 2 1.357V7.5A4.5 4.5 0 0 0 24.5 3zM14 23a8.983 8.983 0 0 1 3.343-7h-5.914A2.429 2.429 0 0 0 9 18.429c0 3.02 2.153 5.205 5.092 5.864A9.067 9.067 0 0 1 14 23m5.75-12.25a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0M23 15.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15m4.53 4.72a.75.75 0 0 0-1.06 0l-4.72 4.72l-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06"
                          />
                        </svg>
                      )}
                      <div
                        className={`navbar-title${selectedIcon === "profiles" ? " selected-title" : ""
                          }`}
                      >
                        Profiles
                      </div>
                    </div>
                  )}

                  {/* PITCHES ICON */}
                  {role === "Admin" && (
                    <div
                      className={`navbar-item ${selectedIcon === "pitches" ? "selected" : ""
                        }`}
                      onClick={() => {
                        navigate("/pitches");
                        handleItemClick("pitches");
                      }}
                    >
                      {selectedIcon === "pitches" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          id="pitches"
                          width="1.2em"
                          height="1.2em"
                          className="icon"
                        >
                          <path
                            fill="var(--nav-head-icons)"
                            d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M7,15V17H9C9.14,18.55 9.8,19.94 10.81,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V13.03C19.85,11.21 17.82,10 15.5,10C14.23,10 13.04,10.37 12.04,11H7V13H10C9.64,13.6 9.34,14.28 9.17,15H7M17,9V7H7V9H17Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          id="pitches"
                          width="1.2em"
                          height="1.2em"
                          className="icon"
                        >
                          <path
                            fill="var(--nav-head-icons)"
                            d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M5,3H19C20.11,3 21,3.89 21,5V13.03C20.5,12.23 19.81,11.54 19,11V5H5V19H9.5C9.81,19.75 10.26,20.42 10.81,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3M7,7H17V9H7V7M7,11H12.03C11.23,11.5 10.54,12.19 10,13H7V11M7,15H9.17C9.06,15.5 9,16 9,16.5V17H7V15Z"
                          />
                        </svg>
                      )}
                      <div
                        className={`navbar-title${selectedIcon === "pitches" ? " selected-title" : ""
                          }`}
                      >
                        Pitches
                      </div>
                    </div>
                  )}

                  {/* REPORTS ICON */}

                  {role === "Admin" && (
                    <div
                      className={`navbar-item ${selectedIcon === "reports" ? "selected" : ""
                        }`}
                      onClick={() => {
                        navigate("/postReports");
                        handleItemClick("reports");
                      }}
                    >
                      {selectedIcon === "reports" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 24 24"
                          id="postReports"
                          className="icon"
                        >
                          <path
                            fill="var(--nav-head-icons)"
                            d="M13 13h-2V7h2m-2 8h2v2h-2m4.73-14H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 24 24"
                          id="postReports"
                          className="icon"
                        >
                          <path
                            fill="var(--nav-head-icons)"
                            d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8zm2.9-7"
                          />
                        </svg>
                      )}
                      <div
                        className={`navbar-title${selectedIcon === "reports" ? " selected-title" : ""
                          }`}
                      >
                        Reports
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* MESSAGE ICON */}
              <div
                className={`navbar-item ${selectedIcon === "messages" ? "selected" : ""
                  }`}
                onClick={() => {
                  navigate("/conversations");
                  handleItemClick("messages");
                }}
              >
                {selectedIcon === "messages" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                    id="conversations"
                    className="icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M6 9h12v2H6m8 3H6v-2h8m4-4H6V6h12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                    id="conversations"
                    className="icon"
                  >
                    <path
                      fill="var(--nav-head-icons)"
                      d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"
                    />
                  </svg>
                )}
                <div
                  className={`navbar-title${selectedIcon === "messages" ? " selected-title" : ""
                    }`}
                >
                  Messages
                </div>
              </div>

              {/* NOTIFICATION ICON */}
              <div
                className="navbar-item"
                onClick={toggleNotificationDrawer("right", true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  id="notifications"
                  className="icon"
                >
                  <path
                    fill="var(--nav-head-icons)"
                    d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2q.625 0 1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m-4-5h8v-7q0-1.65-1.175-2.825T12 6q-1.65 0-2.825 1.175T8 10z"
                  />
                  {notificationAlert && <div className="blinkBall"> </div>}
                </svg>

                <div className="navbar-title">Notifications</div>
              </div>

              <Drawer
                anchor="right"
                open={notificationDrawerState["right"]}
                onClose={toggleNotificationDrawer("right", false)}
                onOpen={toggleNotificationDrawer("right", true)}
              >
                {NotificationList("right")}
              </Drawer>
            </>
          )}

          {width > 770 && (
            <div>
              {["right"].map((anchor) => (
                <React.Fragment key={anchor}>
                  <div
                    id="editProfile"
                    style={{ position: "relative" }}
                    onClick={toggleSideBarDrawer(anchor, true)}
                  >
                    <img
                      id="Profile-img"
                      className="Profile-img"
                      src={
                        image !== undefined && image !== ""
                          ? image.url
                          : "/profile.png"
                      }
                      alt=""
                    />
                    {verification === "approved" && (
                      <img
                        src="/verify.png"
                        height={20}
                        style={{
                          right: "2px",
                          top: "3px",
                          height: "13px",
                          width: "13px",
                        }}
                        alt="Your Alt Text"
                        className="successIcons"
                      />
                    )}
                  </div>

                  <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleSideBarDrawer(anchor, false)}
                  >
                    {sideBarList(anchor)}
                  </Drawer>
                </React.Fragment>
              ))}
            </div>
          )}

          {width < 770 && (
            <>
              <div className="icon" onClick={toggleDrawer("right", true)}>
                <div id="editProfile" style={{ position: "relative" }}>
                  <img
                    id="Profile-img"
                    className="Profile-img"
                    src={
                      image !== undefined && image !== "" ? image.url : "/profile.png"
                    }
                    alt=""
                  />
                  {verification === "approved" && (
                    <img
                      src="/verify.png"
                      height={20}
                      style={{
                        right: "2px",
                        top: "3px",
                        height: "13px",
                        width: "13px",
                      }}
                      alt="Your Alt Text"
                      className="successIcons"
                    />
                  )}
                </div>
              </div>
              <Drawer
                anchor="right"
                open={drawerState["right"]}
                onClose={toggleDrawer("right", false)}
                onOpen={toggleDrawer("right", true)}
                disableBackdropTransition={!isMobile}
                disableDiscovery={!isMobile}
              >
                {list("right")}
              </Drawer>
            </>
          )}
          {/* <div
          className={`userDetails ${firstTime && "userDetailsAlt"}`}
          ref={userDetailsRef}
        >
          <span className="line-loader"></span>
          <div
            className="closeIcon"
            onClick={() => {
              document
                .getElementsByClassName("userDetails")[0]
                .classList.remove("showUserDetails");
            }}
          >
            <i className="fas fa-times cross"></i>
          </div>
          <div>
            <div className="email">{email}</div>
            {firstTime == false && (
              <div className="popupImg">
                <img
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                    maxWidth: "100%",
                    display: "block",
                  }}
                  src={
                    image !== undefined && image !== "" ? image : "/profile.png"
                  }
                  alt="Profile"
                />
                <i
                  className="fas fa-pencil-alt edit-icon"
                  onClick={handleClickOpen}
                ></i>
              </div>
            )}
          </div>

          {firstTime !== null &&
            (firstTime == false ? (
              <>
                <div className="username">Hi, {userName}!</div>
                <div
                  className="manage"
                  onClick={() => navigate(`/user/${user_id}`)}
                >
                  {role}
                </div>
                <div className="editPopupActions">
                  <div
                    className="Account"
                    onClick={() => {
                      document
                        .getElementsByClassName("userDetails")[0]
                        .classList.remove("showUserDetails");
                      navigate(`/editProfile`);
                    }}
                  >
                    <i
                      className="fas fa-user-edit"
                      style={{ marginRight: "5px" }}
                    ></i>{" "}
                    Edit Profile
                  </div>
                  <div
                    className="logout"
                    onClick={() => {
                      setLogoutOpen(true);
                    }}
                  >
                    <i
                      className="fas fa-sign-out-alt"
                      style={{ marginRight: "5px" }}
                    ></i>{" "}
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <div
                className="logoutAlt"
                onClick={() => {
                  setLogoutOpen(true);
                }}
              >
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginRight: "5px" }}
                ></i>{" "}
                Logout
              </div>
            ))}
        </div> */}

          <Dialog
            open={logoutOpen}
            onClose={() => setLogoutOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{}}
          >
            <DialogTitle
              id="alert-dialog-title"
              style={{ display: "flex", justifyContent: "center" }}
            ></DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div style={{ fontSize: "20px" }}>
                  How Do you want to logout ?
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    borderRadius: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => logoutDecider("All")}
                    style={{ whiteSpace: "nowrap", position: "relative" }}
                  >
                    Logout from all devices
                  </button>
                  <button
                    onClick={() => logoutDecider("Single")}
                    style={{ whiteSpace: "nowrap", position: "relative" }}
                  >
                    Logout from this device
                  </button>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          <ProfileImageUpdate open={open} setOpen={setOpen} />

          {/* <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{}}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <b> {"Profile Picture"}</b>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div>
                <img
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                    height: "150px",
                    width: "150px",
                  }}
                  src={
                    image !== undefined && image !== ""
                      ? image
                      : "/profile.png"
                  }
                  alt="Profile"
                />
              </div>

              <div>
                <label htmlFor="profilePic" className="profileImage">
                  <CloudUploadIcon />
                  <span className="fileName">{originalImage || "Upload"}</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.webp"
                  name=""
                  id="profilePic"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </div>

              <div
                style={{ display: "flex", gap: "2px", borderRadius: "10px", justifyContent: 'center', alignItems: 'center' }}
              >
                <button
                  onClick={submit}
                  style={{ whiteSpace: "nowrap", position: "relative" }}
                  disabled={changeImage === "" && isLoading}
                >
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <div className="button-loader"></div>
                      <div><span style={{ marginLeft: "10px" }}>Updating...</span></div>
                    </div>
                  ) : (
                    <>
                      <i
                        className="fas fa-upload"
                        style={{ marginRight: "5px", top: "-5px" }}
                      ></i>{" "}
                      Update
                    </>
                  )}
                </button>

                <button onClick={deleteImg}>
                  <i
                    class="fas fa-trash-alt"
                    style={{ marginRight: "5px" }}
                  ></i>{" "}
                  Delete
                </button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
