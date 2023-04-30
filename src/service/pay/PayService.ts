import store from '@/store/store';
import { PayActionType, requestWithActionType } from "rd-component";

export function doPay(params: any) {
    const config = {
        method: 'post',
        url: '/post/alipay/pay/createOrder',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    const actionTypeString: string = PayActionType[PayActionType.CREATE_ORDER];
    return requestWithActionType(config, actionTypeString, store);
}

export function doClearAlipayFormText() {
    const actionTypeString: string = PayActionType[PayActionType.CLEAR_ALIPAY_FORM_TEXT];
    const action = {
        type: actionTypeString,
        data: ''
      };
      store.dispatch(action);
}