/* eslint-disable camelcase */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../AuthReducers/AuthReducer';


export const conversationSlice = createSlice(
    {
        name: 'conversationSlice',
        initialState: {
            allUsers: [],
            historicalConversations: [],
            userLivePitches: [],
            userAllPitches: [],
            userReceivedPitches: [],
            conversationId: '',
            receiverId: '',
            notificationAlert: false,
            messageCount: [],
            onlineUsers: [],
            liveMessage: {},
            lastMessageRead: false,
            notifications: [],
            followerNotification: null,
        },
        reducers: {
            setAllUsers: (state, action) => {
                state.allUsers = action.payload
            },
            setHistoricalConversation: (state, action) => {
                state.historicalConversations = action.payload
            }
            ,
            setConversationId: (state, action) => {
                state.conversationId = action.payload
            },
            setReceiverId: (state, action) => {
                state.receiverId = action.payload
            },
            setOnlineUsers: (state, action) => {
                state.onlineUsers = action.payload
            }, setLiveMessage: (state, action) => {
                state.liveMessage = action.payload
            }, setLastMessageRead: (state, action) => {
                state.lastMessageRead = action.payload
            }, setNotification: (state, action) => {
                state.notificationAlert = action.payload
            },
            setUserLivePitches: (state, action) => {
                state.userLivePitches = action.payload
            },
            setUserAllPitches: (state, action) => {
                state.userAllPitches = action.payload
            },
            setUserReceivedPitches: (state, action) => {
                state.userReceivedPitches = action.payload
            },
            setMessageCount: (state, action) => {
                state.messageCount = action.payload
            },
            setNotificationData: (state, action) => {
                state.notifications = action.payload
            },
            setFollowerNotification: (state, action) => {
                state.followerNotification = action.payload
            },
        }
    });

export const getAllHistoricalConversations = (id) => async (dispatch) => {
    await ApiServices.getHistoricalConversations({ userId: id }).then((res) => {
            dispatch(setHistoricalConversation(res.data))
    }).catch(err => {
            dispatch(setToast({}))
        })
    }

export const getAllNotifications = (id) => async (dispatch) => {
    await ApiServices.getAllNotification({ userId: id }).then((res) => {
        dispatch(setNotificationData(res.data))
    }).catch(err => {
        dispatch(setToast({}))
    })
}





export const { setAllUsers, setUserLivePitches, setUserReceivedPitches, setUserAllPitches, setFollowerNotification, setMessageCount, setNotification, setHistoricalConversation, setNotificationData, setLiveMessage, setLastMessageRead, setConversationId, setReceiverId, setOnlineUsers } = conversationSlice.actions;

// this is for configureStore
export default conversationSlice.reducer;
