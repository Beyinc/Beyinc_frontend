import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './AuthReducers/AuthReducer';
import ConversationReducer from './Conversationreducer/ConversationReducer';


const store = configureStore({
  reducer: {
    auth: AuthReducer,
    conv: ConversationReducer
  },
});

export default store;
