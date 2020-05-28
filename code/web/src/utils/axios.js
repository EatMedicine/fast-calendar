/*
 * @Descripttion: 
 * @Author: CY
 * @Date: 2020-05-27 18:04:33
 * @LastEditTime: 2020-05-28 11:14:27
 */ 
import axios from 'axios';

axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

axios.defaults.baseURL = process.env.VUE_APP_BASE_API;

axios.interceptors.request.use(config => {
    console.log("axios config",config) 
    // config.method === 'post'
    //     ? config.data = qs.stringify({...config.data})
    //     : config.params = {...config.params};
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
 
    return config;
}, error => {  //请求错误处理
    Promise.reject(error)
});

axios.interceptors.response.use(
  res => {
    let result;
    switch (res.status) {
      case 404:
        console.log("404");
        break;
      case 500:
        console.log("服务器出错");
        break;
      case 401:
        console.log("401");
        break;
      case 200:
      case 201:
      case 202:
      case 203:
      case 204:
      case 205:
      case 206:
      case 207:
      case 208:
      case 209:
      case 210:
        result = res;
        break;
    }
    //在这里对返回的数据进行处理
    return result;
  }, 
  error => {
  return Promise.reject(error);
});

export default axios; //暴露axios实例
