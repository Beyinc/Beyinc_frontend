import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import { setLoginData, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { Howl } from "howler";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import ThreePOutlinedIcon from "@mui/icons-material/ThreePOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { io } from "socket.io-client";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  getAllNotifications,
  setMessageAlert,
  setNotification,
} from "../../redux/Conversationreducer/ConversationReducer";
import { Drawer, Tab, Tabs, Typography } from "@mui/material";
import MessageRequest from "../Conversation/Notification/MessageRequest";
import { format } from "timeago.js";
import useWindowDimensions from "../Common/WindowSize";

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
  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );
  const messageAlert = useSelector((state) => state.conv.messageAlert);
  const messageCount = useSelector((state) => state.conv.messageCount);

  const notificationSound = new Howl({
    src: ["/send.mp3"],
  });

  const messageSound = new Howl({
    src: ["/send.mp3"],
  });

  const [messageRequest, setMessageRequest] = useState([]);

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
    if (messageAlert) {
      messageSound.play()
    }
  }, [notificationAlert, messageAlert]);
  const [notificationDrawerState, setNotificationDrawerState] = useState({
    right: false,
  });
  const getNotifys = async () => {
    await ApiServices.getUserRequest({ userId: user_id }).then((res) => {
      setMessageRequest(res.data);
    });
    dispatch(getAllNotifications(user_id));
  };

  useEffect(() => {
    if (notificationDrawerState.right == true) {
      getNotifys();
    }
  }, [notificationDrawerState]);

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
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {width < 770 && (
          <>
            <ListItem button key="home" onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <DashboardOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              key="conversations"
              onClick={() => navigate("/conversations")}
            >
              <ListItemIcon>
                <MessageOutlinedIcon className="menu-icon" />
                {messageCount.length > 0 && <div
                  className="Conversations-count mobile"
                  title="unread conversations"
                >
                  {messageCount.length}
                </div>}
              </ListItemIcon>
              <ListItemText primary="Conversations" />

            </ListItem>
          </>
        )}

        {width < 770 && (
          <>
            <ListItem
              button
              key="searchUsers"
              onClick={() => navigate("/searchusers")}
            >
              <ListItemIcon>
                <SearchOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Search Users" />
            </ListItem>

            <ListItem
              button
              key="livePitches"
              onClick={() => navigate("/livePitches")}
            >
              <ListItemIcon>
                <BallotOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Live Pitches" />
            </ListItem>

            
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
                <PersonSearchOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Profile Requests" />
            </ListItem>

            <ListItem button key="pitches" onClick={() => navigate("/pitches")}>
              <ListItemIcon>
                <PlagiarismOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Pitch Request" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
  const NotificationList = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
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
        <div className={`sideNavIcons ${value == 1 && 'sideselected'}`} onClick={() => setValue(1)}>Notifications  ({notifications?.length})</div>
        <div className={`sideNavIcons ${value == 2 && 'sideselected'}`} onClick={() => setValue(2)}>Message Requests ({messageRequest?.length})</div>
      </div>
      {value == 1 &&
        notifications.map((n) => (
          <>
            <div
              className={`individualrequest`}
              onClick={() => {
                navigate(`/user/${n.senderInfo?._id}`);
              }}
              style={{ marginLeft: "15px", textAlign: "start" }}
            >
              <div
                className="individualrequestWrapper"
                style={{ gap: "5px", alignItems: "center", width: "100%" }}
              >
                <div>
                  <img
                    style={{
                      height: "50px",
                      width: "50px",
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
                <div>{n.message} </div>
              </div>
            </div>
            {/* <div className="divider"></div> */}
          </>
        ))
      }
      {value == 2 && (messageRequest.length > 0 || notifications.length > 0) && (
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
    </Box>
  );

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const [changeImage, setchangeImage] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) {
      alert(
        `File size should be less than ${(4 * 1024 * 1024) / (1024 * 1024)} MB.`
      );
      e.target.value = null; // Clear the selected file
      return;
    }
    setOriginalImage(file.name);
    setFileBase(file);
  };
  const setFileBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setchangeImage(reader.result);
    };
  };

  const submit = async (e) => {
    e.target.disabled = true;
    setIsLoading(true);
    await ApiServices.updateuserProfileImage({
      userId: user_id,
      image: changeImage, email: email
    })
      .then(async (res) => {
        // console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setLoginData(jwtDecode(res.data.accessToken)));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        dispatch(
          setToast({
            message: "Image uploaded successfully",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        e.target.disabled = false;
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error during image upload",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        setIsLoading(false);
        e.target.disabled = false;
      });

  };

  const deleteImg = async (e) => {
    e.target.disabled = true;
    await ApiServices.deleteuserProfileImage({ userId: user_id })
      .then(async (res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setLoginData(jwtDecode(res.data.accessToken)));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        dispatch(
          setToast({
            message: "Image removed successfully",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        e.target.disabled = false;
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error during image delete",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = false;
      });

  };

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

  return (
    <div
      className="navbar"
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
              : "/logo.png"
          }
          alt="logo"
        />
      </div>

      <div className="menuIcons">
        {width > 770 && (
          <>
            <div title="dashboard">
              <DashboardOutlinedIcon
                id="dashboard"
                className="icon"
                onClick={() => {
                  navigate("/dashboard");
                }}
              ></DashboardOutlinedIcon>
            </div>
            <div style={{ position: "relative" }} title="Conversations">
              {" "}
              <MessageOutlinedIcon
                id="conversations"
                className="icon"
                onClick={() => {
                  navigate("/conversations");
                  dispatch(setMessageAlert(false))
                }}
              ></MessageOutlinedIcon>
              {messageCount.length > 0 && <div
                className="Conversations-count"
                title="unread conversations"
              >
                {messageCount.length}
              </div>}
            </div>

            <div title="Search Users">
              <SearchOutlinedIcon
                id="searchusers"
                className="icon"
                onClick={() => navigate("/searchusers")}
              ></SearchOutlinedIcon>
            </div>

            <div title="Live Pitches">
              <BallotOutlinedIcon
                id="livePitches"
                className="icon"
                onClick={() => navigate("/livePitches")}
              ></BallotOutlinedIcon>
            </div>

           

            {role === "Admin" && (
              <>
                <div title="Profile Requests">
                  <PersonSearchOutlinedIcon
                    id="profileRequests"
                    className="icon"
                    onClick={() => navigate("/profileRequests")}
                  ></PersonSearchOutlinedIcon>
                </div>
                <div title="Pitch Request">
                  <PlagiarismOutlinedIcon
                    id="pitches"
                    className="icon"
                    onClick={() => navigate("/pitches")}
                  ></PlagiarismOutlinedIcon>
                </div>
              </>
            )}

            <div title="Notifications">
              <NotificationsOutlinedIcon
                id="notifications"
                className="icon"
                onClick={toggleNotificationDrawer("right", true)}
              >
                {notificationAlert && <div className="blinkBall"> </div>}
              </NotificationsOutlinedIcon>
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

        {width < 770 && (
          <div id="notifications" className="icon">
            <NotificationsOutlinedIcon
              title="notifications"
              onClick={() => {
                navigate("/notifications");
              }}
            ></NotificationsOutlinedIcon>
            {notificationAlert && <div className="blinkBall"> </div>}
          </div>
        )}

        {/* DARK AND WHITE THEME */}
        {/* <div
          id=""
          className="icon"
          title={`Switch to ${
            localStorage.getItem("theme") === "light" ? "Dark" : "Light"
          } Mode`}
          onClick={(e) => {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const mode = newTheme === "light" ? "Dark" : "Light";

            body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            document.getElementById("themeIcon").className = `fas fa-${
              newTheme == "light" ? "moon" : "sun"
            }`;

            // Switching the logo based on the theme
            const logoImg = document.getElementById("logoImage");
            logoImg.src =
              newTheme === "light" ? "/Footer-Logo.png" : "/Footer-Logo.png";
            logoImg.alt = `${mode} Logo`;

            e.currentTarget.title = `Switch to ${mode} Mode`;
          }}
        >
          <i
            id="themeIcon"
            class={`fas fa-${
              localStorage.getItem("theme") == "light" ? "moon" : "sun"
            }`}
          ></i>
        </div> */}

        <div
          id="editProfile"
          style={{ position: "relative" }}
          onClick={(e) => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.toggle("showUserDetails");
          }}
        >
          <img
            
            id="Profile-img"
            className="Profile-img"
            src={image !== undefined && image !== "" ? image : "/profile.png"}
            alt=""
          />
          {verification === "approved" && (
            <abbr title="verified user">
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
            </abbr>
          )}
        </div>
        {width < 770 && (
          <>
            <div className="icon" onClick={toggleDrawer("right", true)}>
              <MenuRoundedIcon />
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
        <div className="userDetails" ref={userDetailsRef}>
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
            <div className="popupImg">
              <img
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  maxWidth: "100%",
                  display: 'block'
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
          </div>

          <div className="username">Hi, {userName}!</div>
          <div className="manage" title="view profile" onClick={() => navigate(`/user/${email}`)}>{role}</div>

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
                localStorage.removeItem("user");
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              <i
                className="fas fa-sign-out-alt"
                style={{ marginRight: "5px" }}
              ></i>{" "}
              Logout
            </div>
          </div>
        </div>

        <Dialog
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
        </Dialog>
      </div>
    </div>
  );
};

export default Navbar;
