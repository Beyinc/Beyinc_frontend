import React, { useEffect, useState } from 'react'
import IndividualPostCard from '../../Editprofile/IndividualPostCard'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch } from 'react-redux'
import { setLoading, setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'
import { Dialog, DialogContent } from '@mui/material';
import { gridCSS } from '../../CommonStyles';

const PostReports = () => {
  const [allPosts, setAllPosts] = useState([])
  const dispatch = useDispatch()
  const [deletePopUp, setDeletePopUp] = useState(false)
  const [storedId, setStoredId] = useState(null)
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
    dispatch(setLoading({visible: 'yes'}))
    await ApiServices.updateReport({ id: id, postDecide: type }).then(res => {
      setAllPosts(allPosts.filter(f => f._id !== id))
      setStoredId(null)
    }).catch(err => {
      dispatch(
        setToast({
          message: 'Error Occured!',
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    })
    dispatch(setLoading({ visible: 'no' }))

  }
  return (
    <div className="postContainer">
      <div className='postCardContainer'>
        {allPosts?.map(post => (
          <div style={{display: 'flex', flexDirection: 'column'}}><IndividualPostCard post={post} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={(e) => {
                setDeletePopUp(true)
                setStoredId(post._id)
              }}>Delete Post</button>
              <button onClick={(e) => { updatereport(e, post._id, 'keep') }}>Remove Report</button>
            </div>
          </div>
        ))}
       
        <Dialog

          open={deletePopUp}
          onClose={() => {
            setDeletePopUp(false)
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
                updatereport(e, storedId, 'delete')
              }}>Yes</button>
              <button onClick={() => {
                setDeletePopUp(false)
              }}>No</button>
            </div>


          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}

export default PostReports