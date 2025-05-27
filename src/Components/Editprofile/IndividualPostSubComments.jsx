import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import { format } from 'timeago.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'

const IndividualPostSubComments = ({ c, onLike, onDisLike, setReplyBox, replyBox, scrollRef }) => {
    const { email, user_id } = useSelector(state => state.auth.loginDetails)
    const { pitchId } = useParams()

    const [liked, setLiked] = useState(false);

    const [disliked, setdisLiked] = useState(false);


    const [count, setCount] = useState(0);
    const [dislikecount, setdislikecount] = useState(0);
    const [zoomedImage, setZoomedImage] = useState(null);

    useEffect(() => {
        setLiked(c.likes?.includes(user_id))
        setdisLiked(c.Dislikes?.includes(user_id))
        setCount(c.likes?.length)
        setdislikecount(c.Dislikes?.length)
    }, [c, user_id])


    const handleLike = (id) => {
        if (liked) {
            setLiked(false);
            setCount((prev) => prev - 1);
        } else {
            setLiked(true);
            setCount((prev) => prev + 1);
            setdislikecount((prev) => prev - 1);
            setdisLiked(false);


        }
        onLike(id, !c.likes?.includes(user_id));
    };


    const handleDisLike = (id) => {
        if (disliked) {
            setdisLiked(false);
            setdislikecount((prev) => prev - 1);
        } else {
            setdisLiked(true);
            setLiked(false);

            setdislikecount((prev) => prev + 1);
            setCount((prev) => prev - 1);

        }
        onDisLike(id, !c.Dislikes?.includes(user_id));
    };
const navigate = useNavigate()
    return (
        <>
            <div className='IndicommentsSection'>
                <div className='IndicommentsSectionImage'  onClick={() => {
            if (c?.commentBy?._id == user_id) {
              navigate("/editProfile");
            } else {
              navigate(`/user/${c?.commentBy?._id}`);
            }
          }}>
                    <img src={(c?.profile_pic || c?.commentBy?.image?.url) || '/profile.png'} alt="" />
                </div>
                <div className='IndicommentsSectionDetails'>
                    <div className='IndicommentsSectionDetailsUserName'>
                        <div >{(c?.userName || c?.commentBy?.userName)}

                        </div>
                        <div style={{ fontWeight: '200' }} className='IndicommentsSectionDetailsdate'>
                            {format(c?.createdAt)}
                        </div>
                        {/* <div title={'Delete Comment'} onClick={()=>deleteComment(c._id)}>{(c?.email || c?.commentBy?.email) == email && <i className='fas fa-trash'></i>}</div> */}
                    </div>
                    <div className='IndicommentsSectionDetailscomment'>
                        {c?.comment}
                    </div>

                    {/* File attachment display */}
                    {c?.file && (
                        <div className="comment-file-attachment" style={{ marginTop: '10px' }}>
                            {c.file.type === 'image' && (
                                <img 
                                    src={c.file.url} 
                                    alt="Comment attachment" 
                                    style={{ 
                                        maxWidth: '500px', 
                                        maxHeight: '400px',
                                        width: '100%',
                                        borderRadius: '12px',
                                        cursor: 'zoom-in',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                    onClick={() => setZoomedImage(c.file.url)}
                                />
                            )}
                            {c.file.type === 'video' && (
                                <video 
                                    controls 
                                    style={{ 
                                        maxWidth: '500px',
                                        maxHeight: '400px',
                                        width: '100%',
                                        borderRadius: '12px',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                >
                                    <source src={c.file.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {c.file.type === 'pdf' && (
                                <div 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        padding: '8px',
                                        background: 'var(--comment-file-bg, #f5f5f5)',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => window.open(c.file.url, '_blank')}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>View PDF</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Image Zoom Modal */}
                    {zoomedImage && (
                        <div 
                            className="image-zoom-modal" 
                            onClick={() => setZoomedImage(null)}
                        >
                            <div className="close-button" onClick={() => setZoomedImage(null)}>
                                ✕
                            </div>
                            <img 
                                src={zoomedImage} 
                                alt="Zoomed view" 
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '5px' }}>
                        <div className="IndicommentsSectionActions">
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                {count > 0 && <div>{count}</div>}
                                {liked ? (
                                    <i
                                        class="fa fa-thumbs-up icon-blue"
                                        aria-hidden="true"
                                        onClick={() => handleLike(c._id)}
                                    />
                                ) : (
                                    <i
                                        class="far fa-thumbs-up"
                                        aria-hidden="true"
                                        onClick={() => handleLike(c._id)}
                                    />
                                )}
                            </div>


                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                {dislikecount > 0 && <div>{dislikecount}</div>}
                                {disliked ? (
                                    <i
                                        class="fa fa-thumbs-down icon-blue"
                                        aria-hidden="true"
                                        onClick={() => handleDisLike(c._id)}
                                    />
                                ) : (
                                    <i
                                        class="far fa-thumbs-down"
                                        aria-hidden="true"
                                        onClick={() => handleDisLike(c._id)}
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <span className='replyTag' onClick={() => {
                                scrollRef.current?.scrollIntoView({ behavior: "smooth" });

                                setReplyBox(!replyBox)

                            }}>Reply</span>
                        </div>
                    </div>
                </div>


            </div>

        </>

    )
}

export default IndividualPostSubComments