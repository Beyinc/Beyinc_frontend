import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHistoricalConversations } from "../../redux/Conversationreducer/ConversationReducer";
import { useNavigate } from "react-router-dom";
import AddConversationPopup from "../Common/AddConversationPopup";
import "./Posts.css";

const RecommendedConnectButton = ({ id, handleFollower }) => {
  const [connectStatus, setConnectStatus] = useState(null);
  const [receiverRole, setreceiverRole] = useState("");
  const [pitchSendTo, setPitchSendTo] = useState("");
  const [IsAdmin, setIsAdmin] = useState(false)
  const {
    user_id,
    userName: loggedUserName,
    image: loggedImage,
    role,
    email,
  } = useSelector((store) => store.auth.loginDetails);
  const historicalConversations = useSelector(
    (state) => state.conv.historicalConversations
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (id !== undefined) {
      dispatch(getAllHistoricalConversations(user_id));
    }
  }, []);
  useEffect(() => {
    let obj = {};
    if (
      historicalConversations?.filter((f) =>
        f.members.map((m) => m._id).includes(id)
      ).length > 0
    ) {
      obj[id] = {
        status: historicalConversations?.filter((f) =>
          f.members.map((m) => m._id).includes(id)
        )[0]?.status,
        id: historicalConversations?.filter((f) =>
          f.members.map((m) => m._id).includes(id)
        )[0]?._id,
      };
    }
    setConnectStatus(obj);
  }, [historicalConversations]);

  const openChat = async (e) => {
    navigate(`/conversations/${connectStatus[id]?.id}`);
  };
  return (
    <div>
      {connectStatus &&
        (connectStatus[id]?.status === "pending" ? (
          <button className="connect-btn">Pending</button>
        ) : connectStatus[id]?.status === "approved" ? (
          <button className="connect-btn" onClick={openChat}>
            Chat
          </button>
        ) : (
          <button
            className="connect-btn"
            onClick={() => {
              setPitchSendTo(id);
              setreceiverRole(role);
              setIsAdmin(email == process.env.REACT_APP_ADMIN_MAIL);
            }}
          >
            Connect
          </button>
        ))}

        <AddConversationPopup receiverId={pitchSendTo} 
                setReceiverId={setPitchSendTo}
                receiverRole={receiverRole}
                IsAdmin={IsAdmin}
                handleFollower = {handleFollower}
                 />
    </div>
  );
};

export default RecommendedConnectButton;
