

const initState = {
    citem: {}
};

const ConversationItemReducer = (state=initState, action:any) => {
    switch (action.type) {
        case "CONVERSATION_ITEM_PAGE":
            return {
                ...state,
                citem: action.data 
            };
        default:
            break;
    }
    return state;
};

export default ConversationItemReducer;


