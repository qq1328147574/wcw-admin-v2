import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Message } from 'element-ui';
import { sessionData } from '@/filters/storage';
import { AESDecryptPKey, encryptData } from './nodeRSA';

import { baseUrl } from './baseUrl';


/**
 *  const VUE_APP_URL = process.env.VUE_APP_URL;
 *  超时重新请求配置
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: baseUrl,
  timeout: 60000,
  withCredentials: true,
};

// 修改axios配置信息
const service = axios.create(axiosConfig);

let loading: any = null;
service.interceptors.request.use(
  config => {
    const token = sessionData('get', 'HasSessionToken', '');
    token && (config.headers['token'] = token);  // token
    config.headers['login-type'] = 'ADMIN';
    config.headers['content-type'] = "application/json;charset=utf-8";
    config.headers['accept-language'] = sessionStorage.getItem('accessLocaleI18n') || 'zh-CN';


    if(!config.data.notLoading) {
      loading = window['vm'].$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)',
        customClass: 'loading-class'
      });
    }
    
    // 加密发送的数据 needEn: 是否需要加密 [true | false]
    if(config.data.needEn) {
      config.data = { ...encryptData({result: config.data.data}), ip: '12312312', time: new Date().getTime() };
    } else {
      config.data = config.data.data;
    }
    
    return config;

  }, (err) => {
    loading.close();

    return Promise.reject(err);
  },
);

service.interceptors.response.use(
  response => {
    
    loading.close();

    const res:any = response.data;
    // 错误码
    const errorCode = {
      9001: res.message, 
      87321: '您的登录信息已失效'
    }
    if(errorCode[res.code]) {
      Message.error({
        message: errorCode[res.code],
        duration: 3000,
        onClose: () => {
          
        }
      })
    }
    
    // 尝试解密收到的数据
    try {
      if(res.code === 20000) response.data.data = AESDecryptPKey(res.data).result;
    } catch (error) {}

    // console.log(res);
    
    return response

  }, (error) => {
    loading.close();

    if(error.response.status === 401) { // 对请求状态401额外处理
      (Message as any).closeAll(); // 关闭Message
      if(error.response.data.code === 87321) {
        sessionData('clean', 'HasSessionToken', '');
        Message.error('您的登录信息已失效!')
        window['vm'].$router.replace('/login');
      } else {
        Message.error(error.response.data.message || '服务器开小差!')
      }
      return Promise.resolve(error.response);
    } 
    if (error && error.response) {
      const RESPONSE_CODE = {
        400: '请求参数错误',
        403: '拒绝访问',
        404: '请求超时',
        500: '服务器内部错误',
        501: '服务未实现',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
        505: 'HTTP版本不受支持'
      };
      error.message = RESPONSE_CODE[error.response.status] || '服务器开小差!!';
      Message.error(error.message);
    }
    return Promise.reject(error)
  },
);

export default service
