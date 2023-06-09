import { ResponseHandler, REST, WheelGlobal } from 'rdjs-wheel';
import { readConfig } from '../src/config/app/config-reader';
import { IWebsocketMsg } from '../src/models/chat/WebSocketMsg';
import { WebSocketMsgType } from '../src/models/chat/WebSocketMsgType';
import { isLoggedIn } from '../src/service/user/UserService';

export function doCloseWebsocket(chatWebsocket: WebSocket) {
    if (chatWebsocket) {
        chatWebsocket.close();
    }
}

export function doWebsocketConnect(chatWebsocket: WebSocket) {
    if (!chatWebsocket || (chatWebsocket && chatWebsocket.readyState === WebSocket.CLOSED)) {
        if ('WebSocket' in window) {
            if (!isLoggedIn()) {
                return;
            }
            const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
            chatWebsocket = new WebSocket(readConfig('wssUrl') + "?a=1");
            //chatWebsocket = new WebSocket(readConfig('wssUrl'));
        } else {
            alert('当前浏览器 Not support websocket')
        }
        chatWebsocket.onerror = function (e: any) {
            console.log("WebSocket连接发生错误", e);
        };

        chatWebsocket.onclose = function (event: any) {
            console.log(`WebSocket1 closed with code ${event.code} and reason "${event.reason}"`);
            console.log(`WebSocket was clean: ${event.wasClean}`);
        }

        chatWebsocket.onmessage = function (event: any) {
            //const msg: IWebsocketMsg = JSON.parse(event.data);
            //if (msg.msgType === WebSocketMsgType[WebSocketMsgType.USER_CHAT]) {
            //appenMsg(msg.msg);
            //setLoadings(false);
            //}
        }

        chatWebsocket.onopen = function () {
            console.log("WebSocket连接成功");
            //setWebSocketStore(chatWebsocket);
        }
    }
}

export function doConnectWebsocketJs(
    onMessage: (msg: string) => void,
    onOpen:(chatWebsocket: WebsocketHeartbeatJs)=> void
): void {
    const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
    const options = {
        url: readConfig('wssUrl') + "?accessToken=" + accessToken,
        pingTimeout: 15000,
        pongTimeout: 10000,
        reconnectTimeout: 2000,
        pingMsg: "ping",
        repeatLimit: 20
    }
    let websocketHeartbeatJs = new WebsocketHeartbeatJs(options);
    websocketHeartbeatJs.onopen = function () {
        onOpen(websocketHeartbeatJs);
        console.log('connect success');
    }
    websocketHeartbeatJs.onmessage = function (e) {
        if(e.data === 'pong'){
            return;
        }
        const msgModel: IWebsocketMsg = JSON.parse(e.data);
        if(msgModel.msgType === WebSocketMsgType[WebSocketMsgType.ACCESS_TOKEN_EXPIRED]){
            const res: REST.ApiResponse = {
                result:"any",
                msg: "string",
                resultCode: "00100100004016",
                statusCode: "200"
            };
            ResponseHandler.handleWebCommonFailure(res);
            return;
        }
        onMessage(e.data);
        console.log(`onmessage: ${e.data}`);
    }
    websocketHeartbeatJs.onreconnect = function () {
        console.log('reconnecting...');
    }
    websocketHeartbeatJs.onerror = function (e: Event) {
        console.log('error...', e);
    }
    websocketHeartbeatJs.onclose = function (e: CloseEvent) {
        console.log('close......,' + e.code + ', message:' + e.reason);
    }
}

export function randomIntFromInterval(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
