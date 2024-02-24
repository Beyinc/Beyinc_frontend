import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../Services/ApiServices';
import { Dialog, DialogContent } from '@mui/material';
import { gridCSS } from '../CommonStyles';
import { getAllHistoricalConversations } from '../../redux/Conversationreducer/ConversationReducer';
import { setLoading, setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';
import { isParent } from '../../Utils';
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import './AddConv.css'
import {
  
    itPositions,
    socket_io,

} from "../../Utils";
import useWindowDimensions from './WindowSize';
const AddConversationPopup = ({ receiverId, setReceiverId, receiverRole, IsAdmin }) => {
    const dispatch = useDispatch();
    const {width} = useWindowDimensions()
    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);
    const [open, setOpen] = useState(false)
    const { email, role, verification, user_id } = useSelector((state) => state.auth.loginDetails);
    const userPitches = useSelector(state => state.conv.userLivePitches)
    const [selectedpitchId, setselectedpitchId] = useState('');
    const decidingRolesMessage = async (receiverId) => {
        if (role === "Admin") {
            await ApiServices.directConversationCreation({
                userId: user_id,
                receiverId: receiverId,
                senderId: user_id,
                status: "approved",
            })
                .then((res) => {
                    dispatch(getAllHistoricalConversations(user_id));
                    dispatch(
                        setToast({
                            message: res.data,
                            bgColor: ToastColors.success,
                            visible: "yes",
                        })
                    );
                    setOpen(false);
                    setReceiverId("");
                    socket.current.emit("sendNotification", {
                        senderId: user_id,
                        receiverId: receiverId,
                    });
                    document
                        .getElementsByClassName("newConversation")[0]
                        ?.classList?.remove("show");
                })
                .catch((err) => {
                    // console.log(err);
                    dispatch(
                        setToast({
                            message: `Error Occured`,
                            bgColor: ToastColors.failure,
                            visible: "yes",
                        })
                    );
                    setReceiverId("");
                });
        } else if (isParent(role, receiverRole)) {
            if (verification == "approved") {
                await ApiServices.directConversationCreation({
                    userId: user_id,
                    receiverId: receiverId,
                    senderId: user_id,
                    status: "pending",
                })
                    .then((res) => {
                        dispatch(getAllHistoricalConversations(user_id));
                        dispatch(
                            setToast({
                                message: res.data,
                                bgColor: ToastColors.success,
                                visible: "yes",
                            })
                        );
                        setOpen(false);
                        setReceiverId("");
                        socket.current.emit("sendNotification", {
                            senderId: user_id,
                            receiverId: receiverId,
                        });
                        document
                            .getElementsByClassName("newConversation")[0]
                            ?.classList?.remove("show");
                    })
                    .catch((err) => {
                        // console.log(err);
                        dispatch(
                            setToast({
                                message: `Error Occured`,
                                bgColor: ToastColors.failure,
                                visible: "yes",
                            })
                        );
                        setReceiverId("");
                    });
            } else {
                dispatch(
                    setToast({
                        message: `Please Verify Yourself first to create conversation`,
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            }
        } else {
            if (
                verification == "approved" &&
                !IsAdmin
            ) {
                setOpen(true);
            } else if (IsAdmin) {
                // addconversation()
                await ApiServices.directConversationCreation({
                    userId: user_id,
                    receiverId: receiverId,
                    senderId: user_id,
                    status: "approved",
                })
                    .then((res) => {
                        dispatch(getAllHistoricalConversations(user_id));
                        dispatch(
                            setToast({
                                message: res.data,
                                bgColor: ToastColors.success,
                                visible: "yes",
                            })
                        );
                        socket.current.emit("sendNotification", {
                            senderId: user_id,
                            receiverId: receiverId,
                        });
                        setOpen(false);
                        setReceiverId("");
                        document
                            .getElementsByClassName("newConversation")[0]
                            ?.classList?.remove("show");
                    })
                    .catch((err) => {
                        // console.log(err);
                        dispatch(
                            setToast({
                                message: `Error Occured`,
                                bgColor: ToastColors.failure,
                                visible: "yes",
                            })
                        );
                        setReceiverId("");
                    });
            } else {
                setReceiverId("");
                dispatch(
                    setToast({
                        message: `Please Verify Yourself first to create conversation`,
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            }
        }
    };
    useEffect(() => {
        if (receiverId !== "") {
            decidingRolesMessage(receiverId);
        }
    }, [receiverId]);
    

    const addconversation = async (e) => {
        // e.preventDefault();
        dispatch(setLoading({ visible: "yes" }));
        e.target.disabled = true;
        const conversation = {
            userId: user_id,
            receiverId: receiverId,
            senderId: user_id,
            pitchId: selectedpitchId
        };
        await ApiServices.addConversation(conversation)
            .then((res) => {
                dispatch(getAllHistoricalConversations(user_id));
                setReceiverId("");
                dispatch(
                    setToast({
                        message: res.data,
                        bgColor: ToastColors.success,
                        visible: "yes",
                    })
                );
                setOpen(false);
                e.target.disabled = false;
                socket.current.emit("sendNotification", {
                    senderId: user_id,
                    receiverId: receiverId,
                });
                dispatch(setLoading({ visible: "no" }));
            })
            .catch((err) => {
                setReceiverId("");
                dispatch(
                    setToast({
                        message: `Error Occured/try use different pitch title`,
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
                e.target.disabled = false;
                dispatch(setLoading({ visible: "no" }));
            });
        document
            .getElementsByClassName("newConversation")[0]
            ?.classList.remove("show");
    };
  return (
      <Dialog
          fullWidth = {width < 700}
          open={open}
          onClose={() => {
              setReceiverId("");
              setOpen(false)
          }}
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
              <div className='addconvSelect'>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '18px', marginBottom: '5px'}}>
                      <div>Select Pitch</div>
                      <div
                          className='' style={{ textAlign: 'end', fontSize: '14px' }}
                          onClick={() => {
                              setOpen(false);
                              setReceiverId("");
                          }}
                      >
                          <CloseIcon />
                      </div>
                 </div>
                  <div>
                      <select
                          name="pitch"
                          value={selectedpitchId}
                          onChange={(e) => setselectedpitchId(e.target.value)}
                      >
                          <option value="">Select a pitch</option>
                          {userPitches?.length > 0 &&
                              userPitches?.map((c) => (
                                  <option value={c._id}>{c.title}</option>
                              ))}
                      </select>
                      <div className="convButton">
                          <button
                              type=""
                              onClick={addconversation}
                              disabled={
                                  selectedpitchId == ''
                              }
                          >
                              Create a Conversation
                          </button>
                      </div>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
  )
}

export default AddConversationPopup