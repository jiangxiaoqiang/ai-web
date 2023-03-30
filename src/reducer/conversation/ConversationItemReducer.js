
const initState = {
    citem: {}
};

const ConversationItemReducer = (state=initState, action) => {
    switch (action.type) {
        case "CONVERSATION_ITEM_PAGE":
            return {
                ...state,
                citem: action.conversations 
            };
        default:
            break;
    }
    return state;
};

export default ConversationItemReducer;

