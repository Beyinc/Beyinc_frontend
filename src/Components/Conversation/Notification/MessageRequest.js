import React, { useEffect, useRef, useState } from 'react'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'
import { format } from 'timeago.js'
import '../Users/searchBox.css'
import CloseIcon from '@mui/icons-material/Close'

import PitchDetailsReadOnly from '../../Common/PitchDetailsReadOnly'
import { Box, Dialog, DialogContent } from '@mui/material'
import { gridCSS } from '../../CommonStyles'
import { io } from 'socket.io-client'
import { socket_io } from '../../../Utils'
import { useNavigate } from 'react-router'


const MessageRequest = ({ m, setMessageRequest }) => {
    const { email, userName, user_id } = useSelector(state => state.auth.loginDetails)
    const [pitchDetails, setPitchdetails] = useState(null)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(1)
    const [reasonPop, setReasonPop] = useState(false)
    const [reason, setReason] = useState('')
    const [popStatus, setpopStatus] = useState('')
    const navigate = useNavigate()

    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);

    const dispatch = useDispatch()

    const update = async (e, status) => {
        e.target.disabled = true
        if ((status == 'approved' && reason !== '') || (status == 'rejected' && reason !== '')) {
            await ApiServices.updateUserMessageRequest({ conversationId: m._id, status: status, rejectReason: reason }).then((res) => {

                dispatch(
                    setToast({
                        message: `Message request ${status}`,
                        bgColor: ToastColors.success,
                        visible: "yes",
                    })
                );
                setMessageRequest(prev => [...prev.filter((f) => f._id !== m._id)])
                e.target.disabled = false
                setReasonPop(false)
                setpopStatus('')
                setReason('')
                socket.current.emit("sendNotification", {
                    senderId: user_id,
                    receiverId: pitchDetails?.userInfo?._id,
                });

            }).catch(err => {
                setToast({
                    message: 'Error occured when updating request',
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
                e.target.disabled = false

            })
            setTimeout(() => {
                dispatch(
                    setToast({
                        message: "",
                        bgColor: "",
                        visible: "no",
                    })
                );
            }, 4000);
        } else {
            e.target.disabled = false
            setReasonPop(true)
            setpopStatus(status)
        }
    }

    useEffect(() => {
        ApiServices.fetchSinglePitch({ pitchId: m.pitchId }).then(res => {
            setPitchdetails(res.data)
        })
    }, [m])
    return (
        <div className='individualrequest'>
            <div className='individualrequestWrapper'>
                <div className='userNotiD' onClick={() => {
                    navigate(`/user/${m.members?.filter((f) => f.user?.userName !== userName)[0]?._id}`)
                }}>
                    <div>
                        <img style={{ height: '50px', width: '50px', borderRadius: '50%' }} src={m.members?.filter((f) => f.user?.userName !== userName)[0]?.image?.url == undefined ? '/profile.png' : m.members?.filter((f) => f.user?.userName !== userName)[0]?.image?.url} alt="" srcset="" />
                    </div>
                    <div className='message'><b>{m.members?.filter((f) => f.user?.userName !== userName)[0]?.userName}</b> sent you a message request</div>

                </div>
                <div className='updateActions'>
                    {/* <div style={{ fontSize: '12px' }}><b><i className='fas fa-clock' style={{ fontSize: '16px' }}></i>
                        {format(m.createdAt)}</b></div> */}
                    <attr title='Preview Pitch Details'>
                        <div className='extraDetails'
                            onClick={() => {
                                setOpen(true)
                            }}
                        >
                            <button style={{ width: '100px', borderRadius: '5px' }}>View Pitch</button>
                        </div>
                    </attr>
                </div>
                {open &&
                    <PitchDetailsReadOnly approve='Approve Chat Request' reject='Reject' open={open} setOpen={setOpen} update={update} value={value} setValue={setValue} pitchDetails={pitchDetails} />
                }

                <Dialog
                    open={reasonPop}
                    onClose={() => setReasonPop(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth='xl'
                    sx={gridCSS.tabContainer}
                // sx={ gridCSS.tabContainer }
                >


                    <DialogContent style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <Box><b>Enter Reason for {popStatus}</b></Box>
                        <Box sx={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={() => setReasonPop(false)}><CloseIcon /></Box>
                        <Box>
                            <input type="text" name="" value={reason} id="" onChange={(e) => setReason(e.target.value)} />
                        </Box>
                        <button type="submit" disabled={reason == ''} onClick={(e) => {
                            update(e, popStatus)
                        }}>
                            Ok
                        </button>

                    </DialogContent>
                </Dialog>
            </div>

        </div>
    )
}

export default MessageRequest