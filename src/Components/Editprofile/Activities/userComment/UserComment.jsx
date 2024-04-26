import React, { useEffect, useRef, useState } from 'react'
import './UserComment.css'
import { MMDDYYFormat } from '../../../../Utils';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent } from '@mui/material';
import { gridCSS } from '../../../CommonStyles';
import { ApiServices } from '../../../../Services/ApiServices';
import { setToast } from '../../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../../Toast/ToastColors';
import { Navigate, useNavigate } from 'react-router';

const UserComment = ({ comment, deleteComment, onLike, onDisLike, setAllComments }) => {
    console.log(comment);
    const dispatch = useDispatch()

    const [deletePop, setdeletePopUp] = useState(false)
    const userDetailsRef = useRef(null);
    const handleClickOutside = (event) => {
        if (
            userDetailsRef.current &&
            !userDetailsRef.current.contains(event.target) &&
            event.target.id !== "menu"
        ) {
            document.getElementsByClassName(`postSubActions${comment?._id}`)[0]?.classList.remove('show')

        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const { email, role, userName, verification, user_id } = useSelector(
        (store) => store.auth.loginDetails
    );

    const deletePost = async (e) => {
        e.target.disabled = true
        await ApiServices.deleteUserComment({ id: comment?._id }).then(res => {
            // navigate(-1);
            setAllComments(prev => [...prev.filter(p => p._id !== comment?._id)])
            setdeletePopUp(false)
        }).catch((err) => {
            dispatch(setToast({
                message: "Error occured when updating post",
                bgColor: ToastColors.failure,
                visible: "yes",
            }))
        });
        e.target.disabled = false

    }

    const navigate = useNavigate()
    return (


        <>

            <div className='commentTotalContainer'>
                <div onClick={() => {
                    if (comment?.commentBy?._id == user_id) {
                        navigate(`/editProfile`);
                    } else {
                        navigate(`/user/${comment?.commentBy?._id}`);
                    }
                }}>
                    <img
                        src={
                            comment?.commentBy?.image !== undefined && comment?.commentBy?.image?.url !== "" ? comment?.commentBy?.image?.url : "/profile.png"
                        }
                    />
                </div>
                <div className='commentDetailsHolder'>
                    <div className='commentByUserDetails'>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div className='commentByUser'>{comment?.commentBy?.userName}</div>
                            <div className='commentByUserRole'>{comment?.commentBy?.role}</div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div className='commentUpdatedText'>{MMDDYYFormat(comment?.updatedAt)}</div>
                                {comment?.commentBy?._id == user_id && <div id='menu' onClick={() => {
                                    document.getElementsByClassName(`postSubActions${comment?._id}`)[0]?.classList.toggle('show');
                                }}>

                                    <svg id='menu' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.75 15C8.75 15.663 8.48661 16.2989 8.01777 16.7678C7.54893 17.2366 6.91304 17.5 6.25 17.5C5.58696 17.5 4.95107 17.2366 4.48223 16.7678C4.01339 16.2989 3.75 15.663 3.75 15C3.75 14.337 4.01339 13.7011 4.48223 13.2322C4.95107 12.7634 5.58696 12.5 6.25 12.5C6.91304 12.5 7.54893 12.7634 8.01777 13.2322C8.48661 13.7011 8.75 14.337 8.75 15ZM17.5 15C17.5 15.663 17.2366 16.2989 16.7678 16.7678C16.2989 17.2366 15.663 17.5 15 17.5C14.337 17.5 13.7011 17.2366 13.2322 16.7678C12.7634 16.2989 12.5 15.663 12.5 15C12.5 14.337 12.7634 13.7011 13.2322 13.2322C13.7011 12.7634 14.337 12.5 15 12.5C15.663 12.5 16.2989 12.7634 16.7678 13.2322C17.2366 13.7011 17.5 14.337 17.5 15ZM26.25 15C26.25 15.663 25.9866 16.2989 25.5178 16.7678C25.0489 17.2366 24.413 17.5 23.75 17.5C23.087 17.5 22.4511 17.2366 21.9822 16.7678C21.5134 16.2989 21.25 15.663 21.25 15C21.25 14.337 21.5134 13.7011 21.9822 13.2322C22.4511 12.7634 23.087 12.5 23.75 12.5C24.413 12.5 25.0489 12.7634 25.5178 13.2322C25.9866 13.7011 26.25 14.337 26.25 15Z" fill="var(--text-total-color)" />
                                    </svg>
                                </div>}
                            </div>
                            <div id='menu' className={`subMenu postSubActions${comment?._id}`} ref={userDetailsRef}>

                                <>
                                    <div id='menu' onClick={() => setdeletePopUp(true)}>Delete</div>
                                </>
                            </div>
                        </div>
                    </div>
                    <div className='commentText'>
                        {comment?.comment}
                    </div>
                    <div className='userLikesActions'>
                        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.3027 10.4238C17.6309 9.99025 17.8125 9.459 17.8125 8.90626C17.8125 8.02931 17.3223 7.19923 16.5332 6.73634C16.3301 6.61719 16.0988 6.55448 15.8633 6.5547H11.1797L11.2969 4.15431C11.3242 3.57423 11.1191 3.02345 10.7207 2.60353C10.5252 2.39655 10.2893 2.23188 10.0276 2.11967C9.76588 2.00747 9.48395 1.95013 9.19922 1.95119C8.18359 1.95119 7.28516 2.63478 7.01562 3.6133L5.33789 9.68751H2.8125C2.4668 9.68751 2.1875 9.96681 2.1875 10.3125V17.4219C2.1875 17.7676 2.4668 18.0469 2.8125 18.0469H14.5566C14.7363 18.0469 14.9121 18.0117 15.0742 17.9414C16.0039 17.5449 16.6035 16.6367 16.6035 15.6289C16.6035 15.3828 16.5684 15.1406 16.498 14.9063C16.8262 14.4727 17.0078 13.9414 17.0078 13.3887C17.0078 13.1426 16.9727 12.9004 16.9023 12.666C17.2305 12.2324 17.4121 11.7012 17.4121 11.1485C17.4082 10.9024 17.373 10.6582 17.3027 10.4238ZM3.59375 16.6406V11.0938H5.17578V16.6406H3.59375ZM16.0234 9.74611L15.5957 10.1172L15.8672 10.6133C15.9566 10.7767 16.003 10.9602 16.002 11.1465C16.002 11.4688 15.8613 11.7754 15.6191 11.9863L15.1914 12.3574L15.4629 12.8535C15.5523 13.0169 15.5987 13.2004 15.5977 13.3867C15.5977 13.709 15.457 14.0156 15.2148 14.2266L14.7871 14.5977L15.0586 15.0938C15.148 15.2572 15.1944 15.4407 15.1934 15.627C15.1934 16.0645 14.9355 16.459 14.5371 16.6387H6.42578V11.0313L8.36914 3.99025C8.41925 3.80978 8.52682 3.65056 8.67555 3.53673C8.82428 3.42289 9.00607 3.36063 9.19336 3.35939C9.3418 3.35939 9.48828 3.40236 9.60547 3.49025C9.79883 3.63478 9.90234 3.85353 9.89062 4.08595L9.70312 7.96095H15.8438C16.1914 8.17384 16.4062 8.53322 16.4062 8.90626C16.4062 9.22853 16.2656 9.53322 16.0234 9.74611Z" fill="black" />
                            </svg>
                            <div>{comment?.likes?.length}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg style={{ transform: 'rotate(185deg) scaleX(-1)' }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.3027 10.4238C17.6309 9.99025 17.8125 9.459 17.8125 8.90626C17.8125 8.02931 17.3223 7.19923 16.5332 6.73634C16.3301 6.61719 16.0988 6.55448 15.8633 6.5547H11.1797L11.2969 4.15431C11.3242 3.57423 11.1191 3.02345 10.7207 2.60353C10.5252 2.39655 10.2893 2.23188 10.0276 2.11967C9.76588 2.00747 9.48395 1.95013 9.19922 1.95119C8.18359 1.95119 7.28516 2.63478 7.01562 3.6133L5.33789 9.68751H2.8125C2.4668 9.68751 2.1875 9.96681 2.1875 10.3125V17.4219C2.1875 17.7676 2.4668 18.0469 2.8125 18.0469H14.5566C14.7363 18.0469 14.9121 18.0117 15.0742 17.9414C16.0039 17.5449 16.6035 16.6367 16.6035 15.6289C16.6035 15.3828 16.5684 15.1406 16.498 14.9063C16.8262 14.4727 17.0078 13.9414 17.0078 13.3887C17.0078 13.1426 16.9727 12.9004 16.9023 12.666C17.2305 12.2324 17.4121 11.7012 17.4121 11.1485C17.4082 10.9024 17.373 10.6582 17.3027 10.4238ZM3.59375 16.6406V11.0938H5.17578V16.6406H3.59375ZM16.0234 9.74611L15.5957 10.1172L15.8672 10.6133C15.9566 10.7767 16.003 10.9602 16.002 11.1465C16.002 11.4688 15.8613 11.7754 15.6191 11.9863L15.1914 12.3574L15.4629 12.8535C15.5523 13.0169 15.5987 13.2004 15.5977 13.3867C15.5977 13.709 15.457 14.0156 15.2148 14.2266L14.7871 14.5977L15.0586 15.0938C15.148 15.2572 15.1944 15.4407 15.1934 15.627C15.1934 16.0645 14.9355 16.459 14.5371 16.6387H6.42578V11.0313L8.36914 3.99025C8.41925 3.80978 8.52682 3.65056 8.67555 3.53673C8.82428 3.42289 9.00607 3.36063 9.19336 3.35939C9.3418 3.35939 9.48828 3.40236 9.60547 3.49025C9.79883 3.63478 9.90234 3.85353 9.89062 4.08595L9.70312 7.96095H15.8438C16.1914 8.17384 16.4062 8.53322 16.4062 8.90626C16.4062 9.22853 16.2656 9.53322 16.0234 9.74611Z" fill="black" />
                            </svg>

                            <div>{comment?.Dislikes?.length}</div>
                       </div>


                    </div>
                </div>
            </div>

            <Dialog

                open={deletePop}
                onClose={() => {
                    setdeletePopUp(false);
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

                    Are you sure to delete the Comment?
                    <div style={{
                        display: "flex",
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'center'
                    }}>
                        <button onClick={(e) => {
                            deletePost(e);
                        }}>Yes</button>
                        <button onClick={() => {
                            setdeletePopUp(false);
                        }}>No</button>
                    </div>


                </DialogContent>
            </Dialog></>

    )
}

export default UserComment