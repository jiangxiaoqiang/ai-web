import { ChatAsk } from '../../models/request/chat/ChatAsk';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { v4 as uuid } from 'uuid';

export function doSseChatAsk(params: ChatAsk, onSseMessage: (msg: string) => void,) {
  let eventSource: EventSourcePolyfill;
  const accessToken = localStorage.getItem("x-access-token");
  // https://stackoverflow.com/questions/6623232/eventsource-and-basic-http-authentication
  var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof ChatAsk]).join('&');
  eventSource = new EventSourcePolyfill('/ai/stream/chat/ask?' + queryString, {
    headers: {
      'x-access-token': accessToken ?? "",
      'x-request-id': uuid(),
    }
  });
  eventSource.onopen = () => {
    console.log("onopen....")
  }
  eventSource.onerror = (error) => {
    console.log("onerror",error)
    if(eventSource){
      eventSource.close();
    }
  }
  eventSource.onmessage = e => {
    onSseMessage(e.data);
  };

  eventSource.addEventListener('complete', () => {
    console.log('Transfer of data is complete');
  });
  
  eventSource.addEventListener('onclose', () => {
    console.log('Transfer of data is complete');
  });
}
