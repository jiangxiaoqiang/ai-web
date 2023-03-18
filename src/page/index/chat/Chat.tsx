import { Button, Input } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { readConfig } from "../../../config/app/config-reader";
import "./Chat.css"
import { v4 as uuid } from 'uuid';
import { doCloseWebsocket, getCurrentTime } from "./WebSocketClient";
import { IWebsocketMsg } from "../../../models/chat/WebSocketMsg";
import { WebSocketMsgType } from "../../../models/chat/WebSocketMsgType";
import { Base64 } from "js-base64";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const Chat: React.FC = (props) => {

    const [inputValue, setInputValue] = useState('');
    const [webSocketStore, setWebSocketStore] = useState<WebSocket | null>(null);
    const [myMap, setMyMap] = useState(new Map());
    const HEARTBEAT_INTERVAL_MS = 20000; // 心跳间隔，单位为毫秒
    var chatWebsocket: WebSocket;
    const [loadings, setLoadings] = useState<boolean>(false);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    };

    React.useEffect(() => {
        doConnectWebsocket();
        const heartbeatInterval = setInterval(() => {
            if (chatWebsocket.readyState === WebSocket.OPEN) {
                let parms = {
                    msgType: 'HEARTBEAT',
                    msg: 'ping'
                };
                chatWebsocket.send(JSON.stringify(parms));
            }
        }, HEARTBEAT_INTERVAL_MS);
    }, []);

    const doConnectWebsocket = () => {
        if (!chatWebsocket || (chatWebsocket && chatWebsocket.readyState === WebSocket.CLOSED)) {
            if ('WebSocket' in window) {
                chatWebsocket = new WebSocket(readConfig('wssUrl'));
            } else {
                alert('当前浏览器 Not support websocket')
            }
            chatWebsocket.onerror = function (e: any) {
                console.log("WebSocket连接发生错误", e);
            };

            chatWebsocket.onopen = function () {
                console.log("WebSocket连接成功");
                setWebSocketStore(chatWebsocket);
            }

            chatWebsocket.onmessage = function (event: any) {
                const msg: IWebsocketMsg = JSON.parse(event.data);
                if(msg.msgType === WebSocketMsgType[WebSocketMsgType.USER_CHAT]){
                    // const decoded = atob(msg.msg)
                    
                    const decoded = Base64.decode(msg.msg);
                    appenMsg(decoded.toString());
                    setLoadings(false);
                }
            }

            chatWebsocket.onclose = function (event: any) {
                console.log(`WebSocket closed with code ${event.code} and reason "${event.reason}"`);
                console.log(`WebSocket was clean: ${event.wasClean}`);
            }

            window.onbeforeunload = function () {
                doCloseWebsocket(chatWebsocket);
            }
        }
    }

    const appenMsg = (data: string) => {
        const now = getCurrentTime();
        debugger
        const newMap = new Map(myMap);
        newMap.set(now, data);
        setMyMap((prevMapState) => {
            const newMapState = new Map<string, any>(prevMapState);
            newMapState.set(now, data);
            return newMapState;
        });
    }

    const handleSend = () => {
        if (inputValue) {
            if (webSocketStore == null) {
                return;
            }
            appenMsg(inputValue);
            setInputValue('');
            if (webSocketStore.readyState === WebSocket.OPEN) {
                setLoadings(true);
                let parms = {
                    msgType: 'USER_CHAT',
                    msg: inputValue
                };
                webSocketStore.send(JSON.stringify(parms));
            } else if (webSocketStore.readyState === WebSocket.CLOSED) {
                console.log("WebSocket连接已经关闭");
            }
        }
    };

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        myMap.forEach((value, key) => {
            tagList.push(
                <div key={uuid()} className="chat-message">
                    <div key={uuid()} className="message-time">{key}</div>
                        <SyntaxHighlighter language="javascript" style={docco}>
                        {value}
                        </SyntaxHighlighter>
                </div>);
        });
        return tagList;
    };

    const handleEnterKey = (e:any) => {
        if(e.nativeEvent.keyCode === 13){ 
            handleSend();
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <span>会话</span>
            </div>
            <div className="chat-body">
                {renderChat()}
            </div>
            <div className="chat-form">
                <Input id="talkInput" 
                value={inputValue} 
                onChange={handleChange} 
                onKeyPress={handleEnterKey}
                type="text" placeholder="输入会话内容" />
                <Button loading={loadings} onClick={handleSend}><span>发送</span></Button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    robot: state.robot
});

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

