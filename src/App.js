import React, { Suspense, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";
import AuthHoc, { AdminDeciderHoc, LoginAuth } from "./AuthHoc";
import Toast from "./Components/Toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import {
  apicallloginDetails,
  setToast,
  setTotalRoles,
} from "./redux/AuthReducers/AuthReducer";
import { ApiServices } from "./Services/ApiServices";
import UserRequests from "./Components/Admin/UserRequests/UserRequests";
import { SingleRequestProfile } from "./Components/Admin/UserRequests/SingleProfile";
import { Socket, io } from "socket.io-client";
import {
  setLastMessageRead,
  setLiveMessage,
  setMessageAlert,
  setMessageCount,
  setNotification,
  setOnlineUsers,
  setUserAllPitches,
  setUserLivePitches,
} from "./redux/Conversationreducer/ConversationReducer";
import LivePitches from "./Components/LivePitches/LivePitches";
import IndividualPitch from "./Components/LivePitches/IndividualPitch";
import LoadingData from "./Components/Toast/Loading";
import AllUsers from "./Components/AllUsers/AllUsers";
import IndividualUser from "./Components/AllUsers/individualUser";
import { socket_io } from "./Utils";
import { ToastColors } from "./Components/Toast/ToastColors";

const LandingPage = React.lazy(() =>
  import("./Components/LandingPage/LandingPage")
);
const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(() =>
  wait(1000).then(() => import("./Components/ForgotPassword/ForgotPassword"))
);
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() =>
  wait(1000).then(() => import("./Components/Home/Home"))
);
const Editprofile = React.lazy(() =>
  wait(1000).then(() => import("./Components/Editprofile/Editprofile"))
);
const Conversations = React.lazy(() =>
  wait(1000).then(() => import("./Components/Conversation/Conversations"))
);
const Notifications = React.lazy(() =>
  wait(1000).then(() =>
    import("./Components/Conversation/Notification/Notifications")
  )
);
const AllPitches = React.lazy(() =>
  wait(1000).then(() => import("./Components/Admin/pitchDecider/AllPitches"))
);

const LoggedInPitches = React.lazy(() =>
  wait(1000).then(() => import("./Components/LoggedInPitches/LoggedInPitches"))
);

const ENV = process.env;
const NoMatch = () => {
  return (
    <div className="noMatch">
    <div className="noRoute-image">
<img src="/no-route.gif" alt="gif"/>
    </div>
      <div className="noRoute-text">Oops..! no such routes found.</div>
    </div>
  );
};

const App = () => {
  const notificationAlert = useSelector(state => state.conv.notificationAlert);

  const messageAlert = useSelector((state) => state.conv.messageAlert);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(apicallloginDetails());
  }, []);

  // intialize socket io
  const socket = useRef();
  const { email, user_id } = useSelector((store) => store.auth.loginDetails);

  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  // adding online users to socket io
  useEffect(() => {
    socket.current.emit("addUser", user_id);
    socket.current.on("getUsers", (users) => {
      // console.log("online", users);
      dispatch(setOnlineUsers(users));
    });
  }, [email]);

  // live message updates
  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      // console.log(data);
      dispatch(
        setLiveMessage({
          message: data.message,
          senderId: data.senderId,
          fileSent: data.fileSent,
          conversationId: data.conversationId,
        })
      );
      dispatch(setMessageAlert(new Date().toString()));

      // setMessages(prev => [...prev, data])
    });
  }, []);

  // DONT REMOVE THIS IT IS FOR DARK AND WHITE THEME
  //   useEffect(() => {
  //     if (!localStorage.getItem('theme')) {
  //       localStorage.setItem('theme', 'light')
  //       document.body.setAttribute('data-theme', 'light')
  //     } else {
  //       document.body.setAttribute('data-theme', localStorage.getItem('theme'))

  //    }
  //  }, [])
  useEffect(() => {
    socket.current.on("sendseenMessage", (data) => {
      // console.log(data);
      dispatch(setLastMessageRead(true));
      ApiServices.changeStatusMessage({
        senderId: data.receiverId,
        receiverId: data.senderId,
      }).then((res) => {
        // console.log("changed status");
      });
      // setMessages(prev => [...prev, data])
    });
    socket.current.on("sendchatBlockingInfo", (data) => {
      // console.log(data);
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    if (user_id !== undefined) {
      ApiServices.getTotalMessagesCount({
        receiverId: user_id,
        checkingUser: user_id,
      }).then((res) => {
        dispatch(
          setMessageCount(
            res.data.map((a) => a.members.filter((f) => f!== user_id)[0])
          )
        );
      });
    }
  }, [messageAlert, user_id]);

  useEffect(() => {
    socket.current.on("getNotification", (data) => {
      // console.log(data);
      dispatch(setNotification(true));
      // setMessages(prev => [...prev, data])
    });
  }, []);

  useEffect(() => {
    ApiServices.getAllRoles()
      .then((res) => {
        dispatch(setTotalRoles(res.data));
      })
      .catch((err) => {
        // console.log(err);
        if (err.message == "Network Error") {
          dispatch(
            setToast({
              message: "Check your network connection",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        }
      });
  }, []);


  useEffect(() => {
    if (localStorage.getItem('user')) {
      ApiServices.userLivePitches().then(res => {
        dispatch(setUserLivePitches(res.data))
      }).catch(err => {
        dispatch(setToast({
          message: "Error while fetching pitches",
          bgColor: ToastColors.failure,
          visible: "yes",
        }))
      })
    }
  }, [notificationAlert]);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      ApiServices.getuserPitches().then(res => {
        dispatch(setUserAllPitches(res.data))
      }).catch(err => {
        dispatch(setToast({
          message: "Error while fetching pitches",
          bgColor: ToastColors.failure,
          visible: "yes",
        }))
      })
    }
  }, [notificationAlert]);
  return (
    <div>
      <Suspense
        fallback={
          <div className="Loading">
            <div class="loader">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        }
      >
        <Toast />
        <LoadingData />
        <Navbar />
        <Routes>
          <Route path="/signup" Component={LoginAuth(SignUp)} />
          <Route path="/login" Component={LoginAuth(Login)} />
          <Route path="/forgotpassword" Component={LoginAuth(ForgotPassword)} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NoMatch />} />

          <Route path="/dashboard" Component={AuthHoc(Home)} />
          <Route path="/editProfile" Component={AuthHoc(Editprofile)} />
          <Route path="/conversations" Component={AuthHoc(Conversations)} />
          <Route
            path="/conversations/:conversationId"
            Component={AuthHoc(Conversations)}
          />
          <Route path="/notifications" Component={AuthHoc(Notifications)} />
          <Route path="/userPitches" Component={AuthHoc(LoggedInPitches)} />
          <Route path="/livePitches" Component={AuthHoc(LivePitches)} />
          <Route
            path="/livePitches/:pitchId"
            Component={AuthHoc(IndividualPitch)}
          />
          <Route path="/searchusers" Component={AuthHoc(AllUsers)} />
          <Route path="/user/:id" Component={AuthHoc(IndividualUser)} />

          <Route path="/pitches" Component={AdminDeciderHoc(AllPitches)} />
          <Route
            path="/profileRequests"
            Component={AdminDeciderHoc(UserRequests)}
          />
          <Route
            path="/singleProfileRequest/:id"
            Component={AdminDeciderHoc(SingleRequestProfile)}
          />
        </Routes>
      </Suspense>
    </div>
  );
};

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
export default App;
