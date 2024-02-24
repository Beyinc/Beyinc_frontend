import React, { useEffect, useState } from "react";
import "./Notification.css";
import { ApiServices } from "../../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import MessageRequest from "./MessageRequest";
import { getAllNotifications, setNotification, setNotificationData } from "../../../redux/Conversationreducer/ConversationReducer";
import AllNotifications from "./AllNotifications";

const Notifications = () => {
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const notificationAlert = useSelector(state => state.conv.notificationAlert);
  const notifications = useSelector(state => state.conv.notifications);

  const [messageRequest, setMessageRequest] = useState([]);
  const [notificationTrigger, setNotificationtrigger] = useState(false);
  const dispatch = useDispatch()
  const [isSpinning, setSpinning] = useState(false);

  const handleReloadClick = () => {
    setSpinning(true);
    getNotifys()
    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };

  const getNotifys = async () => {
    await ApiServices.getUserRequest({ userId: user_id }).then((res) => {
      setMessageRequest(res.data);
    });
    dispatch(getAllNotifications(user_id));
  };

  useEffect(() => {
    getNotifys()
  }, [email, notificationTrigger]);


  useEffect(() => {
    if (notificationAlert == true) {
      dispatch(setNotification(false))
      getNotifys()
    }

  }, [notificationAlert])

  return (
    <div className="messageRequests">
      {/* <div className="reloadNotification" title="Reload for latest notification updates">
        <img
          src="/refresh.png"
          alt="Reload"
          className={isSpinning ? 'spin' : ''}
          style={{ cursor: "pointer", marginTop: '5px' }}
          onClick={handleReloadClick}
        />
      </div> */}

      {(messageRequest.length > 0 || notifications.length > 0) ? (
        <div>
          <div>
            {messageRequest.length > 0 && <>
              <div className="NotyHeader">Message Requests</div>
              <div>{messageRequest?.map((m) => (
                <MessageRequest m={m} setMessageRequest={setMessageRequest} />
              ))}
              </div>
            </>}
          </div>

          <div>
            {notifications.length > 0 && <>
              <div className="NotyHeader">Notifications</div>
              {notifications?.map((n) => (
                <AllNotifications n={n} />
              ))}
            </>

            }
          </div>

        </div>



      ) : (
        <div className="noSelected" style={{ height: "70vh" }}>
          <img className="no-request" src="/No_Conversation.png" alt="No Conversation" />
          <p style={{ marginTop: '-60px' }}> Oops...! No new message requests found</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
