import React, { useEffect, useRef, useState } from "react";
import "./conversations.css";
import Messages from "./Messages/Messages";
import HistoryChats from "./Users/HistoryChats";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import {
  setAllUsers,
  setLiveMessage,
  setOnlineUsers,
  setReceiverId,
} from "../../redux/Conversationreducer/ConversationReducer";
import SearchBox from "./Users/SearchBox";
import { io } from "socket.io-client";
import { useParams } from "react-router";
import useWindowDimensions from "../Common/WindowSize";
const Conversations = () => {
  const { email, user_id } = useSelector((store) => store.auth.loginDetails);
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.outerWidth <= 768);
  useEffect(() => {
    // console.log(window.outerWidth);
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // // intialize socket io
  // const socket = useRef()
  // const { email } = useSelector(
  //   (store) => store.auth.loginDetails
  // );

  // useEffect(() => {
  //   socket.current = io(socket_io)
  // }, [])

  // // adding online users to socket io
  // useEffect(() => {
  //   socket.current.emit("addUser", email);
  //   socket.current.on("getUsers", users => {
  //     console.log('online', users);
  //     dispatch(setOnlineUsers(users))
  //   })
  // }, [email])

  // // live message updates
  // useEffect(() => {
  //   socket.current.on('getMessage', data => {
  //     console.log(data);
  //     dispatch(setLiveMessage({
  //       message: data.message,
  //       senderId: data.senderId,
  //       fileSent: data.fileSent
  //     }))
  //     // setMessages(prev => [...prev, data])
  //   })
  // }, [])

  useEffect(() => {
    ApiServices.getAllUsers({ type: "" }).then((res) => {
      dispatch(setAllUsers(res.data));
    });
  }, []);

  // get friend based on params
  useEffect(() => {
    if (conversationId !== undefined) {
      ApiServices.getFriendByConvID({
        conversationId: conversationId,
        userId: user_id,
      })
        .then((res) => {
          const friend = res.data?.members.filter((f) => f._id !== user_id)[0];

          dispatch(
            setReceiverId(friend)
          );

          // --- NEW CODE STARTS HERE ---
          // If we found a friend, mark the chat as seen immediately
          if (friend) {
            ApiServices.changeSeenStatus({
              senderId: friend._id, // The person who sent the msg
              receiverId: user_id,  // Me (the one reading it)
              conversationId: conversationId
            })
              .then(() => {
                console.log("Chat marked as seen");
                // Optional: You might want to refresh the chat list here to remove the blue dot immediately
                // ApiServices.getAllConversations().then(...) 
              })
              .catch(err => console.log("Read status error:", err));
          }
          // --- NEW CODE ENDS HERE ---
        })
        .catch((err) => {
          // window.location.href = "/conversations";
          console.log(err);
        });
    }
  }, [conversationId]);

  const { height, width } = useWindowDimensions();

  return (
    <div className="conversationContainer">
      <div
        className="chat-sidebar"
        style={{
          display: width < 770 && conversationId !== undefined && "none",
        }}
      >
        <SearchBox />
        <HistoryChats />
      </div>
      <div
        className="chatContainer"
        style={{
          display: width < 770 && conversationId == undefined && "none",
        }}
      >
        <Messages />
      </div>
    </div>
  );
};

export default Conversations;
