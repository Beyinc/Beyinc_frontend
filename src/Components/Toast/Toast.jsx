import React, { useEffect, useState } from "react";
import "./Toast.css";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
const Toast = () => {
  const { message, visible, bgColor } = useSelector(
    (state) => state.auth.ToastDetails
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (visible == "yes") {
      setLoading(true);
      setTimeout(() => {
        dispatch(
          setToast({
            message: ``,
            bgColor: "",
            visible: "no",
          })
        );
        setLoading(false);
      }, 4000);
    }
  }, [visible]);
  return (
    <div
      style={{
        justifyContent: "center",
        display: visible === "yes" ? "flex" : "none",
      }}
    >
      <div
        className="toastStyles"
        style={{ backgroundColor: bgColor, color: "white", zIndex: "1401",gap: '10px'}}
      >
        <img
          src="/favicon.png"
          style={{ padding: "6px", background: "black", height: '30px', width: '30px', marginLeft: '-5px' }}
        />
        <div>{message}</div>
        {/* <CloseIcon style={{ cursor: 'pointer' }} onClick={() => {
          dispatch(
            setToast({
              message: ``,
              bgColor: '',
              visible: "no",
            })
          );
        }} /> */}
      </div>
    </div>
  );
};

export default Toast;
