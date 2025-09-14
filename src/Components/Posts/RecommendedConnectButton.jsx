import { useState } from "react";
import { useSelector } from "react-redux";
import AddConversationPopup from "../Common/AddConversationPopup";
import "./Posts.css";

const RecommendedConnectButton = ({ id, handleFollower, btnClassname }) => {
  const [receiverRole, setreceiverRole] = useState("");
  const [pitchSendTo, setPitchSendTo] = useState("");
  const [IsAdmin, setIsAdmin] = useState(false);
  const { role, email } = useSelector((store) => store.auth.loginDetails);

  return (
    <div>
      <button
        className={`connect-btn ${btnClassname} w-[120px] h-[35px] ml-2`}
        onClick={() => {
          setPitchSendTo(id);
          setreceiverRole(role);
          setIsAdmin(email == process.env.REACT_APP_ADMIN_MAIL);
        }}
      >
        Chat
      </button>

      <AddConversationPopup
        receiverId={pitchSendTo}
        setReceiverId={setPitchSendTo}
        receiverRole={receiverRole}
        IsAdmin={IsAdmin}
        handleFollower={handleFollower}
        isNavigate={true}
      />
    </div>
  );
};

export default RecommendedConnectButton;
