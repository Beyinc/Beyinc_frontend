import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@mui/material';
import useWindowDimensions from '../Common/WindowSize';
import { gridCSS } from '../CommonStyles';
import { useNavigate, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { convertToDate, formatedDate, postTypes, socket_io } from '../../Utils';
import { ApiServices } from '../../Services/ApiServices';
import { setLoading, setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';
import { io } from 'socket.io-client';
// import './EditProfile.css'
import CloseIcon from "@mui/icons-material/Close";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditPost from './Activities/Posts/EditPost';
import PostComments from './PostComments';
import { Link } from 'react-router-dom';
const IndividualPostDetailsCard = () => {
    const userPitches = useSelector(state => state.conv.userLivePitches)
    const dispatch = useDispatch()
    const { id } = useParams()

    const [post, setPost] = useState(null)

    useEffect(() => {
        if (id !== undefined) {
            ApiServices.getPost({ id: id }).then(res => {
                setPost(res.data)
            }).catch((err) => {
                setToast({
                    message: "Error occured when updating Pitch",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                });
            });
        }
    }, [id])

    const { width } = useWindowDimensions()
    const navigate = useNavigate()
    const { email, role, userName, verification, user_id } = useSelector(
        (store) => store.auth.loginDetails
    );
    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);

    const likingpost = async () => {
        dispatch(setLoading({ visible: "yes" }));

        await ApiServices.likePost({ id: post?._id }).then(res => {
            setPost(res.data)
        }).catch((err) => {
            setToast({
                message: "Error occured when updating Pitch",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
        dispatch(setLoading({ visible: "no" }));

    }
    const dislikePost = async () => {
        dispatch(setLoading({ visible: "yes" }));

        await ApiServices.dislikePost({ id: post?._id }).then(res => {
            setPost(res.data)
        }).catch((err) => {
            setToast({
                message: "Error occured when updating Pitch",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
        dispatch(setLoading({ visible: "no" }));

    }
    const userDetailsRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            userDetailsRef.current &&
            !userDetailsRef.current.contains(event.target) &&
            event.target.id !== "menu"
        ) {
            document.getElementsByClassName('postIndiViewer')[0].classList.remove('show')

        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const [deletePop, setdeletePopUp] = useState(false)
    const [reportpopup, setreportpopUp] = useState(false)
    const [reportText, setReportText] = useState('')

    const deletePost = async (e) => {
        e.target.disabled = true
        await ApiServices.deletepost({ id }).then(res => {
            navigate(-1);
        }).catch((err) => {
            setToast({
                message: "Error occured when updating post",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
    }


    const reportPost = async (e) => {
        e.target.disabled = true
        await ApiServices.addReport({ id, reportby: user_id, reason: reportText }).then(res => {
            setReportText('')
            navigate(-1);
        }).catch((err) => {
            setToast({
                message: "Error occured when Reporting",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
    }

    const [editPostPopup, setEditPostpopup] = useState(false)
    const [EditPostCount, setEditPostCount] = useState(false)



    const addingRequestDiscussion = async (e) => {
        e.target.disabled = true
        await ApiServices.requestIntoOpenDiscussion({ id: post?._id, user_id }).then(res => {
            setPost(res.data)
            socket.current.emit("sendNotification", {
                senderId: user_id,
                receiverId: post?.createdBy._id,
            });
        }).catch((err) => {
            setToast({
                message: "Error occured when updating Pitch",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
            e.target.disabled = false
        });
    }

    return (
        <><Dialog
            fullScreen
            open={id !== undefined}
            onClose={() => {
                navigate(-1);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
            sx={{
                ...gridCSS.tabContainer,
                // Setting width to auto
            }}

        >
            <DialogContent
                style={{
                    padding: '0px',
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: '10px',
                }}
            >
                {post !== null &&

                    <><div className='createPostHeader' styl={{ position: 'relative' }}>
                        {post?.createdBy?.userName}'s Post Details
                        <div style={{
                            display: "flex",
                            alignItems: 'center',
                            gap: '10px',
                            color: 'black'
                        }}>
                            {/* <div style={{ cursor: 'pointer', position: 'relative' }}>
                                <MoreHorizIcon id='menu' onClick={() => {
                                    document.getElementsByClassName('postIndiViewer')[0].classList.toggle('show');
                                } } />
                                <div className='subMenu postIndiViewer' ref={userDetailsRef}>
                                    {post?.createdBy?._id == user_id &&
                                        <>
                                            <div onClick={() => {
                                                setEditPostCount(prev => prev + 1);
                                                setEditPostpopup(true);
                                            } }>Edit</div>
                                            <div onClick={() => setdeletePopUp(true)}>Delete</div>
                                        </>}
                                    <div onClick={() => setreportpopUp(true)}>Report</div>
                                </div>
                            </div> */}
                            <div style={{ cursor: 'pointer' }} onClick={() => {
                                navigate(-1);
                            }}>
                                <CloseIcon />
                            </div>
                        </div>
                    </div><div className='wholePostWrapper'>
                            <div className='leftPostWrapper' style={{ flex: '1', margin: '10px' }}>
                                <div className="postImageDetailsContainer">
                                    {(post?.image !== undefined && post?.image !== "" && post?.image.url !== '') &&

                                        <img src={post?.image?.url} alt="Profile" />}
                                </div>
                                <div>
                                    <b>updated at:</b> {formatedDate(post?.updatedAt)}
                                </div>
                                <div>
                                    <b>post type:</b> {post?.type}
                                </div>
                            {post?.pitchId && <div>
                                <b>pitch:</b> {post?.pitchId?.title}
                                {(post?.openDiscussion == true || post?.openDiscussionTeam.map(o => o._id).includes(user_id) || post?.createdBy._id == user_id || role == 'Admin') &&

                                    <Link to={`/livePitches/${post?.pitchId?._id}`}>View Pitch</Link>
                                }
                            </div>}
                            {post?.link && <div>
                                <b>pitch:</b> <a href={post?.link}>Link</a>
                            </div>}
                                <div>
                                    <b>users tagged:</b> {post?.tags?.map(p => p.userName)?.join(', ')}
                                </div>
                                <div style={{ display: 'flex', gap: '50px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {post?.likes.length}
                                        <i style={{ cursor: 'pointer', color: post?.likes?.map(l => l._id).includes(user_id) && 'blue' }} onClick={likingpost}
                                            class="far fa-thumbs-up "
                                            aria-hidden="true" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {post?.disLikes.length}
                                        <i style={{ cursor: 'pointer', color: post?.disLikes?.map(l => l._id).includes(user_id) && 'blue' }} onClick={dislikePost}
                                            class="far fa-thumbs-down"
                                            aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                            <div className='rightPostWrapper'>
                                {(post?.openDiscussion == true || post?.openDiscussionTeam.map(o => o._id).includes(user_id) || post?.createdBy._id == user_id || role == 'Admin') ? <PostComments postId={post?._id} fetchComments={(post?.openDiscussion == true || post?.openDiscussionTeam.map(o => o._id).includes(user_id) || post?.createdBy._id == user_id || role == 'Admin')} /> : post?.openDiscussionRequests.map(o => o._id).includes(user_id) ? <button>Discussion Request Pending</button> : <button onClick={addingRequestDiscussion}>Join for discussion</button>}
                            </div>
                        </div></>
                }




            </DialogContent>
        </Dialog>
            <Dialog

                open={deletePop}
                onClose={() => {
                    setdeletePopUp(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                sx={{
                    ...gridCSS.tabContainer,
                    // Setting width to auto
                }}

            >
                <DialogContent
                    style={{
                        padding: '10px',
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: '10px',

                    }}
                >

                    Are you sure to delete the post?
                    <div style={{
                        display: "flex",
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'center'

                    }}>
                        <button onClick={(e) => {
                            deletePost(e)
                        }}>Yes</button>
                        <button onClick={() => {
                            setdeletePopUp(false)
                        }}>No</button>
                    </div>


                </DialogContent>
            </Dialog>



            <Dialog

                open={reportpopup}
                onClose={() => {
                    setreportpopUp(false)
                    setReportText('')
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                sx={{
                    ...gridCSS.tabContainer,
                    // Setting width to auto
                }}

            >
                <DialogContent
                    style={{
                        padding: '10px',
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: '10px',

                    }}
                >
                    <div>
                        <textarea
                            className="textarea"
                            rows={2}
                            cols={50}
                            value={reportText} onChange={(e) => { setReportText(e.target.value) }}
                            placeholder="Report reason"
                            style={{ resize: 'none' }} />
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'center'

                    }}>
                        <button disabled={reportText == ''} onClick={(e) => {
                            reportPost(e)
                        }}>Report</button>

                    </div>


                </DialogContent>
            </Dialog>
            <EditPost EditPostCount={EditPostCount} setEditPostpopup={setEditPostpopup} editPostPopup={editPostPopup} post={post} setPost={setPost} />
        </>
    )
}

export default IndividualPostDetailsCard