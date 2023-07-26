import { Message } from 'element-ui';

/**
 * Message 消息提示
 * @res 数据
 * @success true | false 是否需要
 * @error true | false  是否需要
 * @text 提示文本
 * @successFun  成功回调
 * @errorFun    失败回调
 */
const MessageTips = (res: any, success: boolean, error: boolean, text: string, successFun: ((res)=>void) | null, errorFun: ((res)=>void) | null ) =>{
  (Message as any).closeAll();
  if (res.data.code === 20000) {
    if (!success) return true;
    else {
      Message({
        customClass: 'v-zindex',
        showClose: false,
        message: text === '' ? res.data.message : text,
        type: 'success',
        duration: 3000,
      });
      setTimeout(()=> {
        successFun && successFun(res);
      }, 1000)
    }
  } else {
    if (!error) return false;
    else {
      Message({
        customClass: 'v-zindex',
        showClose: false,
        message: res.data.message ? res.data.message : 'error',
        type: 'error',
        duration: 3000,
      });
      setTimeout(()=> {
        errorFun && errorFun(res);
      }, 1000)
    }
  }
};


type requestData = {
  code: number;
  data: any;
  message: string;
}

type messageData = {
  requestData: requestData;
  needMessage: boolean;
  text?: string;
  successCallback?: ()=>void;
  errorCallback?: ()=>void;
}
const MessageTips2 = (messageData: messageData): void => {
  const { requestData, needMessage, text, successCallback, errorCallback} = messageData;
  const {code, data, message} = requestData;

  if(code === 20000) {
    if(needMessage) {
      Message({
        type: 'success',
        duration: 3000,
        message: text || message,
      })
    }
    setTimeout(()=> {
      successCallback && successCallback();
    }, 1000)
  } else {
    Message({
      type: 'error',
      duration: 3000,
      message: message || 'error',
    })
    setTimeout(()=> {
      errorCallback && errorCallback();
    }, 1000)
  }
  
  return data
};

export {
  MessageTips,
};