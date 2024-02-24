import React, { useEffect, useState, useRef } from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ApiServices } from "../../../Services/ApiServices";
import { useNavigate } from "react-router";
import PitchDetailsReadOnly from "../../Common/PitchDetailsReadOnly";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

import { io } from "socket.io-client";
import { setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { AdminServices } from "../../../Services/AdminServices";
import { socket_io } from "../../../Utils";
import { Box, Dialog, DialogContent } from "@mui/material";
import { gridCSS } from "../../CommonStyles";
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function PitchCard({ d }) {
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const navigate = useNavigate();
  const [pitchDetails, setPitchdetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const dispatch = useDispatch();
  const [reasonPop, setReasonPop] = useState(false);
  const [reason, setReason] = useState("");
  // React.useEffect(() => {
  //     ApiServices.getProfile({ email: d.email }).then(res => {
  //         setImage(res.data.image.url)
  //     })
  // }, [d])

  const update = async (e, status) => {
    e.target.disabled = true;
    if (status == "approved" || (status == "rejected" && reason !== "")) {
      await AdminServices.updatePitch({
        pitchId: d._id,
        status: status,
        reason: reason,
      })
        .then((res) => {
          dispatch(
            setToast({
              message: `Pitch Status Updated`,
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
          socket.current.emit("sendNotification", {
            senderId: user_id,
            receiverId: d._id,
          });
          setOpen(false);
          d.status = status;
          setPitchdetails((prev) => ({ ...prev, status: status }));
          e.target.disabled = false;
          setReasonPop(false);
          setReason("");
        })
        .catch((err) => {
          setToast({
            message: "Error occured when updating Pitch",
            bgColor: ToastColors.failure,
            visible: "yes",
          });
        });
    } else {
      e.target.disabled = false;
      setReasonPop(true);
    }
  };

  const openUser = () => navigate(`/user/${d.userInfo?._id}`);

  useEffect(() => {
    setPitchdetails(d);
  }, [d]);
  return (
    <>
      <div
        className={
          "user-card-main-container " +
          (d?.userInfo.role === "Entrepreneur"
            ? "margin-entrepreneur"
            : d?.userInfo.role === "Mentor"
              ? "margin-mentor"
              : "")
        }
      >
        <div className="user-card-details">
          <div className="user-card-img-rating-container">
            <div className="user-card-image" onClick={openUser}>
              <img
                alt="user-pic"
                src={
                  d.userInfo?.image?.url !== undefined &&
                    d.userInfo?.image?.url !== ""
                    ? d.userInfo?.image?.url
                    : "/profile.png"
                }
              />
              {d.userInfo.verification === "approved" && (
                <img
                  src="/verify.png"
                  alt=""
                  style={{ width: "15px", height: "15px", position: 'absolute', right: '0' }}
                />
              )}
            </div>
          </div>
          <div className="user-card-details-text">
            <span className="user-name" onClick={openUser}>
              {d?.userInfo.userName}
            </span>
            <span className="user-name" style={{color: 'black'}}>
              {d?.title}
            </span>
            <span>
              <b>Status</b>:
              <span
                style={{
                  fontSize: "14px",
                  marginLeft: "5px",
                  color:
                    d.status == "approved"
                      ? "green"
                      : d.status == "pending"
                        ? "orange"
                        : "red",
                  border: `1px dotted ${d.status == "approved"
                      ? "green"
                      : d.status == "pending"
                        ? "orange"
                        : "red"
                    }`,
                  borderRadius: 5,
                  padding: "3px",
                }}
              >
                {d.status ? capitalizeFirstLetter(d.status) : d.status}
              </span>
            </span>
          </div>
        </div>
        <div className="user-card-actions">
          <div
            style={{
              fontWeight: "400",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span>{d?.userInfo.role}</span>
           
          </div>
          <button onClick={() => setOpen(true)}>View</button>
          {open && (
            <PitchDetailsReadOnly
              approve="Make Live"
              reject="Reject"
              open={open}
              setOpen={setOpen}
              update={update}
              value={value}
              setValue={setValue}
              pitchDetails={pitchDetails}
            />
          )}
        </div>
      </div>
      <Dialog
        open={reasonPop}
        onClose={() => setReasonPop(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        sx={gridCSS.tabContainer}
      >
        <DialogContent
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <b>Enter Reason for rejection</b>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
            }}
            onClick={() => setReasonPop(false)}
          >
            <CloseIcon />
          </Box>
          <Box>
            <input
              type="text"
              name=""
              value={reason}
              id=""
              onChange={(e) => setReason(e.target.value)}
            />
          </Box>
          <button
            type="submit"
            disabled={reason == ""}
            onClick={(e) => {
              update(e, "rejected");
            }}
          >
            Ok
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
