
const initState = {
    iapproducts:{}
};

const IapProductReducer = (state=initState, action) => {
    switch (action.type) {
        case "GET_IAP_PRODUCT":
            return {
                ...state,
                iapproducts: action.data.productDetails 
            };
        default:
            break;
    }
    return state;
};

export default IapProductReducer;


