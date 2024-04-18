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

    return (
        <Dialog
            fullScreen
            open={id!==undefined}
            onClose={() => {
                navigate(-1)
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
                <div className='createPostHeader' styl={{ position: 'relative' }}>
                    {post?.createdBy?.userName}'s Post Details
                    <div style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => {
                        navigate(-1)
                    }}>
                        <i class="fas fa-times"></i>
                    </div>
                </div>

                <div style={{margin: '10px'}}>
                    <div className="postImageDetailsContainer" >
                        <img src={post?.image?.url} alt="" srcset="" />
                    </div>
                    <div>
                        <b>updated at:</b> {formatedDate(post?.updatedAt)}
                    </div>
                    <div >
                        <b>post type:</b> {post?.type}
                    </div>
                    <div >
                        <b>pitch:</b> {post?.pitchId?.title}
                    </div>
                    <div >
                        <b>users tagged:</b> {post?.tags?.map(p => p.userName)?.join(', ')}
                    </div>
                    <div style={{display: 'flex', gap: '50px'}}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {post?.likes.length}
                            <i style={{cursor: 'pointer', color: post?.likes?.map(l=>l._id).includes(user_id) && 'blue'}} onClick={likingpost}
                                class="far fa-thumbs-up "
                                aria-hidden="true"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {post?.disLikes.length}
                            <i style={{ cursor: 'pointer', color: post?.disLikes?.map(l => l._id).includes(user_id) && 'blue' }} onClick={dislikePost}
                                class="far fa-thumbs-down"
                                aria-hidden="true"
                            />
                        </div>
                   </div>
                </div>



            </DialogContent>
        </Dialog>
    )
}

export default IndividualPostDetailsCard