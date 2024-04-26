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
     

          <><div className='ProfileCommentContainer'>
          <div className='PostHeaderContainer'>
              <div className='postTotaldetails' onClick={() => {
                  if (comment?.commentBy?._id == user_id) {
                      navigate(`/editProfile`);
                  } else {
                      navigate(`/user/${comment?.commentBy?._id}`);
                  }
              } }>
                  <div className='PostheaderimageContainer'>
                      <img src={comment?.commentBy?.image !== "" && comment?.commentBy?.image !== undefined && comment?.commentBy?.image?.url !== ''
                          ? comment?.commentBy?.image?.url
                          : "/profile.png"} alt="" />
                  </div>
                  <div className='PostDetailsContainer'>
                      <div className='postCardUserName'>{comment?.commentBy?.userName[0]?.toUpperCase() + comment?.commentBy?.userName?.slice(1)}</div>
                      <div className='postCardRole'>{comment?.commentBy?.role}</div>
                      <div className='postCardRole'>{MMDDYYFormat(comment?.updatedAt)}</div>
                  </div>

              </div>
              {comment?.commentBy?._id == user_id &&
                  <div style={{ position: 'relative' }}>
                      <div id='menu' onClick={() => {
                          document.getElementsByClassName(`postSubActions${comment?._id}`)[0]?.classList.toggle('show');
                      } }>
                          <svg id='menu' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.75 15C8.75 15.663 8.48661 16.2989 8.01777 16.7678C7.54893 17.2366 6.91304 17.5 6.25 17.5C5.58696 17.5 4.95107 17.2366 4.48223 16.7678C4.01339 16.2989 3.75 15.663 3.75 15C3.75 14.337 4.01339 13.7011 4.48223 13.2322C4.95107 12.7634 5.58696 12.5 6.25 12.5C6.91304 12.5 7.54893 12.7634 8.01777 13.2322C8.48661 13.7011 8.75 14.337 8.75 15ZM17.5 15C17.5 15.663 17.2366 16.2989 16.7678 16.7678C16.2989 17.2366 15.663 17.5 15 17.5C14.337 17.5 13.7011 17.2366 13.2322 16.7678C12.7634 16.2989 12.5 15.663 12.5 15C12.5 14.337 12.7634 13.7011 13.2322 13.2322C13.7011 12.7634 14.337 12.5 15 12.5C15.663 12.5 16.2989 12.7634 16.7678 13.2322C17.2366 13.7011 17.5 14.337 17.5 15ZM26.25 15C26.25 15.663 25.9866 16.2989 25.5178 16.7678C25.0489 17.2366 24.413 17.5 23.75 17.5C23.087 17.5 22.4511 17.2366 21.9822 16.7678C21.5134 16.2989 21.25 15.663 21.25 15C21.25 14.337 21.5134 13.7011 21.9822 13.2322C22.4511 12.7634 23.087 12.5 23.75 12.5C24.413 12.5 25.0489 12.7634 25.5178 13.2322C25.9866 13.7011 26.25 14.337 26.25 15Z" fill="black" />
                          </svg>
                      </div>
                      <div id='menu' className={`subMenu postSubActions${comment?._id}`} ref={userDetailsRef}>

                          <>
                              <div id='menu' onClick={() => setdeletePopUp(true)}>Delete</div>
                          </>
                      </div>
                  </div>}
          </div>
          <div className='postDescContainer'>
              <div className='postDesc'>{comment?.comment}</div>
          </div>

      </div><Dialog

          open={deletePop}
          onClose={() => {
              setdeletePopUp(false);
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

                  Are you sure to delete the Comment?
                  <div style={{
                      display: "flex",
                      alignItems: 'center',
                      gap: '10px',
                      justifyContent: 'center'
                  }}>
                      <button onClick={(e) => {
                          deletePost(e);
                      } }>Yes</button>
                      <button onClick={() => {
                          setdeletePopUp(false);
                      } }>No</button>
                  </div>


              </DialogContent>
          </Dialog></>

  )
}

export default UserComment