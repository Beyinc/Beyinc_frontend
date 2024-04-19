import React from 'react'
import { format } from 'timeago.js'
import { ApiServices } from '../../../Services/ApiServices'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

const AllNotifications = ({ n }) => {
  const navigate = useNavigate()
  const changeStatus = async () => {
    await ApiServices.changeNotification({ notificationId: n._id }).then(res => {

    })
  }
  return (
    <div className={`individualrequest`} onClick={() => {
      navigate(`/user/${n.senderInfo?._id}`)
      changeStatus()
    }} >
      <div className='individualrequestWrapper' style={{ gap: '5px', alignItems: 'center' }}>
        <div>
          <img style={{ height: '30px', width: '30px', borderRadius: '50%' }} src={n.senderInfo?.image?.url == undefined ? '/profile.png' : n.senderInfo?.image?.url} alt="" srcset="" />
        </div>
        <div style={{ wordBreak: 'break-word' }}>{n.message}  {n.type == 'postDiscussion' && <Link to={`/posts/${n.postId}`}>View Post</Link>} {n.type == 'report' && <Link style={{color: 'red'}} to={`/posts/${n.postId}`}>View Post</Link>}</div>
        <div className=''>
          {/* <div>{format(n.createdAt)}</div> */}
        </div>
      </div>

    </div>
  )
}

export default AllNotifications