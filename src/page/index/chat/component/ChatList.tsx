import { ISseMsg } from "@/models/chat/SseMsg";
import withConnect from "@/page/component/hoc/withConnect";
import { v4 as uuid } from 'uuid';
import React from "react";
import ChatContext from "./ChatContext";
import chatMeImage from "@/asset/icon/chat-me.png";
import chatgpt from "@/asset/icon/chatgpt.svg";
import './ChatList.css';
import { Steps } from "antd";
import { isLoggedIn, isSubscribed } from "@/service/user/UserService";

export interface IChatAskList {
    myMap: Map<string, ISseMsg>,
}

/**
 * when the chat list increase, the chat list will rerender every time when user input words
 * so add the React.memo to avoid the dulplicate rerender 
 */
const ChatList: React.FC<IChatAskList> = React.memo((props) => {

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        if (props.myMap.size === 0) {
            return newGuide();
        } else {
            props.myMap.forEach((value, key) => {
                let chatValue: ISseMsg = value;
                if (value.type === "prompt") {
                    tagList.push(
                        <div key={uuid()} className="chat-message">
                            <img className="chat-me" src={chatMeImage}></img>
                            <ChatContext msg={chatValue.msg}></ChatContext>
                        </div>);
                } else {
                    tagList.push(
                        <div key={uuid()} className="chat-message">
                            <img className="chat-me" src={chatgpt}></img>
                            <ChatContext msg={chatValue.msg}></ChatContext>
                        </div>);
                }
            });
            return tagList;
        }
    };

    const newGuide = () => {
        return (
            <div className="steps-guide">
                <div className="guide-container">
                    <Steps
                        current={1}
                        items={[
                            {
                                title: '登录',
                                description: '点击左下侧按钮登录',
                                status: isLoggedIn() ? 'finish' : 'wait'
                            },
                            {
                                title: '订阅',
                                description: '点击订阅菜单，选择订阅套餐，最低1元试用',
                                status: isSubscribed() ? 'finish' : 'wait'
                            },
                            {
                                title: '聊天',
                                description: '页面底部输入会话内容，开启聊天',
                                status: isLoggedIn() && isSubscribed() ? 'finish' : 'wait'
                            },
                        ]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="chat-body">
            {renderChat()}
        </div>
    )
})
export default withConnect(ChatList);
