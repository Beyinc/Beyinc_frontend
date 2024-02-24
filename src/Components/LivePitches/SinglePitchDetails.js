import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {  useSelector } from 'react-redux'

const SinglePitchDetails = ({ d }) => {
  const { email } = useSelector(state => state.auth.loginDetails)

  const navigate = useNavigate()
  const [averagereview, setAverageReview] = useState(0)
  useEffect(() => {
    setAverageReview(0)
    if (d.review !== undefined && d.review.length > 0) {
      let avgR = 0
      d.review?.map((rev) => {
        avgR += rev.review
      })
      setAverageReview(avgR / d.review.length)
    }
  }, [d])
  return (
    <div className='singlePitchWrapper'>
      <div className='singlePitch' onClick={() => { navigate(`${d._id}`) }}>
        <div className='headingIntrested'>
          <b>{d.heading}</b>
          <div title='This Pitch present in your intrested list' className={`${(d?.intrest?.length > 0 && d?.intrest.filter(p => p.email === email).length > 0) && 'intrestButton addIntrest'}`}>
            {(d?.intrest?.length > 0 && d?.intrest.filter(p => p.email === email).length > 0) && <span>Interested</span> }

          </div>
        </div>
        <div className='desc'>{d.description}</div>
        <div className='tags'> {d.tags?.map(t => (
          <span style={{ fontSize: '14px' }} >{`#${t}`}</span>
        ))}</div>
        {d?.hiringPositions?.length > 0 && <div className='tags'>
          People Needed:
          {d?.hiringPositions?.map(h => (
            <span className='hp' style={{border: 'none'}}>{h}</span>
          ))}
        </div>}
        {d?.industry1 !=='' && <div className='tags'>
          Domain:
          {d.industry1}
        </div>}
        {d?.industry2 !== '' && <div className='tags'>
          Tech:
          {d.industry2}
        </div>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ fontSize: '12px', marginLeft: '5px' }} title='total comments'>
            <i class="far fa-comment"></i><span style={{ marginLeft: '3px' }}>{d.comments?.length}</span>
          </div>
          <div style={{ fontSize: '12px', marginLeft: '5px' }} title='total stars'>
            <i class="far fa-star"></i><span style={{ marginLeft: '3px' }}>{averagereview}</span>
          </div>
        </div>
        
      </div>
    </div>
      
  )
}

export default SinglePitchDetails