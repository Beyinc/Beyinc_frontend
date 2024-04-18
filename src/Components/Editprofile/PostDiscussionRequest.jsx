import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiServices } from '../../Services/ApiServices';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';

const PostDiscussionRequest = ({ m, setpostDiscussionRequest }) => {
    const navigate = useNavigate()
    const { email, userName, user_id, role } = useSelector(state => state.auth.loginDetails)
    const dispatch = useDispatch()
    const updaterequestIntoOpenDiscussion = async (e, id, type) => {
        e.target.disabled=true
        await ApiServices.updaterequestIntoOpenDiscussion({ id: m._id, user_id: id, type }).then(res => {
                setpostDiscussionRequest(prev => [...prev.map(l => l._id == m._id ? { ...l, openDiscussionRequests: m.openDiscussionRequests.filter(f => f._id !== id) } : l)])
        }).catch(err => {
                dispatch(setToast({
                    message: 'Error occured when updating request',
                    bgColor: ToastColors.failure,
                    visible: "yes",
                }))
                e.target.disabled = false

        })
        e.target.disabled = false

    }
    return (
        <div>
            {m.openDiscussionRequests?.map(o => (
                <div className='individualrequest' key={o.id}>
                    <div className='individualrequestWrapper'>
                        <div className='userNotiD' onClick={() => {
                            navigate(`/posts/${m._id}`);
                        }}>
                            <div>
                                <img style={{ height: '50px', width: '50px', borderRadius: '50%' }} src={o?.image?.url || '/profile.png'} alt="" srcset="" />
                            </div>
                            <div className='message'>
                                <b>{o.userName}</b> has made a discussion request for post <Link to={``}>{m._id}</Link>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }} className='extraDetails'>
                            <button onClick={(e) => updaterequestIntoOpenDiscussion(e, o._id, 'add')}>Accept</button>
                            <button style={{ background: 'red' }} onClick={(e) => updaterequestIntoOpenDiscussion(e, o._id, 'remove')}>Reject</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostDiscussionRequest;
