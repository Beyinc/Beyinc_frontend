import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@mui/material';
import useWindowDimensions from '../Common/WindowSize';
import { gridCSS } from '../CommonStyles';
import { useNavigate, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { convertToDate, formatedDate, postTypes, socket_io } from '../../Utils';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';
import { io } from 'socket.io-client';
import './EditProfileUI.css'
import CloseIcon from "@mui/icons-material/Close";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditPost from './EditPost';
import PostComments from './PostComments';
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
        await ApiServices.likePost({ id: post?._id }).then(res => {
            setPost(res.data)
        }).catch((err) => {
            setToast({
                message: "Error occured when updating Pitch",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
    }
    const dislikePost = async () => {
        await ApiServices.dislikePost({ id: post?._id }).then(res => {
            setPost(res.data)
        }).catch((err) => {
            setToast({
                message: "Error occured when updating Pitch",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
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

    const deletePost = async (e) => {
        e.target.disabled=true
        await ApiServices.deletepost({ id }).then(res => {
            navigate(-1);
        }).catch((err) => {
            setToast({
                message: "Error occured when updating Pitch",
                bgColor: ToastColors.failure,
                visible: "yes",
            });
        });
    }

    const [editPostPopup, setEditPostpopup] = useState(false)


    const addingRequestDiscussion = async (e) => {
        e.target.disabled=true
        await ApiServices.requestIntoOpenDiscussion({ id: post?._id, user_id }).then(res => {
            setPost(res.data)
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
            } }
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
                <div className='createPostHeader' styl={{ position: 'relative' }}>
                    {post?.createdBy?.userName}'s Post Details
                    <div style={{
                        display: "flex",
                        alignItems: 'center',
                        gap: '10px',
                        color: 'black'
                    }}>
                        <div style={{ cursor: 'pointer', position: 'relative' }}>
                            <MoreHorizIcon id='menu' onClick={() => {
                                document.getElementsByClassName('postIndiViewer')[0].classList.toggle('show');
                            } } />
                            <div className='subMenu postIndiViewer' ref={userDetailsRef}>
                                {post?.createdBy?._id == user_id &&
                                    <>
                                    <div onClick={() => setEditPostpopup(true)}>Edit</div>
                                    <div onClick={() => setdeletePopUp(true)}>Delete</div>
                                    </>}
                                <div>Report</div>
                            </div>
                        </div>
                        <div style={{ cursor: 'pointer' }} onClick={() => {
                            navigate(-1);
                        } }>
                            <CloseIcon />
                        </div>
                    </div>
                </div>

                <div className='wholePostWrapper'>
                    <div className='leftPostWrapper' style={{ margin: '10px' }}>
                        <div className="postImageDetailsContainer">
                            <img src={post?.image?.url} alt="" srcset="" />
                        </div>
                        <div>
                            <b>updated at:</b> {formatedDate(post?.updatedAt)}
                        </div>
                        <div>
                            <b>post type:</b> {post?.type}
                        </div>
                        <div>
                            <b>pitch:</b> {post?.pitchId?.title}
                        </div>
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
                        {(post?.openDiscussion == true || post?.openDiscussionTeam.map(o => o._id).includes(user_id) || post?.createdBy._id == user_id) ? <PostComments postId={post?._id} fetchComments={(post?.openDiscussion == true || post?.openDiscussionTeam.map(o => o._id).includes(user_id) || post?.createdBy._id == user_id)} /> : post?.openDiscussionRequests.map(o => o._id).includes(user_id) ? <button>Discussion Request Pending</button> :<button onClick={addingRequestDiscussion}>Join for discussion</button> }
                    </div>
                </div>



            </DialogContent>
        </Dialog>
        <Dialog
            
            open={deletePop}
            onClose={() => {
                setdeletePopUp(false)
            } }
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
            <EditPost setEditPostpopup={setEditPostpopup} editPostPopup={editPostPopup} post={post} setPost={setPost} />
        </>
    )
}

export default IndividualPostDetailsCard