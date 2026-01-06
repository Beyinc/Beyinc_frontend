import React, { Suspense, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useLocation,
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
  setFollowerNotification,
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
import EditProfile from "./Components/Editprofile/EditProfile";
import CreatePostPage from "./Components/Editprofile/Activities/Posts/CreatePostPage";
import Book from "./Components/Razorpay/Book";
import Proffesional from "./Components/Razorpay/Proffesional";
import Bank from "./Components/Razorpay/Bank";
import Calendar from "./Components/Dashboard/Bookings/UserBooking/Calendar";
import Schedule from "./Components/Dashboard/Availability/Schedule";
import OAuthPopupHandler from "./Components/Calendar/calendarAuth";
import UserBooking from "./Components/Dashboard/Bookings/UserBooking/UserBookings";
import MentorBookings from "./Components/Dashboard/Bookings/mentorBooking/MentorBookings";
import BeyincProfessional from "./Components/BeyincProfessional/BeyincProfessional";
import EntryDetails from "./Components/EntryDetails/EntryDetails";
import SearchResults from "./Components/Searching/SearchResults";
import payOut from "./Components/PayOut/payOut";
import Payment from "./Components/Dashboard/Payment/Payment";
import About from "./Components/Profile/About";
import Profile from "./Components/Profile/Profile";
import NewProfiles from "./Components/NewProfiles/NewProfiles";
import { Connections } from "./Components/Connections/ConnectionsWithSuggestions";
import NotificationPage from "./Components/Navbar/NotificationPage";
import ConnectionsWithSuggestions from "./Components/Connections/ConnectionsWithSuggestions";
import NewLogin from "./Components/NewLogin/NewLogin";
import NewSignup from "./Components/NewSignup/NewSignup";
import VerifyOtp from "./Components/NewSignup/VerifyOtp";
import EditProfessional from "./Components/EditProfessional";
const Posts = React.lazy(() => import("./Components/Posts/Posts"));

const IndividualPostDetailsCard = React.lazy(
  () => import("./Components/Editprofile/IndividualPostDetailsCard"),
);
const PostReports = React.lazy(
  () => import("./Components/Admin/PostReports/PostReports"),
);
const LandingPage = React.lazy(
  () => import("./Components/LandingPage/LandingPage"),
);
const PrivacyPolicy = React.lazy(
  () => import("./Components/LandingPage/PrivacyPolicy/PrivacyPolicy"),
);
const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const UserDetails = React.lazy(() => import("./Components/Signup/UserDetails"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(
  () => import("./Components/ForgotPassword/ForgotPassword"),
);
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() => import("./Components/Home/Home"));

const Conversations = React.lazy(
  () => import("./Components/Conversation/Conversations"),
);
const Notifications = React.lazy(
  () => import("./Components/Conversation/Notification/Notifications"),
);
const AllPitches = React.lazy(
  () => import("./Components/Admin/pitchDecider/AllPitches"),
);

const LoggedInPitches = React.lazy(
  () => import("./Components/LoggedInPitches/LoggedInPitches"),
);

const ENV = process.env;
const NoMatch = () => {
  return (
    <div className="noMatch">
      <div className="noRoute-image">
        <img src="/no-route.gif" alt="gif" />
      </div>
      <div className="noRoute-text">Oops..! no such routes found.</div>
    </div>
  );
};

const App = () => {
  const notificationAlert = useSelector(
    (state) => state.conv.notificationAlert,
  );
  const location = useLocation();
  const { userName } = useSelector((store) => store.auth.userDetails);

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
          file: data.file,
        }),
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
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
      document.body.setAttribute("data-theme", "light");
    } else {
      document.body.setAttribute("data-theme", localStorage.getItem("theme"));
    }
  }, []);
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
      })
        .then((res) => {
          console.log(res.data);
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
        .catch((err) => {});
    }
  }, [user_id]);

  useEffect(() => {
    socket.current.on("getNotification", (data) => {
      // console.log(data);
      dispatch(setNotification(true));
      // setMessages(prev => [...prev, data])
    });

    socket.current.on("getFollowerNotification", (data) => {
      // console.log(data);
      dispatch(setFollowerNotification(data));
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
            }),
          );
        }
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      ApiServices.userLivePitches()
        .then((res) => {
          dispatch(setUserLivePitches(res.data));
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error while fetching pitches",
              bgColor: ToastColors.failure,
              visible: "yes",
            }),
          );
        });
    }
  }, [notificationAlert]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      ApiServices.getuserPitches()
        .then((res) => {
          dispatch(setUserAllPitches(res.data));
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error while fetching pitches",
              bgColor: ToastColors.failure,
              visible: "yes",
            }),
          );
        });
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
        {![
          "/login",
          "/signup",
          "/",
          "/newlogin",
          "/newsignup",
          "/verify-otp",
        ].includes(location.pathname) && <Navbar />}

        <div className=" max-w-[1550px] m-auto">
          <Routes>
            <Route path="/signup" Component={LoginAuth(NewSignup)} />
            <Route path="/userDetails" Component={AuthHoc(UserDetails)} />
            <Route path="/login" Component={LoginAuth(NewLogin)} />
            // new login - signup routes
            {/* <Route path="/newlogin" Component={LoginAuth(NewLogin)}/>
            <Route path="/newsignup" Component={LoginAuth(NewSignup)}/> */}
            <Route path="/verify-otp" Component={LoginAuth(VerifyOtp)} />
            <Route
              path="/forgotpassword"
              Component={LoginAuth(ForgotPassword)}
            />
            <Route path="/" element={<LandingPage />} />
            <Route path="/BeyIncprivacypolicy" element={<PrivacyPolicy />} />
            <Route path="/posts" Component={AuthHoc(Posts)} />
            <Route path="/createPostPage" Component={AuthHoc(CreatePostPage)} />
            <Route
              path="/editPostPage/:postId"
              Component={AuthHoc(CreatePostPage)}
            />
            <Route
              path="/beyincProfesional"
              Component={AuthHoc(BeyincProfessional)}
            />
            <Route
              path="/editProfessional"
              Component={AuthHoc(EditProfessional)}
            />
            <Route path="*" element={<NoMatch />} />
            <Route path="/dashboard" Component={AuthHoc(Home)} />
            <Route path="/editProfile" Component={AuthHoc(Profile)} />
            <Route path="/newProfiles" Component={AuthHoc(NewProfiles)} />
            <Route path="/entryUserDetails" Component={AuthHoc(EntryDetails)} />
            <Route path="/search" Component={AuthHoc(SearchResults)} />
            <Route path="/conversations" Component={AuthHoc(Conversations)} />
            <Route
              path="/conversations/:conversationId"
              Component={AuthHoc(Conversations)}
            />
            <Route path="/notifications" Component={AuthHoc(Notifications)} />
            <Route path="/userPitches" Component={AuthHoc(LoggedInPitches)} />
            <Route path="/livePitches" Component={AuthHoc(LivePitches)} />
            <Route
              path="/posts/:id"
              Component={AuthHoc(IndividualPostDetailsCard)}
            />
            <Route
              path="/livePitches/:pitchId"
              Component={AuthHoc(IndividualPitch)}
            />
            <Route path="/searchusers" Component={AuthHoc(AllUsers)} />
            <Route path="/user/:id" Component={AuthHoc(Profile)} />
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
              Component={AdminDeciderHoc(EditProfile)}
            />
            <Route path="/payout" Component={AdminDeciderHoc(payOut)} />
            <Route
              path="/postReports"
              Component={AdminDeciderHoc(PostReports)}
            />
            <Route path="/book" element={<Book />} />
            <Route path="/proffesional" element={<Proffesional />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/rescheduleCalendar" element={<Calendar />} />
            <Route path="/dashboard/availability" element={<Schedule />} />
            <Route path="/dashboard/payment" element={<Payment />} />
            <Route
              path="/dashboard/mentorBookings"
              element={<MentorBookings />}
            />
            <Route path="/dashboard/userBookings" element={<UserBooking />} />
            <Route
              path="/oauth-popup-handler"
              element={<OAuthPopupHandler />}
            />
            {/* <Route path="/see-all-users" element={<SeeAllUsers/>}></Route> */}
            <Route path="/about" element={<About />} />
            <Route
              path="/connections"
              element={<ConnectionsWithSuggestions />}
            />
            <Route path="/notification-page" element={<NotificationPage />} />
          </Routes>
        </div>
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

////
