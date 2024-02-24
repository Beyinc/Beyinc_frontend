import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../../Services/ApiServices";
import SendIcon from "@mui/icons-material/Send";
import { setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { format } from "timeago.js";
import { io } from "socket.io-client";
import {
  setConversationId,
  setLastMessageRead,
  setLiveMessage,
  setMessageCount,
  setOnlineUsers,
} from "../../../redux/Conversationreducer/ConversationReducer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams, useNavigate } from "react-router";
import "./IndividualMessage.css";
import sendSound from "../Notification/send.mp3";
import { isParent, socket_io, updateLastSeen } from "../../../Utils";
import { Howl } from "howler";
import moment from "moment";
import { GoogleCalenderEvent } from "../../Common/GoogleCalender";
import { TextField } from "@mui/material";


const IndividualMessage = () => {
  const [loadingFile, setLoadingFile] = useState("");
  const { conversationId } = useParams();
  const receiverId = useSelector((state) => state.conv.receiverId);
  const liveMessage = useSelector((state) => state.conv.liveMessage);
  const lastMessageRead = useSelector((state) => state.conv.lastMessageRead);

  const [gmeetLinkOpen, setGmeetLinkOpen] = useState(false)

  const { image, userName, role, user_id, email } = useSelector(
    (state) => state.auth.loginDetails
  );
  const [showDiv, setShowDiv] = useState(true);

  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const [file, setFile] = useState("");
  const [messageTrigger, setMessageTrigger] = useState("");
  const [normalFileName, setNormalFileName] = useState("");
  const [userchatBlocked, setUserChatBlocked] = useState(null)
  const [userchatBlockedBy, setUserChatBlockedBy] = useState('')

  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageCount = useSelector((state) => state.conv.messageCount);
  const [isSending, setIsSending] = useState(false);
  const sound = new Howl({
    src: ["/send.mp3"],
  });

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const onlineUsers = useSelector((state) => state.conv.onlineUsers);
  const [onlineEmails, setOnlineEmails] = useState([]);
  useEffect(() => {
    if (onlineUsers.length > 0) {
      const emails = [];
      onlineUsers.map((ol) => {
        if (!emails.includes(ol.userId)) {
          emails.push(ol.userId);
        }
      });
      setOnlineEmails(emails);
    }
  }, [onlineUsers]);

  useEffect(() => {
    if (conversationId !== "" && receiverId !== undefined && receiverId !== '') {
      // to make seen for other users this api is works thats why we changing  senderId: receiverId.email, receiverId: email
      ApiServices.changeStatusMessage({ senderId: receiverId._id, receiverId: user_id, conversationId:conversationId }).then(res => {
        // console.log('changed status')
        socket.current.emit("seenMessage", {
          senderId: user_id,
          receiverId: receiverId._id,
          conversationId: conversationId,
        });
        dispatch(setMessageCount(messageCount.filter(f => f !== receiverId._id)))
      }).catch(err => {
        // console.log(err)
      })
      ApiServices.getMessages({
        conversationId: conversationId,
      })
        .then((res) => {
          setMessages(res.data);
          setNormalFileName("");
          setFile("");
          setSendMessage("");
          setLoadingFile("");
        })
        .catch((err) => {
          navigate("/conversations");
        });
    }
  }, [conversationId, messageTrigger, receiverId]);

  useEffect(() => {
    setUserChatBlocked(null)
    setUserChatBlockedBy('')
    if (conversationId !== '') {
      ApiServices.getConversationById({ conversationId: conversationId }).then((res) => {
        if (res.data.chatBlocked?.blockedBy !== undefined || res.data.chatBlocked?.blockedBy !== '') {
          setUserChatBlocked(true)
          setUserChatBlockedBy(res.data.chatBlocked.blockedBy || '')
        } else {
          setUserChatBlocked(false)
          setUserChatBlockedBy('')
        }
      }).catch(err => {
        // console.log(err);
      })

    }
  }, [conversationId]);

  useEffect(() => {
    if (liveMessage?.fileSent == true && liveMessage.conversationId == conversationId) {
      ApiServices.getMessages({
        conversationId: conversationId,
      })
        .then((res) => {
          setMessages(res.data);
          setNormalFileName("");
          setFile("");
          setSendMessage("");
          dispatch(setLiveMessage({}))
          // sendSoundRef?.current?.play()
          sound.play();
        })
        .catch((err) => {
          navigate("/conversations");
        });
    }
  }, [liveMessage?.fileSent]);

  useEffect(() => {
    // console.log(liveMessage);
    if (Object.keys(liveMessage).length > 0 && liveMessage.conversationId == conversationId) {
      // sendSoundRef?.current?.play();
      sound.play();

      setMessages((prev) => [
        ...prev,
        { ...liveMessage, createdAt: Date.now() },
      ]);
      dispatch(setLiveMessage({}))
      socket.current.emit("seenMessage", {
        senderId: user_id,
        receiverId: receiverId._id,
        conversationId: conversationId,
      });
    }
  }, [liveMessage]);


  useEffect(() => {
    if (lastMessageRead) {
      const oldMessages = [...messages]
      // console.log({ ...messages[messages.length - 1], seen: new Date() });
      oldMessages.splice(oldMessages.length - 1, 1, { ...oldMessages[oldMessages.length - 1], seen: new Date() })
      dispatch(setLastMessageRead(false))
      setMessages([...oldMessages])
    }
  }, [lastMessageRead])




  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) {
      alert(`File size should be less than ${4 * 1024 * 1024 / (1024 * 1024)} MB.`);
      e.target.value = null; // Clear the selected file
      return;
    }
    setNormalFileName(file);
    setFileBase(e, file);
    e.target.value = null;
  };
  const setFileBase = (e, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(reader.result);
    };
  };

  const sendText = async (e) => {

    if (file != "") {
      setLoadingFile(file);
      // console.log(file);
    }
    setSendMessage('')
    setFile("");
    setIsSending(true);
    setIsSending(false);
    // console.log({
    //   senderId: user_id,
    //   receiverId: receiverId?._id,
    // });
    if (sendMessage !== "" || file !== "") {
      await ApiServices.sendMessages({
        userId: user_id,
        conversationId: conversationId,
        senderId: user_id,
        receiverId: receiverId?._id,
        message: sendMessage,
        file: file, email: email
      })
        .then((res) => {
          setMessages((prev) => [
            ...prev,
            {
              conversationId: conversationId,
              senderId: user_id,
              receiverId: receiverId._id,
              message: sendMessage,
            },
          ]);
          setSendMessage("");
          socket.current.emit("sendMessage", {
            senderId: user_id,
            receiverId: receiverId._id,
            message: sendMessage,
            fileSent: file !== "",
            conversationId: conversationId
          });
          if (file !== "") {
            setMessageTrigger(!messageTrigger);
          }
          document.getElementById("chatFile").value = "";

        })
        .catch((err) => {
          dispatch(
            setToast({
              message: err.response.data.message,
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  };

  // useEffect(() => {
  //   return () => {
  //     sendSoundRef.current.pause();
  //     sendSoundRef.current.currentTime = 0;
  //   };
  // }, []);

  useEffect(() => {
    // console.log(messages);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    const handleScroll = () => {
      // Calculate the distance from the bottom of the page
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const bottomDistance = documentHeight - (scrollPosition + windowHeight);

      // Set visibility based on scroll position
      setShowDiv(bottomDistance > 100); // Adjust the threshold as needed
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const blockChat = async (by) => {
    await ApiServices.chatBlock({ conversationId: conversationId, blockedBy: user_id }).then(res => {
      setUserChatBlocked(!userchatBlocked)
      setUserChatBlockedBy(by)
      dispatch(setToast({
        message: res.data,
        visible: 'yes',
        bgColor: ToastColors.success
      }))
      socket.current.emit("chatBlocking", {
        senderId: user_id,
        receiverId: receiverId._id,
      });
    }).catch(err => {
      dispatch(setToast({
        message: 'Error occured',
        visible: 'no',
        bgColor: ToastColors.failure
      }))
    })
  }

  return (
    <div className="messageContainer">
      <div className="messageNavbar">

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => {
            navigate(`/user/${receiverId?._id}`)
          }}>
            <img
              className="Dp"
              src={
                receiverId?.image?.url !== undefined &&
                  receiverId?.image?.url !== ""
                  ? receiverId.image?.url
                  : "/profile.png"
              }
              alt=""
              srcset=""
            />
          </div>
          <div style={{ cursor: 'pointer' }} onClick={() => {
            navigate(`/user/${receiverId?._id}`)
          }}>
            <div className="User-name">{receiverId?.userName}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <div
                title={
                  onlineEmails.includes(receiverId._id) ? "online" : "away"
                }
                style={{ position: "relative", marginLeft: "10px" }}
                className={
                  onlineEmails.includes(receiverId._id) ? "online" : "away"
                }
              ></div>
              <div style={{ marginLeft: "-16px", fontSize: "12px" }}>
                {onlineEmails.includes(receiverId._id) ? "online" : "away"}
              </div>
            </div>
          </div>
        </div>
        {receiverId?.role !== 'Admin' && ((userchatBlockedBy !== '') ?
          userchatBlockedBy == user_id &&
          <button style={{ cursor: 'pointer' }} className="blockUnblock" onClick={() => blockChat('')}>
            Open Chat
          </button> : <button style={{ cursor: 'pointer' }} className="blockUnblock" onClick={() => blockChat(user_id)}>
            Close Chat
          </button>)}
      </div>

      <div className="messageBox" style={{ position: 'relative' }}>
        <div className="downGoing" id='downGoing' style={{ display: showDiv ? 'block' : 'none' }}
          onClick={() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <i
            className="fas fa-arrow-down"
            title="Scroll below"

          ></i>
        </div>
        {messages.length > 0 &&
          messages.map((m, i) => (
            <>
              {/* showing day on top */}
              {(moment(messages[i - 1]?.createdAt).format('MMMM Do YYYY') !== moment(m.createdAt).format('MMMM Do YYYY')) &&
                <div className="specificDay">{moment(m.createdAt).format('MMMM Do YYYY')}</div>
              }
              <div
                className={`details ${m.senderId === user_id ? "owner" : "friend"}`}
                ref={scrollRef}
              >
                <div
                  className="imageContainer"
                  style={{ display: m.senderId === user_id ? "none" : "none" }}
                >
                  <img
                    src={
                      image !== undefined && image !== "" && m.senderId === user_id
                        ? image
                        : receiverId?.image?.url !== undefined &&
                          receiverId?.image?.url !== "" &&
                          m.senderId !== user_id
                          ? receiverId.image?.url
                          : "/profile.png"
                    }
                    alt=""
                    srcset=""
                  />
                </div>
                <div className="personalDetails">
                  {/* checking previous day is not same */}
                  <div className="email">
                    {m.senderId === user_id ? (
                      <div className="time">
                        {moment(m.createdAt).format("h:mm a")}
                      </div>
                    ) : (
                      <div className="friendDetails">
                        {/* <div className="userName">{receiverId?.userName}</div> */}
                        <div className="time">
                          {/* MMMM Do YYYY,  */}
                          {moment(m.createdAt).format("h:mm a")}
                        </div>
                      </div>
                    )}
                  </div>
                  {m.message !== "" && <div className="text">{m.message}</div>}
                  {m.file !== "" && m.file !== undefined && (
                    <a href={m.file.secure_url} target="_blank" rel="noreferrer">
                      {m.file.secure_url?.includes(".png") ||
                        m.file.secure_url?.includes(".jpg") ||
                        m.file.secure_url?.includes(".webp") ||
                        m.file.secure_url?.includes(".gif") ||
                        m.file.secure_url?.includes(".svg") ||
                        m.file.secure_url?.includes(".jpeg") ? (
                        <img
                          src={m.file.secure_url}
                          alt=""
                          srcset=""
                          style={{
                            borderRadius: "none",
                            height: "150px",
                            width: "150px",
                          }}
                        />
                      ) : (
                        "File"
                      )}
                    </a>
                  )}
                  {(i == messages.length - 1 && m.senderId == user_id) &&
                    <div className="seenMessage">
                      {m.seen !== undefined ?
                        `seen ${format(m.seen)}`
                        : onlineEmails.includes(receiverId?._id) && 'Delivered'}
                    </div>}
                </div>

              </div>
            </>
          ))}
        {loadingFile != "" && (
          <div className={`details owner`} ref={scrollRef}>
            <div className="personalDetails">
              <div className="email">
                {/* <div className="time">
                  {moment(new Date()).format("h:mm a")}
                </div> */}
              </div>
              {loadingFile !== "" && loadingFile !== undefined && (
                <div style={{ position: 'relative' }}>
                  {loadingFile?.includes("data:image/png") ||
                    loadingFile?.includes("data:image/jpg") ||
                    loadingFile?.includes("data:image/webp") ||
                    loadingFile?.includes("data:image/gif") ||
                    loadingFile?.includes("data:image/svg") ||
                    loadingFile?.includes("data:image/jpeg") ? (
                    <>

                      <img src={loadingFile} alt="" srcset="" style={{ borderRadius: 'none', height: '150px', width: '150px' }} />
                      <div className="loading_viewer" >                      <div className="button-loader"></div></div>

                    </>
                  ) : (
                    "Sending File"
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      {/* <div className="bottom-line"></div> */}

      {userchatBlockedBy == '' ? <div className="sendBoxContainer">
        <div className="sendBox">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ margin: "2px 2px -8px 10px" }}>
              <textarea onChange={(e) => setSendMessage(e.target.value)} style={{ resize: 'none', border: 'none' }} id="" cols="2" rows="2" name="message"
                value={sendMessage} placeholder="Type a message"></textarea>
            </div>
            {file !== "" &&
              (file.split(";")[0]?.includes("data:image") ? (
                <div
                  style={{ position: "relative" }}
                  className="senMessageView"
                >
                  <img
                    src={file}
                    style={{
                      height: "250px",
                      width: "250px",
                      objectFit: "cover",
                    }}
                    className="sendingFiles"
                  ></img>
                  <div
                    style={{ position: "absolute", top: "10px", right: "0px" }}
                  >
                    <i
                      className="fas fa-times cross"
                      onClick={() => setFile("")}
                    ></i>
                  </div>
                </div>
              ) : (
                <div
                  style={{ position: "relative" }}
                  className="senMessageView"
                >
                  <iframe
                    src={file}
                    width="250px"
                    height="250px"
                    frameborder="0"
                    className="sendingFiles"
                  ></iframe>{" "}
                  <div
                    style={{ position: "absolute", top: "20px", right: "20px" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "0px",
                      }}
                    >
                      <i
                        className="fas fa-times cross"
                        onClick={() => {
                          setFile("")
                        }

                        }
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div>
            <label htmlFor="chatFile" className="uploadingFileIcon">
              <CloudUploadIcon />
            </label>
            <input
              type="file"
              id="chatFile"
              onChange={handleFile}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }}
            />
          </div>
          {isParent(role, receiverId?.role) && <div>
            <div className="uploadingFileIcon" onClick={() => { setGmeetLinkOpen(true) }}>
              <i class="fas fa-link"></i>
            </div>
          </div>}

        </div>
        <div>
          {(sendMessage !== "" || file !== "") ? (
            <SendIcon
              className=""
              onClick={sendText}
              style={{ color: "#0b57d0", cursor: "pointer", fontSize: "34px", marginTop: "8px", marginLeft: '10px' }}
            />
          ) : (
            <SendIcon
              className=""
              // onClick={sendText}

              style={{ color: "gray", fontSize: "34px", marginTop: "8px", marginLeft: '10px' }}
            />
          )}
        </div>
      </div> : <p> Your chat conversation between <b>{receiverId?.userName}</b> is closed.</p>}
      <GoogleCalenderEvent gmeetLinkOpen={gmeetLinkOpen} setGmeetLinkOpen={setGmeetLinkOpen} receiver={receiverId} />
    </div>
  );
};

export default IndividualMessage;
