import { combineReducers } from 'redux';
import chat from '../reducer/chat/ChatReducer';
import conversation from '../reducer/conversation/ConversationReducer';
import citem from '../reducer/conversation/ConversationItemReducer';
import iapproducts from '../reducer/iapproduct/IapProductReducer';
import image from '../reducer/images/ImageReducer';
import user from '@/reducer/account/UserReducer';
import { rdRootReducer } from 'rd-component';

const rootReducer = combineReducers({
    chat,
    conversation,
    citem,
    iapproducts,
    image,
    user,
    rdRootReducer
})

export default rootReducer;