import React, { useEffect, useState } from 'react'
import IndividualPostCard from '../../Editprofile/IndividualPostCard'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch } from 'react-redux'
import { setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'

const PostReports = () => {
  const [allPosts, setAllPosts] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    ApiServices.getReportedPosts().then(res => {
      setAllPosts(res.data)
    }).catch(err => {
      dispatch(
        setToast({
          message: 'Error Occured!',
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    })
  }, [])

  const updatereport = async (e, id, type) => {
    await ApiServices.updateReport({ id: id, postDecide: type }).then(res => {
      setAllPosts(allPosts.filter(f=>f._id!==id))
    }).catch(err => {
      dispatch(
        setToast({
          message: 'Error Occured!',
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    })
  }
  return (
    <div className="postContainer">
      <div className='postCardContainer'>
        {allPosts?.map(post => (
          <div style={{display: 'flex', flexDirection: 'column'}}><IndividualPostCard post={post} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={(e) => { updatereport(e, post._id, 'delete')}}>Delete Post</button>
              <button onClick={(e) => { updatereport(e, post._id, 'keep') }}>Remove Review</button>
            </div>
          </div>
        ))}
       

      </div>
    </div>
  )
}

export default PostReports