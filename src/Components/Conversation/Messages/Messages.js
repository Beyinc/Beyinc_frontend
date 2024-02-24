import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './Messages.css'
import IndividualMessage from './IndividualMessage'
import { useParams } from 'react-router'
const Messages = () => {
  // const conversationId = useSelector(state => state.conv.conversationId)
  const { conversationId } = useParams()

  return (
    <div className='messages'>
      {(conversationId === '' || conversationId === undefined) ? (
        <div className="noSelected">
          <img className="No_Conversation" src="/no-request.png" alt="No Conversation" />
          <div style={{ marginTop: '-50px' }}>
            No Conversations Selected !
            <h6 style={{ fontSize: '16px', marginLeft: '120px' }}>Start a conversation</h6>
          </div>
        </div>
      ) :
        (
          <>
            <IndividualMessage />
          </>
        )}
    </div>
  );
};

export default Messages;
