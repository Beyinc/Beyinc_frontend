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
import { Socket, io } from "socket.io-client";
import {
  setLastMessageRead,
  setLiveMessage,
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
import Posts from "./Components/Posts/Posts";

const LandingPage = React.lazy(() =>
  import("./Components/LandingPage/LandingPage")
);
const PrivacyPolicy = React.lazy(() =>
  import("./Components/LandingPage/PrivacyPolicy/PrivacyPolicy")
);
const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const UserDetails = React.lazy(() => import("./Components/Signup/UserDetails"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(() =>
  import("./Components/ForgotPassword/ForgotPassword")
);
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() =>
  import("./Components/Home/Home")
);


const EditProfileUI = React.lazy(() =>
  import("./Components/Editprofile/EditProfileUI")
);

const Conversations = React.lazy(() =>
  import("./Components/Conversation/Conversations")
);
const Notifications = React.lazy(() =>
  
    import("./Components/Conversation/Notification/Notifications")
  
);
const AllPitches = React.lazy(() =>
 import("./Components/Admin/pitchDecider/AllPitches")
);

const LoggedInPitches = React.lazy(() =>
 import("./Components/LoggedInPitches/LoggedInPitches")
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
          conversationId: data.conversationId, file: data.file
        })
      );
     

      // setMessages(prev => [...prev, data])
    });

    socket.current.on("allDeviceLogout", (data) => {
      // console.log(data);
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";


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
      dispatch(setLastMessageRead(data));
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
        console.log(res.data)
        const d = []
        for (let i = 0; i < res.data.length; i++) {
          d.push({
            conversationId: res.data[i]._id,
            receiverId: res.data[i].members.filter((f) => f !== user_id)[0],
            lastText: res.data[i].lastMessageText
          })
        }
        console.log(d)
        dispatch(
          setMessageCount(
            d
          )
        );
      }).catch(err => {
        
      });
    }
  }, [user_id]);

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
          <Route path="/userDetails" Component={AuthHoc(UserDetails)} />
          <Route path="/login" Component={LoginAuth(Login)} />
          <Route path="/forgotpassword" Component={LoginAuth(ForgotPassword)} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/BeyIncprivacypolicy" element={<PrivacyPolicy />} />
          <Route path="/posts" element={AuthHoc(Posts)} />

          <Route path="*" element={<NoMatch />} />

          <Route path="/dashboard" Component={AuthHoc(Home)} />
          {/* <Route path="/editProfile" Component={AuthHoc(Editprofile)} /> */}
          <Route path="/editProfile" Component={AuthHoc(EditProfileUI)} />


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
          <Route path="/user/:id" Component={AuthHoc(EditProfileUI)} />
        
          <Route path="/pitches" Component={AdminDeciderHoc(AllPitches)} />
          <Route
            path="/profileRequests"
            Component={AdminDeciderHoc(UserRequests)}
          />
          {/* <Route
            path="/singleProfileRequest/:id"
            Component={AdminDeciderHoc(SingleRequestProfile)}
          /> */}
          <Route
            path="/singleProfileRequest/:id"
            Component={AdminDeciderHoc(EditProfileUI)}
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
